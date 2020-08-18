import {SiteVisit} from '../../admin/modal/siteVisit';
import {Security} from './security';

export class CustomerInfoData {
  id: number;
  name: string;
  idType: any;
  idNumber: string;
  customerType: any;
  idRegDate: any;
  contactNo: string;
  email: string;
  idRegPlace: string;
  associateId: number;
  isBlacklist: boolean;
  siteVisit: SiteVisit;
  version: number;
  security: Security;

}
