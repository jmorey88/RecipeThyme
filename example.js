const adventurerOne = {
  name: "John",
  dog: {
    breed: "Dalmation",
    name: "Spot",
  },
};

const adventurerTwo = {
  name: "John"
};

adventurerOne.dog.name // "Spot"
adventurerTwo.dog?.name // null



const store = {
  recipes: {
    entities: {
      634: { title: 'Chocolate Chip Cookies', description: "Blh balh bahl", instructions: "How to make this..." },
      683: { title: 'Burritos'},
      237: { title: 'Pasta Primavera' },
    }, 
    currentId: 634
  }
}


RecipeDetailComp = (props) => {
  useDispatch
  // go to server and fetch full detail

  return (
    <div>
      <h1>Recipe {props.recipe.id}</h1>
      <p>Description: {props.recipe?.description}</p>
    </div>
  )
}


<RecipeDetailComp recipe={store.recipes.entities[634]} />


// localhost:3000/recipes/:recipeId
// useLocation? get url parameter for recipeId
// set recipeId on recipes reducer under currentId

const currentRecipe = store.recipes.entities[store.recipes.currentId]
<RecipeDetailComp recipe={currentRecipe} />