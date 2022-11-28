import { UploadcareFile } from './UploadcareFile';

const FILE = new UploadcareFile({
    uuid: '00000000-0000-0000-0000-000000000000',
    filename: 'document.pdf',
    mimeType: 'application/pdf',
    size: 655361,
});

const FILE_WITH_FORBIDDEN_SYMBOLS = new UploadcareFile({
    uuid: '00000000-0000-0000-0000-000000000000',
    filename: 'my/?*:|"<>document.pdf',
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

    describe('forbidden symbols', function () {
        it('should provide a CDN URL to access the file and leave forbidden characters', function () {
            expect(FILE_WITH_FORBIDDEN_SYMBOLS.cdnUrl).toEqual(
                'https://cdn.uc.assets.prezly.com/00000000-0000-0000-0000-000000000000/my%2F%3F*%3A%7C%22%3C%3Edocument.pdf',
            );
        });

        it('should provide a download CDN URL to download the file and replace forbidden characters', function () {
            expect(FILE_WITH_FORBIDDEN_SYMBOLS.downloadUrl).toEqual(
                'https://cdn.uc.assets.prezly.com/00000000-0000-0000-0000-000000000000/-/inline/no/my________document.pdf',
            );
        });
    });
});
