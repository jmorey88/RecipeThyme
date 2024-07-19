class Api::UsersController < ApplicationController
  before_action :authenticate_user!, except: [:create]
  before_action :authorize_user!, only: [:show]

  def create
    @user = User.new(user_params)

    if @user.save
      login(@user)
      render 'api/users/show'
    else
      render json: @user.errors.full_messages, status: 422
    end
  end

  def show
    @user = User.find(params[:id])
  end

  # def index
  #   @users = User.all
  # end

  def current
    @user = current_user if logged_in?
  end

  private

  def user_params
    params.require(:user).permit(:first_name, :last_name, :username, :email, :password,
                                 :password_confirmation)
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
end
