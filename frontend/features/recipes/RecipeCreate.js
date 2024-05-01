import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { createRecipe } from "./recipeSlice";
import { resetSearch } from "../search/searchSlice";
import { fetchRecipeTags } from "./RecipeService";
import styles from "./RecipeCreate.module.css";
import { unstable_useViewTransitionState } from "react-router-dom";

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
    // image: null,
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
    console.log({ recipeData });
    const newRecipe = await dispatch(createRecipe(recipeData)).catch(
      (error) => {
        console.error("Failed to create the recipe:", error);
      }
    );
    const recipeId = newRecipe.payload.id;
    if (recipeId) {
      dispatch(resetSearch());
      console.log("navigated");
      navigate(`/recipe/${recipeId}`);
    }
  };

  return (
    <div className={styles.createFormBackground}>
      <form onSubmit={handleSubmit} className={styles.createForm}>
        <h1 className={styles.title}>Create Recipe</h1>
        <div>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleFormChange}
            maxLength="40"
            required
            className={styles.formTitle}
          />
        </div>
        <div className={styles.formDescription}>
          <textarea
            type="text"
            name="description"
            placeholder="Description"
            cols="50"
            rows="4"
            value={formData.description}
            onChange={handleFormChange}
            required
          />
        </div>
        <div className={styles.yieldTimeInput}>
          <div className={styles.formYield}>
            <input
              type="text"
              name="yield"
              placeholder="Yield"
              value={formData.yield}
              onChange={handleFormChange}
              maxLength="20"
              required
            />
          </div>
          <div className={styles.formActiveTime}>
            <input
              type="text"
              name="active_time"
              placeholder="Active_Time"
              value={formData.active_time}
              onChange={handleFormChange}
              maxLength="20"
              required
            />
          </div>
          <div className={styles.formTotalTime}>
            <input
              type="text"
              name="total_time"
              placeholder="Total_time"
              value={formData.total_time}
              onChange={handleFormChange}
              maxLength="20"
              required
            />
          </div>
        </div>
        <div className={styles.formIngredients}>
          <textarea
            type="text"
            name="ingredients"
            placeholder="Ingredients"
            rows="15"
            cols="70"
            value={formData.ingredients}
            onChange={handleFormChange}
            required
          />
        </div>
        <div className={styles.formInstructions}>
          <textarea
            type="text"
            name="instructions"
            placeholder="Instructions"
            rows="15"
            cols="70"
            value={formData.instructions}
            onChange={handleFormChange}
            required
          />
        </div>
        {/* <input type="file" name="image" onChange={handleImageChange} /> */}
        <div className={styles.buttonContainer}>
          <button type="submit">Create Recipe</button>
        </div>
      </form>
      <div className={styles.tagContainer}>
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
  );
};

export default RecipeForm;

// const handleImageChange = (e) => {
//   setFormData({
//     ...formData,
//     image: e.target.files[0],
//   });
// };

// const handleSubmit = async (e) => {
//   e.preventDefault();

// Step 1: Fetch Presigned URL
// const presignedUrlResponse = await fetch(
//   "http://localhost:3000/api/s3/presigned-url"
// );
// const { url: presignedUrl, key } = await presignedUrlResponse.json();

// Step 2: Upload Image to S3
// const file = formData.image;
// console.log("file:", file);
// console.log("key", key);
// console.log("presigned-url", presignedUrl);
// await fetch(presignedUrl, {
//   method: "PUT",
//   headers: {
//     "Content-Type": "multipart/form-data",
//   },
//   body: file,
// }).then((response) => {
//   console.log(response);
// response.json().then((data) => {
//   console.log(data);
// });
// });

// Assuming the S3 bucket URL and the key of the uploaded file, construct the image URL
// const imageUrl = `https://recipe-thyme-content.s3.amazonaws.com/${key}`;

// console.log("image-url", imageUrl);

// Step 3: Create Recipe with the Image URL
// const recipeData = {
//   ...formData,
//   image: imageUrl, // Use the S3 image URL
// };

//   dispatch(createRecipe(formData));
// };
