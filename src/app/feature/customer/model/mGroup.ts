import {BaseEntity} from '../../../@core/model/base-entity';

export class MGroup extends BaseEntity {
     groupCode: string;
     detailInformation: string;
     customerInfoId: number;
     groupName: string;
     groupExposureDateType: string;
     groupExposureDate: Date;

     public MGroup(groupCode, detailInformation, groupName, groupExposureDateType, groupExposureDate) {
          this.groupCode = groupCode;
          this.detailInformation = detailInformation;
          this.groupName = groupName;
          this.groupExposureDateType = groupExposureDateType;
          this.groupExposureDate = groupExposureDate;
     }
}
