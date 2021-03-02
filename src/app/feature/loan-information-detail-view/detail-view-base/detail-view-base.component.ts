import {Component, Input, OnInit} from '@angular/core';
import {FiscalYear} from '../../admin/modal/FiscalYear';

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

  constructor() { }

  ngOnInit() {
  }

}
