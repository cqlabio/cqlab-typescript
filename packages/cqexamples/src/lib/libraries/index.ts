export * from './breast-cancer-screening-library';

import { LibraryContainer } from '@cqlab/cqdefine';
import { BreastCancerScreeningLibrary } from './breast-cancer-screening-library';

export const libraryContainer = new LibraryContainer();
libraryContainer.add(BreastCancerScreeningLibrary);
