class Api::UsersController < ApplicationController
  def create
    @user = User.new(user_params)

    if @user.save
      login(@user)
      render "api/users/show"
    else
      render json: @user.errors.full_messages, status: 422
    end
  end

  def show
    @user = User.find(params[:id])
  end

  def index
    @users = User.all
  end

  def current
    @user = current_user if logged_in?
  end

  private

  def user_params
    params.require(:user).permit(:first_name, :last_name, :username, :email, :password, :password_confirmation)
  end 
end
