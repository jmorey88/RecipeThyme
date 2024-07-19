class ApplicationController < ActionController::Base
  # Protects against CSRF attacks by raising an exception for unverified requests.
  # In this React SPA, CSRF tokens in meta tags don't update automatically.
  # this was handled by:
  # 1. Including the CSRF token in response headers after login.
  # 2. Manually updating the meta tag on the client side with the new token.
  # 3. Using a fetch utility in React that includes the current CSRF token in all requests and updates the meta tag if a new token is received.

  # before_action :log_csrf_token
  protect_from_forgery with: :exception
  helper_method :current_user, :logged_in?

  def current_user
    # Rails.logger.info "Current Session Token: #{session[:session_token]}"
    return nil unless session[:session_token]

    @current_user ||= User.find_by(session_token: session[:session_token])
  end

  def logged_in?
    !!current_user
  end

  def login(user)
    # Rails.logger.info "Current Session Token: #{session[:session_token]}"
    # Rails.logger.info "Session Data Before Reset: #{session.to_hash}"
    # logger.info "Expected CSRF token: #{form_authenticity_token}"

    reset_session

    # Rails.logger.info "Session Data After Reset: #{session.to_hash}"
    # Rails.logger.info "Logging in user #{user.id}, setting session token"
    # logger.info "Expected CSRF token: #{form_authenticity_token}"
    # logger.info "Expected CSRF token: #{form_authenticity_token}"
    # logger.info "Expected CSRF token: #{form_authenticity_token}"

    session[:session_token] = user.session_token
    session[:_csrf_token] = form_authenticity_token
    response.set_header('X-CSRF-Token', form_authenticity_token)
    @current_user = user

    # Rails.logger.info "New Session Token after login: #{session[:session_token]}"
    # Rails.logger.info "Session Data After Login: #{session.to_hash}"
  end

  def logout
    # Rails.logger.info "Logging out user #{current_user.id}" if current_user
    # Rails.logger.info "Current Session Token: #{session[:session_token]}"

    current_user.reset_session_token! if current_user

    # Rails.logger.info "Current Session Token: #{session[:session_token]}"

    reset_session

    # Rails.logger.info "Current Session Token: #{session[:session_token]}"
    # session[:session_token] = nil
    # Rails.logger.info "Session reset after logout"

    response.set_header('X-CSRF-Token', form_authenticity_token)
    @current_user = nil

    # Rails.logger.info "Current Session Token: #{session[:session_token]}"
  end

  def require_logged_in
    return if current_user

    Rails.logger.info 'Require logged in: No current user'
    render json: { base: ['invalid credentials'] }, status: 401
  end

  # def log_csrf_token
  #   logger.info "Expected CSRF token: #{form_authenticity_token}"
  #   logger.info "Received CSRF token: #{request.headers['X-CSRF-Token']}"
  # end
end
