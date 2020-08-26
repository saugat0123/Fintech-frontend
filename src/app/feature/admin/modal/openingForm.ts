import {OpeningAccount} from './openingAccount';
import {Branch} from './branch';
import {AccountType} from './accountType';
import {User} from './user';

export class OpeningForm {
  id: number;
  branch: Branch;
  requestedDate: Date;
  fullName: string;
  accountType: AccountType;
  openingAccount: OpeningAccount;
  status: string;
  remark: string;
  lastFollowUp: Date;
  lastFollowUpBy: User;
  accountNumber: string;
  customerPhotoPath: string;
}
