class CreateTaggings < ActiveRecord::Migration[7.1]
  def change
    create_table :taggings do |t|
      t.integer :recipe_id
      t.integer :tag_id

      t.timestamps
    end
  end
end
