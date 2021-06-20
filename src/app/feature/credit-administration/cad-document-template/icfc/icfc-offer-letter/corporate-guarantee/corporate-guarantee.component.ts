import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-corporate-guarantee',
  templateUrl: './corporate-guarantee.component.html',
  styleUrls: ['./corporate-guarantee.component.scss']
})
export class CorporateGuaranteeComponent implements OnInit {
  @Input() offerLetterType;
  @Input() cadOfferLetterApprovedDoc;
  corporateGuarantee: FormGroup;

  constructor() { }

  ngOnInit() {
  }

}
