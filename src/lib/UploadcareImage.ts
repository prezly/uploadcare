import type { UploadedImage } from '@prezly/uploads';
import { isUploadedImage } from '@prezly/uploads';
import type { FileInfo } from '@prezly/uploadcare-widget';

import { UPLOADCARE_CDN_URL, UPLOADCARE_FILE_DATA_KEY } from '../constants';

import { UploadcareGifVideo } from './UploadcareGifVideo';

export const MAX_PREVIEW_SIZE = 3000;
export const DEFAULT_PREVIEW_SIZE = 2048;

export class UploadcareImage {
    public static createFromUploadcareWidgetPayload(
        fileInfo: FileInfo,
        caption?: string,
    ): UploadcareImage {
        if (!fileInfo.originalImageInfo) {
            throw new Error('UploadcareImage was given a non-image FileInfo object');
        }

        return new UploadcareImage({
            effects: fileInfo.cdnUrlModifiers ? fileInfo.cdnUrlModifiers.split('-').slice(1) : [],
            filename: fileInfo.name,
            mimeType: fileInfo.mimeType,
            originalHeight: fileInfo.originalImageInfo.height,
            originalWidth: fileInfo.originalImageInfo.width,
            size: fileInfo.size,
            uuid: fileInfo.uuid,
            caption,
        });
    }

    public static createFromPrezlyStoragePayload(
        payload: UploadedImage,
        caption?: string,
    ): UploadcareImage {
        return new UploadcareImage({
            effects: payload.effects || [],
            filename: payload.filename,
            mimeType: payload.mime_type,
            originalHeight: payload.original_height,
            originalWidth: payload.original_width,
            size: payload.size,
            uuid: payload.uuid,
            caption,
        });
    }

    public static isPrezlyStoragePayload(payload: any): payload is UploadedImage {
        return isUploadedImage(payload);
    }

    [UPLOADCARE_FILE_DATA_KEY]?: {
        caption: string;
    };

    public readonly uuid: string;

    public readonly filename: string;

    public readonly mimeType: string;

    public readonly size: number;

    public readonly originalHeight: number;

    public readonly originalWidth: number;

    public readonly effects: string[];

    constructor({
        uuid,
        filename,
        mimeType,
        size,
        originalWidth,
        originalHeight,
        effects = [],
        caption,
    }: {
        uuid: string;
        filename: string;
        mimeType: string;
        size: number;
        originalWidth: number;
        originalHeight: number;
        effects: string[];
        caption?: string;
    }) {
        this.uuid = uuid;
        this.filename = filename;
        this.mimeType = mimeType;
        this.size = size;
        this.originalWidth = originalWidth;
        this.originalHeight = originalHeight;
        this.effects = effects;

        if (caption !== undefined) {
            this[UPLOADCARE_FILE_DATA_KEY] = { caption };
        }
    }

    get caption(): string | undefined {
        return this[UPLOADCARE_FILE_DATA_KEY]?.caption;
    }

    public get dimensions(): { width: number; height: number } {
        const [width, height] = dimensions([this.originalWidth, this.originalHeight], this.effects);
        return { width, height };
    }

    public get width(): number {
        return this.dimensions.width;
    }

    public get height(): number {
        return this.dimensions.height;
    }

    public get aspectRatio(): number {
        const { width, height } = this.dimensions;

        return width / height;
    }

    public get cdnUrl(): string {
        const cdnUrl = [
            UPLOADCARE_CDN_URL,
            this.uuid,
            // Prepend a dash only if effects exist.
            // It doesn't matter if there's a dash at the end of URL even if there are no effects,
            // but it looks cleaner without it.
            this.effects.length === 0 ? this.effects : ['', ...this.effects].join('-'),
        ].join('/');

        return `${cdnUrl}${encodeURIComponent(this.filename)}`;
    }

    public get downloadUrl(): string {
        const downloadUrl = [
            UPLOADCARE_CDN_URL,
            this.uuid,
            ['', ...this.effects, '/inline/no/'].join('-'),
        ].join('/');

        return `${downloadUrl}${encodeURIComponent(this.filename)}`;
    }

    public isGif = () => {
        return this.mimeType === 'image/gif';
    };

    public format = (imageFormat: 'auto' | 'jpeg' | 'png' | 'web' = 'auto'): UploadcareImage => {
        return this.withEffect(`/format/${imageFormat}/`);
    };

    public preview = (
        width: number | null = null,
        height: number | null = null,
    ): UploadcareImage => {
        if (this.isGif()) {
            // Do not resize GIF otherwise it breaks the animation
            return this;
        }

        if (width === null && height === null) {
            return this.withEffect('/preview/');
        }
        const effectiveWidth = Math.min(Math.round(width || MAX_PREVIEW_SIZE), MAX_PREVIEW_SIZE);
        const effectiveHeight = Math.min(Math.round(height || MAX_PREVIEW_SIZE), MAX_PREVIEW_SIZE);
        return this.withEffect(`/preview/${effectiveWidth}x${effectiveHeight}/`);
    };

    public resize = (
        width: number | null = null,
        height: number | null = null,
    ): UploadcareImage => {
        if (width == null && height === null) {
            throw new Error('At least one function argument has to be non-null');
        }

        if (this.isGif()) {
            // Do not resize GIF otherwise it breaks the animation
            return this;
        }

        if (width === null) {
            return this.withEffect(`/resize/x${height}/`);
        }

        if (height === null) {
            return this.withEffect(`/resize/${width}/`);
        }

        return this.withEffect(`/resize/${width}x${height}/`);
    };

    public crop = (width: number, height: number): UploadcareImage => {
        return this.withEffect(`/crop/${width}x${height}/`);
    };

    public scaleCrop = (
        width: number,
        height: number,
        center: boolean = false,
    ): UploadcareImage => {
        if (center) {
            return this.withEffect(`/scale_crop/${width}x${height}/center/`);
        }
        return this.withEffect(`/scale_crop/${width}x${height}/`);
    };

    /**
     * @see https://uploadcare.com/docs/transformations/image/resize-crop/#operation-smart-crop
     */
    public smartCrop = (
        width: number,
        height: number,
        type:
            | 'smart'
            | 'smart_faces_objects'
            | 'smart_faces_points'
            | 'smart_objects_faces_points'
            | 'smart_objects_faces'
            | 'smart_objects_points'
            | 'smart_points'
            | 'smart_objects'
            | 'smart_faces' = 'smart',
        alignment?: 'center' | 'top' | 'right' | 'bottom' | 'left' | `${number}p,${number}p`,
    ): UploadcareImage => {
        if (alignment) {
            return this.withEffect(`/scale_crop/${width}x${height}/${type}/${alignment}/`);
        }
        return this.withEffect(`/scale_crop/${width}x${height}/${type}/`);
    };

    public toGifVideo = (): UploadcareGifVideo => {
        // The `gif2video` transformation is supported only for gifs,
        // otherwise the server responds with "400 Bad Request".
        if (!this.isGif()) {
            throw new Error(`You can only convert a GIF to video. Given: "${this.mimeType}".`);
        }
        return new UploadcareGifVideo({
            uuid: this.uuid,
            filename: this.filename,
            mimeType: this.mimeType,
            size: this.size,
            width: this.originalWidth,
            height: this.originalHeight,
        });
    };

    public srcSet = (width: number): string => {
        const doubleWidth = width * 2;
        const src1x = this.resize(width).cdnUrl;
        const src2x = this.resize(doubleWidth).cdnUrl;

        if (this.width < doubleWidth) {
            return `${src1x} ${width}w`;
        }

        return `${src1x} ${width}w, ${src2x} ${doubleWidth}w`;
    };

    public toPrezlyStoragePayload = (): UploadedImage => ({
        version: 2,
        uuid: this.uuid,
        filename: this.filename,
        mime_type: this.mimeType,
        size: this.size,
        original_width: this.originalWidth,
        original_height: this.originalHeight,
        effects: this.effects,
    });

    private withEffect = (effect: string): UploadcareImage => {
        return new UploadcareImage({
            uuid: this.uuid,
            filename: this.filename,
            mimeType: this.mimeType,
            size: this.size,
            originalWidth: this.originalWidth,
            originalHeight: this.originalHeight,
            effects: [...this.effects, effect],
        });
    };
}

function dimensions([width, height]: [number, number], effects: string[]): [number, number] {
    return effects.reduce(
        function ([w, h], effect) {
            const [_, name, params] = effect.split('/');
            switch (name) {
                case 'preview': {
                    if (!params) {
                        return fit([w, h], [DEFAULT_PREVIEW_SIZE, DEFAULT_PREVIEW_SIZE]);
                    }
                    const p = params.split('x');
                    const px = parseInt(p[0], 10) || null;
                    const py = parseInt(p[1], 10) || null;
                    return fit([w, h], [px, py]);
                }
                case 'resize':
                case 'crop':
                case 'scale_crop': {
                    const p = params.split('x');
                    const px = parseInt(p[0], 10) || null;
                    const py = parseInt(p[1], 10) || null;
                    return resize([w, h], [px, py]);
                }
            }
            return [w, h];
        },
        [width, height],
    );
}

function fit(
    [width, height]: [number, number],
    [maxWidth, maxHeight]: [number | null, number | null],
): [number, number] {
    let resizedWidth = width;
    let resizedHeight = height;

    if (maxWidth && maxWidth < resizedWidth) {
        resizedWidth = maxWidth;
        resizedHeight = Math.round((height * maxWidth) / width);
    }

    if (maxHeight && maxHeight < resizedHeight) {
        resizedWidth = Math.round((width * maxHeight) / height);
        resizedHeight = maxHeight;
    }

    return [resizedWidth, resizedHeight];
}

function resize(
    [width, height]: [number, number],
    [maxWidth, maxHeight]: [number | null, number | null],
): [number, number] {
    if (maxWidth && maxHeight) {
        return [maxWidth, maxHeight];
    }
    if (maxWidth) {
        return [maxWidth, Math.round((height * maxWidth) / width)];
    }
    if (maxHeight) {
        return [Math.round((width * maxHeight) / height), maxHeight];
    }
    return [width, height];
}
