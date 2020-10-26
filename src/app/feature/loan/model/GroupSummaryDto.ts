import {GroupDto} from './GroupDto';

export class GroupSummaryDto {
  groupDtoList: Array<GroupDto>;
  groupCode: string;
  groupLimit: number;
  groupId: number;
  grandTotalFundedAmount: number;
  grandTotalNotFundedAmount: number;
  grandTotalApprovedLimit: number;
  grandTotalPendingLimit: number;
}
