import { FileInfo } from 'uploadcare-widget';

import { UPLOADCARE_FILE_DATA_KEY } from '../constants';

interface PrezlyFileInfo extends FileInfo {
    [UPLOADCARE_FILE_DATA_KEY]?: Record<string, any>;
}

export default PrezlyFileInfo;
