require 'uri'
require 'net/http'
require 'json'
require 'aws-sdk-s3'
require 'open-uri'

namespace :data do
  namespace :generate do

    # /////// Generate Users ///////

    desc "Generate sample users data for seeding"
    task users: :environment do
      puts "Generating user data..."
      
      users = []
      20.times do
        users << {
          username: Faker::Internet.unique.username,
          email: Faker::Internet.email,
          first_name: Faker::Name.first_name,
          last_name: Faker::Name.last_name,
          password: "password",
          password_confirmation: "password"
        }
      end
      
      File.open(Rails.root.join('db', 'userSeedData.json'), 'w') do |file|
        file.write(JSON.pretty_generate(users))
      end
      
      puts "Generated user data saved to db/userSeedData.json"
    end

    # ////////// Generate Titles //////////////
    
    desc "Generate recipe titles"
    task recipe_titles: :environment do
      
      file_path = Rails.root.join('db', 'recipeSeedData.json')

      if File.exist?(file_path)
        existing_data = JSON.parse(File.read(file_path))
      else
        existing_data = []
      end

      categories = ['Breakfast', 'Lunch', 'Entrees', 'Desserts', 'Beverages', 'Appetizers', 'Breads', 'Salads', 'Soups', 'Miscellaneous']
      prompt = "Generate 200 unique and creative recipe titles suitable for a diverse cooking blog, covering the following categories: #{categories.join(', ')}. Each title should clearly reflect its category, be distinct, concise, and not exceed 35 characters. Avoid prefixes, numbers, or special formatting in the titles."
      new_recipes = []

      recipe_titles = send_prompt_to_gpt(prompt)

      titles = recipe_titles.split("\n").map do |title|
        title.gsub(/^[\d\-\.\s]+/, '').strip
      end.reject(&:empty?)

      new_recipes = titles.map { |title| { title: title } }

      combine_data = existing_data + new_recipes

      File.open(file_path, 'w') do |file|
        file.write(JSON.pretty_generate(combine_data))
      end

      puts "#{new_recipes.size} new recipes have been generated and saved to #{file_path}"
    end

    # ////////// Generate Tag_Arrays ///////////

    desc "Assign tag categories to recipes using GPT"
    task tag_arrays: :environment do
      file_path = Rails.root.join('db', 'recipeSeedData.json')

      if File.exist?(file_path)
        recipes = JSON.parse(File.read(file_path))
      else
        puts "No existing recipe data found."
        exit
      end

      recipes.each do |recipe|
        next if recipe['tag_names']
        
        valid_categories = ['Breakfast', 'Lunch', 'Entrees', 'Desserts', 'Beverages', 'Appetizers', 'Breads', 'Salads', 'Soups', 'Miscellaneous']
        title = recipe['title']
        prompt = "Here is a recipe title: '#{title}'. Based on its content, list the appropriate categories from the following: #{valid_categories.join(', ')}. Please format your response as a comma-separated list of categories."

        categorized_titles = send_prompt_to_gpt(prompt)

        category_list = categorized_titles.split(',').map(&:strip)

        recipe['tag_names'] = category_list.select { |category| valid_categories.include?(category) }
      end

      File.open(file_path, 'w') do |file|
        file.write(JSON.pretty_generate(recipes))
      end

      puts "Categories have been assigned and updated in the JSON file."
    end

    # ///////////// Generate Recipe Details //////////////

    desc "Generate detailed recipe data and append to recipesSeedData.json"
    task recipe_details: :environment do
      file_path = Rails.root.join('db', 'recipeSeedData.json')

      if File.exist?(file_path)
        recipes = JSON.parse(File.read(file_path))
      else
        puts "No recipe data file found."
        next
      end

      recipes.each do |recipe|
        next if recipe['description'] && recipe['ingredients'] && recipe['instructions']

        title = recipe['title']
        prompt = "Create a JSON object with recipe details for '#{title}'. Include fields for description, yield, active_time, total_time, ingredients, instructions. Example:\n{\n  \"title\": \"Example Title\",\n  \"description\": \"A brief description of the dish.\",\n  \"yield\": \"Serves 4\",\n  \"active_time\": \"20 minutes\",\n  \"total_time\": \"1 hour\",\n  \"ingredients\": \"1 cup of flour\"\n \"2 eggs\"\n \"1 cup of milk\",\n  \"instructions\": \"Mix all ingredients together.\"\n  \"Pour into a pan.\"\n  \"Bake for 20 minutes.\"}\n"

        response_body = send_prompt_to_gpt(prompt)
        
        begin 
          detailed_recipe = JSON.parse(response_body)
          
          if detailed_recipe['ingredients'].is_a?(Array)
            detailed_recipe['ingredients'] = detailed_recipe['ingredients'].join("\n")
          end
          if detailed_recipe['instructions'].is_a?(Array)
            detailed_recipe['instructions'] = detailed_recipe['instructions'].join("\n")
          end
        rescue JSON::ParserError => each
          puts "Failed to parse JSON response: #{e.message}"
          next
        end
        recipe.merge!(detailed_recipe)
      end

      File.open(file_path, 'w') do |file|
        file.write(JSON.pretty_generate(recipes))
      end

      puts "Recipe details have been updated and saved to #{file_path}"
    end
    
    # /////////// Generate Recipe Images //////////

    desc "Generate and upload images for recipes without images"
    task recipe_images: :environment do
      file_path = Rails.root.join('db', 'recipeSeedData.json')

      if File.exist?(file_path)
        recipes = JSON.parse(File.read(file_path))
      else
        puts "No recipe data file found."
        next
      end

      s3_client = Aws::S3::Resource.new(region: ENV['AWS_REGION'])
      updated = false

      recipes.each do |recipe|
        next if recipe['image'] 

        title = recipe['title']
        image_data = send_prompt_to_gpt_for_image(title)

        if image_data && !image_data.empty?
          obj = s3_client.bucket(ENV['S3_BUCKET_NAME']).object("recipes/#{title.parameterize}.png")
          obj.put(body: URI.open(image_data))  

          recipe['image'] = obj.public_url
          puts "Uploaded image for #{title}: #{obj.public_url}"
          updated = true
        else
          puts "Error or no image data returned for #{title}"
        end
      end

      if updated
        File.open(file_path, 'w') do |file|
          file.write(JSON.pretty_generate(recipes))
        end
        puts "Updated recipes with images saved to #{file_path}"
      end
    end

  end
end

# ///////// GPT Data Request ////////////

def send_prompt_to_gpt(prompt)
  uri = URI.parse("https://api.openai.com/v1/chat/completions")
  request = Net::HTTP::Post.new(uri)
  request.content_type = "application/json"
  request["Authorization"] = "Bearer #{ENV['OPENAI_API_KEY']}"
  request.body = JSON.dump({
    "model" => "gpt-3.5-turbo",
    "messages" => [{ "role" => "system", "content" => "You are a helpful assistant." },
                  { "role" => "user", "content" => prompt }]
  })

  response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") do |http|
    http.request(request)
  end

  response_body = JSON.parse(response.body)
  # puts "global response.body", response_body
  if response_body["error"]
    puts "Error: #{response_body["error"]["message"]}"
    nil
  elsif response_body["choices"].empty?
    puts "No choices returned from the API"
    nil
  else
    response_body["choices"].first["message"]["content"].strip
  end
end

# ///////// GPT Image Data Reqeust ///////////

def send_prompt_to_gpt_for_image(title)
  uri = URI.parse("https://api.openai.com/v1/images/generations")
  request = Net::HTTP::Post.new(uri)
  request.content_type = "application/json"
  request["Authorization"] = "Bearer #{ENV['OPENAI_API_KEY']}"
  request.body = JSON.dump({
    "prompt" => title,
    "n" => 1  
  })

  response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") do |http|
    http.request(request)
  end

  response_body = JSON.parse(response.body)
  if response_body["data"] && !response_body["data"].empty?
    response_body["data"].first["url"]
  else
    nil 
  end
end