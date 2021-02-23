import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CreditChecklistView} from '../../loan/model/creditChecklistView';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {CalendarType} from '../../../@core/model/calendar-type';
import {CustomerType} from '../../customer/model/customerType';

@Component({
  selector: 'app-credit-checklist-view',
  templateUrl: './credit-checklist-view.component.html',
  styleUrls: ['./credit-checklist-view.component.scss']
})
export class CreditChecklistViewComponent implements OnInit {
  @Output() creditChecklistViewEmitter = new EventEmitter();
  @Input() formData: CreditChecklistView;
  @Input() fromProfile;
  @Input() calendarType: CalendarType;
  @Input() customerType: CustomerType;

  formGroupCheckList: FormGroup;
  dataForEdit;
  creditChecklistView: CreditChecklistView = new CreditChecklistView();
  optionList = ['Yes', 'No', 'Na'];
  optionListRegulatory = ['Yes', 'No'];

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.formData)) {
      this.creditChecklistView = this.formData;
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
    });
  }

  creditViewYesToAll() {
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

  submitForm() {
    this.creditChecklistView.data = JSON.stringify(this.formGroupCheckList.value);
    this.creditChecklistViewEmitter.emit(this.creditChecklistView);
    console.log(this.formGroupCheckList.value);
  }
}
