import React, { useEffect, useState } from "react";
import { fetchRecipeTags } from "./tagService";
import { useDispatch } from "react-redux";
import styles from "./TagSelect.module.css";

const TagSelect = ({ value, onChange }) => {
  const dispatch = useDispatch();

  const [tags, setTags] = useState([]);

  useEffect(() => {
    const loadTags = async () => {
      const tagsData = await fetchRecipeTags();
      setTags(tagsData);
    };
    loadTags();
  }, []);

  const handleCheckboxChange = (tag) => {
    if (value.includes(tag)) {
      onChange(value.filter((t) => t !== tag));
    } else {
      onChange([...value, tag]);
    }
  };

  return (
    <fieldset className={styles.TagSelectContainer}>
      <legend>Choose Tags:</legend>
      {tags.map((tag) => (
        <div key={tag.id}>
          <label>
            <input
              type="checkbox"
              checked={value.includes(tag.id)}
              onChange={() => handleCheckboxChange(tag.id)}
            />
            {tag.name}
          </label>
        </div>
      ))}
    </fieldset>
  );
};

export default TagSelect;
