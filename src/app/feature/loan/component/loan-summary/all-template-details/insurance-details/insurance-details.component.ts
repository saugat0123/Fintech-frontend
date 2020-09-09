import {Component, Input, OnInit} from '@angular/core';
import {Insurance} from '../../../../../admin/modal/insurance';

@Component({
  selector: 'app-insurance-details',
  templateUrl: './insurance-details.component.html',
  styleUrls: ['./insurance-details.component.scss']
})
export class InsuranceDetailsComponent implements OnInit {
@Input() insurance: Insurance;
  constructor() { }

  ngOnInit() {
  }

}
