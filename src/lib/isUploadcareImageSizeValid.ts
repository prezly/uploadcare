import { UPLOADCARE_IMAGE_SIZE_LIMIT } from '../constants';
import type { UploadcareImage } from './UploadcareImage';

export function isUploadcareImageSizeValid(uploadcareImage: UploadcareImage): boolean {
    const { originalHeight, originalWidth } = uploadcareImage;
    return originalWidth * originalHeight <= UPLOADCARE_IMAGE_SIZE_LIMIT;
}