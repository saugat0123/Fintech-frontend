import {OpeningCustomerRelative} from './openingCustomerRelative';

export class OpeningNominee {
  fullName: string;
  imagePath: string;
  relationToMe: string;
  dateOfBirth: Date;
  citizenNumber: string;
  issuedPlace: string;
  temporaryAddress: string;
  permanentAddress: string;
  contactNumber: string;
  nomineeFamily: Array<OpeningCustomerRelative>;
}
