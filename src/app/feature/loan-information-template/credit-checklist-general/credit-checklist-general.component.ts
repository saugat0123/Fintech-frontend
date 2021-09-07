import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CreditChecklistGeneral} from '../../loan/model/creditChecklistGeneral';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {CalendarType} from '../../../@core/model/calendar-type';
import {CustomerType} from '../../customer/model/customerType';
import {Clients} from '../../../../environments/Clients';
import {environment} from '../../../../environments/environment';
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-credit-checklist-general',
  templateUrl: './credit-checklist-general.component.html',
  styleUrls: ['./credit-checklist-general.component.scss']
})
export class CreditChecklistGeneralComponent implements OnInit {
  @Output() creditChecklistGeneralEmitter = new EventEmitter();
  @Input() formData: CreditChecklistGeneral;
  @Input() fromProfile;
  @Input() calendarType: CalendarType;
  @Input() customerType: CustomerType;
  @Input()

  formGroupCheckList: FormGroup;
  dataForEdit;
  creditChecklistGeneral: CreditChecklistGeneral = new CreditChecklistGeneral();
  optionList = ['Yes', 'No', 'Na'];
  optionListRegulatory = ['Yes', 'No'];

  constructor(private formBuilder: FormBuilder,
              private overlay: NgxSpinnerService) {
  }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.formData)) {
      this.creditChecklistGeneral = this.formData;
      this.dataForEdit = JSON.parse(this.formData.data);
    }
    this.buildForm(this.dataForEdit);
  }

  buildForm(data) {
    this.formGroupCheckList = this.formBuilder.group({
      dateCheckList: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.isEmpty(data.dateCheckList)
          ? undefined : new Date(data.dateCheckList)],
      permit: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.permit)],
      permitRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.permitRemark)],
      clearance: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.clearance)],
      clearanceRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.clearanceRemark)],
      noProposal: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.noProposal)],
      noProposalRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.noProposalRemark)],
      audit: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.audit)],
      auditRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.auditRemark)],
      copies: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.copies)],
      copiesRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.copiesRemark)],
      verification: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.verification)],
      verificationRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.verificationRemark)],
      valuation: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.valuation)],
      valuationRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.valuationRemark)],
      dateValuation: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.isEmpty(data.dateValuation)
          ? undefined : new Date(data.dateValuation)],
      assets: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.assets)],
      assetsRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.assetsRemark)],
      callReportMonth: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.callReportMonth)],
      callReportDate: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.isEmpty(data.callReportDate)
          ? undefined : new Date(data.callReportDate)],
      callReportIrregularityReport: [ObjectUtil.isEmpty(data) ? undefined
          : ObjectUtil.setUndefinedIfNull(data.callReportIrregularityReport)],
      callReport: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.callReport)],
      callReportRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.callReportRemark)],
      director: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.director)],
      directorRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.directorRemark)],
      bankPost: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.bankPost)],
      bankPostRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.bankPostRemark)],
      share: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.share)],
      shareRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.shareRemark)],
      guarantor: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.guarantor)],
      guarantorRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.guarantorRemark)],
      promoter: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.promoter)],
      promoterRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.promoterRemark)],
      shareOfBank: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.shareOfBank)],
      shareOfBankRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.shareOfBankRemark)],
      guarantorOfBank: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.guarantorOfBank)],
      guarantorOfBankRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.guarantorOfBankRemark)],
      financialInterest: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.financialInterest)],
      financialInterestRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.financialInterestRemark)],
      collateral: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.collateral)],
      collateralRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.collateralRemark)],
      votingRight: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.votingRight)],
      votingRightRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.votingRightRemark)],
      bankName: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.bankName)],
      selfDeclaration: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.selfDeclaration)],
      applicantPG: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.applicantPG)],
      netWorth: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.netWorth)],
      consentObtained: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.consentObtained)],
      directorUndivided: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.directorUndivided)],
      borrowingFirmCompany: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.borrowingFirmCompany)],
      borrowerPromoter: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.borrowerPromoter)],
      selfDeclarationRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.selfDeclarationRemark)],
      applicantPGRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.applicantPGRemark)],
      netWorthRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.netWorthRemark)],
      consentObtainedRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.consentObtainedRemark)],
      directorUndividedRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.directorUndividedRemark)],
      borrowingFirmCompanyRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.borrowingFirmCompanyRemark)],
      borrowerPromoterRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.borrowerPromoterRemark)],
      information: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.information)],
      informationRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.informationRemark)],
      form: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.form)],
      formRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.formRemark)],
      kyc: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.kyc)],
      AMLRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.AMLRemark)],
      operators: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.operators)],
      document: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.document)],
      nature: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.nature)],
      audited: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.audited)],
      financial: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.financial)],
      business: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.business)],
      customer: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.customer)],
      loan: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.loan)],
      settled: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.settled)],
      payment: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.payment)],
      identified: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.identified)],
      risk: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.risk)],
      enhanced: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.enhanced)],
      PEP: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.PEP)],
      diligence: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.diligence)],
      CIC: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.CIC)],
      rating: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.rating)],
      transaction: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.transaction)],
      transactionRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.transactionRemark)],
      ratingRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.ratingRemark)],
      CICRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.CICRemark)],
      diligenceRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.diligenceRemark)],
      PEPRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.PEPRemark)],
      enhancedRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.enhancedRemark)],
      riskRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.riskRemark)],
      identifiedRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.identifiedRemark)],
      paymentRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.paymentRemark)],
      settledRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.settledRemark)],
      loanRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.loanRemark)],
      customerRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.customerRemark)],
      businessRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.businessRemark)],
      financialRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.financialRemark)],
      natureRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.natureRemark)],
      documentRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.documentRemark)],
      operatorsRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.operatorsRemark)],
      kycRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.kycRemark)],

    });
  }

  creditGeneralYesToAll() {
    this.formGroupCheckList.get('permit').patchValue('Yes');
    this.formGroupCheckList.get('clearance').patchValue('Yes');
    this.formGroupCheckList.get('noProposal').patchValue('Yes');
    this.formGroupCheckList.get('audit').patchValue('Yes');
    this.formGroupCheckList.get('copies').patchValue('Yes');
    this.formGroupCheckList.get('verification').patchValue('Yes');
    this.formGroupCheckList.get('valuation').patchValue('Yes');
    this.formGroupCheckList.get('assets').patchValue('Yes');
    this.formGroupCheckList.get('callReport').patchValue('Yes');
    this.formGroupCheckList.get('selfDeclaration').patchValue('Yes');
    this.formGroupCheckList.get('applicantPG').patchValue('Yes');
    this.formGroupCheckList.get('netWorth').patchValue('Yes');
    this.formGroupCheckList.get('consentObtained').patchValue('Yes');
    this.formGroupCheckList.get('directorUndivided').patchValue('Yes');
    this.formGroupCheckList.get('borrowingFirmCompany').patchValue('Yes');
    this.formGroupCheckList.get('borrowerPromoter').patchValue('Yes');
  }

  directiveKaYesAll() {
    this.formGroupCheckList.get('director').patchValue('Yes');
    this.formGroupCheckList.get('bankPost').patchValue('Yes');
    this.formGroupCheckList.get('share').patchValue('Yes');
    this.formGroupCheckList.get('guarantor').patchValue('Yes');
  }

  directiveKhaYesAll() {
    this.formGroupCheckList.get('promoter').patchValue('Yes');
    this.formGroupCheckList.get('shareOfBank').patchValue('Yes');
    this.formGroupCheckList.get('guarantorOfBank').patchValue('Yes');
    this.formGroupCheckList.get('financialInterest').patchValue('Yes');
    this.formGroupCheckList.get('collateral').patchValue('Yes');
    this.formGroupCheckList.get('votingRight').patchValue('Yes');

  }
  AMLYesAll() {
    this.formGroupCheckList.get('information').patchValue('Yes');
    this.formGroupCheckList.get('form').patchValue('Yes');
    this.formGroupCheckList.get('kyc').patchValue('Yes');
    this.formGroupCheckList.get('operators').patchValue('Yes');
    this.formGroupCheckList.get('document').patchValue('Yes');
    this.formGroupCheckList.get('nature').patchValue('Yes');
    this.formGroupCheckList.get('audited').patchValue('Yes');
    this.formGroupCheckList.get('financial').patchValue('Yes');
    this.formGroupCheckList.get('business').patchValue('Yes');
    this.formGroupCheckList.get('customer').patchValue('Yes');
    this.formGroupCheckList.get('loan').patchValue('Yes');
    this.formGroupCheckList.get('settled').patchValue('Yes');
    this.formGroupCheckList.get('payment').patchValue('Yes');
    this.formGroupCheckList.get('identified').patchValue('Yes');

    this.formGroupCheckList.get('risk').patchValue('Yes');
    this.formGroupCheckList.get('enhanced').patchValue('Yes');
    this.formGroupCheckList.get('PEP').patchValue('Yes');
    this.formGroupCheckList.get('diligence').patchValue('Yes');
    this.formGroupCheckList.get('CIC').patchValue('Yes');
    this.formGroupCheckList.get('rating').patchValue('Yes');
    this.formGroupCheckList.get('transaction').patchValue('Yes');

  }

  submitForm() {
    this.overlay.show();
    this.creditChecklistGeneral.data = JSON.stringify(this.formGroupCheckList.value);
    this.creditChecklistGeneralEmitter.emit(this.creditChecklistGeneral);
  }
}
