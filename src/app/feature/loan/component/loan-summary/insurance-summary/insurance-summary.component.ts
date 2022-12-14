import {Component, Input, OnInit} from '@angular/core';
import {Insurance} from '../../../../admin/modal/insurance';

@Component({
  selector: 'app-insurance-summary',
  templateUrl: './insurance-summary.component.html',
  styleUrls: ['./insurance-summary.component.scss']
})
export class InsuranceSummaryComponent implements OnInit {
  @Input() insurance: Array<Insurance>;

  constructor() { }

  ngOnInit() {
  }

}
