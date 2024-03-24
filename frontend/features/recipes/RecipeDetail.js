import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { recieveRecipeDetails } from "./recipeSlice";
import styles from "./RecipeDetail.module.css";

const RecipeDetail = () => {
  const { recipeId } = useParams();
  const dispatch = useDispatch();
  const recipe = useSelector((state) => state.recipes.recipeEntities[recipeId]);

  useEffect(() => {
    if (!recipe || !recipe.detailed) {
      dispatch(recieveRecipeDetails(recipeId));
    }
  }, [dispatch, recipe]);

  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.background}>
      <div className={styles.topHalf}>
        <img
          src={recipe.image}
          alt={recipe.title}
          className={styles.recipeImage}
        />
        <div className={styles.recipeSpecs}>
          <h1 className={styles.title}>{recipe.title}</h1>
          <p className={styles.description}>{recipe.description}</p>
          <div className={styles.specs}>
            <text className={styles.yield}>Yield:</text>
            <p>{recipe.yield}</p>
            <label>Active Time:</label>
            <p>{recipe.active_time}</p>
            <label>Total Time:</label>
            <p>{recipe.total_time}</p>
          </div>
          <div className={styles.editDelete}>
            <button>
              <img
                src="https://recipe-thyme-content.s3.us-west-1.amazonaws.com/app-images/pencil-icon-png-28-Photoroom.png-Photoroom.png"
                alt="pencil-icon"
                className={styles.pencil}
              ></img>
              Edit
            </button>
            <button className={styles.delete}>
              <img
                src="https://recipe-thyme-content.s3.us-west-1.amazonaws.com/app-images/trash-can-icon-28689.png"
                alt="trash-icon"
                className={styles.trash}
              ></img>
              Delete
            </button>
          </div>
        </div>
      </div>
      <div className={styles.recipeCard}>
        <div className={styles.recipe}>
          <div className={styles.ingredients}>
            <label>Ingredients:</label>
            <p>{recipe.ingredients}</p>
          </div>
          <div className={styles.instructions}>
            <label>Instructions:</label>
            <p>{recipe.instructions}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
