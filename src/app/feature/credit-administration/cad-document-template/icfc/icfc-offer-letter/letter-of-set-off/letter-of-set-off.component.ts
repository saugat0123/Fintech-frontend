import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-letter-of-set-off',
  templateUrl: './letter-of-set-off.component.html',
  styleUrls: ['./letter-of-set-off.component.scss']
})
export class LetterOfSetOffComponent implements OnInit {
  @Input() offerLetterType;
  @Input() cadOfferLetterApprovedDoc;
    letterOfSetOff: FormGroup;
  constructor() { }

  ngOnInit() {
  }

}
