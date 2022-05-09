import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { idSearch } from '../api/foodsAPI';
import shareIcon from '../images/shareIcon.svg';
import './styles.css';
import {
  getFavorite,
  removeFavorite,
  saveFavorite,
  setInProgressRecipe,
  getInProgressRecipes,
} from '../helpers/tokenLocalStorage';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';
import blackHeartIcon from '../images/blackHeartIcon.svg';
import treatRecipe from '../helpers/treatingDataForLocal';

const copy = require('clipboard-copy');

const five = 5;
function FoodInProgress(props) {
  const { match: { params: { recipeId } } } = props;
  const [recipe, setRecipe] = useState({});
  const history = useHistory();
  const [isFavorite, setIsFavorite] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [checkedIndex, setCheckedIndex] = useState([]);

  const getLink = () => {
    const string = window.location.href;
    const URL = string.split('/').splice(0, five).join('/');
    copy(URL);
    setLinkCopied(true);
  };

  const handleHeart = () => {
    setIsFavorite(!isFavorite);
  };

  const finishRecipe = () => {
    treatRecipe(recipeId, recipe, 'food');
    history.push('/done-recipes');
  };

  const handleCheckBox = ({ target }, index) => {
    if (!checkedIndex.includes(`${index}`)) {
      setCheckedIndex([...checkedIndex, target.name]);
      return;
    }
    setCheckedIndex(checkedIndex.filter((e) => +e !== index));
  };
  const handleClick = () => {
    const obj = {
      id: recipeId,
      type: 'food',
      nationality: recipe.strArea,
      category: recipe.strCategory,
      alcoholicOrNot: '',
      name: recipe.strMeal,
      image: recipe.strMealThumb,
    };
    if (isFavorite) {
      removeFavorite(obj);
      handleHeart();
      return;
    }
    saveFavorite(obj);
    handleHeart();
  };

  // Set recipe in storage
  useEffect(() => {
    const inProgressRecipesData = getInProgressRecipes();
    if (inProgressRecipesData.meals[recipeId]) {
      setCheckedIndex(inProgressRecipesData.meals[recipeId]);
      return;
    }
    setInProgressRecipe(recipeId, 'meals', checkedIndex);
  }, []);

  useEffect(() => {
    setInProgressRecipe(recipeId, 'meals', checkedIndex);
  }, [checkedIndex, recipeId]);

  useEffect(() => {
    const getRecipe = async () => {
      setRecipe(await idSearch(recipeId));
    };
    getRecipe();
  }, [recipeId]);

  useEffect(() => {
    const allFavorites = getFavorite();
    setIsFavorite(allFavorites.some((item) => item.id === recipeId));
  }, []);

  const recipeKeys = Object.keys(recipe);
  const ingredients = recipeKeys.filter((item) => item.includes('strIngredient'));
  const measure = recipeKeys.filter((item) => item.includes('strMeasure'));

  useEffect(() => {
    const allIngredients = ingredients.filter(
      (item) => recipe[item] !== null && recipe[item] !== '',
    );

    if (
      allIngredients.length > 0
      && allIngredients.length === checkedIndex.length
    ) {
      return setIsDisabled(false);
    }
    return setIsDisabled(true);
  }, [checkedIndex.length, ingredients, recipe]);

  return (
    <div>
      <h1 data-testid="recipe-title">{recipe.strMeal}</h1>
      <img data-testid="recipe-photo" src={ recipe.strMealThumb } alt="" />
      <button type="button" data-testid="share-btn" onClick={ () => getLink() }>
        <img src={ shareIcon } alt="shareIcon" />
      </button>
      {linkCopied && <span>Link copied!</span>}
      <button type="button" onClick={ handleClick }>
        <img
          src={ isFavorite ? blackHeartIcon : whiteHeartIcon }
          alt="Favorito"
          data-testid="favorite-btn"
        />
      </button>
      <p data-testid="recipe-category">{recipe.strCategory}</p>
      {ingredients
        .filter((item) => recipe[item] !== null && recipe[item] !== '')
        .map((i, index) => (
          <label
            key={ index }
            htmlFor={ `ingredient-${index}` }
            data-testid={ `${index}-ingredient-step` }
          >
            <input
              type="checkbox"
              id={ `ingredient-${index}` }
              name={ index }
              onClick={ (e) => handleCheckBox(e, index) }
              checked={ checkedIndex.some((item) => +item === index) }
            />
            <span
              key={ index }
              className={
                checkedIndex.some((item) => +item === index) ? 'checkbox' : ''
              }
            >
              {`${recipe[measure[index]]} ${recipe[i]}`}
            </span>
          </label>
        ))}
      <p data-testid="instructions">{recipe.strInstructions}</p>
      <p>Details</p>
      <button
        type="button"
        onClick={ finishRecipe }
        data-testid="finish-recipe-btn"
        className="buttonFinish"
        disabled={ isDisabled }
      >
        Finish recipe
      </button>
    </div>
  );
}

FoodInProgress.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      recipeId: PropTypes.string,
    }),
  }).isRequired,
};

export default FoodInProgress;
