namespace :db do
  desc "Assign recipes to users and save them to the database"
  task assign_recipes_to_users: :environment do
    file_path = 'tmp/final_recipe_details.json'
    recipes_data = JSON.parse(File.read(file_path))

    # Fetch all users and prepare to distribute recipes evenly
    users = User.all.to_a
    user_index = 0

    recipes_data.each do |recipe_data|
      user = users[user_index]

      # Create the recipe under the current user
      recipe = user.recipes.create(
        title: recipe_data["title"],
        description: recipe_data["description"],
        yield: recipe_data["yield"],
        active_time: recipe_data["active_time"],
        total_time: recipe_data["total_time"],
        ingredients: recipe_data["ingredients"],
        instructions: recipe_data["instructions"],
        image: recipe_data["image"]
      )

      # Attach tags via Tagging
      recipe_data["tag_ids"].each do |tag_id|
        Tagging.create(recipe_id: recipe.id, tag_id: tag_id)
      end

      # Move to the next user, cycle back to the first if at the end
      user_index = (user_index + 1) % users.length
    end

    puts "#{recipes_data.length} recipes have been successfully assigned to users."
  end
end
