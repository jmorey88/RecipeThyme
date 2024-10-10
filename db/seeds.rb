puts 'Resetting database...'

[Recipe, User, Tag, Tagging].each(&:delete_all)

# ///// Seed Tags //////
puts 'Seeding Tags...'
Tag::CATEGORIES.each do |category|
  Tag.find_or_create_by(name: category)
end
puts 'Tags seeded.'

puts 'Generating new users...'

19.times do
  password = Faker::Internet.password(min_length: 10, max_length: 20, mix_case: true,
                                      special_characters: true)

  User.create!(
    username: Faker::Internet.unique.username,
    email: Faker::Internet.email,
    first_name: Faker::Name.first_name,
    last_name: Faker::Name.last_name,
    password:,
    password_confirmation: password
  )
end

User.create!(
  username: 'guest_user',
  email: 'guest_user@guest.test',
  first_name: 'Guest',
  last_name: 'User',
  password: 'guest_password',
  password_confirmation: 'guest_password'
)

# //////// Seed Recipes and Taggings //////
puts 'Seeding Recipes...'
recipe_data = JSON.parse(File.read(Rails.root.join('db', 'recipeSeedData.json')))
users = User.all

# users.each_with_index do |user, index|
#   recipe_attrs = recipe_data[index % recipe_data.max_length]
recipe_data.each_with_index do |recipe_attrs, index|
  user = users[index % users.length]

  recipe = user.recipes.create!(
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
    Tagging.create!(recipe:, tag:) if tag
  end
end
puts 'Recipes and taggings seeded.'

puts 'Database has been seeded!'
