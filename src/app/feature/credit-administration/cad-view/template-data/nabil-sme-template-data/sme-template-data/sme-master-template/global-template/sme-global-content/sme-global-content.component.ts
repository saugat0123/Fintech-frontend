import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SbTranslateService} from '../../../../../../../../../@core/service/sbtranslate.service';
import {DatePipe} from '@angular/common';
import {ObjectUtil} from '../../../../../../../../../@core/utils/ObjectUtil';
import {EngToNepaliNumberPipe} from '../../../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {OfferDocument} from '../../../../../../../model/OfferDocument';
import {CurrencyFormatterPipe} from '../../../../../../../../../@core/pipe/currency-formatter.pipe';
import {EngNepDatePipe} from 'nepali-patro';

@Component({
  selector: 'app-sme-global-content',
  templateUrl: './sme-global-content.component.html',
  styleUrls: ['./sme-global-content.component.scss']
})
export class SmeGlobalContentComponent implements OnInit {
  @Input() isEdit = false;
  globalForm: FormGroup;
  translatedFormGroup: FormGroup;
  translatedValue: any;
  @Input() offerDocumentList: Array<OfferDocument>;
  initialInformation: any;
  loanOptions = [
      {value: 'New'},
      {value: 'Plain Renewal'},
      {value: 'Renewal with Enhancement or Additional Loan'},
      {value: 'Additional Loan'},
      {value: 'Other'},
  ];
  yesNoOptions = [
    {value: 'Yes'},
    {value: 'No'}
  ];
  mortgageType = [
    {value: 'New'},
    {value: 'Existing'},
    {value: 'Enhancement'}
  ];
  hypothecationType = [
    {value: 'New'},
    {value: 'Existing'}
  ];
  chargeType = [
    {value: 'For All Loan'},
    {value: 'For Specific Loan Only'},
  ];
  dateType = ['AD', 'BS'];
  interestRateType = [{value: 'Floating Interest Rate'}, {value: 'Fixed Interest Rate'}];
  loanSchemeType = [{value: 'Nabil Sajilo Karja'},
    {value: 'Nari Karja'},
    {value: 'Nabil Fast Track Scheme'},
    {value: 'Nabil Anniversary Scheme'}];
  loanSchemeSelected = false;
  loanOptionsSelected = false;
  changedServiceChargeType = [
    {value: 'Service Charge In Flat Amount'},
    {value: 'Service Charge In Percentage'}
  ];
  totalLimitInFigure;
  isARFinancing = false;
  hypothecationVisible = true;
  constructor(private formBuilder: FormBuilder,
              private translateService: SbTranslateService,
              private datePipe: DatePipe,
              public engToNepaliNumberPipe: EngToNepaliNumberPipe,
              public currencyWordPipe: NepaliCurrencyWordPipe,
              private currencyFormatter: CurrencyFormatterPipe,
              private engToNepaliDate: EngNepDatePipe) { }

  ngOnInit() {
    this.buildForm();
    if (this.isEdit) {
      if (this.offerDocumentList.length > 0) {
        this.offerDocumentList.forEach(offerLetter => {
          this.initialInformation = JSON.parse(offerLetter.initialInformation);
        });
      }
      if (!ObjectUtil.isEmpty(this.initialInformation)) {
        this.globalForm.patchValue(this.initialInformation.smeGlobalForm);
        const arFinancing = this.initialInformation.smeGlobalForm.arFinancing;
        if (!ObjectUtil.isEmpty(this.initialInformation.smeGlobalForm) && this.initialInformation.smeGlobalForm.arFinancing === true) {
          this.hypothecationVisible = false;
        }
            // Date Of Approval
        const dateOfApprovalType = this.initialInformation.smeGlobalForm.dateOfApprovalType;
        if (dateOfApprovalType === 'AD') {
          const dateOfApproval = this.initialInformation.smeGlobalForm.dateOfApproval;
          if (!ObjectUtil.isEmpty(dateOfApproval)) {
            this.globalForm.get('dateOfApproval').patchValue(new Date(dateOfApproval));
          }
        } else if (dateOfApprovalType === 'BS') {
          const dateOfApproval = this.initialInformation.smeGlobalForm.dateOfApprovalNepali;
          if (!ObjectUtil.isEmpty(dateOfApproval)) {
            this.globalForm.get('dateOfApprovalNepali').patchValue(dateOfApproval);
          }
        }
        // Loan Application Date
        const loanApplicationDataType = this.initialInformation.smeGlobalForm.loanApplicationDataType;
        if (loanApplicationDataType === 'AD') {
          const loanApplicationDate = this.initialInformation.smeGlobalForm.loanApplicationDate;
          if (!ObjectUtil.isEmpty(loanApplicationDate)) {
            this.globalForm.get('loanApplicationDate').patchValue(new Date(loanApplicationDate));
          }
        } else if (loanApplicationDataType === 'BS') {
          const loanApplicationDate = this.initialInformation.smeGlobalForm.loanApplicationDateNepali;
          if (!ObjectUtil.isEmpty(loanApplicationDate)) {
            this.globalForm.get('loanApplicationDateNepali').patchValue(loanApplicationDate);
          }
        }
        // Sanction Letter Date
        // Loan Application Date
        if (this.initialInformation.smeGlobalForm.loanOption === 'New') {
          this.loanOptionsSelected = true;
        }
        const previousSanctionType = this.initialInformation.smeGlobalForm.previousSanctionType;
        if (previousSanctionType === 'AD') {
          const sanctionLetterDate = this.initialInformation.smeGlobalForm.sanctionLetterDate;
          if (!ObjectUtil.isEmpty(sanctionLetterDate)) {
            this.globalForm.get('sanctionLetterDate').patchValue(new Date(sanctionLetterDate));
          }
        } else if (previousSanctionType === 'BS') {
          const sanctionLetterDate = this.initialInformation.smeGlobalForm.sanctionLetterDateNepali;
          if (!ObjectUtil.isEmpty(sanctionLetterDate)) {
            this.globalForm.get('sanctionLetterDateNepali').patchValue(sanctionLetterDate);
          }
        }
      }
    }
  }
  transformEnglishDate(date) {
    let transformedDate;
    let monthName;
    const dateArray = [];
    const splittedDate = date.split(' ');
    if (splittedDate[0] === 'Jan') {
      monthName = 'जनवरी';
    } else if (splittedDate[0] === 'Feb') {
      monthName = 'फेब्रुअरी';
    } else if (splittedDate[0] === 'Mar') {
      monthName = 'मार्च';
    } else if (splittedDate[0] === 'Apr') {
      monthName = 'अप्रिल';
    } else if (splittedDate[0] === 'May') {
      monthName = 'मे';
    } else if (splittedDate[0] === 'Jun') {
      monthName = 'जुन';
    } else if (splittedDate[0] === 'Jul') {
      monthName = 'जुलाई';
    } else if (splittedDate[0] === 'Aug') {
      monthName = 'अगष्ट';
    } else if (splittedDate[0] === 'Sep') {
      monthName = 'सेप्टेम्बर';
    } else if (splittedDate[0] === 'Oct') {
      monthName = 'अक्टुबर';
    } else if (splittedDate[0] === 'Nov') {
      monthName = 'नोभेम्बर';
    } else {
      monthName = 'डिसेम्बर';
    }
    dateArray.push(this.engToNepaliNumberPipe.transform(splittedDate[1].slice(0, -1)));
    dateArray.push(monthName + ',');
    dateArray.push(this.engToNepaliNumberPipe.transform(splittedDate[2]));
    transformedDate = dateArray.join(' ');
    return transformedDate;
  }
  private buildForm(): FormGroup {
    return this.globalForm = this.formBuilder.group({
      dateOfApprovalType: [undefined],
      loanApplicationDataType: [undefined],
      loanOption: [undefined],
      previousSanctionType: [undefined],
      subsidyOrAgricultureLoan: [undefined],
      mortgageType: [undefined],
      hypothecation: [undefined],
      borrowerNaturalPerson: [undefined],
      loanAmountAbove50Crore: [undefined],
      workingCapitalAbove25Crore: [undefined],
      loanScheme: [this.yesNoOptions[1].value],
      loanSchemeType: [undefined],
      interestRateType: [undefined],
      dateOfApproval: [undefined],
      dateOfApprovalTrans: [undefined],
      dateOfApprovalCT: [undefined],
      dateOfApprovalNepali: [undefined],
      dateOfApprovalNepaliTrans: [undefined],
      dateOfApprovalNepaliCT: [undefined],
      loanApplicationDate: [undefined],
      loanApplicationDateTrans: [undefined],
      loanApplicationDateCT: [undefined],
      loanApplicationDateNepali: [undefined],
      loanApplicationDateNepaliTrans: [undefined],
      loanApplicationDateNepaliCT: [undefined],
      sanctionLetterDate: [undefined],
      sanctionLetterDateTrans: [undefined],
      sanctionLetterDateCT: [undefined],
      sanctionLetterDateNepali: [undefined],
      sanctionLetterDateNepaliTrans: [undefined],
      sanctionLetterDateNepaliCT: [undefined],
      schemeInterestRate: [undefined],
      schemeInterestRateTrans: [undefined],
      schemeInterestRateCT: [undefined],
      serviceChargeType: [undefined],
      serviceChargeInFigure: [undefined],
      serviceChargeInFigureTrans: [undefined],
      serviceChargeInFigureCT: [undefined],
      serviceChargeInWords: [undefined],
      serviceChargeInWordsTrans: [undefined],
      serviceChargeInWordsCT: [undefined],
      detailOfFacility: [undefined],
      detailOfFacilityTrans: [undefined],
      detailOfFacilityCT: [undefined],
      serviceChargeInPercent: [undefined],
      serviceChargeInPercentTrans: [undefined],
      serviceChargeInPercentCT: [undefined],
      commitmentFee: [undefined],
      commitmentFeeTrans: [undefined],
      commitmentFeeCT: [undefined],
      totalFundedLimitInFigure: [undefined],
      totalFundedLimitInFigureTrans: [undefined],
      totalFundedLimitInFigureCT: [undefined],
      totalFundedLimitInWords: [undefined],
      totalFundedLimitInWordsTrans: [undefined],
      totalFundedLimitInWordsCT: [undefined],
      totalNonFundedLimitInFigure: [undefined],
      totalNonFundedLimitInFigureTrans: [undefined],
      totalNonFundedLimitInFigureCT: [undefined],
      totalNonFundedLimitInWords: [undefined],
      totalNonFundedLimitInWordsTrans: [undefined],
      totalNonFundedLimitInWordsCT: [undefined],
      totalLimitInFigure: [undefined],
      totalLimitInFigureTrans: [undefined],
      totalLimitInFigureCT: [undefined],
      totalLimitInWords: [undefined],
      totalLimitInWordsTrans: [undefined],
      totalLimitInWordsCT: [undefined],
      nameOfRelationshipManager: [undefined],
      nameOfRelationshipManagerTrans: [undefined],
      nameOfRelationshipManagerCT: [undefined],
      nameOfBranchManager: [undefined],
      nameOfBranchManagerTrans: [undefined],
      nameOfBranchManagerCT: [undefined],
      arFinancing: [undefined],
      arFinancingTrans: [undefined],
      arFinancingCT: [undefined]
    });
  }

  public async translateFormData() {

    // translating number field by number pipe
    const serviceChargeInFigure = this.globalForm.get('serviceChargeInFigure').value;
    if (!ObjectUtil.isEmpty(serviceChargeInFigure)) {
      this.globalForm.get('serviceChargeInFigureTrans').patchValue(this.engToNepaliNumberPipe.transform(this.currencyFormatter.transform(serviceChargeInFigure.toString())));
      this.globalForm.get('serviceChargeInFigureCT').patchValue(this.engToNepaliNumberPipe.transform(this.currencyFormatter.transform(serviceChargeInFigure.toString())));
    }

    const tempSchemeInterestRate = this.globalForm.get('schemeInterestRate').value;
    if (!ObjectUtil.isEmpty(tempSchemeInterestRate)) {
      this.globalForm.get('schemeInterestRateTrans').patchValue(this.engToNepaliNumberPipe.transform(tempSchemeInterestRate.toString()));
      this.globalForm.get('schemeInterestRateCT').patchValue(this.engToNepaliNumberPipe.transform(tempSchemeInterestRate.toString()));
    }

    const serviceChargeInPercent = this.globalForm.get('serviceChargeInPercent').value;
    if (!ObjectUtil.isEmpty(serviceChargeInPercent)) {
      this.globalForm.get('serviceChargeInPercentTrans').patchValue(this.engToNepaliNumberPipe.transform(serviceChargeInPercent.toString()));
      this.globalForm.get('serviceChargeInPercentCT').patchValue(this.engToNepaliNumberPipe.transform(serviceChargeInPercent.toString()));
    }

    const commitmentFee = this.globalForm.get('commitmentFee').value;
    if (!ObjectUtil.isEmpty(commitmentFee)) {
      this.globalForm.get('commitmentFeeTrans').patchValue(this.engToNepaliNumberPipe.transform(this.currencyFormatter.transform(commitmentFee.toString())));
      this.globalForm.get('commitmentFeeCT').patchValue(this.engToNepaliNumberPipe.transform(this.currencyFormatter.transform(commitmentFee.toString())));
    }

    const totalFundedLimitInFigure = this.globalForm.get('totalFundedLimitInFigure').value;
    if (!ObjectUtil.isEmpty(totalFundedLimitInFigure)) {
      this.globalForm.get('totalFundedLimitInFigureTrans').patchValue(this.engToNepaliNumberPipe.transform(this.currencyFormatter.transform(totalFundedLimitInFigure.toString())));
      this.globalForm.get('totalFundedLimitInFigureCT').patchValue(this.engToNepaliNumberPipe.transform(this.currencyFormatter.transform(totalFundedLimitInFigure.toString())));
    }

    const totalNonFundedLimitInFigure = this.globalForm.get('totalNonFundedLimitInFigure').value;
    if (!ObjectUtil.isEmpty(totalNonFundedLimitInFigure)) {
      this.globalForm.get('totalNonFundedLimitInFigureTrans').patchValue(this.engToNepaliNumberPipe.transform(this.currencyFormatter.transform(totalNonFundedLimitInFigure.toString())));
      this.globalForm.get('totalNonFundedLimitInFigureCT').patchValue(this.engToNepaliNumberPipe.transform(this.currencyFormatter.transform(totalNonFundedLimitInFigure.toString())));
    }

    this.totalLimitInFigure = totalFundedLimitInFigure + totalNonFundedLimitInFigure;
    const totalLimitInFigure = this.globalForm.get('totalLimitInFigure').value;
    if (!ObjectUtil.isEmpty(totalLimitInFigure)) {
      this.globalForm.get('totalLimitInFigure').patchValue(totalLimitInFigure);
      this.globalForm.get('totalLimitInFigureTrans').patchValue(this.engToNepaliNumberPipe.transform(this.currencyFormatter.transform(totalLimitInFigure.toString())));
      this.globalForm.get('totalLimitInFigureCT').patchValue(this.engToNepaliNumberPipe.transform(this.currencyFormatter.transform(totalLimitInFigure.toString())));
    } else {
      this.globalForm.get('totalLimitInFigure').patchValue(this.totalLimitInFigure);
      this.globalForm.get('totalLimitInFigureTrans').patchValue(this.engToNepaliNumberPipe.transform(this.currencyFormatter.transform(this.totalLimitInFigure.toString())));
      this.globalForm.get('totalLimitInFigureCT').patchValue(this.engToNepaliNumberPipe.transform(this.currencyFormatter.transform(this.totalLimitInFigure.toString())));
    }

    // set date field value
    let tempApprovalDate;
    const dateOfApprovalType = this.globalForm.get('dateOfApprovalType').value;
    if (dateOfApprovalType === 'AD') {
      const dateOfApproval = this.datePipe.transform(this.globalForm.get('dateOfApproval').value);
      tempApprovalDate = !ObjectUtil.isEmpty(dateOfApproval) ? this.datePipe.transform(dateOfApproval) : '';
      const finalExpDate = !ObjectUtil.isEmpty(tempApprovalDate) ? this.engToNepaliDate.transform(tempApprovalDate, true) : '';
      if (!ObjectUtil.isEmpty(dateOfApproval)) {
        this.globalForm.get('dateOfApprovalTrans').patchValue(finalExpDate);
        this.globalForm.get('dateOfApprovalCT').patchValue(finalExpDate);
      }
    } else if (dateOfApprovalType === 'BS') {
      const dateOfApproval = this.globalForm.get('dateOfApprovalNepali').value.nDate;
      if (!ObjectUtil.isEmpty(dateOfApproval)) {
        this.globalForm.get('dateOfApprovalTrans').patchValue(dateOfApproval);
        this.globalForm.get('dateOfApprovalCT').patchValue(dateOfApproval);
      }
    }
    const arFinancing = this.globalForm.get('arFinancing').value;
    if (!ObjectUtil.isEmpty(arFinancing)) {
      this.globalForm.get('arFinancingTrans').patchValue(arFinancing);
      this.globalForm.get('arFinancingCT').patchValue(arFinancing);
    }
    if (!ObjectUtil.isEmpty(serviceChargeInFigure)) {
      this.globalForm.get('serviceChargeInWords').patchValue(this.currencyWordPipe.transform(serviceChargeInFigure.toFixed(2)));
      this.globalForm.get('serviceChargeInWordsTrans').patchValue(this.currencyWordPipe.transform(serviceChargeInFigure.toFixed(2)));
      this.globalForm.get('serviceChargeInWordsCT').patchValue(this.currencyWordPipe.transform(serviceChargeInFigure.toFixed(2)));
    }
    if (!ObjectUtil.isEmpty(totalFundedLimitInFigure)) {
      this.globalForm.get('totalFundedLimitInWords').patchValue(this.currencyWordPipe.transform(totalFundedLimitInFigure.toFixed(2)));
      this.globalForm.get('totalFundedLimitInWordsTrans').patchValue(this.currencyWordPipe.transform(totalFundedLimitInFigure.toFixed(2)));
      this.globalForm.get('totalFundedLimitInWordsCT').patchValue(this.currencyWordPipe.transform(totalFundedLimitInFigure.toFixed(2)));
    }

    if (!ObjectUtil.isEmpty(totalNonFundedLimitInFigure)) {
      this.globalForm.get('totalNonFundedLimitInWords').patchValue(this.currencyWordPipe.transform(totalNonFundedLimitInFigure.toFixed(2)));
      this.globalForm.get('totalNonFundedLimitInWordsTrans').patchValue(this.currencyWordPipe.transform(totalNonFundedLimitInFigure.toFixed(2)));
      this.globalForm.get('totalNonFundedLimitInWordsCT').patchValue(this.currencyWordPipe.transform(totalNonFundedLimitInFigure.toFixed(2)));
    }

    if (!ObjectUtil.isEmpty(totalLimitInFigure)) {
      this.globalForm.get('totalLimitInWords').patchValue(this.currencyWordPipe.transform(totalLimitInFigure.toFixed(2)));
      this.globalForm.get('totalLimitInWordsTrans').patchValue(this.currencyWordPipe.transform(totalLimitInFigure.toFixed(2)));
      this.globalForm.get('totalLimitInWordsCT').patchValue(this.currencyWordPipe.transform(totalLimitInFigure.toFixed(2)));
    } else {
      this.globalForm.get('totalLimitInWords').patchValue(this.currencyWordPipe.transform(this.totalLimitInFigure));
      this.globalForm.get('totalLimitInWordsTrans').patchValue(this.currencyWordPipe.transform(this.totalLimitInFigure));
      this.globalForm.get('totalLimitInWordsCT').patchValue(this.currencyWordPipe.transform(this.totalLimitInFigure));
    }
    let tempExpDate;
    const loanApplicationDataType = this.globalForm.get('loanApplicationDataType').value;
    if (loanApplicationDataType === 'AD') {
      const loanApplicationDate = this.datePipe.transform(this.globalForm.get('loanApplicationDate').value);
      tempExpDate = !ObjectUtil.isEmpty(loanApplicationDate) ? this.datePipe.transform(loanApplicationDate) : '';
      const finalExpDate = this.transformEnglishDate(tempExpDate);
      if (!ObjectUtil.isEmpty(finalExpDate)) {
        this.globalForm.get('loanApplicationDateTrans').patchValue(finalExpDate);
        this.globalForm.get('loanApplicationDateCT').patchValue(finalExpDate);
      }
    } else if (loanApplicationDataType === 'BS') {
      const loanApplicationDate = this.globalForm.get('loanApplicationDateNepali').value.nDate;
      if (!ObjectUtil.isEmpty(loanApplicationDate)) {
        this.globalForm.get('loanApplicationDateTrans').patchValue(loanApplicationDate);
        this.globalForm.get('loanApplicationDateCT').patchValue(loanApplicationDate);
      }
    }
    let tempPreviousSanctionDate;
    const previousSanctionType = this.globalForm.get('previousSanctionType').value;
    if (previousSanctionType === 'AD') {
      const previousSanctionDate = this.datePipe.transform(this.globalForm.get('sanctionLetterDate').value);
      tempPreviousSanctionDate = !ObjectUtil.isEmpty(previousSanctionDate) ? this.datePipe.transform(previousSanctionDate) : '';
      const finalExpDate = this.transformEnglishDate(tempPreviousSanctionDate);
      if (!ObjectUtil.isEmpty(previousSanctionDate)) {
        this.globalForm.get('sanctionLetterDateTrans').patchValue(finalExpDate);
        this.globalForm.get('sanctionLetterDateCT').patchValue(finalExpDate);
      }
    } else if (previousSanctionType === 'BS') {
      const previousSanctionDate = this.globalForm.get('sanctionLetterDateNepali').value.nDate;
      if (!ObjectUtil.isEmpty(previousSanctionType)) {
        this.globalForm.get('sanctionLetterDateTrans').patchValue(previousSanctionDate);
        this.globalForm.get('sanctionLetterDateCT').patchValue(previousSanctionDate);
      }
    }

    // translated by google api
    this.translatedFormGroup = this.formBuilder.group({
      detailOfFacility: this.globalForm.get('detailOfFacility').value,
      nameOfRelationshipManager: this.globalForm.get('nameOfRelationshipManager').value,
      nameOfBranchManager: this.globalForm.get('nameOfBranchManager').value,
    });

    this.translatedValue =  await this.translateService.translateForm(this.translatedFormGroup);

    this.globalForm.get('detailOfFacilityTrans').patchValue(this.translatedValue.detailOfFacility);
    this.globalForm.get('detailOfFacilityCT').patchValue(this.translatedValue.detailOfFacility);

    this.globalForm.get('nameOfRelationshipManagerTrans').patchValue(this.translatedValue.nameOfRelationshipManager);
    this.globalForm.get('nameOfRelationshipManagerCT').patchValue(this.translatedValue.nameOfRelationshipManager);

    this.globalForm.get('nameOfBranchManagerTrans').patchValue(this.translatedValue.nameOfBranchManager);
    this.globalForm.get('nameOfBranchManagerCT').patchValue(this.translatedValue.nameOfBranchManager);
  }

  /* For Clearing the fields based on chosen options */
  selectedServiceCharge(selectedVal) {
    if (selectedVal === this.changedServiceChargeType[0].value) {
      this.clearForm('detailOfFacility', true);
      this.clearForm('serviceChargeInPercent', true);
    } else {
      this.clearForm('serviceChargeInFigure', true);
      this.clearForm('serviceChargeInWords', true);
    }
  }

  /* For selected loan Scheme*/
  checkLoanScheme(data) {
    this.loanSchemeSelected = data === 'Yes';
  }

  checkSelectedOptions(data) {
    this.loanOptionsSelected = data === 'New';
  }

  clearForm(controls, option?: boolean) {
    this.globalForm.get(controls).setValue(null);
    if (option) {
      this.globalForm.get(controls + 'Trans').setValue(null);
      this.globalForm.get(controls + 'CT').setValue(null);
    }
  }

  checkARFinancing(data) {
    this.isARFinancing = data;
    this.globalForm.get('arFinancing').patchValue(this.isARFinancing);
    if (this.isARFinancing === false) {
      this.globalForm.get('borrowerNaturalPerson').patchValue('No');
    }
  }

  toggleShow() {
    this.hypothecationVisible = ! this.hypothecationVisible;
  }

}
