import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CadCheckListTemplateEnum} from '../../../../../admin/modal/cadCheckListTemplateEnum';

@Component({
  selector: 'app-guarantor-acknowledgement',
  templateUrl: './guarantor-acknowledgement.component.html',
  styleUrls: ['./guarantor-acknowledgement.component.scss']
})
export class GuarantorAcknowledgementComponent implements OnInit {
  @Input() customerLoanId;
  @Input() cadData;
  @Input() documentId;
  form: FormGroup;
  spinner = false;
  initialInfoPrint;
  cadCheckListEnum = CadCheckListTemplateEnum;

  constructor(
      private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.buildForm();
  }
  private buildForm() {
    this.form = this.formBuilder.group({
      branch: [undefined],
      shanakhatWitnessBranch: [undefined],
      shanakhatWitnessPosition: [undefined],
      shanakhatWitnessName: [undefined],
      year: [undefined],
      month: [undefined],
      day: [undefined],
      roj: [undefined],
      shuvam: [undefined]
    });
  }
  submit() {

  }
}
