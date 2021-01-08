import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../model/customerApprovedLoanCadDocumentation';

@Component({
  selector: 'app-exposure-view',
  templateUrl: './exposure-view.component.html',
  styleUrls: ['./exposure-view.component.scss']
})
export class ExposureViewComponent implements OnInit {
  @Input()
  cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
  constructor() { }

  ngOnInit() {
  }

}
