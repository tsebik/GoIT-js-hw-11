import axios from 'axios';

const DEFAULT_PAGE = 1;
const per_page = 40;

let page = DEFAULT_PAGE;

export const resetPage = () => {
  page = DEFAULT_PAGE;
};

export const fetchData = async searchQuery => {
  const searchParams = new URLSearchParams({
    key: '29237455-bf508152d1f1c478b8d78d1ad',
    q: searchQuery,
    per_page,
    page,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  });

  try {
    const { data } = await axios.get(
      `https://pixabay.com/api/?${searchParams}`
    );

    const dataImg = {
      img: data.hits,
      isLastPage: page > Math.ceil(data.totalHits / per_page),
    };
    page += 1;

    return dataImg;
  } catch (error) {
    console.log(error.message);
  }
};
