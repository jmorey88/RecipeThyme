class ApplicationController < ActionController::Base

  skip_forgery_protection
  helper_method :current_user, :logged_in?

  private

  def current_user
    return nil unless session[:session_token]
    @curent_user ||= User.find_by(session_token: session[:session_token])
  end

  def logged_in?
    !!current_user
  end

  def login(user)
    reset_session
    session[:session_token] = user.session_token
    @current_user = user
  end

  def logout
    current_user.reset_session_token! if current_user
    reset_session
    session[:session_token] = nil
    @current_user = nil
  end

  def require_logged_in 
    unless current_user
      render json: { base: ['invalid credentials'] }, status: 401
    end
  end


end
