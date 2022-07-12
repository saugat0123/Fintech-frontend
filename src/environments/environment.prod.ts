import {Clients} from './Clients';

export const environment = {
  production: true,
  client: Clients.SB,
  GOOGLE_MAP_API_KEY: 'AIzaSyDKERYllGf5BfVR_c_45nqHVkbHoPgXPDA',
  LOCAL_STORAGE_KEY: 'QP\'`0tWfyBni^(*rv0gB].ck$s@z(/',
  LOCAL_STORAGE_NAME: 'SBSolutionsLAS',
  enablePreAddingAccountNumber: false,
  disableCrgAlpha: true,
  disableCrgLambda: true,
  isMega: true,
  SBS_GROUP: false,
  MEGA_GROUP: false,
  microLoan: true,
  versionCheckUrl: 'http://localhost:84/version.json',
  autoReload: true // this should be always true to detect new update after deployment.
};
