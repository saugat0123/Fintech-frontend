import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-joint-customer-view',
  templateUrl: './joint-customer-view.component.html',
  styleUrls: ['./joint-customer-view.component.scss']
})
export class JointCustomerViewComponent implements OnInit {
  constructor() { }
  @Input() jointDetails;
  accountNumbers;
  ngOnInit() {
  }
  calculateAge(dob) {
    const difference = Math.abs(Date.now() - new Date(dob).getTime());
    const age = Math.floor((difference / (1000 * 3600 * 24)) / 365);
    return age;
  }
    getAccountNumber(accountNumberList) {
      let accountNumber = '';
      if (accountNumberList.length === 1) {
        accountNumber = accountNumberList[0].accountNo;
      }
      if (accountNumberList.length === 2) {
        const tempNumbArray = this.setAccountDetailsArray(accountNumberList);
        accountNumber = tempNumbArray.join(' and ');
      }
      if (accountNumberList.length > 2) {
        const tempNumbArray = this.setAccountDetailsArray(accountNumberList);
        for (let i = 0; i < tempNumbArray.length - 1; i++) {
          this.accountNumbers = tempNumbArray.join(' , ');
        }
        const tempData = tempNumbArray[tempNumbArray.length - 1];
        accountNumber = this.accountNumbers + ' and ' + tempData;
      }
      return accountNumber ? accountNumber : '';
    }

    setAccountDetailsArray(accountList: any) {
      const tempNumbArray = [];
      accountList.forEach((val: any) => {
        tempNumbArray.push(val.accountNo);
      });
      return tempNumbArray;
    }
}
