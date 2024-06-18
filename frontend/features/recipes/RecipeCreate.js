import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { createRecipe } from "./recipeSlice";
import { resetSearch } from "../search/searchSlice";
import { fetchRecipeTags } from "../Tags/tagService";
import styles from "./RecipeCreate.module.css";

const RecipeForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [tags, setTags] = useState([]);
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    yield: "",
    active_time: "",
    total_time: "",
    ingredients: "",
    instructions: "",
  });

  useEffect(() => {
    const loadTags = async () => {
      const tagsData = await fetchRecipeTags();
      setTags(tagsData);
    };
    loadTags();
  }, []);

  const handleTaggingsChange = (tagId) => {
    setSelectedTagIds((prevSelectedTags) =>
      prevSelectedTags.includes(tagId)
        ? prevSelectedTags.filter((id) => id !== tagId)
        : [...prevSelectedTags, tagId]
    );
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const recipeData = {
      ...formData,
      tag_ids: selectedTagIds,
    };
    const newRecipe = await dispatch(createRecipe(recipeData)).catch(
      (error) => {
        console.error("Failed to create the recipe:", error);
      }
    );
    const recipeId = newRecipe.payload.id;
    if (recipeId) {
      dispatch(resetSearch());
      navigate(`/recipe/${recipeId}`);
    }
  };

  return (
    <div className={styles.createFormBackground}>
      <form onSubmit={handleSubmit} className={styles.createForm}>
        <h1 className={styles.title}>Create Your Recipe</h1>
        <div>
          <h3>Recipe Title</h3>
          <input
            type="text"
            name="title"
            placeholder="Type your recipe name here"
            value={formData.title}
            onChange={handleFormChange}
            maxLength="40"
            required
            className={styles.formInput}
          />
        </div>
        <div className={styles.formDescription}>
          <h3>Description</h3>
          <textarea
            type="text"
            name="description"
            placeholder="Add a breif description of your recipe"
            cols="50"
            rows="4"
            value={formData.description}
            onChange={handleFormChange}
            required
          />
        </div>
        <div className={styles.yieldTimeInput}>
          <div className={styles.formYield}>
            <h3>Serving Size</h3>
            <input
              type="text"
              name="yield"
              placeholder="e.g. Serves 4"
              value={formData.yield}
              onChange={handleFormChange}
              maxLength="20"
              required
              className={styles.formInput}
            />
          </div>
          <div className={styles.formActiveTime}>
            <h3>Active Time</h3>
            <input
              type="text"
              name="active_time"
              placeholder="e.g. 20 mins"
              value={formData.active_time}
              onChange={handleFormChange}
              maxLength="20"
              required
              className={styles.formInput}
            />
          </div>
          <div className={styles.formTotalTime}>
            <h3>Total Time</h3>
            <input
              type="text"
              name="total_time"
              placeholder="e.g. 1 hour"
              value={formData.total_time}
              onChange={handleFormChange}
              maxLength="20"
              required
              className={styles.formInput}
            />
          </div>
        </div>
        <div className={styles.formIngredients}>
          <h3>Ingredients</h3>
          <textarea
            type="text"
            name="ingredients"
            placeholder="Add list of Ingredients"
            rows="15"
            cols="70"
            value={formData.ingredients}
            onChange={handleFormChange}
            required
          />
        </div>
        <div className={styles.formInstructions}>
          <h3>Instructions</h3>
          <textarea
            type="text"
            name="instructions"
            placeholder={`Add one or multiple steps(e.g. "preheat oven to 350° F")`}
            rows="15"
            cols="70"
            value={formData.instructions}
            onChange={handleFormChange}
            required
          />
        </div>
        <div className={styles.tagContainer}>
          <h3 className={styles.tagTitle}>Tags</h3>
          <div className={styles.tagBorder}>
            {tags.map((tag) => (
              <label key={tag.id} className={styles.tagItem}>
                <input
                  type="checkbox"
                  checked={selectedTagIds.includes(tag.id)}
                  onChange={() => handleTaggingsChange(tag.id)}
                />
                {tag.name}
              </label>
            ))}
          </div>
        </div>
        <div className={styles.createButtonContainer}>
          <button type="submit">Create Recipe</button>
        </div>
      </form>
    </div>
  );
};

export default RecipeForm;
