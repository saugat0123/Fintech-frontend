import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Editor} from '../../../../../@core/utils/constants/editor';

@Component({
  selector: 'app-nabil-loan-deed-company',
  templateUrl: './nabil-loan-deed-company.component.html',
  styleUrls: ['./nabil-loan-deed-company.component.scss']
})
export class NabilLoanDeedCompanyComponent implements OnInit {
  form: FormGroup;
  ckEditorConfig = Editor.CK_CONFIG;


  constructor(
      private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm(): FormGroup {
    return this.form = this.formBuilder.group({
      nameOfBranch: [undefined],
      actYearInFigure: [undefined],
      headSectionDepartment: [undefined],
      registrationDate: [undefined],
      registrationNo: [undefined],
      companyName: [undefined],
      nameOfAuthorizePerson: [undefined],
      sanctionLetterIssueDate: [undefined],
      givenAuthorityPerson: [undefined],
      totalLoanAmountInFigure: [undefined],
      totalLoanAmountInWord: [undefined],
      yearInFigure: [undefined],
      year: [undefined],
      month: [undefined],
      days: [undefined],
      freeText: [undefined],
    });
  }

}
