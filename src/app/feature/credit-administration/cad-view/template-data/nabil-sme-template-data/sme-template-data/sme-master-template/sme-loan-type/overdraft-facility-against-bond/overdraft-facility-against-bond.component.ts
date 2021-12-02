import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-overdraft-facility-against-bond',
  templateUrl: './overdraft-facility-against-bond.component.html',
  styleUrls: ['./overdraft-facility-against-bond.component.scss']
})
export class OverdraftFacilityAgainstBondComponent implements OnInit {
  @Input() loanName;

  constructor() { }

  ngOnInit() {
  }

}
