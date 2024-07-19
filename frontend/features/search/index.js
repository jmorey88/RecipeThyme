import React, { useState } from "react";
import TagSelect from "../Tags/TagSelect.js";
import styles from "./SearchForm.module.css";

const SearchForm = ({ onSearch }) => {
  const [keyword, setKeyword] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [ownRecipes, setOwnRecipes] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({
      keyword,
      tags: selectedTags,
      ownRecipes,
    });
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.searchForm}>
        <div className={styles.leftSide}>
          <h2>Search Recipes</h2>
          <input
            type="text"
            placeholder="Keyword..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className={styles.keywordInput}
          />
          <label className={styles.ownRecipesInput}>
            My Recipes Only
            <input
              type="checkbox"
              checked={ownRecipes}
              onChange={(e) => setOwnRecipes(e.target.checked)}
            />
          </label>
        </div>
        <div className={styles.rightSide}>
          <TagSelect value={selectedTags} onChange={setSelectedTags} />
          <div className={styles.buttonContainer}>
            <button type="submit" className={styles.searchButton}>
              Search
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
