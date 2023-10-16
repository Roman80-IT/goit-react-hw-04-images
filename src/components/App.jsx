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

// export class App extends Component {
export const App = () => {
  // state = {
  //   query: '',
  //   image: [],
  //   totalImage: 0,
  //   page: 1,
  //   selectedImageUrl: '',
  //   load: false,
  //   error: false,
  //   loadMore: true,
  // };

  const [query, setQuery] = useState('');
  const [image, setImage] = useState([]);
  const [totalImage, setTotalImage] = useState(0);
  const [page, setPage] = useState(1);
  const [selectedImageUrl, setSelectedImageUrl] = useState('');
  const [load, setLoad] = useState(false);
  const [error, setError] = useState(false);
  const [loadMore, setLoadMore] = useState(true);

  //! componentDidUpdate(_, prevState) {
  //   if (
  //     prevState.query !== this.state.query ||
  //     prevState.page !== this.state.page
  //   ) {
  //     this.fetchImages();
  //   }
  // }
  // useEffect(() => {
  //   if (!query) return;
  // }, [query, page]);

  useEffect(() => {
    //! `useEffect` has a missing dependency `fetchImages`. Either include it or remove the dependency array
    //* Оскільки ф-ція 'fetchImages' використовується тільки в 'useEffect()', то перемістимо його сюди:
    const fetchImages = async () => {
      try {
        // this.setState({ load: true, error: false });
        setLoad(true);
        setError(false);

        // const response = await getImages(this.state.query, this.state.page);
        const response = await getImages(query, page);

        // Вивести вміст відповіді на консоль
        console.log('Вміст відповіді:', response.data);

        // this.setState(prevState => ({
        //   image: [...prevState.image, ...response.data.hits],
        //   totalImage: response.data.totalHits,
        //   loadMore:
        //     this.state.page < Math.ceil(response.data.totalHits / PER_PAGE),
        // }));

        setImage(prevImage => [...prevImage, ...response.data.hits]);
        setTotalImage(response.data.totalHits);
        setLoadMore(page < Math.ceil(response.data.totalHits / PER_PAGE));
      } catch (error) {
        // this.setState({ error: true }); // TODO Інший варіант
        // this.setState({ error: error.message });
        setError(error.message);
      } finally {
        // this.setState({ load: false });
        setLoad(false);
      }
    };

    // Виклик функції для завантаження зображень при зміні query або page
    fetchImages();
  }, [query, page]);

  const getQuery = q => {
    // this.setState({
    //   query: `${Date.now()}/${q}`,
    //   page: 1,
    //   image: [],
    //   totalImage: 0,
    // });
    setQuery(`${Date.now()}/${q}`);
    setPage(1);
    setImage([]);
    setTotalImage(0);
  };

  // const onBtnClick = () => {
  //   this.setState(prevState => ({ page: prevState.page + 1 }));
  // };

  const onBtnClick = () => {
    setPage(prevPage => prevPage + 1);
  };

  const getImageForModal = url => {
    // this.setState({ selectedImageUrl: url });
    setSelectedImageUrl(url);
  };

  const onModalClose = () => {
    // this.setState({ selectedImageUrl: '' });
    setSelectedImageUrl('');
  };

  // render() {
  // const showImg = Array.isArray(this.state.image) && this.state.image.length;
  const showImg = Array.isArray(image) && image.length;

  return (
    <Layout>
      {/* <Searchbar onSubmit={this.getQuery}></Searchbar> */}
      <Searchbar onSubmit={getQuery}></Searchbar>
      {showImg && (
        <ImageGallery
          // image={this.state.image}
          // onImageClick={this.getImageForModal}
          image={image}
          onImageClick={getImageForModal}
        ></ImageGallery>
      )}

      {/* {this.state.load && <Loader></Loader>} */}
      {load && <Loader></Loader>}

      {totalImage > 0 && <div>Total Images: {totalImage}</div>}

      {/* {this.state.image.length !== 0 &&
          this.state.totalImage > PER_PAGE * this.state.page && (
            <Button onClick={this.onBtnClick}></Button>
          )} */}

      {/* {this.state.image.length !== 0 && this.state.loadMore && (
        <Button onClick={this.onBtnClick}></Button>
      )} */}
      {image.length !== 0 && loadMore && <Button onClick={onBtnClick}></Button>}

      <Message
        // error={this.state.error}
        error={error}
        // empty={
        //   this.state.image.length === 0 &&
        //   this.state.query !== '' && !this.state.load
        // }
        empty={image.length === 0 && query !== '' && !load}
      ></Message>
      <Modal
        // url={this.state.selectedImageUrl}
        // query={this.state.query}
        // onModalClose={this.onModalClose}
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
