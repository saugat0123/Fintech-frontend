import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Editor} from '../../../../../@core/utils/constants/editor';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {NabilDocumentChecklist} from '../../../../admin/modal/nabil-document-checklist.enum';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-nabil-loan-deed-company',
  templateUrl: './nabil-loan-deed-company.component.html',
  styleUrls: ['./nabil-loan-deed-company.component.scss']
})
export class NabilLoanDeedCompanyComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  individualData;
  initialInfoPrint;
  offerLetterConst = NabilDocumentChecklist;
  form: FormGroup;
  ckEditorConfig = Editor.CK_CONFIG;


  constructor(
      private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.buildForm();
    console.log('cad data', this.cadData);
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(individualCadFile => {
        console.log(individualCadFile);
        if (individualCadFile.customerLoanId === this.customerLoanId && individualCadFile.cadDocument.id === this.documentId) {
          const initialInfo = JSON.parse(individualCadFile.initialInformation);
          this.initialInfoPrint = initialInfo;
        }
      });
    }
    this.setLoanDeedCompanyFormData(this.cadData);
  }

  private setLoanDeedCompanyFormData(cadData): void {
    if (!ObjectUtil.isEmpty(cadData)) {
      const data = JSON.parse(cadData.loanHolder.nepData);
      console.log(data);
      this.form.get('nameOfBranch').patchValue(data.branch.ct);
    }
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
