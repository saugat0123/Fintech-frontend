import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-bank-guarantee',
  templateUrl: './bank-guarantee.component.html',
  styleUrls: ['./bank-guarantee.component.scss']
})
export class BankGuaranteeComponent implements OnInit {
  @Input() loanName;

  constructor() { }

  ngOnInit() {
  }

}
