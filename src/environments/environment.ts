// This file can be replaced during build by using the `fweileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import {Clients} from './Clients';

/**
 This file can be replaced during build by using the `fileReplacements` array.
 `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
 The list of file replacements can be found in `angular.json`.

 this environment file is run in default run. So place your current active config in this file.

 command to build client related product:
 ng build --configuration= 'client name'

 active client name in current repo: 'srdb' , 'tinau' , 'mega'
 */
export const environment = {
    production: true,
    client: Clients.EXCEL,
    GOOGLE_MAP_API_KEY: 'AIzaSyDKERYllGf5BfVR_c_45nqHVkbHoPgXPDA',
    LOCAL_STORAGE_KEY: 'QP\'`0tWfyBni^(*rv0gB].ck$s@z(/',
    LOCAL_STORAGE_NAME: 'SBSolutionsEXCELLAS',
    enablePreAddingAccountNumber: false,
    disableCrgAlpha: true,
    disableCrgLambda: true,
    disableApprovalSheet: true,
    RISK_INITIAL_ROLE: 'RISK OFFICER',
    microLoan: false,
    SBS_GROUP: false,
    MEGA_GROUP: false,
    isMega: false
};

// export const environment = {
//     production: false,
//     client: Clients.SHINE_RESUNGA,
//     GOOGLE_MAP_API_KEY: 'AIzaSyDKERYllGf5BfVR_c_45nqHVkbHoPgXPDA',
//     LOCAL_STORAGE_KEY: 'QP\'`0tWfyBni^(*rv0gB].ck$s@z(/',
//     LOCAL_STORAGE_NAME: 'SBSolutionsLAS',
//     enablePreAddingAccountNumber: true,
//     disableCrgAlpha: true,
//     disableApprovalSheet: false,
//     microLoan: true,
//     SBS_GROUP: false,
//     MEGA_GROUP: true,
// };

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
