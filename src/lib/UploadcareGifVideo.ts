import { UPLOADCARE_CDN_URL } from '../constants';

export class UploadcareGifVideo {
    public readonly uuid: string;

    public readonly filename: string;

    public readonly mimeType: string;

    public readonly size: number;

    public readonly width: number;

    public readonly height: number;

    public readonly effects: string[];

    public constructor(props: {
        uuid: string;
        filename: string;
        mimeType: string;
        size: number;
        width: number;
        height: number;
        effects?: string[];
    }) {
        if (props.mimeType !== 'image/gif') {
            throw new Error(`Only GIF images are allowed. Given: "${props.mimeType}".`);
        }

        this.uuid = props.uuid;
        this.filename = props.filename;
        this.mimeType = props.mimeType;
        this.size = props.size;
        this.width = props.width;
        this.height = props.height;
        this.effects = props.effects ?? [];
    }

    public format(format: 'mp4' | 'webm'): UploadcareGifVideo {
        /** @see https://uploadcare.com/docs/image_transformations/gif2video/#gif2video-format */
        return this.withEffect(`/format/${format}/`);
    }

    public quality(
        quality: 'lightest' | 'lighter' | 'normal' | 'better' | 'best',
    ): UploadcareGifVideo {
        /** @see https://uploadcare.com/docs/image_transformations/gif2video/#gif2video-quality */
        return this.withEffect(`/quality/${quality}/`);
    }

    public bestQuality(): UploadcareGifVideo {
        return this.quality('best');
    }

    public get aspectRatio(): number {
        return this.width / this.height;
    }

    private withEffect(effect: string): UploadcareGifVideo {
        return new UploadcareGifVideo({
            uuid: this.uuid,
            filename: this.filename,
            mimeType: this.mimeType,
            size: this.size,
            width: this.width,
            height: this.height,
            effects: [...this.effects, effect],
        });
    }

    public get cdnUrl(): string {
        const cdnUrl = [
            UPLOADCARE_CDN_URL,
            this.uuid,
            'gif2video',
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
            'gif2video',
            ['', ...this.effects, '/inline/no/'].join('-'),
        ].join('/');

        return `${downloadUrl}${encodeURIComponent(this.filename)}`;
    }
}
