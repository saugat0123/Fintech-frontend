import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../../model/loanData';

@Component({
  selector: 'app-banking-relationship',
  templateUrl: './banking-relationship.component.html',
  styleUrls: ['./banking-relationship.component.scss']
})
export class BankingRelationshipComponent implements OnInit {

  constructor() { }

  @Input() loanDataHolder: LoanDataHolder;
  ngOnInit() {
  }

}
