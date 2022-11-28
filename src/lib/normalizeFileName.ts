import sanitizeFileName from 'sanitize-filename';

export function normalizeFileName(filename: string) {
    return sanitizeFileName(filename, { replacement: '_' });
}
