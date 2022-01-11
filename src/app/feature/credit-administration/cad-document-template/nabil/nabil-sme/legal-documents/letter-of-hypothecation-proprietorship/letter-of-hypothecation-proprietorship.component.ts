import { Component, OnInit, Input } from '@angular/core';
import { CustomerApprovedLoanCadDocumentation} from "../../../../../model/customerApprovedLoanCadDocumentation";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ObjectUtil} from "../../../../../../../@core/utils/ObjectUtil";

@Component({
  selector: 'app-letter-of-hypothecation-proprietorship',
  templateUrl: './letter-of-hypothecation-proprietorship.component.html',
  styleUrls: ['./letter-of-hypothecation-proprietorship.component.scss']
})
export class LetterOfHypothecationProprietorshipComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  letterOfHypothecationProprietor: FormGroup;
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
    this.letterOfHypothecationProprietor = this.formBuilder.group({
      branch: [this.loanHolderNepData.branch ? this.loanHolderNepData.branch.ct : ''],
      districtOfFirm: [this.loanHolderNepData.registeredDistrict ? this.loanHolderNepData.registeredDistrict.ct : ''],
      vdcMunicipality: [this.loanHolderNepData.registeredMunicipality ? this.loanHolderNepData.registeredMunicipality.ct : ''],
      wardNumber: [this.loanHolderNepData.permanentWard ? this.loanHolderNepData.permanentWard.ct : ''],
      streetNumber: [this.loanHolderNepData.registeredStreetTole ? this.loanHolderNepData.registeredStreetTole.ct : ''],
      borrowerName: [this.loanHolderNepData.name ? this.loanHolderNepData.name.ct : ''],
    })
  }

}
