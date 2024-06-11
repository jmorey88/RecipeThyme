// const API_BASE_URL =
//   process.env.NODE_ENV === "production"
//     ? "https://secure-fortress-86280.herokuapp.com/api"
//     : "http://localhost:3000/api";

import API_BASE_URL from "../../utils/hostNameUtil";

export const fetchRecipes = async (searchParams) => {
  const { page, keyword, tags, ownRecipes } = searchParams;
  const url = new URL(`${API_BASE_URL}/recipes`);
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

  const response = await fetch(url, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Error Loading Recipes");
  }

  return response.json();
};
