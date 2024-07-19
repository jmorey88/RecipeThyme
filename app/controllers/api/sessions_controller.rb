class Api::SessionsController < ApplicationController
  def create
    # Rails.logger.info "Login attempt for username: #{params[:user][:username]}"
    @user = User.find_by_credentials(
      params[:user][:username],
      params[:user][:password]
    )
    if @user
      # Rails.logger.info "User authenticated successfully: #{@user.id}"
      login(@user)
      render 'api/users/show'
    else
      # Rails.logger.info "Authentication failed for username: #{params[:user][:username]}"
      render json: { errors: ['invalid credentials'] }, status: :unauthorized
    end
  end

  def destroy
    # Rails.logger.info "Logout attempt"
    # logger.info "CSRF Token: #{request.headers['X-CSRF-Token']}"
    @user = current_user
    if @user
      # Rails.logger.info "User logged out: #{@user.id}"
      logout
      render json: { status: 'success', message: 'Logged out successfully.' }, status: :ok
    else
      # Rails.logger.info "No user to log out"
      render json: { messages: 'Nobody Signed in.' }
    end
  end
end
