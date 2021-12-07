import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from "../../../../../../../../@core/utils/ObjectUtil";

@Component({
  selector: 'app-section4-loan-limit',
  templateUrl: './section4-loan-limit.component.html',
  styleUrls: ['./section4-loan-limit.component.scss']
})
export class Section4LoanLimitComponent implements OnInit {
  @Input() cadOfferLetterApprovedDoc;
  section2: FormGroup;
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
    this.section2 = this.formBuilder.group({
      totalFundedLimitInFigure: [undefined],
      /*securities: this.formBuilder.array([]),
      freeTextVal : [undefined],*/
      totalFundedLimitInWords: [undefined],
      totalNonFundedLimitInFigure: [undefined],
      totalNonFundedLimitInWords: [undefined],
      totalLimitInFigure: [undefined],
      totalLimitInWords: [undefined],
    });
  }
  
  fillForm() {
    this.section2.patchValue({
      totalFundedLimitInFigure: this.tempData.smeGlobalForm.totalFundedLimitInFigureCT ? this.tempData.smeGlobalForm.totalFundedLimitInFigureCT : '',
      totalFundedLimitInWords: this.tempData.smeGlobalForm.totalFundedLimitInWordsCT ? this.tempData.smeGlobalForm.totalFundedLimitInWordsCT : '',
      totalNonFundedLimitInFigure: this.tempData.smeGlobalForm.totalNonFundedLimitInFigureCT ? this.tempData.smeGlobalForm.totalNonFundedLimitInFigureCT : '',
      totalNonFundedLimitInWords: this.tempData.smeGlobalForm.totalNonFundedLimitInWordsCT ? this.tempData.smeGlobalForm.totalNonFundedLimitInWordsCT : '',
      totalLimitInFigure: this.tempData.smeGlobalForm.totalLimitInFigureCT ? this.tempData.smeGlobalForm.totalLimitInFigureCT : '',
      totalLimitInWords: this.tempData.smeGlobalForm.totalLimitInWordsCT ? this.tempData.smeGlobalForm.totalLimitInWordsCT : '',
    })
  }
}
