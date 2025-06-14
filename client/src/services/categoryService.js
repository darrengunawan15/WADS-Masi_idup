import axios from 'axios';

const API_URL = '/api/categories/';

const getCategories = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const categoryService = {
  getCategories,
};

export default categoryService; 