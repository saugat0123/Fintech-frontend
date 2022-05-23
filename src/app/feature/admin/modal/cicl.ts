export class Cicl {
  nameOfBorrower: string;
  nameOfFI: string;
  facility: string;
  borrower: string;
  guarantor: string;
  shareholder: string;
  outstandingAmount: number;
  overdueAmount: number;
  overdueStatus: string;
  obtaineddate: Date;
  loanamount: number;
  // overdue: string;
  createdAt: Date;
  lastModifiedAt: Date;
  version: number;
  // ciclRelation: string;
  blacklistChecked: boolean;
  blacklistHistory: [];
}

export class CiclArray {
  id: number;
  data?: any;
  remarks: string;
  repaymentTrack: string;
  createdAt: Date;
  lastModifiedAt: Date;
  version: number;
  cibCharge: string;
  cibDate: Date;
  checkedData: string;
}
