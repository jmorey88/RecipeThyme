namespace :db do
  desc "Generate sample users"
  task generate_users: :environment do
    
    puts "Deleting existing users..."
    User.delete_all
    
    30.times do
      User.create!(
        username: Faker::Internet.unique.username,
        email: Faker::Internet.email,
        first_name: Faker::Name.first_name,
        last_name: Faker::Name.last_name,
        password: "password",
        password_confirmation: "password"
      )
    end
    puts "Generated 30 users."
  end
end
