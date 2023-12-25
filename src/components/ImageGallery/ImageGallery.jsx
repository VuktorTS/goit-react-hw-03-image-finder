import { ImageGalleryItem } from 'components/ImageGalleryItem/ImageGalleryItem';
// import { nanoid } from 'nanoid';
import css from './ImageGallery.module.css';

export const ImageGallery = ({ images, onClickModal }) => {
  return (
    <ul className={css.gallery}>
      {images.map(image => {
        return (
          <ImageGalleryItem
            key={image.id}
            image={image}
            onClickModal={onClickModal}
          />
        );
      })}
    </ul>
  );
};
