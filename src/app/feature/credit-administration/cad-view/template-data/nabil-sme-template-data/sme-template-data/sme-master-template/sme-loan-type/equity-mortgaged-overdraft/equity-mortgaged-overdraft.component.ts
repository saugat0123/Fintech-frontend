import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-equity-mortgaged-overdraft',
  templateUrl: './equity-mortgaged-overdraft.component.html',
  styleUrls: ['./equity-mortgaged-overdraft.component.scss']
})
export class EquityMortgagedOverdraftComponent implements OnInit {
  @Input() loanName;

  constructor() { }

  ngOnInit() {
  }

}
