import { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Button } from './Button/Button';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Loader } from './Loader/Loader';
import { Modal } from './Modal/Modal';
import { Searchbar } from './Searchbar/Searchbar';

import { STATUSES } from 'utils/constants';
import { getImages } from 'services/pixabayApi';

import css from './App.module.css';

export class App extends Component {
  state = {
    searchImage: '',
    status: STATUSES.idle, // "idle" | "pending" | "success" | "error"
    page: 1,
    images: [],
    totalPages: null,
    showModal: false,
    largeImageURL: '',
    error: null,
  };

  componentDidUpdate(_, prevState) {
    const orMakeRequest =
      prevState.searchImage !== this.state.searchImage ||
      prevState.page !== this.state.page;

    const showError = prevState.error !== this.state.error;

    const didYouShowAllImages =
      this.state.page === this.state.totalPages &&
      prevState.status === STATUSES.pending;

    if (orMakeRequest) {
      this.addImages();
    }

    if (showError) {
      toast.error(`Something went wrong! ${this.state.error}`);
    }

    if (didYouShowAllImages) {
      toast.success(
        'Sorry, there are no more images matching your search query.'
      );
    }
  }

  addImages = async () => {
    console.log('reqvest');
    const { searchImage, page } = this.state;

    try {
      this.setState({ status: STATUSES.pending });
      const { hits, totalHits } = await getImages(searchImage, page);
      this.setState({ status: STATUSES.success });

      if (hits.length === 0) {
        toast.error('Sorry, there are no images matching your search query.');
        this.setState({ status: STATUSES.idle });
        return;
      }

      this.setState(prevState => ({
        images: [...prevState.images, ...hits],
        totalPages: Math.ceil(totalHits / 12),
      }));
    } catch (error) {
      this.setState({ error: error.message, status: STATUSES.error });
    }
  };

  openModal = (largeImageURL, tags) => {
    this.setState({ showModal: true, tags, largeImageURL });
  };

  closeModal = () => {
    this.setState({ showModal: false });
  };

  onClickLodeMore = () => {
    this.setState(prevState => ({ page: prevState.page + 1 }));
  };

  handleSubmit = query => {
    if (this.state.searchImage === query) {
      toast.success('You are already seeing images for this request.');
      return;
    }
    this.setState({ searchImage: query, images: [], page: 1 });
  };

  render() {
    const { images, page, totalPages, showModal, largeImageURL, tags, status } =
      this.state;

    const showLoadMore = status === STATUSES.success && page !== totalPages;

    return (
      <div className={css.main}>
        <Searchbar onSubmit={this.handleSubmit} />
        <ImageGallery images={images} onClickModal={this.openModal} />
        {status === STATUSES.pending && <Loader />}
        {showModal && (
          <Modal
            imgUrl={largeImageURL}
            onCloseModal={this.closeModal}
            tags={tags}
          />
        )}
        {showLoadMore && <Button onClick={this.onClickLodeMore} />}
        <ToastContainer
          position="top-center"
          autoClose={1500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    );
  }
}
