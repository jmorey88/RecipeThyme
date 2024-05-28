export const fetchRecipes = async (searchParams) => {
  const { page, keyword, tags, ownRecipes } = searchParams;
  const url = new URL(`http://localhost:3000/api/recipes`);
  const params = {
    page: page || 1,
    keyword,
    tag_ids: tags ? tags.join(",") : undefined,
    ownRecipes: ownRecipes,
  };

  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined) {
      url.searchParams.append(key, params[key]);
    }
  });

  // const response = await fetch(
  //   `http://localhost:3000/api/recipes?page=${page}`,
  //   {
  //     method: "GET",
  //   }
  // );

  const response = await fetch(url, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Error Loading Recipes");
  }

  return response.json();
};
