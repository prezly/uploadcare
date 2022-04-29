import type { UploadedImage } from '@prezly/uploads';
import { isUploadedImage } from '@prezly/uploads';
import type { FileInfo } from '@prezly/uploadcare-widget';

import { UPLOADCARE_CDN_URL, UPLOADCARE_FILE_DATA_KEY } from '../constants';

const MAX_PREVIEW_SIZE = 3000;
const DEFAULT_PREVIEW_SIZE = 2048;

export class UploadcareImage {
    static createFromUploadcareWidgetPayload(fileInfo: FileInfo): UploadcareImage {
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
        });
    }

    static createFromPrezlyStoragePayload(payload: UploadedImage): UploadcareImage {
        return new UploadcareImage({
            effects: payload.effects || [],
            filename: payload.filename,
            mimeType: payload.mime_type,
            originalHeight: payload.original_height,
            originalWidth: payload.original_width,
            size: payload.size,
            uuid: payload.uuid,
        });
    }

    static isPrezlyStoragePayload(payload: any): payload is UploadedImage {
        return isUploadedImage(payload);
    }

    [UPLOADCARE_FILE_DATA_KEY]?: {
        caption: string;
    };

    uuid: string;

    filename: string;

    mimeType: string;

    size: number;

    effects: string[];

    originalHeight: number;

    originalWidth: number;

    constructor({
        uuid,
        filename,
        mimeType,
        size,
        originalWidth,
        originalHeight,
        effects = [],
    }: {
        uuid: string;
        filename: string;
        mimeType: string;
        size: number;
        originalWidth: number;
        originalHeight: number;
        effects: string[];
    }) {
        this.uuid = uuid;
        this.filename = filename;
        this.mimeType = mimeType;
        this.size = size;
        this.originalWidth = originalWidth;
        this.originalHeight = originalHeight;
        this.effects = effects;
    }

    get dimensions(): { width: number, height: number } {
        const [width, height] = dimensions([this.originalWidth, this.originalHeight], this.effects);
        return { width, height };
    }

    get width(): number {
        return this.dimensions.width;
    }

    get height(): number {
        return this.dimensions.height;
    }

    get aspectRatio(): number {
        const { width, height } = this.dimensions;

        return width / height;
    }

    get cdnUrl(): string {
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

    get downloadUrl(): string {
        const downloadUrl = [
            UPLOADCARE_CDN_URL,
            this.uuid,
            // Prepend a dash only if effects exist.
            // It doesn't matter if there's a dash at the end of URL even if there are no effects,
            // but it looks cleaner without it.
            this.effects.length === 0
                ? this.effects
                : ['', ...this.effects, '/inline/no/'].join('-'),
        ].join('/');

        return `${downloadUrl}${encodeURIComponent(this.filename)}`;
    }

    private isGif = () => {
        return this.mimeType === 'image/gif';
    };

    format = (imageFormat: 'auto' | 'jpeg' | 'png' | 'web' = 'auto'): UploadcareImage => {
        return this.withEffect(`/format/${imageFormat}/`);
    };

    preview = (width: number | null = null, height: number | null = null): UploadcareImage => {
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

    resize = (width: number | null = null, height: number | null = null): UploadcareImage => {
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

    crop = (width: number, height: number): UploadcareImage => {
        return this.withEffect(`/crop/${width}x${height}/`);
    };

    scaleCrop = (width: number, height: number, center: boolean = false): UploadcareImage => {
        if (center) {
            return this.withEffect(`/scale_crop/${width}x${height}/center/`);
        }
        return this.withEffect(`/scale_crop/${width}x${height}/`);
    };

    toPrezlyStoragePayload = (): UploadedImage => ({
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
