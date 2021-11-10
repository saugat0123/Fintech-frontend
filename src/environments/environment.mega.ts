import {Clients} from './Clients';
import {SummaryType} from '../app/feature/loan/component/SummaryType';

export const environment = {
    production: false,
    client: Clients.MEGA,
    GOOGLE_MAP_API_KEY: 'AIzaSyDKERYllGf5BfVR_c_45nqHVkbHoPgXPDA',
    LOCAL_STORAGE_KEY: 'QP\'`0tWfyBni^(*rv0gB].ck$s@z(/',
    LOCAL_STORAGE_NAME: 'SBSolutionsSRDBLAS',
    enablePreAddingAccountNumber: true,
    disableCrgAlpha: false,
    disableCrgLambda: false,
    SBS_GROUP: false,
    MEGA_GROUP: true,
    summaryType: SummaryType.GENERAL,
    versionCheckUrl: 'http://localhost:84/version.json'
};
