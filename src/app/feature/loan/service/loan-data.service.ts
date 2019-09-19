import {Injectable} from '@angular/core';
import {LoanDataHolder} from '../model/loanData';
import {LoanConfig} from '../../admin/modal/loan-config';
import {Document} from '../../admin/modal/document';
import {DmsLoanFile} from '../../admin/modal/dms-loan-file';
import {Customer} from '../../admin/modal/customer';


@Injectable({
  providedIn: 'root'
})

// export interface LooseObject {
//     [key: string]: any
// }

export class LoanDataService {


  prvs = {
    url: null,
    index: null,
    name: null
  };
  url: string;
  name: string;
  index;
  nxt = {
    url: null,
    index: null,
    name: null
  };

  customer: Customer = new Customer();
  dmsLoanFile: DmsLoanFile = new DmsLoanFile();
  loanDocument: LoanDataHolder = new LoanDataHolder();
  loanConfig: LoanConfig = new LoanConfig();
  loan: LoanConfig = new LoanConfig();
  renew: Document[] = [];
  initial: Document[] = [];

  setNext(index, url, name) {
    this.nxt = {
      url: url,
      index: index,
      name: name
    };

  }

  getNext() {
    return this.nxt;
  }

  setPrevious(index, url, name) {
    this.prvs = {
      url: url,
      index: index,
      name: name
    };
  }

  getPrevious() {
    return this.prvs;
  }

  setCustomer(customer: Customer) {
    this.customer = customer;
    this.loanDocument.customerInfo = this.customer;
  }

  getCustomer() {
    return this.customer;
  }


  setLoan(loanConfig: LoanConfig) {
    this.loanConfig = loanConfig;
    this.loanDocument.loan = loanConfig;
  }


}
