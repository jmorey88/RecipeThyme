json.recipes @recipes do |recipe|
  json.id recipe.id
  json.title recipe.title
  json.description recipe.description
  json.author_id recipe.author_id
  json.image recipe.image
  json.yield recipe.yield
  json.author recipe.author.username
end

json.meta do
  json.current_page @current_page
  json.total_pages @total_pages
  json.total_entries @total_entries
end

