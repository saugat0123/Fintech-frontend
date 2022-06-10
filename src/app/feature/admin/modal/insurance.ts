import {BaseEntity} from '../../../@core/model/base-entity';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {Validators} from '@angular/forms';

export class Insurance extends BaseEntity {
  company?: string;
  insuredAmount?: number;
  premiumAmount?: number;
  issuedDate?: Date;
  expiryDate?: Date;
  policyType?: string;
  policyNumber?: string;
  policyDocumentPath: string;
  remark: string;
  assetInsured: string;
  endorsement: string;
}
