class CreateRecipes < ActiveRecord::Migration[7.1]
  def change
    create_table :recipes do |t|
      t.string :title
      t.text :description
      t.string :yield
      t.string :active_time
      t.string :total_time
      t.text :ingredients
      t.text :instructions

      t.timestamps
    end

    add_reference :recipes, :author, foreign_key: { to_table: :users }
  end
end
