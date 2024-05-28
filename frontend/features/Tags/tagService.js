export const fetchRecipeTags = async (tagIDs) => {
  const response = await fetch("/api/tags", {
    method: "GET",
    body: tagIDs,
  });

  return response.json();
};
