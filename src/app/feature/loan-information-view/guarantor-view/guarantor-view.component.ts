import {Component, Input, OnInit} from '@angular/core';
import {Guarantor} from '../../loan/model/guarantor';
import {Occupation} from '../../admin/modal/occupation';

@Component({
  selector: 'app-guarantor-view',
  templateUrl: './guarantor-view.component.html',
  styleUrls: ['./guarantor-view.component.scss']
})
export class GuarantorViewComponent implements OnInit {
  @Input() guarantorData;
  @Input() loanCategory;
  Occupation = Occupation;
  constructor() { }

  ngOnInit() {
  }

}
