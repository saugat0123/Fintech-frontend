import {BaseEntity} from '../../../@core/model/base-entity';

export class MGroup extends BaseEntity{
     groupCode: string;
     detailInformation: string;
     customerInfoId: number;

     public MGroup(groupCode, detailInformation) {
          this.groupCode = groupCode;
          this.detailInformation = detailInformation;
     }
}
