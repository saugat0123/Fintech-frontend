import {Clients} from './Clients';

export const environment = {
  production: true,
  client: Clients.SB,
  GOOGLE_MAP_API_KEY: 'AIzaSyDKERYllGf5BfVR_c_45nqHVkbHoPgXPDA',
  LOCAL_STORAGE_KEY: 'QP\'`0tWfyBni^(*rv0gB].ck$s@z(/',
  LOCAL_STORAGE_NAME: 'SBSolutionsCIVILLAS',
  enablePreAddingAccountNumber: false,
  disableCrgAlpha: false,
  disableCrgLambda: false,
  disableApprovalSheet: true,
  isMega: true,
  SBS_GROUP: false,
  MEGA_GROUP: false,
  microLoan: false,
  versionCheckUrl: 'http://localhost:84/version.json',
  autoReload: false,
  validation: true,
  validationUrl: 'http://localhost:4200/'
};
