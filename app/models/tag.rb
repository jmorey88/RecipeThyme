class Tag < ApplicationRecord

  CATEGORIES = ['Appetizers', 'Breakfast', 'Lunch', 'Entrees', 'Soups', 'Salads', 'Beverages', 'Breads', 'Desserts', 'Miscellaneous'].freeze

  validates :name, presence: true, uniqueness: true, inclusion: { in: CATEGORIES }


  has_many :taggings
  has_many :recipes, through: :taggings
end