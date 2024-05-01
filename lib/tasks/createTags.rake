namespace :db do
  desc 'Seed Tags Table'
  task create_tags: :environment do
    # define tagnames in model as constant TAG_NAMES =
    tag_names = [
      'Apps', 'Salads', 'Entrees', 'Breakfast', 'Lunch', 'Soups', 
      'Breads', 'Dessert', 'Beverages', 'Miscillaneous'
    ]

    tag_names.each do |name|
      Tag.find_or_create_by(name: name)
      puts "Tag created or found: #{name}"
    end
  end
end