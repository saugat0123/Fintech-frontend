import {Component, Input, OnInit} from '@angular/core';
import {OpeningForm} from '../../../modal/openingForm';

@Component({
  selector: 'app-opening-account-print',
  templateUrl: './opening-account-print.component.html',
  styleUrls: ['./opening-account-print.component.scss']
})
export class OpeningAccountPrintComponent implements OnInit {
  @Input()
  openingForm: OpeningForm = new OpeningForm();

  constructor() {
  }


  ngOnInit() {
  }
}
