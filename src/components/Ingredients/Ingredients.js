import React, { useState, useCallback } from 'react';
import IngredientList from './IngredientList';
import IngredientForm from './IngredientForm';
import Search from './Search';

function Ingredients() {
  const [userIngredients, setUserIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const filteredIngredientsHandler = useCallback(ingredients => {
    setUserIngredients(ingredients);
  }, []);

  const addIngredientHandler = ingredient => {
    setIsLoading(true);
    fetch('https://react-hooks-26b43.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      setIsLoading(false);
      return res.json();
    }).then(data => {
      setUserIngredients(prevIngredients => [...prevIngredients, {id: data.name, ...ingredient}]);
    });
  };

  const removeIngredientHandler = id => {
    setIsLoading(true);
    fetch(`https://react-hooks-26b43.firebaseio.com/ingredients/${id}.json`, {
      method: 'DELETE'
    }).then(res => {
      setIsLoading(false);
      setUserIngredients(prevIngredients => prevIngredients.filter(ing => ing.id !== id));
    })
  }

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  );
}

export default Ingredients;
