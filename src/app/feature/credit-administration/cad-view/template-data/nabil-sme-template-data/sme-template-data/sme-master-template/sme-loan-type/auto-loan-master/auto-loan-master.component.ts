import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-auto-loan-master',
  templateUrl: './auto-loan-master.component.html',
  styleUrls: ['./auto-loan-master.component.scss']
})
export class AutoLoanMasterComponent implements OnInit {
  @Input() loanName;

  constructor() { }

  ngOnInit() {
  }

}
