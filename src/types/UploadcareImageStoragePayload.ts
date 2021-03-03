import UploadcareFileStoragePayload from './UploadcareFileStoragePayload';

interface UploadcareImageStoragePayload extends UploadcareFileStoragePayload {
    effects: string[];
    original_height: number;
    original_width: number;
}

export default UploadcareImageStoragePayload;
