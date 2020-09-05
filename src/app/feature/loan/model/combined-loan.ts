import {BaseEntity} from '../../../@core/model/base-entity';
import {LoanDataHolder} from './loanData';

export class CombinedLoan extends BaseEntity {
  loans?: LoanDataHolder[];
}
