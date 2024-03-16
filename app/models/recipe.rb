class Recipe < ApplicationRecord

  validates :title, :description, :yield, :active_time, :total_time, 
            :ingredients, :instructions, presence: true

  belongs_to :author, class_name: 'User', foreign_key: 'author_id'

end
