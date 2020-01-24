import React, { useReducer, useEffect, useCallback, useMemo } from 'react';
import IngredientList from './IngredientList';
import IngredientForm from './IngredientForm';
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../../hooks/http';
import Search from './Search';

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id);
    default: 
      throw new Error('should not get here');
  }
}

function Ingredients() {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const { isLoading, error, data, sendRequest, extra, identifier } = useHttp();
  // const [userIngredients, setUserIngredients] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();

  useEffect(() => {
    if (!isLoading && !error && identifier === 'REMOVE_INGREDIENT') {
      dispatch({ type: 'DELETE', id: extra });
    } else if (!isLoading && !error && identifier === 'ADD_INGREDIENT') {
      dispatch({type: 'ADD', ingredient: {id: data.name, ...extra}})
    }
  }, [data, extra, identifier, isLoading, error]);

  const filteredIngredientsHandler = useCallback(ingredients => {
    // setUserIngredients(ingredients);
    dispatch({type: 'SET', ingredients: ingredients})
  }, []);

  const addIngredientHandler = useCallback(ingredient => {
    sendRequest('https://react-hooks-26b43.firebaseio.com/ingredients.json', 'POST', JSON.stringify(ingredient), ingredient, 'ADD_INGREDIENT');
    // dispatchHttp({ type: 'SEND' });
    // // setIsLoading(true);
    // fetch('https://react-hooks-26b43.firebaseio.com/ingredients.json', {
    //   method: 'POST',
    //   body: JSON.stringify(ingredient),
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // }).then(res => {
    //   dispatchHttp({ type: 'RESPONSE' });
    //   // setIsLoading(false);
    //   return res.json();
    // }).then(data => {
    //   dispatch({type: 'ADD', ingredient: {id: data.name, ...ingredient}})
    //   // setUserIngredients(prevIngredients => [...prevIngredients, {id: data.name, ...ingredient}]);
    // }).catch(error => {
    //   // setError('Something went wrong!');
    //   // setIsLoading(false);
    //   dispatchHttp({ type: 'ERROR', error: 'Something went wrong!' });
    // });
  }, [sendRequest]);

  const removeIngredientHandler = useCallback(id => {
    sendRequest(`https://react-hooks-26b43.firebaseio.com/ingredients/${id}.json`, 'DELETE', null, id, 'REMOVE_INGREDIENT');
    // dispatchHttp({ type: 'SEND' });
    // setIsLoading(true);
    
  }, [sendRequest]);

  const clearError = useCallback(() => {
    // dispatchHttp({ type: 'CLEAR' });
  }, []);

  const ingredientList = useMemo(() => {
    return (
      <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} />
    )
  }, [userIngredients, removeIngredientHandler]);

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError} >{error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading} />
      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
