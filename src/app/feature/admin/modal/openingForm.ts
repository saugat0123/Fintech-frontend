
import {OpeningAccount} from './openingAccount';
import {Branch} from './branch';
import {AccountType} from './accountType';

export class OpeningForm {
  id: number;
  branch: Branch;
  requestedDate: Date;
  fullName: string;
  accountType: AccountType;
  openingAccount: OpeningAccount;
  status: string;
}
