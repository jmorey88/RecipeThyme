export const fetchRecipeTags = async (tagIDs) => {
  const response = await fetch("/api/tags", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch tags");
  }

  return response.json();
};
