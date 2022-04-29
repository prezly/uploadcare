import { UploadcareImage } from './UploadcareImage';

const IMAGE = new UploadcareImage({
    uuid: '00000000-0000-0000-0000-000000000000',
    filename: 'image.png',
    mimeType: 'image/png',
    size: 65536,
    originalWidth: 3133,
    originalHeight: 4433,
    effects: [],
});

describe('UploadcareImage', function () {
    it('should calculate final image dimensions after effects applied', function () {
        // Preview
        expect(IMAGE.preview().dimensions).toEqual({ width: 1447, height: 2048 });
        expect(IMAGE.preview(100, 100).dimensions).toEqual({ width: 71, height: 100 });

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
