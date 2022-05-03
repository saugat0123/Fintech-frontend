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
      this.freeInformation = JSON.parse(this.cadData.offerDocumentList[0].supportedInformation);
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder)) {
      this.loanHolderInfo = JSON.parse(this.cadData.loanHolder.nepData);
      this.initialInfo = JSON.parse(this.cadData.offerDocumentList[0].initialInformation);
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
      freeText5: [undefined]
    });
  }
  fillForm() {
    this.form.patchValue({
      branchName: this.loanHolderInfo.branch ? this.loanHolderInfo.branch.ct : '',
      nameOfARO_RO_RM_ARM: this.initialInfo.retailGlobalForm.nameOfRelationshipManagerCT ?
          this.initialInfo.retailGlobalForm.nameOfRelationshipManagerCT : '',
      nameOfBranchManager: this.initialInfo.retailGlobalForm.nameOfBranchManagerCT ? this.initialInfo.retailGlobalForm.nameOfBranchManagerCT : '',
      position : !ObjectUtil.isEmpty(this.freeInformation) ? this.freeInformation.position : this.position ,
      position1 : !ObjectUtil.isEmpty(this.freeInformation) ? this.freeInformation.position1 : this.position1,
      sakshiDistrict1: !ObjectUtil.isEmpty(this.freeInformation) ? this.freeInformation.sakshiDistrict1 : '',
      sakshiMunicipality1: !ObjectUtil.isEmpty(this.freeInformation) ? this.freeInformation.sakshiMunicipality1 : '',
      sakshiWard1: !ObjectUtil.isEmpty(this.freeInformation) ? this.freeInformation.sakshiWard1 : '',
      sakshiAge1: !ObjectUtil.isEmpty(this.freeInformation) ? this.freeInformation.sakshiAge1 : '',
      sakshiName1: !ObjectUtil.isEmpty(this.freeInformation) ? this.freeInformation.sakshiName1 : '',
      sakshiDistrict2: !ObjectUtil.isEmpty(this.freeInformation) ? this.freeInformation.sakshiDistrict2 : '',
      sakshiMunicipality2: !ObjectUtil.isEmpty(this.freeInformation) ? this.freeInformation.sakshiMunicipality2 : '',
      sakshiWard2: !ObjectUtil.isEmpty(this.freeInformation) ? this.freeInformation.sakshiWard2 : '',
      sakshiAge2: !ObjectUtil.isEmpty(this.freeInformation) ? this.freeInformation.sakshiAge2 : '',
      sakshiName2: !ObjectUtil.isEmpty(this.freeInformation) ? this.freeInformation.sakshiName2 : '',
      nameOfBankStaff: !ObjectUtil.isEmpty(this.freeInformation) ? this.freeInformation.nameOfBankStaff : '',
      freeText1: !ObjectUtil.isEmpty(this.freeInformation) ? this.freeInformation.freeText1 : '',
      freeText2: !ObjectUtil.isEmpty(this.freeInformation) ? this.freeInformation.freeText2 : '',
      freeText3: !ObjectUtil.isEmpty(this.freeInformation) ? this.freeInformation.freeText3 : '',
      freeText4: !ObjectUtil.isEmpty(this.freeInformation) ? this.freeInformation.freeText4 : '',
      freeText5: !ObjectUtil.isEmpty(this.freeInformation) ? this.freeInformation.freeText5 : '',
    });
  }
}
