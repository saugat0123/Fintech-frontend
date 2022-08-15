import {Component, Input, OnInit} from '@angular/core';
import {Occupation} from '../../admin/modal/occupation';
import {LoanDataHolder} from '../../loan/model/loanData';
import {Guarantor} from '../../loan/model/guarantor';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-guarantor-view',
  templateUrl: './guarantor-view.component.html',
  styleUrls: ['./guarantor-view.component.scss']
})
export class GuarantorViewComponent implements OnInit {
  @Input() guarantorData: Array<Guarantor>;
  @Input() individual;
  @Input() loanDataHolder: LoanDataHolder;
  @Input() customerAllLoanList: LoanDataHolder [];
  Occupation = Occupation;
  newGuarantor = [];
  promoter = [];
  promoterBackground = [];
  cgid;
  promoterCheck = false;
  constructor() { }
  thisClient;
  check = false;
  ngOnInit() {
    this.thisClient = this.customerAllLoanList[this.customerAllLoanList.length -1].loanHolder.clientType;
    if (this.thisClient === 'CORPORATE' || this.thisClient === 'INFRASTRUCTURE_AND_PROJECT' ||
        this.thisClient === 'MID_MARKET' || this.thisClient === 'BUSINESS_DEVELOPMENT') {
      this.check = true;
    }
    if (!ObjectUtil.isEmpty(this.customerAllLoanList)) {
      this.guarantorData = [];
      this.customerAllLoanList.forEach((d) => {
       if (!ObjectUtil.isEmpty(d.taggedGuarantors)) {
         d.taggedGuarantors.forEach((g) => {
           if (!this.guarantorData.includes(g)) {
             this.guarantorData.push(g);
           }
         });
       }
      });
    }
    const guarantorIds = this.guarantorData.map(d => d.id);
    this.guarantorData =  this.guarantorData
        .filter((value, index) => guarantorIds.indexOf(value.id) === index);
    this.newGuarantor = this.constructGuarantor(this.guarantorData);
    this.filterPromoter();
  }
  filterPromoter() {
    let currentGuarantor;
    if (this.customerAllLoanList.length > 0) {
      this.customerAllLoanList.forEach(d => {
        if (d.documentStatus.toString() === 'PENDING' || !ObjectUtil.isEmpty(d.loanHolder)) {
          if (!ObjectUtil.isEmpty(d.loanHolder.guarantors)) {
            currentGuarantor = d;
            return;
          }
        }
      });
    }
      if (!ObjectUtil.isEmpty(currentGuarantor)) {
        this.promoterBackground = currentGuarantor.loanHolder.guarantors.guarantorList.filter(d => d.guarantorType === 'Promoter' || d.guarantorType === 'Partner' || d.guarantorType === 'Proprietor');
      }
    this.promoterCheck = this.promoterBackground.length > 0;
    this.promoter = this.constructGuarantor(this.promoterBackground);
  }

  constructGuarantor(array) {
    let innerGuarantor = [];
    const newGuarantor = [];
    array.forEach((g, i) => {
      innerGuarantor.push(g);
      if ((i + 1) % 2 === 0) {
        if (innerGuarantor.length > 0) {
          newGuarantor.push(innerGuarantor);
        }
        innerGuarantor = [];
      }
      if (i === array.length - 1) {
        if (innerGuarantor.length > 0) {
          newGuarantor.push(innerGuarantor);
        }
        innerGuarantor = [];
      }
    });
    return newGuarantor;
  }
  calculateAge(dob) {
    const difference = Math.abs(Date.now() - new Date(dob).getTime());
    const age = Math.floor((difference / (1000 * 3600 * 24)) / 365);
    return age;
  }
}
