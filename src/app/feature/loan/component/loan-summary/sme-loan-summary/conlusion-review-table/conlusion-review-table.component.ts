import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../../model/loanData';

@Component({
  selector: 'app-conlusion-review-table',
  templateUrl: './conlusion-review-table.component.html',
  styleUrls: ['./conlusion-review-table.component.scss'],
})
export class ConlusionReviewTableComponent implements OnInit {
  @Input() isUsedForAboveTenMillion: boolean;
  @Input() loanDataHolder: LoanDataHolder;
  @Input() totalProposedLimit: number;

  constructor() {
  }

  ngOnInit() {
  }
}
