import type { FileInfo } from '@prezly/uploadcare-widget';

import { UPLOADCARE_FILE_DATA_KEY } from '../constants';

export interface PrezlyFileInfo extends FileInfo {
    [UPLOADCARE_FILE_DATA_KEY]?: Record<string, any>;
}
