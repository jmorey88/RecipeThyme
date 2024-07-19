class Api::TagsController < ApplicationController
  before_action :authenticate_user!

  def index
    @tags = Tag.all
    render json: @tags, only: %i[id name]
  end

  private

  def authenticate_user!
    return if current_user

    render json: { error: 'Unauthorized' }, status: :unauthorized
  end
end
