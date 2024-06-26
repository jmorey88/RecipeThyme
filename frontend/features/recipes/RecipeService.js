// const API_BASE_URL =
//   process.env.NODE_ENV === "production"
//     ? "https://secure-fortress-86280.herokuapp.com/api"
//     : "http://localhost:3000/api";

import API_BASE_URL from "../../utils/hostNameUtil";

export const fetchRecipeDetails = async (recipeId) => {
  const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Error Loading Recipe");
  }

  return response.json();
};

export const postNewRecipe = async (recipeDetails) => {
  const response = await fetch(`${API_BASE_URL}/recipes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      recipe: {
        title: recipeDetails.title,
        description: recipeDetails.description,
        yield: recipeDetails.yield,
        active_time: recipeDetails.active_time,
        total_time: recipeDetails.total_time,
        ingredients: recipeDetails.ingredients,
        instructions: recipeDetails.instructions,
        // image: recipeDetails.image,
        tag_ids: recipeDetails.tag_ids,
      },
    }),
  });

  if (!response.ok) {
    throw new Error("Error creating Recipe");
  }

  return response.json();
};

export const uploadRecipeImage = async (recipeId, imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await fetch(
    `${API_BASE_URL}/recipes/${recipeId}/upload_image`,
    {
      method: "PUT",
      body: formData,
    }
  );

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.errors || "Failed to uplaod image.");
  }

  return responseData;
};

export const editRecipe = async (recipeId, recipeDetails) => {
  const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ recipe: recipeDetails }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.errors || "Error editing Recipe-serv");
  }

  return response.json();
};

export const destroyRecipe = async (recipeId) => {
  const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}`, {
    method: "DELETE",
  });

  return response.json();
};

export const fetchRecipeTagsByRecipeId = async (recipeId) => {
  const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}/tags`);
  if (!response.ok) {
    throw new Error("Failed to fetch tags");
  }
  return response.json();
};
