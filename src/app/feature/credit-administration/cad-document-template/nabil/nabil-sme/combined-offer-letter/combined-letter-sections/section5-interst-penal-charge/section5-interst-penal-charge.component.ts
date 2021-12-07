import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from "../../../../../../../../@core/utils/ObjectUtil";

@Component({
  selector: 'app-section5-interst-penal-charge',
  templateUrl: './section5-interst-penal-charge.component.html',
  styleUrls: ['./section5-interst-penal-charge.component.scss']
})
export class Section5InterstPenalChargeComponent implements OnInit {
  @Input() cadOfferLetterApprovedDoc;
  section5: FormGroup;
  tempData: any;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc)) {
      this.tempData = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);
      this.fillForm();
    }
  }
  buildForm() {
    this.section5 = this.formBuilder.group({
      interestRate: [undefined],
      /*securities: this.formBuilder.array([]),
      freeTextVal : [undefined],*/
      serviceChargeInFigure: [undefined],
      serviceChargeInWords: [undefined],
      detailsOfFacility: [undefined],
      serviceChargeInPercentage: [undefined],
    });
  }

  fillForm() {
    this.section5.patchValue({
      serviceChargeInFigure: this.tempData.smeGlobalForm.serviceChargeInFigureCT ? this.tempData.smeGlobalForm.serviceChargeInFigureCT : '',
      serviceChargeInWords: this.tempData.smeGlobalForm.serviceChargeInWordsCT ? this.tempData.smeGlobalForm.serviceChargeInWordsCT : '',
      detailsOfFacility: this.tempData.smeGlobalForm.detailOfFacilityCT ? this.tempData.smeGlobalForm.detailOfFacilityCT : '',
      serviceChargeInPercentage: this.tempData.smeGlobalForm.serviceChargeInPercentCT ? this.tempData.smeGlobalForm.serviceChargeInPercentCT : '',
    });
  }
}
