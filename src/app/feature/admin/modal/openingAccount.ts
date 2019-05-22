import {OpeningNominee} from './openingNominee';
import {OpeningBeneficiary} from './openingBeneficiary';
import {OpeningCustomer} from './openingCustomer';

export class OpeningAccount {
  accountType: string;
  accountNo: string;
  purposeOfAccount: string;
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
  accountStatementRadio: boolean;
  statementFrequency: string;
  statementMode: string;
}
