export type { UploadedFile, UploadedImage } from '@prezly/uploads';
export { isUploadedFile, isUploadedImage } from '@prezly/uploads';

export {
    UPLOADCARE_CDN_URL,
    UPLOADCARE_FILE_DATA_KEY,
    UPLOADCARE_IMAGE_SIZE_LIMIT,
} from './constants';

export {
    DEFAULT_PREVIEW_SIZE,
    MAX_PREVIEW_SIZE,
    UploadcareImage,
    UploadcareFile,
    awaitUploads,
    isUploadcareImageSizeValid,
    toProgressPromise,
} from './lib';

export type { PrezlyFileInfo } from './types';
