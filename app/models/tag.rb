class Tag < ApplicationRecord
  has_many :taggings, dependent: :destroy
  has_many :recipes, through: :taggings
  CATEGORIES = %w[Appetizers Breakfast Lunch Entrees Soups Salads Beverages Breads Desserts
                  Miscellaneous].freeze

  validates :name, presence: true, uniqueness: true, inclusion: { in: CATEGORIES }
end
