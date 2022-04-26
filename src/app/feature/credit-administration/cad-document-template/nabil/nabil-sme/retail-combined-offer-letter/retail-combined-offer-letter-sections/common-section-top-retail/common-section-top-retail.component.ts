import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-common-section-top-retail',
  templateUrl: './common-section-top-retail.component.html',
  styleUrls: ['./common-section-top-retail.component.scss']
})
export class CommonSectionTopRetailComponent implements OnInit {
  @Input() cadData;
  form: FormGroup;
  tempData;
  assignedData;
  sanctionDate;
  loanHolderInfo;
  constructor(
      private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList)) {
      this.tempData = JSON.parse(this.cadData.offerDocumentList[0].initialInformation);
      this.loanHolderInfo = JSON.parse(this.cadData.loanHolder.nepData);
    }
    this.fillform();
  }
  buildForm() {
    return this.form = this.formBuilder.group({
      referenceNumber: [undefined],
      sanctionLetterDate: [undefined],
      nameOfBorrower: [undefined],
      addressOfBorrower: [undefined],
    });
  }
  fillform() {
    let refNum;
    if (!ObjectUtil.isEmpty(this.cadData.assignedLoan)) {
      this.assignedData = this.cadData.assignedLoan[0];
      refNum = this.assignedData.refNo;
    }
    let sanctionLetterDate;
    if (!ObjectUtil.isEmpty(this.tempData.retailGlobalForm)) {
      this.sanctionDate = this.tempData.retailGlobalForm.sanctionLetterDateNepali.nDate ?
      this.tempData.retailGlobalForm.sanctionLetterDateNepali.nDate : '';
      sanctionLetterDate = this.sanctionDate ? this.sanctionDate : '';
    }
    const address = this.loanHolderInfo.permanentMunicipality.ct + '-' +
        this.loanHolderInfo.permanentWard.ct + ', ' + this.loanHolderInfo.permanentDistrict.ct + ', ' +
        this.loanHolderInfo.permanentProvince.ct + ' प्रदेश ';
    this.form.patchValue({
      referenceNumber: refNum ? refNum : '',
      sanctionLetterDate: sanctionLetterDate ? sanctionLetterDate : '',
      nameOfBorrower : this.loanHolderInfo.name ? this.loanHolderInfo.name.np : '',
      addressOfBorrower : address ? address : '',
    });
  }
}
