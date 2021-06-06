import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-offer-letter-personal',
  templateUrl: './offer-letter-personal.component.html',
  styleUrls: ['./offer-letter-personal.component.scss']
})
export class OfferLetterPersonalComponent implements OnInit {
  form: FormGroup;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
    });
  }

}
