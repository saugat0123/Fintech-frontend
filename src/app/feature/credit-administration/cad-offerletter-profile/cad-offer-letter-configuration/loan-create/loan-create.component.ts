import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {SbTranslateService} from '../../../../../@core/service/sbtranslate.service';

@Component({
  selector: 'app-loan-create',
  templateUrl: './loan-create.component.html',
  styleUrls: ['./loan-create.component.scss']
})
export class LoanCreateComponent implements OnInit {
  @Input() userConfigForm;
  submitted = false;
  translatedValues: any;

  constructor(
      private formBuilder: FormBuilder,
      private translateService: SbTranslateService
  ) {
  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.userConfigForm = this.formBuilder.group({
      loanType: [undefined],
      proposedAmount: [undefined],
      status: [undefined],
      createdOn: [undefined],
      comments: [undefined],
    });
  }
}
