class Api::RecipesController < ApplicationController
  # before_action :set_recipe, only: [:show, :edit, :update, :destroy, :upload_image]
  require 'aws-sdk-s3'

  def create
    @recipe = current_user.recipes.new(recipe_params.except(:tag_ids))

    if @recipe.save 
      update_tags(@recipe, params[:recipe][:tag_ids])
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

    keyword = params[:keyword]
    tag_ids = params[:tag_ids]&.split(',') 
    own_recipes = params[:ownRecipes] == 'true'

    # recipes_query = Recipe.eager_load(:author)
    recipes_query = Recipe.includes(:author)
    # recipes_query = Recipe.all


    query = <<-SQL
      LOWER(recipes.title) LIKE :keyword OR 
      LOWER(recipes.description) LIKE :keyword OR 
      LOWER(recipes.ingredients) LIKE :keyword
    SQL

    if keyword.present?
      keyword_condition = "%#{keyword.downcase}%"
      recipes_query = recipes_query.where(query, keyword: keyword_condition)
    end

    if tag_ids.present?
      recipes_query = recipes_query.joins(:taggings)
      .where(taggings: { tag_id: tag_ids })
      .group('recipes.id')
      .having('COUNT(DISTINCT taggings.tag_id) = ?', tag_ids.count)
      @total_entries = recipes_query.count.keys.length
    else
      @total_entries = recipes_query.count
    end

    if own_recipes
      recipes_query = recipes_query.where(author_id: current_user.id)
    end

    # @total_entries = recipes_query.count('DISTINCT recipes.id')
    # @total_entries = recipes_query.count.length
    @total_pages = (@total_entries.to_f / page_size).ceil
    @current_page = page_number

    @recipes = recipes_query.order(updated_at: :desc).limit(page_size).offset(offset)

  end

  def update
    @recipe = Recipe.find(params[:id])
    if @recipe.update(recipe_params.except(:tag_ids))
      update_tags(@recipe, params[:recipe][:tag_ids])
      render "api/recipes/show", status: :ok
    else
      render json: @recipe.errrors.full_messages, status: :unprocessable_entity
    end
  end

  def destroy
    @recipe = Recipe.find(params[:id])
    @recipe.delete
    return render json: { message: 'recipe successfully deleted' }, status: :ok
  end

  def upload_image
    uploaded_image = params[:image]

    if uploaded_image.size > 5.megabytes
      return render json: { errors: 'Image size should be less than 5MB' }, status: :unprocessable_entity
    end

    valid_content_types = ['image/jpeg', 'image/png']
    unless valid_content_types.include?(uploaded_image.content_type)
      return render json: { errors: 'Invalid image type' }, status: :unprocessable_entity
    end

    @recipe = Recipe.find(params[:id])
    s3_resource = Aws::S3::Resource.new(
      region: ENV['AWS_REGION'],
      access_key_id: ENV['AWS_ACCESS_KEY_ID'],
      secret_access_key: ENV['AWS_SECRET_ACCESS_KEY']
    )
    obj = s3_resource.bucket('recipe-thyme-content').object("recipes/#{SecureRandom.uuid}")
    obj.upload_file(uploaded_image.tempfile)
    @recipe.update(image: obj.public_url)

    render json: { message: 'Image uploaded successfully', image_url: @recipe.image }, status: :ok
  rescue => e
    Rails.logger.error "Upload failed: #{e.message}"
    render json: { errors: 'Image upload failed' }, status: :unprocessable_entity
  end

  def tags_by_recipe
    recipe = Recipe.find(params[:id])
    tags = recipe.tags
    puts tags
    render json: tags
  end
  

  private 

  # def set_recipe
  #   @recipe = Recipe.find(params[:id])
  # end

  def recipe_params
    params.require(:recipe).permit(:title, :description, :yield, :active_time, :total_time, :ingredients, :instructions, tag_ids: [])
  end

  def update_tags(recipe, tag_ids)
    if tag_ids
      recipe.tags = Tag.find(tag_ids)
    else 
      recipe.taggings.destroy_all
    end 
  end

end
