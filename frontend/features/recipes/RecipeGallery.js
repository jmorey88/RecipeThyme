import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { searchRecipes } from "../search/searchSlice";
import styles from "./RecipeGallery.module.css";

const RecipeGallery = () => {
  const dispatch = useDispatch();

  const recipes = useSelector((state) => state.recipes.recipeEntities);
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
        <li key={recipe.id} className={styles.recipeSquare}>
          <Link to={`/recipe/${recipe.id}`}>
            <img
              src={recipe.image}
              alt={recipe.title}
              className={styles.recipeImg}
            />
            <h3 className={styles.recipeTitle}>{recipe.title}</h3>
            {/* <p>{recipe.description}</p> */}
          </Link>
        </li>
      );
    });
  };

  return (
    <div className={styles.background}>
      <div className={styles.gallery}>
        <h1 className={styles.heading}>Recipe Gallery</h1>
        {/* <img src="" alt="" className={styles.newRecipe} /> */}
        <Link to="/recipe-create" className={styles.newRecipe}>
          {/* <img
            src="https://recipe-thyme-content.s3.us-west-1.amazonaws.com/app-images/plus.png"
            alt="plus"
            className={styles.plus}
          /> */}
          <p>
            + <u>New Recipe</u>
          </p>
        </Link>
      </div>

      <InfiniteScroll
        dataLength={searchResults?.length || 0}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p className={styles.endMessage}>
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
