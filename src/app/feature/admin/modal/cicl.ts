export class Cicl {
  nameOfBorrower: string;
  nameOfFI: string;
  facility: string;
  outstandingAmount: number;
  overdueAmount: number;
  status: string;
  obtaineddate: Date;
  loanamount: number;
  overdue: string;
  createdAt: Date;
  lastModifiedAt: Date;
  version: number;
  ciclRelation: string;
  probabilityDefer: number;
  riskScore: number;
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
}
