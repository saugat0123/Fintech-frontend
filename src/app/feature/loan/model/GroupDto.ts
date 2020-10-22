import {CustomerLoanGroupDto} from './CustomerLoanGroupDto';

export class GroupDto {
  totalFunded: number;
  totalNonFunded: number;
  customerLoanGroupDto: Array<CustomerLoanGroupDto>;
  fundedData: Array<CustomerLoanGroupDto>;
  nonFundedData: Array<CustomerLoanGroupDto>;
  totalApprovedLimit: string;
  totalPendingLimit: string;
}
