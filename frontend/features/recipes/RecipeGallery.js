import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { searchRecipes, resetSearch } from "../search/searchSlice";
import styles from "./RecipeGallery.module.css";
import SearchForm from "../search/SearchForm";

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

  const [currentFilters, setCurrentFilters] = useState({});

  useEffect(() => {
    const initialFilters = { page: 1 };
    dispatch(searchRecipes(initialFilters));
    setCurrentFilters(initialFilters);
  }, [dispatch]);

  const fetchMoreData = (filters) => {
    if (hasMore) {
      const nexpPageFilters = { ...currentFilters, page: currentPage + 1 };
      dispatch(searchRecipes(nexpPageFilters));
    }
  };

  const handleSearch = (filters) => {
    const newFilters = { ...filters, page: 1 };
    dispatch(resetSearch());
    dispatch(searchRecipes(newFilters));
    setCurrentFilters(newFilters);
  };

  const renderRecipes = () => {
    return searchResults?.map((recipeId) => {
      const recipe = recipes[recipeId];
      if (!recipe) {
        return <p>Loading...</p>;
      }
      return (
        <div className={styles.recipeSquareContainer}>
          <li key={recipe.id} className={styles.recipeSquare}>
            <Link to={`/recipe/${recipe.id}`}>
              <img
                src={recipe.image}
                alt={recipe.title}
                className={styles.recipeImg}
              />
              <p className={styles.author}>
                <b>Created by</b> {recipe.author}
              </p>
              <h3 className={styles.recipeTitle}>{recipe.title}</h3>
              <p className={styles.yield}>
                <b>Servings:</b> {recipe.yield}
              </p>
            </Link>
          </li>
        </div>
      );
    });
  };

  return (
    <div className={styles.background}>
      <div className={styles.gallery}>
        <SearchForm onSearch={handleSearch} />
        <Link to="/recipe-create" className={styles.newRecipe}>
          + New Recipe
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
