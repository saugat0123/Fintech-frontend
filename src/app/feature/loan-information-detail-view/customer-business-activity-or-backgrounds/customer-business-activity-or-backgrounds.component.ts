import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-customer-business-activity-or-backgrounds',
  templateUrl: './customer-business-activity-or-backgrounds.component.html',
  styleUrls: ['./customer-business-activity-or-backgrounds.component.scss']
})
export class CustomerBusinessActivityOrBackgroundsComponent implements OnInit {

  @Input() customer: any;
  @Input() loanHolder: any;
  constructor() { }

  ngOnInit() {
  }

}
