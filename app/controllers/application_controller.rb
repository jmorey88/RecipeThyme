class ApplicationController < ActionController::Base
  # protect_from_forgery with: :null_session
  # skip_before_action :verify_authenticity_token
  # protect_from_forgery with: :exception, prepend: true

  skip_forgery_protection
  helper_method :current_user, :logged_in?

  # def fallback_index_html
  #   render :file => 'public/index.html'
  # end

  # def fallback_index_html
  #   render file: Rails.root.join('public', 'index.html'), layout: false
  # end

  # def index
  #   render layout: 'application', html: ''
  # end

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
