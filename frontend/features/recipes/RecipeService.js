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
