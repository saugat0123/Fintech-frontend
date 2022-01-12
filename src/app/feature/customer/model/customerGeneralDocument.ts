import {Document} from '../../admin/modal/document';
import {CustomerInfoData} from '../../loan/model/customerInfoData';

export class CustomerGeneralDocument {
  document: Document;
  docPath: string;
  customerInfo: CustomerInfoData;
  version: number;
  name: string;
  id: number;
  checked: boolean;
  docIndex: number;

}
