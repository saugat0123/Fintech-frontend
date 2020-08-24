import {BaseEntity} from '../../../@core/model/base-entity';

export class Insurance extends BaseEntity {
  company: string;
  insuredAmount: number;
  premiumAmount: number;
  issuedDate: Date;
  expiryDate: Date;
  policyType: string;
  remarks: string;
  policyNumber: string;
}
