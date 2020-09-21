import {CustomerInfoData} from '../../feature/loan/model/customerInfoData';

export class CustomerLoanFlag {
  id: number;
  flag: string;
  description: string;
  order: number;
  customerLoanId: number;
  customerInfo: CustomerInfoData;
}
