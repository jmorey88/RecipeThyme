class Tagging < ApplicationRecord
  belongs_to :recipe
  belongs_to :tag

  validates :tag_id, presence: true
  validates :recipe_id, presence: true
end
