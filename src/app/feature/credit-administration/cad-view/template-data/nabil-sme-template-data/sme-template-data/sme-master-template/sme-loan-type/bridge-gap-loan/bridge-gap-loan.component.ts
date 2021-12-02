import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-bridge-gap-loan',
  templateUrl: './bridge-gap-loan.component.html',
  styleUrls: ['./bridge-gap-loan.component.scss']
})
export class BridgeGapLoanComponent implements OnInit {
  @Input() loanName;

  constructor() { }

  ngOnInit() {
  }

}
