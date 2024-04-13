require 'net/http'
require 'uri'
require 'json'
require 'aws-sdk-s3'
require 'open-uri'

namespace :db do
  desc "Generate images for recipe titles and upload to S3"
  task generate_recipe_images: :environment do
    # Read lines and keep the title and tags intact
    recipes = File.readlines('tmp/recipe_titles_with_tags.txt').map(&:strip)

    File.open('tmp/recipe_titles_tags_images.txt', 'w') do |file|
      recipes.each do |recipe|
        title, *tags = recipe.split(',')
        uri = URI.parse("https://api.openai.com/v1/images/generations")
        request = Net::HTTP::Post.new(uri)
        request.content_type = "application/json"
        request["Authorization"] = "Bearer #{ENV['OPENAI_API_KEY']}"
        request.body = JSON.dump({
          "prompt" => title,
          "n" => 1, # Number of images to generate
        })

        response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") do |http|
          http.request(request)
        end

        response_body = JSON.parse(response.body)

        if response_body["data"] && !response_body["data"].empty?
          image_url = response_body["data"].first["url"]

          # Upload to S3
          s3_client = Aws::S3::Resource.new(region: ENV['AWS_REGION'])
          obj = s3_client.bucket(ENV['S3_BUCKET_NAME']).object("recipes/#{title.parameterize}.png")
          URI.open(image_url) do |image_data|
            obj.put(body: image_data)
            file.puts [title, tags.join(','), obj.public_url].join(',')
            puts "Uploaded image for #{title}: #{obj.public_url}"
          end
        else
          puts "Error generating image for #{title}: #{response_body["error"] || 'Unexpected response structure'}"
        end
      end
    end
  end
end

