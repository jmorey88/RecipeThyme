require 'net/http'
require 'uri'
require 'json'

namespace :db do
  desc "Generate recipe titles with tags using OpenAI"
  task generate_recipe_titles_with_tags: :environment do
    combinations = [
      'Apps',
      'Breakfast',
      'Lunch',
      'Entrees', 
      'Soups',
      'Salads',
      'Beverages',
      'Breads',
      'Dessert',
      'Miscellaneous',
      'Breakfast and Beverages',
      'Lunch and Salads',
      'Entree and Apps',
      'Soups and Breads',
      'Soups and Dinner',
      'Miscellaneous and Beverages',
      'Dessert and Beverages',
      'Breakfast and Breads'
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
          "content" => "Generate 4 recipe titles that could be categorized under #{combo}.  Each title should be no more than 35 chararcters."
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




