import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-overdraft-facility-against-fixed-deposit',
  templateUrl: './overdraft-facility-against-fixed-deposit.component.html',
  styleUrls: ['./overdraft-facility-against-fixed-deposit.component.scss']
})
export class OverdraftFacilityAgainstFixedDepositComponent implements OnInit {
  @Input() loanName;

  constructor() { }

  ngOnInit() {
  }

}
