import React, { useState, useEffect, useRef } from 'react';
import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const { onLoadIngredients } = props;
  const [enteredFilter, setEnteredFilter] = useState('');
  const inputRef = useRef();
  useEffect(() => {
    const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        const query = enteredFilter.length === 0 ? '' : `?orderBy="title"&equalTo="${enteredFilter}"`;
        fetch('https://react-hooks-26b43.firebaseio.com/ingredients.json' + query)
        .then(res => res.json())
        .then(data => {
          const loadedIngredients = [];
          for (const key in data) {
            loadedIngredients.push({
              id: key,
              title: data[key].title,
              amount: data[key].amount
            });
          }
          onLoadIngredients(loadedIngredients);
        });
      }
    },500)
    return () => clearTimeout(timer);
  }, [enteredFilter, onLoadIngredients, inputRef]);
  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input type="text" ref={inputRef} value={enteredFilter} onChange={event => setEnteredFilter(event.target.value)} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
