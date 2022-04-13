import { LoanDataHolder } from './../../loan/model/loanData';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-family-details-networth',
  templateUrl: './family-details-networth.component.html',
  styleUrls: ['./family-details-networth.component.scss']
})
export class FamilyDetailsNetworthComponent implements OnInit {
  @Input() loanDataHolder: LoanDataHolder
  constructor() { }

  ngOnInit() {
  }

}
