import {ShareType} from '../../loan/model/ShareType';

export class CustomerShareData {
   id: number;
   version: number;
   companyName: String;
   shareType: ShareType;
   shareUnit: String;
   shareRate: String;
}
