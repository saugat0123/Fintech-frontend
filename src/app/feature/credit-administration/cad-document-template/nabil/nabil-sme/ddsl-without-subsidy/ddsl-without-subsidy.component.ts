import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NabilOfferLetterConst} from '../../../../nabil-offer-letter-const';
import {NbDialogRef} from '@nebular/theme';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';

@Component({
  selector: 'app-ddsl-without-subsidy',
  templateUrl: './ddsl-without-subsidy.component.html',
  styleUrls: ['./ddsl-without-subsidy.component.scss']
})
export class DdslWithoutSubsidyComponent implements OnInit {
  @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
  @Input() preview;
  @Input() ddslData: any;
  @Input() renewal: any;
  @Input() loanLimit;
  form = FormGroup;
  offerLetterConst = NabilOfferLetterConst;
  initialInfoPrint;
  spinner = false;
  selectedSecurity;
  offerLetterData;
  constructor(
      private formBuilder: FormBuilder,
      private dialogRef: NbDialogRef<DdslWithoutSubsidyComponent>,
  ) { }

  ngOnInit() {
    this.buildForm();
  }
  private buildForm(): FormGroup {
    // @ts-ignore
    return this.form = this.formBuilder.group({
      referenceNo: [undefined],
      sanctionLetterDate: [undefined],
      borrowersName: [undefined],
      borrowerAddress: [undefined],
      customerLoanApplicationDate: [undefined],
      previousSanctionLetterDate: [undefined],
      requestLetterDate: [undefined],
      karjaPurpose: [undefined],
      loanAmount: [undefined],
      loanAmountInWord: [undefined],
      marginInPercentage1: [undefined],
      marginInPercentage2: [undefined],
      baseRate: [undefined],
      premiumRate: [undefined],
      totalInterestRate: [undefined],
      EMIAmount: [undefined],
      EMIAmountInWord: [undefined],
      totalNoOfInstallment: [undefined],
      nameOfFacility: [undefined],
      serviceCharge: [undefined],
      totalTenureOfLoan: [undefined],
      marginInPercentage3: [undefined],
      marginInPercentage4: [undefined],
      landOwnerName: [undefined],
      district: [undefined],
      municipalityVDC: [undefined],
      wardNo: [undefined],
      sheetNo: [undefined],
      plotNo: [undefined],
      area: [undefined],
      approvedCFRLoanAmount: [undefined],
      approvedCFRLoanAmountInWord: [undefined],
      approvedCFRPersonalGuarantor: [undefined],
      totalLimit: [undefined],
      totalLimitInWord: [undefined],
      nameOfBranch: [undefined],
      extraFinancialClause: [undefined],
      additionalOtherClause: [undefined],
      nameOfBranch1: [undefined],
      promissoryAmount: [undefined],
      supplementaryAmount: [undefined],
      powerOfAttorneyAmount: [undefined],
      loanDeedAmount: [undefined],
      mortgageDeedPlotNo: [undefined],
      personalGuaranteeAmount: [undefined],
      nameOfPersonalGuarantor: [undefined],
      extraSecurityDocument: [undefined],
      nameOfARO: [undefined],
      position: [undefined],
      nameOfBranch2: [undefined],
      nameOfBranchManager: [undefined],
      position1: [undefined],
      nameOfBranch3: [undefined],
      extraTermsAndConditionsNRB: [undefined],
      sanctionLetterAcceptedDate: [undefined],
      witnessDistrict: [undefined],
      witnessMuc: [undefined],
      witnessWardNo: [undefined],
      witnessName: [undefined],
      karmachariName: [undefined],
    });
  }

  close() {
    this.dialogRef.close();
  }

  submit() {}
}
