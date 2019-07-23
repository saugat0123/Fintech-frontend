export enum AccountStatus {
  NEW_REQUEST = 'New Request',
  APPROVAL = 'Approval',
  REJECTED = 'Rejected'
}

export namespace AccountStatus {
  export function name(accountStatus: AccountStatus) {
    if (accountStatus === AccountStatus.NEW_REQUEST) {
      return 'NEW_REQUEST';
    } else if (accountStatus === AccountStatus.APPROVAL) {
      return 'APPROVAL';
    } else if (accountStatus === AccountStatus.REJECTED) {
      return 'REJECTED';
    }
  }
}
