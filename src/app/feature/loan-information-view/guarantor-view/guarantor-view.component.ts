import {Component, Input, OnInit} from '@angular/core';
import {Occupation} from '../../admin/modal/occupation';
import {LoanDataHolder} from '../../loan/model/loanData';
import {Guarantor} from '../../loan/model/guarantor';

@Component({
  selector: 'app-guarantor-view',
  templateUrl: './guarantor-view.component.html',
  styleUrls: ['./guarantor-view.component.scss']
})
export class GuarantorViewComponent implements OnInit {
  @Input() guarantorData: Array<Guarantor>;
  @Input() individual;
  @Input() loanDataHolder: LoanDataHolder;
  Occupation = Occupation;
  newGuarantor = [];
  promoter = [];
  promoterBackground = [];
  cgid;
  constructor() { }

  ngOnInit() {
    this.newGuarantor = this.constructGuarantor(this.guarantorData);
    this.filterPromoter();
  }
  filterPromoter() {
    this.promoterBackground = this.loanDataHolder.loanHolder.guarantors.guarantorList.map(d => {
      if (d.guarantorType === 'Promoter' || d.guarantorType === 'Partner' || d.guarantorType === 'Proprietor') {
        return d;
      }
    });
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
