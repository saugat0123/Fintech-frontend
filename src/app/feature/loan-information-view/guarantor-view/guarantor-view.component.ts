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
  constructor() { }

  ngOnInit() {
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
      if (!ObjectUtil.isEmpty(this.customerAllLoanList[0].loanHolder.guarantors.guarantorList)) {
        this.promoterBackground = this.customerAllLoanList[0].loanHolder.guarantors.guarantorList.map(d => {
          if (d.guarantorType === 'Promoter' || d.guarantorType === 'Partner' || d.guarantorType === 'Proprietor') {
            return d;
          }
        });
      }
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
