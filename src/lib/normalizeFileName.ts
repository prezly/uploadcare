import sanitizeFileName from 'sanitize-filename';

const forbiddenCharacters = /[% ]/g;
const replacement = '_';

export function normalizeFileName(filename: string) {
    const sanitize = sanitizeFileName(filename, { replacement });
    const normalized = sanitize.replaceAll(forbiddenCharacters, replacement);
    return normalized;
}
