class Api::SessionsController < ApplicationController
  def create
    @user = User.find_by_credentials(
      params[:user][:username],
      params[:user][:password]
    )
    if @user
      login(@user)
      render "api/users/show"
    else
      render json: ['invalid credentials']
    end
  end

  def destroy
    @user = current_user
    if @user
      logout
      render json: { status: 'success', message: 'Logged out successfully.' }, status: :ok
    else 
      render json: { messages: 'Nobody Signed in.' }
    end
  end
end
