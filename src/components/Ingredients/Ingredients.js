import React, { useState, useEffect } from 'react';
import IngredientList from './IngredientList';
import IngredientForm from './IngredientForm';
import Search from './Search';

function Ingredients() {
  const [userIngredients, setUserIngredients] = useState([]);

  useEffect(() => {
    fetch('https://react-hooks-26b43.firebaseio.com/ingredients.json')
      .then(res => res.json())
      .then(data => {
        const loadedIngredients = [];
        for (const key in data) {
          loadedIngredients.push({
            id: key,
            title: data[key].title,
            amount: data[key].amount
          })
        }
        setUserIngredients(loadedIngredients);
      })
  }, []);

  const addIngredientHandler = ingredient => {
    fetch('https://react-hooks-26b43.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      return res.json();
    }).then(data => {
      setUserIngredients(prevIngredients => [...prevIngredients, {id: data.name, ...ingredient}]);
    });
  };

  const removeIngredientHandler = id => {
    setUserIngredients(prevIngredients => prevIngredients.filter(ing => ing.id !== id))
  }

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search />
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  );
}

export default Ingredients;
