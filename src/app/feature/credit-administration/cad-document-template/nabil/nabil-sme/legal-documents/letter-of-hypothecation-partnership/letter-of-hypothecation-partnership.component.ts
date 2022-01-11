import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from "../../../../../model/customerApprovedLoanCadDocumentation";
import {ObjectUtil} from "../../../../../../../@core/utils/ObjectUtil";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-letter-of-hypothecation-partnership',
  templateUrl: './letter-of-hypothecation-partnership.component.html',
  styleUrls: ['./letter-of-hypothecation-partnership.component.scss']
})
export class LetterOfHypothecationPartnershipComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  letterOfHypothecationPartner: FormGroup;
  loanHolderNepData: any;
  offerDocumentDetails: any;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.loadData();
    this.buildForm();
  }


  loadData() {
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.assignedLoan)) {
      this.loanHolderNepData = this.cadData.loanHolder.nepData
          ? JSON.parse(this.cadData.loanHolder.nepData)
          : this.cadData.loanHolder.nepData;
      if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList) && this.cadData.offerDocumentList.length !== 0) {
        this.offerDocumentDetails = JSON.parse(this.cadData.offerDocumentList[0].initialInformation);
      }
    }
  }

  buildForm() {
    this.letterOfHypothecationPartner = this.formBuilder.group({
      branch: [this.loanHolderNepData.branch ? this.loanHolderNepData.branch.ct : ''],
      districtOfFirm: [this.loanHolderNepData.registeredDistrict ? this.loanHolderNepData.registeredDistrict.ct : ''],
      vdcMunicipality: [this.loanHolderNepData.registeredMunicipality ? this.loanHolderNepData.registeredMunicipality.ct : ''],
      wardNumber: [this.loanHolderNepData.permanentWard ? this.loanHolderNepData.permanentWard.ct : ''],
      streetNumber: [this.loanHolderNepData.registeredStreetTole ? this.loanHolderNepData.registeredStreetTole.ct : ''],
      borrowerName: [this.loanHolderNepData.name ? this.loanHolderNepData.name.ct : ''],
    })
  }

}
