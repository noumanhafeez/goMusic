// In useFavorites.js (or any relevant file)
import { useState } from 'react';

const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);

  const addFavorite = (item) => {
    setFavorites([...favorites, item]);
  };

  const removeFavorite = (uri) => {
    setFavorites(favorites.filter(item => item.uri !== uri));
  };

  const reorderFavorites = (oldIndex, newIndex) => {
    const updatedFavorites = [...favorites];
    const [removed] = updatedFavorites.splice(oldIndex, 1);
    updatedFavorites.splice(newIndex, 0, removed);
    setFavorites(updatedFavorites);
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    reorderFavorites
  };
};

export default useFavorites;
