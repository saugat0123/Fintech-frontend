import {OpeningNominee} from './openingNominee';
import {OpeningBeneficiary} from './openingBeneficiary';
import {OpeningCustomer} from './openingCustomer';
import {AccountPurpose} from './accountPurpose';

export class OpeningAccount {
  haveExistingAccountNo: boolean;
  existingAccountNo: string;
  purposeOfAccount: AccountPurpose;
  currency: string;
  haveJoint: boolean;
  haveNominee: boolean;
  haveBeneficiary: boolean;
  nominee: OpeningNominee;
  beneficiary: OpeningBeneficiary;
  openingCustomers: Array<OpeningCustomer>;
  annualTurnover: number;
  annualTransaction: number;
  internetBanking: boolean;
  mobileBanking: boolean;
  debitCard: boolean;
  statement: boolean;
  statementFrequency: string;
  statementMode: string;
}
