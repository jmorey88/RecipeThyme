import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  recieveRecipeDetails,
  handleRecipeImage,
  requestDeleteRecipe,
} from "./recipeSlice";
import styles from "./RecipeDetail.module.css";

const RecipeDetail = () => {
  const { recipeId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const recipe = useSelector((state) => state.recipes.recipeEntities[recipeId]);
  const currentUserId = useSelector((state) => state.session.currentUser.id);

  useEffect(() => {
    if (!recipe || !recipe.detailed) {
      dispatch(recieveRecipeDetails(recipeId));
    }
  }, [dispatch, recipe]);

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

  // const handleImageChange = async (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     try {
  //       await dispatch(handleRecipeImage({ recipeId, imageFile: file }));
  //       alert("Image uploaded successfully");
  //       dispatch(recieveRecipeDetails(recipeId));
  //     } catch (error) {
  //       alert("Failed to upload image");
  //     }
  //   }
  // };
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const actionResult = await dispatch(
        handleRecipeImage({ recipeId, imageFile: file })
      );

      // Check if the dispatch action was fulfilled (successfully resolved)
      if (actionResult.type.endsWith("fulfilled")) {
        alert("Image uploaded successfully");
        dispatch(recieveRecipeDetails(recipeId));
      } else if (actionResult.type.endsWith("rejected")) {
        // Handle the case where the action was rejected (error occurred)
        // Assuming the error structure is consistent as mentioned earlier
        // const errorMessage =
        //   actionResult.errors?.message ||
        //   "Failed to upload image. Please try again.";
        // console.log("actionResult:", actionResult);
        // alert(errorMessage);
        alert(
          actionResult.payload || "Failed to upload image. Please try again."
        );
      }
    }
  };

  const isAuthor = currentUserId === recipe?.author_id;
  // console.log("recipe:", recipe);
  // console.log("currentUserId:", currentUserId);
  // console.log("recipe.author_id:", recipe.author_id);
  // console.log("isAuthor:", isAuthor);

  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.background}>
      <Link to="/recipe-gallery" className={styles.galleryNav}>
        &lt; <u>Recipe Gallery</u>
      </Link>
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
                // className={styles.fileInput}
                style={{
                  display: "none",
                  // backgroundImage:
                  //   "url('https://recipe-thyme-content.s3.us-west-1.amazonaws.com/app-images/camera-2112207_1280.png')",
                }}
              />
              <label htmlFor="fileInput" className={styles.uploadButton}>
                <img
                  src="https://recipe-thyme-content.s3.us-west-1.amazonaws.com/app-images/camera-2112207_1280.png"
                  alt="Upload Image"
                  className={styles.uploadIcon}
                />
                Upload New Image
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
                EDIT RECIPE
              </Link>
              <button onClick={handleDelete} className={styles.delete}>
                <img
                  src="https://recipe-thyme-content.s3.us-west-1.amazonaws.com/app-images/final_trash_can.png"
                  alt="trash-icon"
                  className={styles.trash}
                ></img>
                DELETE RECIPE
              </button>
            </div>
          ) : null}
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

{
  /* <div className={styles.imageWrapper}>
  <img src={recipe.image} alt={recipe.title} className={styles.recipeImage} />
  {isAuthor ? (
    <div className={styles.uploadImageWrapper}>
      <input type="file" onChange={handleImageChange} id="fileInput" />
      <label htmlFor="fileInput" className={styles.uploadIcon}>
        <img
          src="https://recipe-thyme-content.s3.us-west-1.amazonaws.com/app-images/camera-2112207_1280.png"
          alt="upload"
          className={styles.cameraImage}
        />
      </label>
    </div>
  ) : null}
</div>; */
}

{
  /* <label htmlFor="fileInput" className={styles.uploadIcon}>
  <img
    src="https://recipe-thyme-content.s3.us-west-1.amazonaws.com/app-images/camera-2112207_1280.png"
    alt="upload"
    // className={styles.cameraImage}
  />
</label>; */
}
