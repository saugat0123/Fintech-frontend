import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-micro-loan-detail-view-base',
  templateUrl: './micro-loan-detail-view-base.component.html',
  styleUrls: ['./micro-loan-detail-view-base.component.scss']
})
export class MicroLoanDetailViewBaseComponent implements OnInit {
  @Input() loanDataHolder;
  @Input() loanHolder;
  @Input() calendarType;
  @Input() loanId;

  constructor() { }

  ngOnInit() {
  }

}
