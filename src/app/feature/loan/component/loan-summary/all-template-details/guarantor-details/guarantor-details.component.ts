import {Component, Input, OnInit} from '@angular/core';
import {Guarantor} from '../../../../model/guarantor';

@Component({
  selector: 'app-guarantor-details',
  templateUrl: './guarantor-details.component.html',
  styleUrls: ['./guarantor-details.component.scss']
})
export class GuarantorDetailsComponent implements OnInit {
  @Input() guarantorData: Array<Guarantor>;

  constructor() {
  }

  ngOnInit() {
  }
}
