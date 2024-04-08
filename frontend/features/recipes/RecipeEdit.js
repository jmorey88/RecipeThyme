import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { requestEditRecipe, recieveRecipeDetails } from "./recipeSlice";
import { resetSearch } from "../search/searchSlice";
import styles from "./RecipeCreate.module.css";
// import { unstable_useViewTransitionState } from "react-router-dom";
// import { editRecipe } from "./RecipeService";

const EditRecipeForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { recipeId } = useParams();
  const currentRecipe = useSelector(
    (state) => state.recipes.recipeEntities[recipeId]
  );

  const [formData, setFormData] = useState({
    title: currentRecipe.title,
    description: currentRecipe.description,
    yield: currentRecipe.yield,
    active_time: currentRecipe.active_time,
    total_time: currentRecipe.total_time,
    ingredients: currentRecipe.ingredients,
    instructions: currentRecipe.instructions,
    // image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const editRecipeResult = await dispatch(
      requestEditRecipe({ recipeId, formData })
    );
    console.log("formData-comp:", formData);
    // const recipeId = newRecipe.payload.id;
    if (editRecipeResult.type.endsWith("fulfilled")) {
      alert("recipe successfully updated");
      // dispatch(resetSearch());
      console.log("navigated");
      dispatch(recieveRecipeDetails(recipeId));
      navigate(`/recipe/${recipeId}`);
    } else if (editRecipeResult.type.endsWith("rejected"))
      alert(editRecipeResult.payload || "failed to edit recipe-comp");
  };

  return (
    <div className={styles.createFormBackground}>
      <form onSubmit={handleSubmit} className={styles.createForm}>
        <h1 className={styles.title}>Edit Recipe</h1>
        <div>
          <input
            type="text"
            name="title"
            placeholder={formData.title}
            value={formData.title}
            onChange={handleChange}
            maxLength="40"
            required
            className={styles.formTitle}
          />
        </div>
        <div className={styles.formDescription}>
          <textarea
            type="text"
            name="description"
            placeholder={formData.description}
            cols="50"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.yieldTimeInput}>
          <div className={styles.formYield}>
            <input
              type="text"
              name="yield"
              placeholder={formData.yield}
              value={formData.yield}
              onChange={handleChange}
              maxLength="20"
              required
            />
          </div>
          <div className={styles.formActiveTime}>
            <input
              type="text"
              name="active_time"
              placeholder={formData.active_time}
              value={formData.active_time}
              onChange={handleChange}
              maxLength="20"
              required
            />
          </div>
          <div className={styles.formTotalTime}>
            <input
              type="text"
              name="total_time"
              placeholder={formData.total_time}
              value={formData.total_time}
              onChange={handleChange}
              maxLength="20"
              required
            />
          </div>
        </div>
        <div className={styles.formIngredients}>
          <textarea
            type="text"
            name="ingredients"
            placeholder={formData.ingredients}
            rows="15"
            cols="70"
            value={formData.ingredients}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formInstructions}>
          <textarea
            type="text"
            name="instructions"
            placeholder={formData.instructions}
            rows="15"
            cols="70"
            value={formData.instructions}
            onChange={handleChange}
            required
          />
        </div>
        {/* <input type="file" name="image" onChange={handleImageChange} /> */}
        <div className={styles.buttonContainer}>
          <button type="submit">Edit Recipe</button>
        </div>
      </form>
    </div>
  );
};

export default EditRecipeForm;
