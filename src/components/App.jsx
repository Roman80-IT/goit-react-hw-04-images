import { useEffect, useState } from 'react';

import { PER_PAGE, getImages } from './services/api';

import { GlobalStyle } from './GlobalStyle';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Searchbar } from './Searchbar/Searchbar';
import { Button } from './Button/Button';
import { Layout } from './Layout/Layout.styled';
import { Modal } from './Modal/Modal';
import { Message } from './Message/Message';
import { Loader } from './Loader/Loader';

export const App = () => {
  const [query, setQuery] = useState('');
  const [image, setImage] = useState([]);
  const [totalImage, setTotalImage] = useState(0);
  const [page, setPage] = useState(1);
  const [selectedImageUrl, setSelectedImageUrl] = useState('');
  const [load, setLoad] = useState(false);
  const [error, setError] = useState(false);
  const [loadMore, setLoadMore] = useState(true);

  // componentDidUpdate(_, prevState) {
  useEffect(() => {
    if (!query) return;

    //! `useEffect` has a missing dependency `fetchImages`. Either include it or remove the dependency array
    //* Оскільки ф-ція 'fetchImages' використовується тільки в 'useEffect()', то перемістимо його сюди:
    const fetchImages = async () => {
      try {
        setLoad(true);
        setError(false);

        const response = await getImages(query, page);

        setImage(prevImage => [...prevImage, ...response.data.hits]);
        setTotalImage(response.data.totalHits);
        setLoadMore(page < Math.ceil(response.data.totalHits / PER_PAGE));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoad(false);
      }
    };

    // Виклик функції для завантаження зображень при зміні query або page
    fetchImages();
  }, [query, page]);

  const getQuery = q => {
    setQuery(`${Date.now()}/${q}`);
    setPage(1);
    setImage([]);
    setTotalImage(0);
  };

  const onBtnClick = () => {
    setPage(prevPage => prevPage + 1);
  };

  const getImageForModal = url => {
    setSelectedImageUrl(url);
  };

  const onModalClose = () => {
    setSelectedImageUrl('');
  };

  // render() {
  const showImg = Array.isArray(image) && image.length;

  return (
    <Layout>
      {/* <Searchbar onSubmit={this.getQuery}></Searchbar> */}
      <Searchbar onSubmit={getQuery}></Searchbar>
      {showImg && (
        <ImageGallery
          image={image}
          onImageClick={getImageForModal}
        ></ImageGallery>
      )}

      {load && <Loader></Loader>}

      {totalImage > 0 && <div>Total Images: {totalImage}</div>}

      {image.length !== 0 && loadMore && <Button onClick={onBtnClick}></Button>}

      <Message
        error={error}
        empty={image.length === 0 && query !== '' && !load}
      ></Message>
      <Modal
        url={selectedImageUrl}
        query={query}
        onModalClose={onModalClose}
      ></Modal>
      <GlobalStyle></GlobalStyle>
    </Layout>
  );
};
// }

export default App;
