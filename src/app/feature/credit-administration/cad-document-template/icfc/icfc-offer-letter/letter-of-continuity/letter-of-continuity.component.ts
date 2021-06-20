import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-letter-of-continuity',
  templateUrl: './letter-of-continuity.component.html',
  styleUrls: ['./letter-of-continuity.component.scss']
})
export class LetterOfContinuityComponent implements OnInit {
  @Input() offerLetterType;
  @Input() cadOfferLetterApprovedDoc;
  letterOfContinuity: FormGroup;
  constructor() { }

  ngOnInit() {
  }

}
