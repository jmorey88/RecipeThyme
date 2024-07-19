import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTags } from "./TagSlice";
import styles from "./TagSelect.module.css";

const TagSelect = ({ value, onChange }) => {
  const dispatch = useDispatch();
  const tags = useSelector((state) => state.tags.items);
  const tagStatus = useSelector((state) => state.tags.status);

  useEffect(() => {
    if (tagStatus === "idle") {
      dispatch(fetchTags());
    }
  }, [tagStatus, dispatch]);

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
