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
      this.form.get('actName').patchValue(data.actName.ct);
      this.form.get('actYearInFigure').patchValue(data.actYear.ct);
      this.form.get('authorizedBody').patchValue(data.authorizedBodyName.ct);
      this.form.get('headSectionDepartment').patchValue(data.registeredWith.ct);
      this.form.get('registrationDate').patchValue(data.registrationDate.np);
      this.form.get('registrationNo').patchValue(data.registrationNo.ct);
    }
  }

  private buildForm(): FormGroup {
    return this.form = this.formBuilder.group({
      nameOfBranch: [undefined],
      actName: [undefined],
      actYearInFigure: [undefined],
      authorizedBody: [undefined],
      headSectionDepartment: [undefined],
      registrationDate: [undefined],
      registrationNo: [undefined],
      companyName: [undefined],
      nameOfAuthorizePerson: [undefined],
      nameOfGrandSon: [undefined],
      nameOfGrandDaughter: [undefined],
      nameOfDaughterInLaw: [undefined],
      nameOfSon: [undefined],
      nameOfDaughter: [undefined],
      nameOfWife: [undefined],
      districtOfAuthPerson: [undefined],
      vdcMunicipalityOfAuth: [undefined],
      municipality: [undefined],
      VDC: [undefined],
      gaupalika: [undefined],
      wardNo: [undefined],
      ageOfAuthPerson: [undefined],
      nameOfAuthPerson: [undefined],
      purposeOfLoan: [undefined],
      sanctionLetterIssueDate: [undefined],
      givenAuthorityPerson: [undefined],
      totalLoanAmountInFigure: [undefined],
      totalLoanAmountInWord: [undefined],
      districtOfWitness: [undefined],
      municipalityVDC: [undefined],
      wardNoOfWitness: [undefined],
      ageOfWitness: [undefined],
      nameOfWitness: [undefined],
      nameOfBank: [undefined],
      yearInFigure: [undefined],
      year: [undefined],
      month: [undefined],
      days: [undefined],
      freeText: [undefined],
      collateral: [undefined],
    });
  }

}
