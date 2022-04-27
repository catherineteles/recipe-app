import React, { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AppContext from '../context/AppContext';
import RecipeCard from '../components/RecipeCard';

const doze = 12;
function Drinks() {
  const { setPage, data } = useContext(AppContext);

  const history = useHistory();
  useEffect(() => {
    setPage('Drinks');
    if (data.drinks && data.drinks.length === 1) {
      history.push(`/drinks/${data.drinks[0].idDrink}`);
    }
  }, [setPage, data, history]);

  useEffect(() => {
    if (data.drinks === null) {
      return global.alert('Sorry, we haven\'t found any recipes for these filters.');
    }
  }, [data]);

  return (
    <div>
      <Header title="Drinks" show />
      {data.drinks && data.drinks.filter((f, i) => i < doze).map((drink, index) => (
        <RecipeCard
          index={ index }
          name={ drink.strDrink }
          img={ drink.strDrinkThumb }
          key={ index }
        />
      ))}

      <Footer />
    </div>
  );
}

export default Drinks;
