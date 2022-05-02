import { UploadcareFile } from './UploadcareFile';

const FILE = new UploadcareFile({
    uuid: '00000000-0000-0000-0000-000000000000',
    filename: 'document.pdf',
    mimeType: 'application/pdf',
    size: 655361,
});

describe('UploadcareFile', function () {
    describe('cdnUrl', function () {
        it('should provide a CDN URL to access the file', function () {
            expect(FILE.cdnUrl).toEqual(
                'https://cdn.uc.assets.prezly.com/00000000-0000-0000-0000-000000000000/document.pdf',
            );
        });
    });

    describe('downloadUrl', function () {
        it('should provide a download CDN URL to download the file', function () {
            expect(FILE.downloadUrl).toEqual(
                'https://cdn.uc.assets.prezly.com/00000000-0000-0000-0000-000000000000/-/inline/no/document.pdf',
            );
        });
    });
});
