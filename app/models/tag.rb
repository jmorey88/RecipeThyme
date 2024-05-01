class Tag < ApplicationRecord

  CATEGORIES = ['Appetizers', 'Breakfast', 'Lunch', 'Entrees', 'Soups', 'Salads', 'Beverages', 'Breads', 'Desserts', 'Miscellaneous'].freeze

  has_many :taggings
  has_many :recipes, through: :taggings
end