import {Component, Input, OnInit} from '@angular/core';
import {Guarantor} from '../../loan/model/guarantor';

@Component({
  selector: 'app-guarantor-view',
  templateUrl: './guarantor-view.component.html',
  styleUrls: ['./guarantor-view.component.scss']
})
export class GuarantorViewComponent implements OnInit {
  @Input() guarantorData;
  guarantorList: Array<Guarantor> = [];
  constructor() { }

  ngOnInit() {
    this.guarantorList = this.guarantorData.guarantorList;
  }

}
