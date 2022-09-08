import {BaseEntity} from '../../../@core/model/base-entity';

export class MGroup extends BaseEntity {
     groupCode: string;
     detailInformation: string;
     customerInfoId: number;
     groupName: string;
     groupExposureDateType: string;
     groupExposureDate: Date;
     outstandingOverdue: string;
     groupPosition: string;
     totalAmount: string;
     companyGroup: string;
     securityHeld: string;
     groupTotal: number;

     public MGroup(groupCode, detailInformation, groupName, groupExposureDateType, groupExposureDate,
                   outstandingOverdue, groupPosition, totalAmount, companyGroup, securityHeld, groupTotal) {
          this.groupCode = groupCode;
          this.detailInformation = detailInformation;
          this.groupName = groupName;
          this.groupExposureDateType = groupExposureDateType;
          this.groupExposureDate = groupExposureDate;
          this.outstandingOverdue = outstandingOverdue;
          this.groupPosition = groupPosition;
          this.totalAmount = totalAmount;
          this.companyGroup = companyGroup;
          this.securityHeld = securityHeld;
          this.groupTotal = groupTotal;
     }
}
