import { UploadcareGifVideo } from './UploadcareGifVideo';

const GIF = new UploadcareGifVideo({
    uuid: '00000000-0000-0000-0000-000000000000',
    filename: 'image.gif',
    mimeType: 'image/gif',
    size: 65536,
    width: 300,
    height: 400,
    effects: [],
});

describe('UploadcareGifVideo', function () {
    describe('cdnUrl', function () {
        it('should provide a /gif2video/ CDN URL', function () {
            expect(GIF.cdnUrl).toEqual(
                'https://cdn.uc.assets.prezly.com/00000000-0000-0000-0000-000000000000/gif2video/image.gif',
            );

            expect(GIF.bestQuality().cdnUrl).toEqual(
                'https://cdn.uc.assets.prezly.com/00000000-0000-0000-0000-000000000000/gif2video/-/quality/best/image.gif',
            );
        });
    });

    describe('downloadUrl', function () {
        it('should provide a /gif2video/ CDN URL', function () {
            expect(GIF.downloadUrl).toEqual(
                'https://cdn.uc.assets.prezly.com/00000000-0000-0000-0000-000000000000/gif2video/-/inline/no/image.gif',
            );
            expect(GIF.format('mp4').downloadUrl).toEqual(
                'https://cdn.uc.assets.prezly.com/00000000-0000-0000-0000-000000000000/gif2video/-/format/mp4/-/inline/no/image.gif',
            );
        });
    });
});
