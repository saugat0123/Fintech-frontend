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

     public MGroup(groupCode, detailInformation, groupName, groupExposureDateType, groupExposureDate,
                   outstandingOverdue, groupPosition, totalAmount) {
          this.groupCode = groupCode;
          this.detailInformation = detailInformation;
          this.groupName = groupName;
          this.groupExposureDateType = groupExposureDateType;
          this.groupExposureDate = groupExposureDate;
          this.outstandingOverdue = outstandingOverdue;
          this.groupPosition = groupPosition;
          this.totalAmount = totalAmount;
     }
}
