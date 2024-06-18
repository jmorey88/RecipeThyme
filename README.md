<!-- This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

* Ruby version

* System dependencies

* Configuration

* Database creation

* Database initialization

* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)

* Deployment instructions

* ... -->
  

# README

# RecipeThyme

## Overview

RecipeThyme is a vibrant web application designed for cooking enthusiasts and culinary explorers. This platform allows users to create an account, share their favorite recipes, and explore dishes crafted by others. RecipeThyme brings people together through the love of food, offering tools for managing recipes with an easy-to-use interface.

![RecipeThyme Screenshot](https://recipe-thyme-content.s3.us-west-1.amazonaws.com/screenShots/recipeThymeHomePage.png)
*Home Page of RecipeThyme*

## Table of Contents

- Introduction
- Features
- Demo
- Technologies Used
- Local Setup
- Technical Details
- Future Enhancements
- Contributing
- Credits

## Introduction

RecipeThyme caters to anyone passionate about cooking, from home cooks to professional chefs. It allows users to store their recipes, share them with a community, and discover new ones, all while managing their culinary content efficiently.

## Features

- **User Accounts:** Sign up and log in to manage personal recipe portfolios.  The user authentication state is managed via Redux, ensuring a seamless user experience and secure access to user-specific functionalities.
- **Recipe Management:** Create, edit, and delete recipes. Each recipe includes details such as yield, prep time, ingredients, instructions, and the ability to categorize recipes with tags for better organization and searchability.
- **Recipe Gallery:** Explore a dynamic gallery of recipes from all users with robust search functionality, including filters for keywords, tags, or filter recipes by the author to find exactly what you're looking for.  Redux is used to handle state changes as recipes are added, updated, or removed, which keeps the UI synchronized with the backend in real-time.
- **Search Functionality:** Users can search through recipes using keywords, tags, or by the author. Redux plays a crucial role here by managing the search state, including storing search results and pagination data, making the search feature robust and responsive.
- **Detailed Recipe Views:** View detailed pages for each recipe with options for the recipe's author to edit, delete, or update the recipe's photo; tags on each recipe enhance understanding and connections to other similar recipes.
- **Guest User Experience:** Browse and interact with the app using a guest account where changes can be made but are reset periodically, including full access to tagged recipes.

## Demo

Experience RecipeThyme by visiting http://www.recipethyme.net and signing in as guest.

## Technologies Used

- **Frontend:** React.js v18.2.0, Redux for state management, CSS Modules for styling.
  - **Redux:** Redux v5.0.1 to manage global state across the application, including user sessions, recipe data, and search functionality. This centralized state management facilitates efficient data flow and state updates across React components.
- **Backend:** Ruby on Rails v7.1.3 as the API, PostgreSQL for the database.
- **Image Storage:**  AWS S3 buckets for securely storing and serving recipe images.
-  **Data Generation:**  Chat GPT Open AI API for recipe data/images creation
- **Hosting/Deployment:** RecipeThyme is hosted on Heroku.

## Local Setup

To set up RecipeThyme locally, follow these instructions:

### Prerequisites

Ensure you have the following installed on your system:

- **Ruby v3.1.0 and Rails v7.1.3:** Required for setting up the backend.
- **Node.js and npm:** Needed for managing frontend dependencies.
- **PostgreSQL:** Required for the database.
- **Webpack v5.90.1:** Used to bundle JavaScript files and manage frontend assets efficiently. Ensure that Webpack is configured correctly to handle the application’s asset compilation and loading. 

### Configuration 

Environment Setup:

- Copy the `.env.example` file to create a new `.env` file in your project root:
  
  ```bash
  cp .env.example .env
  ```
- Open the `.env` file and fill in the required credentials:
  - **AWS_ACCESS_KEY_ID:** Your AWS access key.
  - **AWS_SECRET_ACCESS_KEY:** Your AWS secret access key.
  - **AWS_REGION:** Your AWS Region.
  - **S3_BUCKET_NAME** Your AWS bucket name.
  - **DATABASE_USER:** The username for your PostgreSQL database.
  - **DATABASE_PASSWORD:** The password for your PostgreSQL database.

  Make sure to set up an AWS S3 bucket and get the credentials to be able to handle image uploads.

### Installation

Clone the repository:

```bash
git clone https://github.com/jmorey88/RecipeThyme.git
cd RecipeThyme
```

Set up the backend:

```bash
# Install Ruby gem dependencies 
bundle install

# Create and migrate the database
rails db:create db:migrate db:seed
```

Set up the frontend:

```bash
# Install JavaScript dependencies
npm install

# Use Webpack to bundle the assets
npm run dev
```

In a new terminal start the backend server:

```bash
rails s
```



### Usage

Visit `http://localhost:3000` in your browser to start exploring RecipeThyme. The local setup provides a demonstration environment filled with seeded recipe data, allowing you to view and manage these recipes as if you were a user of the app. This setup is ideal for experiencing the full range of features without the need for real user interactions, perfect for testing and development purposes.

## Technical Details

### Recipe Management

#### CRUD Operations:
RecipeThyme allows users to manage their recipes with full CRUD (Create, Read, Update, Delete) functionality. This feature enables easy addition, adjustment, and removal of recipes. Each recipe includes details like title, ingredients, instructions, and images for accurate culinary representation.

![RecipeThyme Screenshot](https://recipe-thyme-content.s3.us-west-1.amazonaws.com/screenShots/recipeCreatePage.png)
*RecipeThyme Create Form*

#### Image Upload:
Efficient and secure image uploads are crucial for RecipeThyme. The app ensures all images meet size and type criteria before storing them on AWS S3. Images must be under 5MB and in JPEG or PNG format for optimal storage and display.

![RecipeThyme Screenshot](https://recipe-thyme-content.s3.us-west-1.amazonaws.com/screenShots/recipeDetailPage.png)
*RecipeThyme Recipe detail page with image upload*

- **Size Check:** Ensures images are not larger than 5MB to optimize storage and loading speeds.
- **Type Validation:** Accepts only JPEG and PNG formats to maintain consistency and reliability in image displays.
- **AWS S3 Integration:** Uses AWS S3 for robust and scalable image storage. Each image is stored with a unique identifier to prevent conflicts and ensure accessibility.

```ruby
# Extract from the upload_image action in RecipesController

# Validate image size
if uploaded_image.size > 5.megabytes
  render json: { errors: 'Image size should be less than 5MB' }, status: :unprocessable_entity
end

# Check if the image content type is valid
valid_content_types = ['image/jpeg', 'image/png']
unless valid_content_types.include?(uploaded_image.content_type)
  render json: { errors: 'Invalid image type' }, status: :unprocessable_entity
end

# Upload to AWS S3 and update the recipe image URL
s3_resource = Aws::S3::Resource.new(region: ENV['AWS_REGION'])
obj = s3_resource.bucket('recipe-thyme-content').object("recipes/#{SecureRandom.uuid}")
obj.upload_file(uploaded_image.tempfile)
@recipe.update(image: obj.public_url)

render json: { message: 'Image uploaded successfully', image_url: @recipe.image }, status: :ok
```

### Gallery

#### Pagination:
Pagination in RecipeThyme enhances the user experience by allowing users to browse through large sets of recipes without overwhelming load times or clutter. This functionality is managed through coordinated efforts between the frontend and backend.

***Frontend***:
On the frontend, the RecipeGallery component uses InfiniteScroll from react-infinite-scroll-component to load more recipes as the user scrolls down. The component fetches the next page of recipes only if there are more pages to load, which is determined by the state tracked in Redux.

```jsx
// Handling pagination in React with Infinite Scroll
<InfiniteScroll
  dataLength={searchResults?.length || 0}
  next={fetchMoreData}
  hasMore={currentPage < totalPages}
  loader={<h4>Loading...</h4>}
  endMessage={<p className={styles.endMessage}><b>End of Recipes List</b></p>}
>
  <ul className={styles.recipesDisplay}>{renderRecipes()}</ul>
</InfiniteScroll>
```

This snippet demonstrates how the InfiniteScroll component is integrated to handle fetching additional pages based on user scroll, enhancing the browsing experience by loading data on demand.

***Backend:***
The backend complements this by providing the necessary pagination metadata such as current_page and total_pages, which are essential for the frontend to determine whether more recipes are available for fetching.

```jsx
def index
    page_size = params.fetch(:page_size, 20).to_i
    page_number = [params.fetch(:page, 1).to_i, 1].max
    offset = (page_number - 1) * page_size
    recipes_query = Recipe.includes(:author).order(updated_at: :desc)

    # Apply filters...

    @total_entries = recipes_query.count
    @total_pages = (@total_entries.to_f / page_size).ceil
    @current_page = page_number

    @recipes = recipes_query.limit(page_size).offset(offset)
    render json: { recipes: @recipes, meta: { total_pages: @total_pages, current_page: @current_page } }
end
```

This backend logic sets up the pagination by calculating the total number of pages and the current page based on the request parameters. It sends this metadata along with the recipe data to the frontend, which uses it to manage the infinite scrolling behavior.

### Search Feature

#### SQL Query Optimization:
The search functionality in RecipeThyme lets users navigate a vast recipe collection using filters like keywords, tags, and toggles for personal or community recipes. Below is a key SQL query snippet from the Recipes controller's index action that manages this feature.

![RecipeThyme Screenshot](https://recipe-thyme-content.s3.us-west-1.amazonaws.com/screenShots/recipeSearchForm.png)
*RecipeThyme Search Form*

The search mechanism is flexible and efficient, allowing keyword searches across multiple recipe attributes (title, description, ingredients) and filtering by tags. Users can toggle between viewing their own recipes and the entire community's recipes, adding a layer of user-specific customization.

Here's a breakdown of the SQL logic used:

***Keyword***: Search The query supports a case-insensitive search across the recipe's title, description, and ingredients. It uses PostgreSQL's ILIKE for case-insensitive matching.
***Tag Filtering***: Users can filter recipes based on multiple tags. The system returns recipes that match all selected tags, not just any tag.
***User-Specific Recipes***: There's an option to filter the recipes to show only those created by the logged-in user, enhancing personalization.

```ruby
# Extract from the index action in RecipesController

def index
    # Pagination setup
    page_size = params.fetch(:page_size, 20).to_i
    page_number = [params.fetch(:page, 1).to_i, 1].max
    offset = (page_number - 1) * page_size

    # Search and filter setup
    keyword = params[:keyword]
    tag_ids = params[:tag_ids]&.split(',')
    own_recipes = params[:ownRecipes] == 'true'
    
    recipes_query = Recipe.includes(:author)

    if keyword.present?
        keyword_condition = "%#{keyword.downcase}%"
        recipes_query = recipes_query.where("LOWER(recipes.title) LIKE :keyword OR LOWER(recipes.description) LIKE :keyword OR LOWER(recipes.ingredients) LIKE :keyword", keyword: keyword_condition)
    end

    if tag_ids.present?
        recipes_query = recipes_query.joins(:taggings).where(taggings: { tag_id: tag_ids }).group('recipes.id').having('COUNT(DISTINCT taggings.tag_id) = ?', tag_ids.count)
    end

    if own_recipes
        recipes_query = recipes_query.where(author_id: current_user.id)
    end

    @total_entries = recipes_query.count.keys.length
    @total_pages = (@total_entries.to_f / page_size).ceil
    @current_page = page_number

    @recipes = recipes_query.order(updated_at: :desc).limit(page_size).offset(offset)
end
```

### Tags and Taggings

#### Associations:
RecipeThyme uses Rails' Active Record associations to manage relationships between recipes, tags, taggings, and users. This setup allows flexible recipe categorization, making it easier for users to organize and search recipes by tags, and fostering community and personalization as users manage their culinary contributions.

***Association Details:***
- **Tag Model:**
   The `Tag` model serves as a connector between recipes and the tags they belong to. It allows a tag to have relationships with multiple recipes through the `Tagging` model.

   ```ruby
   class Tag < ApplicationRecord
     has_many :taggings
     has_many :recipes, through: :taggings
   end
   ```
- **Tagging Model:**
   The `Tagging` model acts as a join table in a many-to-many relationship between tags and recipes.

   ```ruby
   class Tagging < ApplicationRecord
     belongs_to :recipe
     belongs_to :tag
   end
   ```
- **Recipe Model:**
   Each Recipe belongs to a user and can have multiple tags through the taggings intermediary.

   ```ruby
   class Recipe < ApplicationRecord
     belongs_to :author, class_name: 'User', foreign_key: 'author_id'
     has_many :taggings, dependent: :destroy
     has_many :tags, through: :taggings
   end
   ```
- **User Model:**
   The `User` model illustrates ownership over recipes. Each user can have multiple recipes.

   ```ruby
   class User < ApplicationRecord
     has_many :recipes, foreign_key: 'author_id'
   end
   ```

**Explanation:**

These model associations create a robust framework for RecipeThyme's functionality:

The associations in RecipeThyme facilitate efficient data management and user interactions. Tags enhance recipe discoverability, while taggings allow for flexible categorization. The User model defines recipe ownership, supporting personalized galleries. This robust architecture ensures streamlined operations and enhances the user experience with easy categorization and personalization.

### State Management with Redux
Redux is pivotal in RecipeThyme for managing the application state across different components and features. Below are key insights into how Redux enhances the application:

#### Global State Structure:
The Redux store is organized into major slices to handle different aspects of the application:
- **Session:** Manages user authentication and session data.
- **Recipes:** Stores recipe details and handles CRUD operations state.
- **Search:** Manages the state related to search queries and results.

#### Store Details:
Here's a simplified example of how the Redux store is configured:

```js
import { configureStore } from '@reduxjs/toolkit';
import sessionReducer from './features/session/sessionSlice';
import recipesReducer from './features/recipes/recipeSlice';
import searchReducer from './features/search/searchSlice';

export const store = configureStore({
  reducer: {
    session: sessionReducer,
    recipes: recipesReducer,
    search: searchReducer,
  },
});
```

This setup enables efficient data management and ensures that the UI components are always in sync with the backend, providing a seamless user experience.

### Data Generation

RecipeThyme utilizes advanced data generation tasks that incorporate the ChatGPT API to automatically generate comprehensive and diverse recipe data. This includes generating images and recipe details that are stored in userSeedData.json and recipeSeedData.json, respectively. These tasks simplify the process of populating the database with rich content, demonstrating the integration of AI tools in web development.

**Chat GPT API Use:**

The `send_prompt_to_gpt` function plays a crucial role in interfacing with the OpenAI API, sending prompts and receiving generated content that forms the basis of the recipes.

```ruby
# Communicate with OpenAI's GPT to generate recipe data
def send_prompt_to_gpt(prompt)
  uri = URI.parse("https://api.openai.com/v1/chat/completions")
  request = Net::HTTP::Post.new(uri)
  request.content_type = "application/json"
  request["Authorization"] = "Bearer #{ENV['OPENAI_API_KEY']}"
  request.body = JSON.dump({
    "model" => "gpt-3.5-turbo",
    "messages" => [
      { "role" => "system", "content" => "You are a helpful assistant." },
      { "role" => "user", "content" => prompt }
    ]
  })

  response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") do |http|
    http.request(request)
  end

  response_body = JSON.parse(response.body)
  response_body["choices"].first["message"]["content"].strip unless response_body["error"] || response_body["choices"].empty?
end
```
- #### URI Parsing and Request Setup:
    This snippet constructs an HTTP POST request, specifying the OpenAI API endpoint and including necessary headers such as the content type and authorization token.

- #### JSON Payload:
  It sends a structured JSON body containing the model details and the user prompt, which guides the type of content to be generated.

- #### HTTP Request Execution:
  The function executes the request using Ruby's Net::HTTP library and handles the response.

- #### Response Handling:
  It processes the API's JSON response to extract and return the generated content, ensuring the application can utilize it immediately, for example, to populate a database or provide interactive content to users.

This function is integral to RecipeThyme's backend, allowing it to dynamically generate rich, varied recipe content.

## Hosting/Deployment

This application is hosted on Heroku, which involves setting up environment variables, configuring databases, and ensuring that the production build of the frontend is served correctly. 

## Future Enhancements
As RecipeThyme continues to evolve, several exciting enhancements are planned to enrich user interaction and accessibility:

- **Rating System**: Users will be able to rate recipes and view average ratings. This feature aims to foster community engagement and help users find popular recipes easily.
- **Comments**: Implementation of a commenting system will allow users to provide feedback, suggestions, and interact more dynamically with recipe creators.
- **Social Sharing**: Integration with social media platforms will enable users to share their favorite recipes with friends and followers, extending the reach of RecipeThyme's culinary community.
- **Responsive Design**: Plans to implement media queries and adjust CSS to optimize RecipeThyme for mobile and tablet devices. This enhancement will ensure a smoother and more accessible experience for users on all types of screens, making it easier to browse, read, and interact with content even on the go.

These enhancements will not only improve the functionality of RecipeThyme but also enhance its usability across different platforms and devices, making it a more inclusive culinary platform.

## Credits
Developer: Joel Morey License: MIT

Contact: For inquiries or feedback, you can reach me at joel.morey88@gmail.com.



