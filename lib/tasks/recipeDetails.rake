require 'net/http'
require 'uri'
require 'json'
require 'open-uri'

namespace :db do
  desc "Generate detailed recipe data from titles and images"
  task generate_recipe_details: :environment do
    input_file = 'tmp/recipe_titles_tags_images.txt'
    output_file = 'tmp/final_recipe_details.json'
    final_recipes = []

    File.readlines(input_file).each do |line|
      title, tag_list, image_url = line.strip.split(',')
      # prompt = "Create a JSON object with a detailed recipe for '#{title}'. Include fields for title, description, yield, active_time, total_time, ingredients, instructions. Exclude the image URL. Example:\n{\n  \"title\": \"Example Title\",\n  \"description\": \"A brief description of the dish.\",\n  \"yield\": \"Serves 4\",\n  \"active_time\": \"20 minutes\",\n  \"total_time\": \"1 hour\",\n  \"ingredients\": \"List of ingredients\",\n  \"instructions\": \"Step-by-step instructions\"\n}"
      # prompt = "Create a JSON object with a detailed recipe for '#{title}'. Include fields for title, description, yield, active_time, total_time, ingredients, instructions in list format. Exclude the image URL."
      prompt = "Create a JSON object with a detailed recipe for '#{title}'. The ingredients and instructions should be in a simple list format. Include fields for title, description, yield, active_time, total_time, ingredients, instructions. Example:\n{\n  \"title\": \"Example Title\",\n  \"description\": \"A brief description of the dish.\",\n  \"yield\": \"Serves 4\",\n  \"active_time\": \"20 minutes\",\n  \"total_time\": \"1 hour\",\n  \"ingredients\": [\"1 cup of flour\", \"2 eggs\", \"1 cup of milk\"],\n  \"instructions\": [\"Mix all ingredients.\", \"Pour into a pan.\", \"Bake for 20 minutes.\"]\n}"


      uri = URI.parse("https://api.openai.com/v1/chat/completions")

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
      if response_body["error"]
        puts "Error: #{response_body["error"]["message"]}"
        next
      end

      recipe_json = JSON.parse(response_body["choices"].first["message"]["content"])
      recipe_json['image'] = image_url 
      recipe_json['ingredients'] = recipe_json['ingredients'].join("\n") if recipe_json['ingredients'].is_a?(Array)
      recipe_json['instructions'] = recipe_json['instructions'].join("\n") if recipe_json['instructions'].is_a?(Array)

      # Convert tag names to tag IDs
      tag_ids = tag_list.split(' and ').map { |tag_name| Tag.find_by(name: tag_name)&.id }.compact
      recipe_json['tag_ids'] = tag_ids

      final_recipes << recipe_json
    end

    # Write the final JSON data to a file
    File.open(output_file, 'w') do |file|
      file.write(JSON.pretty_generate(final_recipes))
    end

    puts "Recipe details saved to #{output_file}"
  end
end
