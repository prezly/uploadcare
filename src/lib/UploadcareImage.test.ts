import { UploadcareImage } from './UploadcareImage';
import { UploadcareGifVideo } from './UploadcareGifVideo';

const IMAGE = new UploadcareImage({
    uuid: '00000000-0000-0000-0000-000000000000',
    filename: 'image.png',
    mimeType: 'image/png',
    size: 65536,
    originalWidth: 3133,
    originalHeight: 4433,
    effects: [],
});
const GIF = new UploadcareImage({
    uuid: '00000000-0000-0000-0000-000000000000',
    filename: 'image.gif',
    mimeType: 'image/gif',
    size: 65536,
    originalWidth: 300,
    originalHeight: 400,
    effects: [],
});

describe('UploadcareImage', function () {
    describe('dimensions', function () {
        it('should calculate final image dimensions after effects applied', function () {
            // Preview
            expect(IMAGE.preview().dimensions).toEqual({ width: 1447, height: 2048 });
            expect(IMAGE.preview(100, 100).dimensions).toEqual({ width: 71, height: 100 });
            expect(IMAGE.preview(100, 200).dimensions).toEqual({ width: 100, height: 141 });

            // resize
            expect(IMAGE.resize(100, 110).dimensions).toEqual({ width: 100, height: 110 });
            expect(IMAGE.resize(100).dimensions).toEqual({ width: 100, height: 141 });
            expect(IMAGE.resize(null, 100).dimensions).toEqual({ width: 71, height: 100 });

            // Crop
            expect(IMAGE.crop(120, 130).dimensions).toEqual({ width: 120, height: 130 });

            // Scale crop
            expect(IMAGE.scaleCrop(140, 150).dimensions).toEqual({ width: 140, height: 150 });

            // Combined
            expect(IMAGE.preview().resize(200).format().dimensions).toEqual({
                width: 200,
                height: 283,
            });
        });
    });

    describe('width', function () {
        it('should calculate final image width after effects applied', function () {
            // Preview
            expect(IMAGE.preview().width).toEqual(1447);
            expect(IMAGE.preview(100, 100).width).toEqual(71);
            expect(IMAGE.preview(100, 200).width).toEqual(100);

            // resize
            expect(IMAGE.resize(100, 110).width).toEqual(100);
            expect(IMAGE.resize(100).width).toEqual(100);
            expect(IMAGE.resize(null, 100).width).toEqual(71);

            // Crop
            expect(IMAGE.crop(120, 130).width).toEqual(120);

            // Scale crop
            expect(IMAGE.scaleCrop(140, 150).width).toEqual(140);

            // Combined
            expect(IMAGE.preview().resize(200).format().width).toEqual(200);
        });
    });

    describe('width', function () {
        it('should calculate final image height after effects applied', function () {
            // Preview
            expect(IMAGE.preview().height).toEqual(2048);
            expect(IMAGE.preview(100, 100).height).toEqual(100);
            expect(IMAGE.preview(100, 200).height).toEqual(141);

            // resize
            expect(IMAGE.resize(100, 110).height).toEqual(110);
            expect(IMAGE.resize(100).height).toEqual(141);
            expect(IMAGE.resize(null, 100).height).toEqual(100);

            // Crop
            expect(IMAGE.crop(120, 130).height).toEqual(130);

            // Scale crop
            expect(IMAGE.scaleCrop(140, 150).height).toEqual(150);

            // Combined
            expect(IMAGE.preview().resize(200).format().height).toEqual(283);
        });
    });

    describe('aspectRatio', function () {
        it('should calculate final image aspect ratio after effects applied', function () {
            // Preview
            expect(IMAGE.preview().aspectRatio).toBeCloseTo(0.71);
            expect(IMAGE.preview(100, 100).aspectRatio).toBeCloseTo(0.71);
            expect(IMAGE.preview(100, 200).aspectRatio).toBeCloseTo(0.71);

            // resize
            expect(IMAGE.resize(100, 110).aspectRatio).toBeCloseTo(0.91);
            expect(IMAGE.resize(100).aspectRatio).toBeCloseTo(0.71);
            expect(IMAGE.resize(null, 100).aspectRatio).toBeCloseTo(0.71);

            // Crop
            expect(IMAGE.crop(120, 130).aspectRatio).toBeCloseTo(0.92);

            // Scale crop
            expect(IMAGE.scaleCrop(140, 150).aspectRatio).toBeCloseTo(0.93);

            // Combined
            expect(IMAGE.preview().resize(200).format().aspectRatio).toBeCloseTo(0.71);
        });
    });

    describe('toGifImage', function () {
        it('should convert GIF images to videos', function () {
            expect(GIF.toGifVideo()).toBeInstanceOf(UploadcareGifVideo);
        });
        it('should ignore applied GIF image effects when converting to videos', function () {
            expect(GIF.resize(100).toGifVideo().effects).toEqual([]);
        });
        it('should throw error when a non-GIF image is being converted to video', function () {
            try {
                IMAGE.toGifVideo();
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                return;
            }
            fail('Error is not thrown');
        });
    });
});
