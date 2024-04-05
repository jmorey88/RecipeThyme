class Recipe < ApplicationRecord

  after_initialize :set_default_image, if: :new_record?

  validates :title, :description, :yield, :active_time, :total_time, 
            :ingredients, :instructions, presence: true

  belongs_to :author, class_name: 'User', foreign_key: 'author_id'

  def set_default_image
    self.image ||= "https://recipe-thyme-content.s3.us-west-1.amazonaws.com/app-images/defaultPlate+Small.png"
  end
  
end
