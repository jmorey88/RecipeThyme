json.extract! recipe,
              :id,
              :image,
              :title,
              :author_id,
              :description,
              :yield,
              :active_time,
              :total_time,
              :ingredients,
              :instructions

json.tag_ids recipe.tags.map(&:id)
