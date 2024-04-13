# require 'net/http'
# require 'uri'
# require 'json'

# namespace :db do
#   desc "Generate recipe titles with potential for multiple tags using OpenAI"
#   task generate_recipe_titles: :environment do
#     # categories = ['breakfast', 'lunch', 'dinner', 'dessert', 'beverages', 'salads', 'pastas', 'soups', 'breads', 'miscellaneous']
#     combinations = [
#       'breakfast',
#       'lunch',
#       'dinner', 
#       'pasta',
#       'soup',
#       'salad',
#       'beverage',
#       'bread',
#       'dessert',
#       'miscellaneous',
#       'breakfast and beverage',
#       'lunch and salad',
#       'dinner and pasta',
#       'soup and bread',
#       'soup and dinner',
#       'miscellaneous and beverage',
#       'dessert and beverage',
#       'breakfast and bread'
#   ]
#     titles_array = []

#     combinations.each do |combo|
#       uri = URI.parse("https://api.openai.com/v1/chat/completions")
#       request = Net::HTTP::Post.new(uri)
#       request.content_type = "application/json"
#       request["Authorization"] = "Bearer #{ENV['OPENAI_API_KEY']}"
#       request.body = JSON.dump({
#         "model" => "gpt-3.5-turbo",
#         "messages" => [{
#           "role" => "system",
#           "content" => "You are a helpful assistant."
#         },{
#           "role" => "user",
#           "content" => "Generate a recipe title that could be categorized uner #{combo}."
#         }]
#       })

#       response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") do |http|
#         http.request(request)
#       end

#       response_body = JSON.parse(response.body)
#       if response_body["error"]
#         puts "Error: #{response_body["error"]["message"]}"
#       else
#         titles_string = response_body["choices"].map { |choice| choice["message"]["content"] }.join("\n")
#         new_titles = titles_string.lines.map(&:strip)
#         titles_array += new_titles
#         puts "Generated Recipe Titles:"
#         puts new_titles
#       end
#     end

#     File.open('tmp/recipe_titles.txt', 'w') do |file|
#       titles_array.each do |title|
#         file.puts(title)
#       end
#     end

#     puts "Recipe titles saved to tmp/recipe_titles.txt"
#   end
# end

require 'net/http'
require 'uri'
require 'json'

namespace :db do
  desc "Generate recipe titles with tags using OpenAI"
  task generate_recipe_titles_with_tags: :environment do
    combinations = [
      # 'breakfast',
      # 'lunch',
      # 'dinner', 
      # 'pasta',
      # 'soup',
      # 'salad',
      # 'beverage',
      # 'bread',
      # 'dessert',
      # 'miscellaneous',
      # 'breakfast and beverage',
      # 'lunch and salad',
      # 'dinner and pasta',
      # 'soup and bread',
      # 'soup and dinner',
      # 'miscellaneous and beverage',
      'dessert and beverage',
      # 'breakfast and bread'
    ]
    titles_with_tags = []

    combinations.each do |combo|
      uri = URI.parse("https://api.openai.com/v1/chat/completions")
      request = Net::HTTP::Post.new(uri)
      request.content_type = "application/json"
      request["Authorization"] = "Bearer #{ENV['OPENAI_API_KEY']}"
      request.body = JSON.dump({
        "model" => "gpt-3.5-turbo",
        "messages" => [{
          "role" => "system",
          "content" => "You are a helpful assistant."
        },{
          "role" => "user",
          "content" => "Generate a recipe title that could be categorized under #{combo}."
        }]
      })

      response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") do |http|
        http.request(request)
      end

      response_body = JSON.parse(response.body)
      if response_body["error"]
        puts "Error: #{response_body["error"]["message"]}"
      else
        title = response_body["choices"].first["message"]["content"].strip
        titles_with_tags << "#{title},#{combo}"
        puts "Generated Recipe Title: #{title} with Tags: #{combo}"
      end
    end

    File.open('tmp/recipe_titles_with_tags.txt', 'w') do |file|
      titles_with_tags.each do |title_with_tags|
        file.puts(title_with_tags)
      end
    end

    puts "Recipe titles with tags saved to tmp/recipe_titles_with_tags.txt"
  end
end




