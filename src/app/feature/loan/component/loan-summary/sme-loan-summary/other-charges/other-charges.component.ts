import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-other-charges',
  templateUrl: './other-charges.component.html',
  styleUrls: ['./other-charges.component.scss']
})
export class OtherChargesComponent implements OnInit {
  @Input() customerAllLoanList;

  constructor() { }

  ngOnInit() {
  }

}
