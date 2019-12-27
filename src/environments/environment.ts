// This file can be replaced during build by using the `fweileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import {AppConstant} from '../app/@core/utils/appConstant';

export const environment = {
  production: false,
  client: AppConstant.BANKNAME,
  GOOGLE_MAP_API_KEY: 'AIzaSyDKERYllGf5BfVR_c_45nqHVkbHoPgXPDA',
  LOCAL_STORAGE_KEY: 'QP\'`0tWfyBni^(*rv0gB].ck$s@z(/',
  LOCAL_STORAGE_NAME: 'SBSolutionsLAS'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
