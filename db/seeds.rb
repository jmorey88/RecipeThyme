puts "Resetting database..."

[User, Recipe, Tag, Tagging].each(&:delete_all)

# ///// Seed Tags //////
puts 'Seeding Tags...'
Tag.categories.each do |category|
  Tag.find_or_create_by(name: category)
end
puts 'Tags seeded.'

Seed Users
puts 'Seeding Users...'
user_data = JSON.parse(File.read(Rails.root.join('db', 'userSeedData.json')))
user_data.each do |user_attrs|
  User.create!(user_attrs)
end
puts 'Users seeded.'

# //////// Seed Recipes and Taggings //////
puts 'Seeding Recipes...'
recipe_data = JSON.parse(File.read(Rails.root.join('db', 'recipeSeedData.json')))
users = User.all
user_index = 0

recipe_data.each do |recipe_attrs|
  recipe = users[user_index].recipes.create!(
    title: recipe_attrs['title'],
    description: recipe_attrs['description'],
    yield: recipe_attrs['yield'],
    active_time: recipe_attrs['active_time'],
    total_time: recipe_attrs['total_time'],
    ingredients: recipe_attrs['ingredients'],
    instructions: recipe_attrs['instructions'],
    image: recipe_attrs['image']
  )

  recipe_attrs['tag_names'].each do |tag_name|
    tag = Tag.find_by(name: tag_name)
    Tagging.create!(recipe: recipe, tag: tag) if tag
  end

  user_index = (user_index + 1) % users.count
end
puts 'Recipes and taggings seeded.'

puts 'Database has been seeded!'
