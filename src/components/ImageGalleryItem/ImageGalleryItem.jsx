import css from './ImageGalleryItem.module.css';

export const ImageGalleryItem = ({ image, onClickModal }) => {
  const { id, tags, webformatURL, largeImageURL } = image;

  return (
    <li key={id} className={css.galleryItem}>
      <img
        className={css.galleryItemImage}
        src={webformatURL}
        alt={tags}
        onClick={() => {
          onClickModal(largeImageURL, tags);
        }}
      />
    </li>
  );
};
