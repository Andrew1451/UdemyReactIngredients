import React, { useReducer, useEffect, useCallback } from 'react';
import IngredientList from './IngredientList';
import IngredientForm from './IngredientForm';
import ErrorModal from '../UI/ErrorModal';
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

const httpReducer = (curHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return { loading: true, error: null };
    case 'RESPONSE':
      return { ...curHttpState, loading: false }
    case 'ERROR':
      return { loading: false, error: action.error}
    case 'CLEAR':
      return { ...curHttpState, error: null }
    default:
      throw new Error ('Should not reach this!');
  }
}

function Ingredients() {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, { loading: false, error: null });
  // const [userIngredients, setUserIngredients] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();

  useEffect(() => {
    console.log('rendering ingredients: ', userIngredients);
  }, [userIngredients]);

  const filteredIngredientsHandler = useCallback(ingredients => {
    // setUserIngredients(ingredients);
    dispatch({type: 'SET', ingredients: ingredients})
  }, []);

  const addIngredientHandler = ingredient => {
    dispatchHttp({ type: 'SEND' });
    // setIsLoading(true);
    fetch('https://react-hooks-26b43.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      dispatchHttp({ type: 'RESPONSE' });
      // setIsLoading(false);
      return res.json();
    }).then(data => {
      dispatch({type: 'ADD', ingredient: {id: data.name, ...ingredient}})
      // setUserIngredients(prevIngredients => [...prevIngredients, {id: data.name, ...ingredient}]);
    }).catch(error => {
      // setError('Something went wrong!');
      // setIsLoading(false);
      dispatchHttp({ type: 'ERROR', error: 'Something went wrong!' });
    });
  };

  const removeIngredientHandler = id => {
    dispatchHttp({ type: 'SEND' });
    // setIsLoading(true);
    fetch(`https://react-hooks-26b43.firebaseio.com/ingredients/${id}.json`, {
      method: 'DELETE'
    }).then(res => {
      dispatchHttp({ type: 'RESPONSE' });
      // setIsLoading(false);
      dispatch({type: 'DELETE', id: id});
      // setUserIngredients(prevIngredients => prevIngredients.filter(ing => ing.id !== id));
    }).catch(error => {
      dispatchHttp({ type: 'ERROR', error: 'Something went wrong!' })
    })
  }

  const clearError = () => {
    dispatchHttp({ type: 'CLEAR' });
  }

  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={clearError} >{httpState.error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} loading={httpState.loading} />
      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  );
}

export default Ingredients;
