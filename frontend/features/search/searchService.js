export const fetchRecipes = async (page = 1) => {
  const response = await fetch(
    `http://localhost:3000/api/recipes?page=${page}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    throw new Error("Error Loading Recipes");
  }

  return response.json();
};
