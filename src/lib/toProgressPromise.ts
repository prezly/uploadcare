import { ProgressPromise } from '@prezly/progress-promise';
import type { FileInfo, FilePromise, UploadInfo } from '@prezly/uploadcare-widget';

export function toProgressPromise(filePromise: FilePromise): ProgressPromise<FileInfo, UploadInfo> {
    return new ProgressPromise((resolve, reject, progress) => {
        filePromise.then(resolve, reject);
        filePromise.progress((uploadInfo) => {
            progress(uploadInfo.progress * 100, uploadInfo);
        });
    });
}
