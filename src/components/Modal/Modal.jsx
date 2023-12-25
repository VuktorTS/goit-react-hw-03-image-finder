import { Component } from 'react';
import css from './Modal.module.css';

export class Modal extends Component {
  componentDidMount() {
    window.addEventListener('keydown', this.onClickESC);
  }

  componentDidUpdate() {
    window.removeEventListener('keydown', this.onClickESC);
  }

  onClickESC = e => {
    if (e.code === 'Escape') {
      this.props.onCloseModal();
    }
  };

  handleCloseModal = e => {
    if (e.target === e.currentTarget) {
      this.props.onCloseModal();
    }
  };

  render() {
    const { imgUrl, tags } = this.props;

    return (
      <div className={css.overlay} onClick={this.handleCloseModal}>
        <div className={css.modal}>
          <img src={imgUrl} alt={tags} />
        </div>
      </div>
    );
  }
}
