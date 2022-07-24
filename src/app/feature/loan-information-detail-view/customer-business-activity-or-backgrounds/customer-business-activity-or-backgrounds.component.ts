import {Component, Input, OnInit} from '@angular/core';
import {Guarantor} from '../../loan/model/guarantor';

@Component({
  selector: 'app-customer-business-activity-or-backgrounds',
  templateUrl: './customer-business-activity-or-backgrounds.component.html',
  styleUrls: ['./customer-business-activity-or-backgrounds.component.scss']
})
export class CustomerBusinessActivityOrBackgroundsComponent implements OnInit {

  @Input() customer: any;
  @Input() loanHolder: any;
  @Input() tagGuarantor: Array<Guarantor>;

  constructor() {
  }

  ngOnInit() {
  }

}
