import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-joint-customer-view',
  templateUrl: './joint-customer-view.component.html',
  styleUrls: ['./joint-customer-view.component.scss']
})
export class JointCustomerViewComponent implements OnInit {

  constructor() { }
  @Input() jointArray;
  ngOnInit() {
  }
  calculateAge(dob) {
    const difference = Math.abs(Date.now() - new Date(dob).getTime());
    const age = Math.floor((difference / (1000 * 3600 * 24)) / 365);
    return age;
  }
}
