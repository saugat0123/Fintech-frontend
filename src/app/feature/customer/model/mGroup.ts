import {BaseEntity} from '../../../@core/model/base-entity';

export class MGroup extends BaseEntity {
     groupCode: string;
     detailInformation: string;
     customerInfoId: number;
     groupName: string;

     public MGroup(groupCode, detailInformation, groupName) {
          this.groupCode = groupCode;
          this.detailInformation = detailInformation;
          this.groupName = groupName;
     }
}
