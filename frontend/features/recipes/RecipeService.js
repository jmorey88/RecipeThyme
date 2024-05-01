export const fetchRecipeDetails = async (recipeId) => {
  const response = await fetch(
    `http://localhost:3000/api/recipes/${recipeId}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    throw new Error("Error Loading Recipe");
  }

  return response.json();
};

export const postNewRecipe = async (recipeDetails) => {
  const response = await fetch("http://localhost:3000/api/recipes", {
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

  const response = await fetch(`/api/recipes/${recipeId}/upload_image`, {
    method: "PUT",
    body: formData,
  });

  const responseData = await response.json();

  if (!response.ok) {
    console.log("response:", response);
    throw new Error(responseData.errors || "Failed to uplaod image.");
  }

  return responseData;
};

export const editRecipe = async (recipeId, recipeDetails) => {
  const response = await fetch(`/api/recipes/${recipeId}`, {
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
  const response = await fetch(`/api/recipes/${recipeId}`, {
    method: "DELETE",
  });

  return response.json();
};

export const fetchRecipeTags = async () => {
  const response = await fetch("/api/tags", {
    method: "GET",
  });

  return response.json();
};
