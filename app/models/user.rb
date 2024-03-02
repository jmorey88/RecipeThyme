class User < ApplicationRecord
  
  before_save { self.email = email.downcase }
  
  validates :first_name, presence: true, length: { maximum: 20 }
  validates :last_name, presence: true, length: { maximum: 20 }
  validates :username, presence: true, length: { maximum: 50 }, uniqueness: true
  validates :email, presence: true, length: { maximum: 250 },
  format: {with: URI::MailTo::EMAIL_REGEXP},
  uniqueness: true 
  validates :session_token, presence: true
  has_secure_password
  validates :password, presence: true, length: { minimum: 6}
  
  before_validation :ensure_session_token

  def self.find_by_credentials(username, password)
    user = User.find_by(username: username)
    return nil unless user
    user.is_password?(password) ? user : nil
  end

  def is_password?(password)
    BCrypt::Password.new(self.password_digest).is_password?(password)
  end

  def reset_session_token!
    self.session_token = SecureRandom.urlsafe_base64
    update_column(:session_token, self.session_token)
    self.session_token
  end

  private 

  def ensure_session_token
    self.session_token ||= SecureRandom.urlsafe_base64
  end

end
