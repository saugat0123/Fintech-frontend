import {Component, Input, OnInit} from '@angular/core';
import {FiscalYear} from '../../admin/modal/FiscalYear';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-detail-view-base',
  templateUrl: './detail-view-base.component.html',
  styleUrls: ['./detail-view-base.component.scss']
})
export class DetailViewBaseComponent implements OnInit {
  @Input() loanDataHolder;
  @Input() loanHolder;
  @Input() calendarType;
  @Input() loanId;
  fiscalYearArray: Array<FiscalYear>;

  isMega = environment.isMega;

  constructor() { }

  ngOnInit() {
  }

}
