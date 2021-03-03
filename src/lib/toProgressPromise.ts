import ProgressPromise from '@prezly/progress-promise';
import { FileInfo, FilePromise, UploadInfo } from 'uploadcare-widget';

const toProgressPromise = (filePromise: FilePromise): ProgressPromise<FileInfo, UploadInfo> => {
    return new ProgressPromise((resolve, reject, progress) => {
        filePromise.then(resolve, reject);
        filePromise.progress((uploadInfo) => {
            progress(uploadInfo.progress * 100, uploadInfo);
        });
    });
};

export default toProgressPromise;
