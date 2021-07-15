import {Component, Input, OnInit} from '@angular/core';
import {Guarantor} from '../../loan/model/guarantor';
import {Occupation} from '../../admin/modal/occupation';
import {environment} from '../../../../environments/environment';
import {SummaryType} from '../../loan/component/SummaryType';

@Component({
  selector: 'app-guarantor-view',
  templateUrl: './guarantor-view.component.html',
  styleUrls: ['./guarantor-view.component.scss']
})
export class GuarantorViewComponent implements OnInit {
  @Input() guarantorData;
  @Input() loanCategory;
  Occupation = Occupation;
  summaryType = environment.summaryType;
  summaryTypeName = SummaryType;
  constructor() { }

  ngOnInit() {
  }

}
