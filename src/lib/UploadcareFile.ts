import type { FileInfo } from '@prezly/uploadcare-widget';
import type { UploadedFile } from '@prezly/uploads';
import { isUploadedFile } from '@prezly/uploads';

import { UPLOADCARE_CDN_URL } from '../constants';
import { normalizeFileName } from './normalizeFileName';

interface UploadcareFileParameters {
    uuid: UploadedFile['uuid'];
    filename: UploadedFile['filename'];
    mimeType: UploadedFile['mime_type'];
    size: UploadedFile['size'];
    baseCdnUrl?: string;
}

export class UploadcareFile {
    public static createFromPrezlyStoragePayload(payload: UploadedFile): UploadcareFile {
        return new UploadcareFile({
            uuid: payload.uuid,
            filename: payload.filename,
            mimeType: payload.mime_type,
            size: payload.size,
        });
    }

    public static createFromUploadcareWidgetPayload(payload: FileInfo): UploadcareFile {
        return new UploadcareFile({
            uuid: payload.uuid,
            filename: payload.name,
            mimeType: payload.mimeType,
            size: payload.size,
        });
    }

    public static isPrezlyStoragePayload(payload: any): payload is UploadedFile {
        return isUploadedFile(payload);
    }

    public cdnUrl: string;

    public downloadUrl: string;

    public filename: string;

    public mimeType: string;

    public size: number;

    public uuid: string;

    public baseCdnUrl: string;

    public constructor({ filename, mimeType, size, uuid, baseCdnUrl }: UploadcareFileParameters) {
        this.uuid = uuid;
        this.filename = filename;
        this.size = size;
        this.mimeType = mimeType;
        this.baseCdnUrl = baseCdnUrl || UPLOADCARE_CDN_URL;
        this.cdnUrl = `${this.baseCdnUrl}/${uuid}/${encodeURIComponent(this.filename)}`;
        this.downloadUrl = `${this.baseCdnUrl}/${uuid}/-/inline/no/${normalizeFileName(
            this.filename,
        )}`;
    }

    public get isImage() {
        return this.mimeType.startsWith('image/');
    }

    public withBaseCdnUrl(baseCdnUrl: string): UploadcareFile {
        return new UploadcareFile({
            uuid: this.uuid,
            filename: this.filename,
            mimeType: this.mimeType,
            size: this.size,
            baseCdnUrl,
        });
    }

    public toPrezlyStoragePayload = (): UploadedFile => ({
        version: 2,
        uuid: this.uuid,
        filename: this.filename,
        mime_type: this.mimeType,
        size: this.size,
    });
}
