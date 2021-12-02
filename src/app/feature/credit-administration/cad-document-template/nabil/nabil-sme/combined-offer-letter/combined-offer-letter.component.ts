import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NabilOfferLetterConst} from '../../../../nabil-offer-letter-const';
import {NbDialogRef} from '@nebular/theme';

@Component({
  selector: 'app-combined-offer-letter',
  templateUrl: './combined-offer-letter.component.html',
  styleUrls: ['./combined-offer-letter.component.scss']
})
export class CombinedOfferLetterComponent implements OnInit {
  @Input() customerApprovedDoc: CustomerApprovedLoanCadDocumentation;
  form: FormGroup;
  spinner = false;
  offerLetterConst = NabilOfferLetterConst;

  constructor(private formBuilder: FormBuilder,
              private dialogRef: NbDialogRef<CombinedOfferLetterComponent>) { }

  ngOnInit() {
    this.buildForm();
  }

  close() {
    this.dialogRef.close();
  }
  buildForm() {
    return this.form = this.formBuilder.group({
      sanctionLetterDate: [undefined],
      nameOfBorrower: [undefined],
      addressOfBorrower: [undefined],
      samparkaAdhikrit: [undefined],
      branchName: [undefined],
      samparkaPrabandhak: [undefined]
    });
  }

  submit() {}

}
