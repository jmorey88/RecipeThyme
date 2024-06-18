import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { requestEditRecipe, recieveRecipeDetails } from "./recipeSlice";
import { resetSearch } from "../search/searchSlice";
import { fetchRecipeTags } from "../Tags/tagService";
import styles from "./RecipeEdit.module.css";

const EditRecipeForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [tags, setTags] = useState([]);
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const { recipeId } = useParams();
  const currentRecipe = useSelector(
    (state) => state.recipes.recipeEntities[recipeId]
  );

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
    if (currentRecipe) {
      setFormData({
        title: currentRecipe.title,
        description: currentRecipe.description,
        yield: currentRecipe.yield,
        active_time: currentRecipe.active_time,
        total_time: currentRecipe.total_time,
        ingredients: currentRecipe.ingredients,
        instructions: currentRecipe.instructions,
      });
    }
  }, [currentRecipe]);

  useEffect(() => {
    if (!currentRecipe) {
      dispatch(recieveRecipeDetails(recipeId));
    }
  }, [dispatch, currentRecipe]);

  useEffect(() => {
    if (currentRecipe && currentRecipe.tag_ids) {
      setSelectedTagIds(currentRecipe.tag_ids);
    }
  }, [currentRecipe]);

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
    const editRecipeResult = await dispatch(
      requestEditRecipe({ recipeId, recipeData })
    );
    if (editRecipeResult.type.endsWith("fulfilled")) {
      alert("recipe successfully updated");
      dispatch(recieveRecipeDetails(recipeId));
      navigate(`/recipe/${recipeId}`);
    } else if (editRecipeResult.type.endsWith("rejected"))
      alert(editRecipeResult.payload || "failed to edit recipe-comp");
  };

  if (!currentRecipe) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.editFormBackground}>
      <form onSubmit={handleSubmit} className={styles.editForm}>
        <h1 className={styles.title}>Edit Your Recipe</h1>
        <div>
          <h3>Recipe Title</h3>
          <input
            type="text"
            name="title"
            placeholder={formData.title}
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
            placeholder={formData.description}
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
              placeholder={formData.yield}
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
              placeholder={formData.active_time}
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
              placeholder={formData.total_time}
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
            placeholder={formData.ingredients}
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
            placeholder={formData.instructions}
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
        <div className={styles.editButtonContainer}>
          <button type="submit">Edit Recipe</button>
        </div>
      </form>
    </div>
  );
};

export default EditRecipeForm;
