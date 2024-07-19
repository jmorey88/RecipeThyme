import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  recieveRecipeDetails,
  handleRecipeImage,
  requestDeleteRecipe,
} from "../recipeSlice";
import { fetchTags } from "../../Tags/TagSlice";
import styles from "./RecipeDetail.module.css";

const RecipeDetail = () => {
  const { recipeId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const [tags, setTags] = useState([]);
  const recipe = useSelector((state) => state.recipes.recipeEntities[recipeId]);
  const currentUserId = useSelector((state) => state.session.currentUser.id);
  const tags = useSelector((state) => state.tags.items);

  useEffect(() => {
    if (!recipe || !recipe.detailed) {
      dispatch(recieveRecipeDetails(recipeId));
    }
  }, [dispatch, recipe, recipeId]);

  useEffect(() => {
    if (!tags.length) {
      dispatch(fetchTags());
    }
  }, [dispatch, tags]);

  const handleDelete = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this recipe?"
    );

    if (isConfirmed) {
      try {
        await dispatch(requestDeleteRecipe({ recipeId }));
        alert("Recipe deleted successfully!!!.");
        navigate("/recipe-gallery");
      } catch (error) {
        alert("Failed to delete recipe. Please try agian.");
      }
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    console.log("file:", file);
    if (file) {
      const actionResult = await dispatch(
        handleRecipeImage({ recipeId, imageFile: file })
      );
      if (actionResult.type.endsWith("fulfilled")) {
        alert("Image uploaded successfully");
        dispatch(recieveRecipeDetails(recipeId));
      } else if (actionResult.type.endsWith("rejected")) {
        alert(
          actionResult.payload || "Failed to upload image. Please try again."
        );
      }
    }
  };

  const isAuthor = currentUserId === recipe?.author_id;

  const getTagNames = (tagIds) => {
    return tagIds
      .map((id) => {
        const tag = tags.find((tag) => tag.id === id);
        return tag ? tag.name : null;
      })
      .filter((name) => name !== null);
  };

  const tagNames = getTagNames(recipe?.tag_ids || []);

  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.background}>
      <div className={styles.topHalf}>
        <div className={styles.imageWrapper}>
          <img
            src={recipe.image}
            alt={recipe.title}
            className={styles.recipeImage}
          />
          {isAuthor && (
            <>
              <input
                type="file"
                onChange={handleImageChange}
                id="fileInput"
                style={{
                  display: "none",
                }}
              />
              <label htmlFor="fileInput" className={styles.uploadButton}>
                <img
                  src="https://recipe-thyme-content.s3.us-west-1.amazonaws.com/app-images/camera-2112207_1280.png"
                  alt="Upload Image"
                  className={styles.uploadIcon}
                />
                Update Image
              </label>
            </>
          )}
        </div>
        <div className={styles.recipeSpecs}>
          <div className={styles.recipeHead}>RECIPE</div>
          {isAuthor ? (
            <div className={styles.authorTag}>CREATED BY ME</div>
          ) : (
            <div className={styles.authorTag}>CREATED BY {recipe.author}</div>
          )}
          <h1 className={styles.title}>{recipe.title}</h1>
          {isAuthor ? (
            <div className={styles.editDelete}>
              <Link to={`/recipe/${recipeId}/edit`} className={styles.editLink}>
                <img
                  src="https://recipe-thyme-content.s3.us-west-1.amazonaws.com/app-images/final_pencil.png"
                  alt="pencil-icon"
                  className={styles.pencil}
                ></img>
                EDIT
              </Link>
              <button onClick={handleDelete} className={styles.delete}>
                <img
                  src="https://recipe-thyme-content.s3.us-west-1.amazonaws.com/app-images/final_trash_can.png"
                  alt="trash-icon"
                  className={styles.trash}
                ></img>
                DELETE
              </button>
            </div>
          ) : null}
        </div>
        <div className={styles.tagsContainer}>
          {
            /* {recipe.tag_names &&
            recipe.tag_names.map((tag, index) => (
              <div key={index} className={styles.tagNameContainer}>
                {tag}
              </div>
            ))} */
            tagNames.map((tag, index) => (
              <div key={index} className={styles.tagNameContainer}>
                {tag}
              </div>
            ))
          }
        </div>
      </div>
      <div className={styles.description}>
        <p>{recipe.description}</p>
      </div>
      <div className={styles.specs}>
        <div>
          <label>Servings:</label>
          <p>{recipe.yield}</p>
        </div>
        <div>
          <label>Active Time:</label>
          <p>{recipe.active_time}</p>
        </div>
        <div>
          <label>Total Time:</label>
          <p>{recipe.total_time}</p>
        </div>
      </div>
      <div className={styles.ingredients}>
        <label>Ingredients</label>
        <div>
          <p>{recipe.ingredients}</p>
        </div>
      </div>
      <div className={styles.instructions}>
        <label>Instructions</label>
        <div>
          <p>{recipe.instructions}</p>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
