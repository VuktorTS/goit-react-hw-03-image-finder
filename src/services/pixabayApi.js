import axios from 'axios';

const KEY = '40709536-90c82784c25641df8e09a41ce';
const pageLimit = 12;
axios.defaults.baseURL = 'https://pixabay.com/api/';
//pixabay.com/api/?q=cat&page=1&key=your_key&image_type=photo&orientation=horizontal&per_page=12

export const getImages = async (qyery, page) => {
  const { data } = await axios({
    params: {
      key: KEY,
      q: qyery,
      page,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: pageLimit,
    },
  });
  return data;
};
