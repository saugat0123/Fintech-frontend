import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-section19-to-section22',
  templateUrl: './section19-to-section22.component.html',
  styleUrls: ['./section19-to-section22.component.scss']
})
export class Section19ToSection22Component implements OnInit {
  @Input() cadData;
  form: FormGroup;
  freeInformation: any;
  loanHolderInfo;
  initialInfo;
  position = 'सम्पर्क अधिकृत';
  position1 = 'सम्पर्क प्रबन्धक';
  constructor(
      private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadData)) {
      if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList)) {
        if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList[0].supportedInformation)) {
          this.freeInformation = JSON.parse(this.cadData.offerDocumentList[0].supportedInformation);
        }
        if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList[0].initialInformation)) {
          this.initialInfo = JSON.parse(this.cadData.offerDocumentList[0].initialInformation);
        }
      }
      if (!ObjectUtil.isEmpty(this.cadData.loanHolder)) {
        this.loanHolderInfo = JSON.parse(this.cadData.loanHolder.nepData);
      }
    }
    this.fillForm();
  }
  buildForm() {
    return this.form = this.formBuilder.group({
      nameOfARO_RO_RM_ARM: [undefined],
      position: [undefined],
      branchName: [undefined],
      nameOfBranchManager: [undefined],
      position1: [undefined],
      sakshiDistrict1: [undefined],
      sakshiMunicipality1: [undefined],
      sakshiWard1: [undefined],
      sakshiAge1: [undefined],
      sakshiName1: [undefined],
      sakshiDistrict2: [undefined],
      sakshiMunicipality2: [undefined],
      sakshiWard2: [undefined],
      sakshiAge2: [undefined],
      sakshiName2: [undefined],
      nameOfBankStaff: [undefined],
      freeText1: [undefined],
      freeText2: [undefined],
      freeText3: [undefined],
      freeText4: [undefined],
      freeText5: [undefined],
      additionalClauseChecked: [false],
    });
  }
  fillForm() {
    this.form.get('position').patchValue(this.position);
    this.form.get('position1').patchValue(this.position1);
    this.form.patchValue({
      branchName: !ObjectUtil.isEmpty(this.loanHolderInfo) &&
                  !ObjectUtil.isEmpty(this.loanHolderInfo.branch) &&
                  !ObjectUtil.isEmpty(this.loanHolderInfo.branch.ct) ? this.loanHolderInfo.branch.ct : '',
      nameOfARO_RO_RM_ARM: !ObjectUtil.isEmpty(this.initialInfo) &&
                            !ObjectUtil.isEmpty(this.initialInfo.retailGlobalForm) &&
                            !ObjectUtil.isEmpty(this.initialInfo.retailGlobalForm.nameOfRelationshipManagerCT) ?
                            this.initialInfo.retailGlobalForm.nameOfRelationshipManagerCT : '',
      nameOfBranchManager: !ObjectUtil.isEmpty(this.initialInfo) &&
                            !ObjectUtil.isEmpty(this.initialInfo.retailGlobalForm) &&
                            !ObjectUtil.isEmpty(this.initialInfo.retailGlobalForm.nameOfBranchManagerCT) ?
                            this.initialInfo.retailGlobalForm.nameOfBranchManagerCT : ''
    });
    if (!ObjectUtil.isEmpty(this.freeInformation) &&
    !ObjectUtil.isEmpty(this.freeInformation.section22)) {
      this.form.patchValue({
        position : !ObjectUtil.isEmpty(this.freeInformation.section22.position) ? this.freeInformation.section22.position : this.position ,
        position1 : !ObjectUtil.isEmpty(this.freeInformation.section22.position1) ? this.freeInformation.section22.position1 : this.position1,
        sakshiDistrict1: !ObjectUtil.isEmpty(this.freeInformation.section22.sakshiDistrict1) ? this.freeInformation.section22.sakshiDistrict1 : '',
        sakshiMunicipality1: !ObjectUtil.isEmpty(this.freeInformation.section22.sakshiMunicipality1) ? this.freeInformation.section22.sakshiMunicipality1 : '',
        sakshiWard1: !ObjectUtil.isEmpty(this.freeInformation.section22.sakshiWard1) ? this.freeInformation.section22.sakshiWard1 : '',
        sakshiAge1: !ObjectUtil.isEmpty(this.freeInformation.section22.sakshiAge1) ? this.freeInformation.section22.sakshiAge1 : '',
        sakshiName1: !ObjectUtil.isEmpty(this.freeInformation.section22.sakshiName1) ? this.freeInformation.section22.sakshiName1 : '',
        sakshiDistrict2: !ObjectUtil.isEmpty(this.freeInformation.section22.sakshiDistrict2) ? this.freeInformation.section22.sakshiDistrict2 : '',
        sakshiMunicipality2: !ObjectUtil.isEmpty(this.freeInformation.section22.sakshiMunicipality2) ? this.freeInformation.section22.sakshiMunicipality2 : '',
        sakshiWard2: !ObjectUtil.isEmpty(this.freeInformation.section22.sakshiWard2) ? this.freeInformation.section22.sakshiWard2 : '',
        sakshiAge2: !ObjectUtil.isEmpty(this.freeInformation.section22.sakshiAge2) ? this.freeInformation.section22.sakshiAge2 : '',
        sakshiName2: !ObjectUtil.isEmpty(this.freeInformation.section22.sakshiName2) ? this.freeInformation.section22.sakshiName2 : '',
        nameOfBankStaff: !ObjectUtil.isEmpty(this.freeInformation.section22.nameOfBankStaff) ? this.freeInformation.section22.nameOfBankStaff : '',
        freeText1: !ObjectUtil.isEmpty(this.freeInformation.section22.freeText1) ? this.freeInformation.section22.freeText1 : '',
        freeText2: !ObjectUtil.isEmpty(this.freeInformation.section22.freeText2) ? this.freeInformation.section22.freeText2 : '',
        freeText3: !ObjectUtil.isEmpty(this.freeInformation.section22.freeText3) ? this.freeInformation.section22.freeText3 : '',
        freeText4: !ObjectUtil.isEmpty(this.freeInformation.section22.freeText4) ? this.freeInformation.section22.freeText4 : '',
        freeText5: !ObjectUtil.isEmpty(this.freeInformation.section22.freeText5) ? this.freeInformation.section22.freeText5 : '',
        additionalClauseChecked: !ObjectUtil.isEmpty(this.freeInformation.section22.additionalClauseChecked) ?
            this.freeInformation.section22.additionalClauseChecked : '',
      });
    }
  }
  showAdditionalClauseCheck(data) {
    console.log('Show Additional Clause for Corporate agreement based Loan?', data);
  }
}
