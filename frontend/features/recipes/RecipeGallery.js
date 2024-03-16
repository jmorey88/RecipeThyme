import React, { useEffect, useState, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { searchRecipes } from "../search/searchSlice";
import styles from "./RecipeGallery.module.css";

const RecipeGallery = () => {
  const dispatch = useDispatch();

  const recipes = useSelector((state) => state.recipes.entities);
  const searchResults = useSelector((state) => state.search?.results);
  const currentPage = useSelector(
    (state) => state.search.metaData?.current_page || 1
  );
  const totalPages = useSelector(
    (state) => state.search.metaData?.total_pages || 1
  );
  const hasMore = currentPage < totalPages;

  useEffect(() => {
    dispatch(searchRecipes({ page: 1 }));
  }, [dispatch]);

  const fetchMoreData = () => {
    if (hasMore) {
      dispatch(searchRecipes({ page: currentPage + 1 }));
    }
  };

  const renderRecipes = () => {
    return searchResults?.map((recipeId) => {
      const recipe = recipes[recipeId];
      if (!recipe) {
        return <p>Loading...</p>;
      }
      return (
        <li key={recipe.id}>
          <h3>{recipe.title}</h3>
          <p>{recipe.description}</p>
        </li>
      );
    });
  };

  return (
    <div>
      <h1>Recipe Gallery</h1>
      <InfiniteScroll
        dataLength={searchResults?.length || 0}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>End of Recipes List</b>
          </p>
        }
      >
        <ul className={styles.recipesDisplay}>{renderRecipes()}</ul>
      </InfiniteScroll>
    </div>
  );
};

export default RecipeGallery;
