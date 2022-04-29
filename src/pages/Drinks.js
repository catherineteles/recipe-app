import React, { useEffect, useContext } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { ingredientDrinkName } from '../api/drinksAPI';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AppContext from '../context/AppContext';
import RecipeCard from '../components/RecipeCard';
import Categories from '../components/Categories';

const doze = 12;
function Drinks() {
  const { setPage, data, setData } = useContext(AppContext);

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

  useEffect(() => {
    const callData = async () => {
      setData(await ingredientDrinkName());
    };
    callData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Header title="Drinks" show />
      <Categories />
      {data.drinks && data.drinks.filter((f, i) => i < doze).map((drink, index) => (
        <Link to={ `/drinks/${drink.idDrink}` } key={ index }>
          <RecipeCard
            index={ index }
            name={ drink.strDrink }
            img={ drink.strDrinkThumb }
            key={ index }
          />
        </Link>
      ))}

      <Footer />
    </div>
  );
}

export default Drinks;
