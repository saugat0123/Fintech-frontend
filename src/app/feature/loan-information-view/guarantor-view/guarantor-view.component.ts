import {Component, Input, OnInit} from '@angular/core';
import {Occupation} from '../../admin/modal/occupation';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-guarantor-view',
  templateUrl: './guarantor-view.component.html',
  styleUrls: ['./guarantor-view.component.scss']
})
export class GuarantorViewComponent implements OnInit {
  @Input() guarantorData;
  @Input() individual;
  Occupation = Occupation;
  newGuarantor = [];
  cgid;
  constructor() { }

  ngOnInit() {
    let innerGuarantor = [];
    this.guarantorData.forEach((g, i) => {
      innerGuarantor.push(g);
      if ((i + 1) % 2 === 0) {
        if (innerGuarantor.length > 0) {
          this.newGuarantor.push(innerGuarantor);
        }
        innerGuarantor = [];
      }
      if (i === this.guarantorData.length - 1) {
        if (innerGuarantor.length > 0) {
          this.newGuarantor.push(innerGuarantor);
        }
        innerGuarantor = [];
      }
    });
    // this.guarantorData.forEach((g, i) => {
    //
    //   if(this.cgid !== g.id) {
    //     innerGuarantor.push(g);
    //   }
    //   if (!ObjectUtil.isEmpty(this.guarantorData[i + 1])) {
    //     this.cgid = this.guarantorData[i + 1].id;
    //     innerGuarantor.push(this.guarantorData[i + 1]);
    //   }
    //   if(innerGuarantor.length > 0) {
    //     this.newGuarantor.push(innerGuarantor);
    //   }
    // });
  }
  calculateAge(dob) {
    const difference = Math.abs(Date.now() - new Date(dob).getTime());
    const age = Math.floor((difference / (1000 * 3600 * 24)) / 365);
    return age;
  }
}
