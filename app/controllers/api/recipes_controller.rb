class Api::RecipesController < ApplicationController
  def create
    @recipe = Recipe.new(recipe_params)

    if @recipe.save 
      render "api/recipes/show"
    else
      render json: @recipe.errors.full_messages, status: 422
    end
  end

  def show
    @recipe = Recipe.find(params[:id])
  end

  def index
    page_size = params.fetch(:page_size, 20).to_i
    page_number = [params.fetch(:page, 1).to_i, 1].max

    offset = (page_number - 1) * page_size

    @total_entries = Recipe.count
    @total_pages = (@total_entries.to_f / page_size).ceil
    @current_page = page_number

    @recipes = Recipe.limit(page_size).offset(offset)
  end

  def edit
  end

  def delete
  end

  private 

  def recipe_params
    params.require(:recipe).permit(:title, :image, :author_id, :description, :yield, :active_time, :total_time, :ingredients, :instructions)
  end

end
