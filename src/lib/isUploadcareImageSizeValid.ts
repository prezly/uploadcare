import { UPLOADCARE_IMAGE_SIZE_LIMIT } from '../constants';
import UploadcareImage from './UploadcareImage';

const isUploadcareImageSizeValid = (uploadcareImage: UploadcareImage): boolean => {
    const { originalHeight, originalWidth } = uploadcareImage;
    return originalWidth * originalHeight <= UPLOADCARE_IMAGE_SIZE_LIMIT;
};

export default isUploadcareImageSizeValid;
