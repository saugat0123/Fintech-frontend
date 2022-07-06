import {Component, Input, OnInit} from '@angular/core';
import {Guarantor} from '../../../../model/guarantor';
import {NbDialogRef} from '@nebular/theme';

@Component({
  selector: 'app-guarantor-detail',
  templateUrl: './guarantor-detail.component.html',
  styleUrls: ['./guarantor-detail.component.scss']
})
export class GuarantorDetailComponent implements OnInit {
   @Input() guarantorData: Guarantor;
   @Input() customerType;


  constructor() { }

  ngOnInit() {
  }

  findAge(date: Date) {
    const timeDiff = Math.abs(Date.now() - new Date(date).getTime());
    return  Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
  }

}
