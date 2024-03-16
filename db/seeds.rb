# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

Recipe.delete_all
User.delete_all

20.times do |i|
  User.create!(
    first_name: "FirstName#{i}",
    last_name: "LastName#{i}",
    username: "User#{i}",
    email: "user#{i}@example.com",
    password: "password", 
    password_confirmation: "password"
  )
end

puts "20 users have been created."

User.find_each do |user|
  2.times do |i|
    Recipe.create!(
      title: "Recipe #{i + 1} by #{user.username}",
      author_id: user.id,
      description: "This is a sample description for recipe #{i + 1} by #{user.username}.",
      yield: "Serves #{rand(2..6)}",
      active_time: "#{rand(10..30)} minutes",
      total_time: "#{rand(30..120)} minutes",
      ingredients: "Ingredient 1, Ingredient 2, Ingredient 3",
      instructions: "Step 1, Step 2, Step 3"
    )
  end
end

puts "40 recipes have been created."

