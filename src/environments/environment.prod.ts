import {Clients} from './Clients';
import {SummaryType} from '../app/feature/loan/component/SummaryType';

export const environment = {
  production: true,
  client: Clients.SB,
  GOOGLE_MAP_API_KEY: 'AIzaSyDKERYllGf5BfVR_c_45nqHVkbHoPgXPDA',
  LOCAL_STORAGE_KEY: 'QP\'`0tWfyBni^(*rv0gB].ck$s@z(/',
  LOCAL_STORAGE_NAME: 'SBSolutionsLAS',
  enablePreAddingAccountNumber: false,
  disableCrgAlpha: true,
  disableCrgLambda: true,
  disableApprovalSheet: false,
  isMega: true,
  SBS_GROUP: false,
  MEGA_GROUP: false,
  microLoan: true,
  summaryType: SummaryType.GAMMA
};
