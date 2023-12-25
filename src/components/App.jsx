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
    if (
      prevState.searchImage !== this.state.searchImage ||
      prevState.page !== this.state.page
    ) {
      this.addImages();
    }

    if (prevState.error !== this.state.error) {
      toast.error(`Something went wrong! ${this.state.error}`);
    }

    if (
      this.state.page === this.state.totalPages &&
      prevState.status === STATUSES.pending
    ) {
      toast.success(
        'Sorry, there are no more images matching your search query.'
      );
    }
  }

  addImages = async () => {
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
    this.setState({ searchImage: query, images: [], page: 1 });
  };

  render() {
    const { images, page, totalPages, showModal, largeImageURL, tags } =
      this.state;
    const showLoadMore =
      this.state.status === STATUSES.success && page !== totalPages;

    return (
      <div className={css.main}>
        <Searchbar onSubmit={this.handleSubmit} />
        <ImageGallery images={images} onClickModal={this.openModal} />
        {this.state.status === STATUSES.pending && <Loader />}
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
