import {OpeningNominee} from './openingNominee';
import {OpeningBeneficiary} from './openingBeneficiary';
import {OpeningCustomer} from './openingCustomer';
import {AccountCategory} from './accountCategory';

export class OpeningAccount {
  purposeOfAccount: AccountCategory;
  currency: string;
  haveJoint: boolean;
  haveNominee: boolean;
  haveBeneficiary: boolean;
  nominee: OpeningNominee;
  beneficiary: OpeningBeneficiary;
  openingCustomers: Array<OpeningCustomer>;
  annualTransactionNumber: string;
  annualTransaction: string;
  internetBanking: boolean;
  mobileBanking: boolean;
  debitCard: boolean;
  statement: boolean;
  statementFrequency: string;
  statementMode: string;
}
