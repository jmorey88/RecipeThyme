

class RecipesController
  def index
    recipe_params = { 
      tags: [:breakfast, :lunch],
      myREcipes: false, 
      query: "",
      page: 1
    }

    @recipes = Recipe.all

    if recipe_params.tags
      @recipes = @recipes.joins(:taggings).joins(:tags).where("tags.name IN (?)", recipe_params.tags)
    end

    if recipe_parms.myREcipes
      @recipes = @recipes.where(author_id: current_user.id)
    end

    query = "chocolate cake" # title, description, ingredients

    if recipe_params.query
      # Google how to do a union in postgres OR how to match against multiple columns at one time.
      @recipes = @recipes.where("'title' ~= \(?)\", query) + 
                 @recipes.where("'description' ~= \(?)\", query) + 
                 @recipes.where("'ingredients' ~= \(?)\", query)
    end

    return json { recipes: @recipes }.to_json

    # sql = "SELECT *
    # FROM recipes r
    # LEFT JOIN taggings tngs
    #   ON r.id = tngs.recipe_id
    # LEFT JOIN tags t
    #   ON t.id = tngs.tag_id
    # WHERE t.name IN (#{recipe_params.tags})"
  end

  # private

  # def recipe_index_params

  # end

end