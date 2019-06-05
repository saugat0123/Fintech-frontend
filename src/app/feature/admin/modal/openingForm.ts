
import {OpeningAccount} from './openingAccount';
import {Branch} from './branch';

export class OpeningForm {
  id: number;
  branch: Branch;
  requestedDate: Date;
  fullName: string;
  accountType: string;
  openingAccount: OpeningAccount;
  status: string;
}
