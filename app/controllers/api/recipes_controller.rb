require 'aws-sdk-s3'
require 'benchmark'
class Api::RecipesController < ApplicationController
  before_action :authenticate_user!, except: %i[show index]
  before_action :set_recipe, only: %i[show update destroy upload_image]
  before_action :authorize_user!, only: %i[update destroy]

  def create
    @recipe = current_user.recipes.new(recipe_params.except(:tag_ids))

    if @recipe.save
      # update_tags(@recipe, params[:recipe][:tag_ids])
      if params[:recipe][:tag_ids].present?
        tag_ids = params[:recipe][:tag_ids]
        tag_ids.each do |tag_id|
          Tagging.create(recipe_id: @recipe.id, tag_id:)
        end
      end
      render 'api/recipes/show'
    else
      render json: @recipe.errors.full_messages, status: 422
    end
  end

  def show
    Benchmark.bm do |x|
      x.report("show action:") do
        @recipe = Recipe.find(params[:id])
      end
    end
  end

  def index
    Benchmark.bm do |x|
      x.report("index action:") do
        page_size = params.fetch(:page_size, 20).to_i
        page_number = [params.fetch(:page, 1).to_i, 1].max
        offset = (page_number - 1) * page_size

        recipes_query = build_recipes_query
        puts "recipes_query: #{recipes_query}"
        @total_entries = recipes_query.count
        puts "@total_entries #{@total_entries}"
        @total_pages = (@total_entries / page_size.to_f).ceil
        @current_page = page_number
        @recipes = recipes_query.select(:id, :title, :description, :author_id, :image, :yield).order(updated_at: :desc).limit(page_size).offset(offset)
      end
    end
  end

  def update
    if @recipe.update(recipe_params)
      render 'api/recipes/show', status: :ok
    else
      render json: @recipe.errrors.full_messages, status: :unprocessable_entity
    end
  end

  def destroy
    if @recipe
      @recipe.destroy
      render json: { message: 'Recipe successfully deleted' }, status: :ok
    else
      render json: { error: 'Recipe not found' }, status: :not_found
    end
  end

  def upload_image
    if validate_image(uploaded_image)
      if upload_to_s3(@recipe, uploaded_image)
        render json: { message: 'Image uploaded successfully', image_url: @recipe.image },
               status: :ok
      else
        render json: { errors: 'Image upload failed' }, status: :unprocessable_entity
      end
    end
  rescue StandardError => e
    Rails.logger.error "Upload failed: #{e.message}"
    render json: { errors: 'Image upload failed' }, status: :unprocessable_entity
  end

  # def tags_by_recipe
  #   recipe = Recipe.find(params[:id])
  #   tags = recipe.tags
  #   puts tags
  #   render json: tags
  # end

  private

  def recipe_params
    params.require(:recipe).permit(:title, :description, :yield, :active_time, :total_time, :ingredients,
                                   :instructions, tag_ids: [])
  end

  def set_recipe

    @recipe = Recipe.find_by(id: params[:id])
  end

  def authenticate_user!
    return if current_user

    render json: { error: 'Unauthorized' }, status: :unauthorized
  end

  def authorize_user!
    return if @recipe&.author == current_user

    render json: { error: 'Not authorized' },
           status: :unauthorized
  end

  def build_recipes_query
    keyword = params[:keyword]
    tag_ids = params[:tag_ids]&.split(',')
    own_recipes = params[:ownRecipes] == 'true'

    recipes_query = Recipe.includes(:author)

    if keyword.present?
      keyword_condition = "%#{keyword.downcase}%"
      recipes_query = recipes_query.where(
        "LOWER(recipes.title) LIKE :keyword OR
         LOWER(recipes.description) LIKE :keyword OR
         LOWER(recipes.ingredients) LIKE :keyword",
        keyword: keyword_condition
      )
    end

    if tag_ids.present?
      recipes_query = recipes_query.joins(:taggings)
                                   .where(taggings: { tag_id: tag_ids })
    end

    recipes_query = recipes_query.where(author_id: current_user.id) if own_recipes

    recipes_query
  end

  def uploaded_image
    Rails.logger.info "Uploaded image: #{params[:image].inspect}"
    params[:image]
  end

  def validate_image(image)
    Rails.logger.info "Image size: #{image.size}"
    Rails.logger.info "Image content type: #{image.content_type}"
    if image.size > 5.megabytes
      render json: { errors: 'Image size should be less than 5MB' }, status: :unprocessable_entity
      return false
    end
    valid_content_types = ['image/jpeg', 'image/png']
    unless valid_content_types.include?(image.content_type)
      render json: { errors: 'Invalid image type' }, status: :unprocessable_entity
      return false
    end
    true
  end

  def upload_to_s3(recipe, image)
    s3_resource = Aws::S3::Resource.new(
      region: ENV['AWS_REGION'],
      access_key_id: ENV['AWS_ACCESS_KEY_ID'],
      secret_access_key: ENV['AWS_SECRET_ACCESS_KEY']
    )
    obj = s3_resource.bucket('recipe-thyme-content').object("recipes/#{SecureRandom.uuid}")

    begin
      Rails.logger.info "Image tempfile: #{image.tempfile.inspect}"
      obj.upload_file(image.tempfile)
      recipe.update(image: obj.public_url)
      true
    rescue Aws::S3::Errors::ServiceError => e
      Rails.logger.error "S3 upload failed: #{e.message}"
      false
    end
    # render json: { message: 'Image uploaded successfully', image_url: recipe.image }, status: :ok
  end
end
