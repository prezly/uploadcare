import { ProgressPromise } from '@prezly/progress-promise';
import clamp from 'lodash.clamp';
import type { FilePromise } from '@prezly/uploadcare-widget';

import type { PrezlyFileInfo } from '../types';

import { toProgressPromise } from './toProgressPromise';

const MIN_PROGRESS = 0;
const MAX_PROGRESS = 100;

interface Result {
    failedUploads: Error[];
    successfulUploads: PrezlyFileInfo[];
}

export function awaitUploads(promises: FilePromise[]): ProgressPromise<Result> {
    const result: Result = { failedUploads: [], successfulUploads: [] };

    if (promises.length === 0) {
        return new ProgressPromise<Result>((resolve) => resolve(result));
    }

    const progressBuffer = new Array(promises.length).fill(MIN_PROGRESS);
    let resolvedCount = 0;

    return new ProgressPromise((resolve, _, reportProgress) => {
        function notifyProgress() {
            const sumProgress = progressBuffer.reduce((sum, subProgress) => sum + subProgress, 0);
            reportProgress(sumProgress / promises.length);
        }

        function resolveSubPromise(index: number) {
            progressBuffer[index] = MAX_PROGRESS;
            resolvedCount += 1;

            if (resolvedCount === promises.length) {
                resolve(result);
            } else {
                notifyProgress();
            }
        }

        promises.forEach((promise, index) => {
            toProgressPromise(promise).then(
                (subResult: PrezlyFileInfo) => {
                    result.successfulUploads.push(subResult);
                    resolveSubPromise(index);
                },
                (subError: Error) => {
                    result.failedUploads.push(subError);
                    resolveSubPromise(index);
                },
                (subProgress: number) => {
                    progressBuffer[index] = clamp(subProgress, progressBuffer[index], MAX_PROGRESS);
                    notifyProgress();
                },
            );
        });
    });
}
