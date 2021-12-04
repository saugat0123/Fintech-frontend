import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../model/customerApprovedLoanCadDocumentation';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';
import {SmeGlobalContentComponent} from './global-template/sme-global-content/sme-global-content.component';
import {IrrevocableLetterOfCreditFacilityComponent} from './sme-loan-type/irrevocable-letter-of-credit-facility/irrevocable-letter-of-credit-facility.component';
import {CreditAdministrationService} from '../../../../../service/credit-administration.service';
import {Alert, AlertType} from '../../../../../../../@theme/model/Alert';
import {ToastService} from '../../../../../../../@core/utils';
import {OfferDocument} from '../../../../../model/OfferDocument';
import {NabilOfferLetterConst} from '../../../../../nabil-offer-letter-const';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {CombinedOfferLetterComponent} from '../../../../../cad-document-template/nabil/nabil-sme/combined-offer-letter/combined-offer-letter.component';
import {CustomerAcceptanceForTimeLetterOfCreditComponent} from './sme-loan-type/customer-acceptance-for-time-letter-of-credit/customer-acceptance-for-time-letter-of-credit.component';
import {ImportBillsDiscountingComponent} from './sme-loan-type/import-bills-discounting/import-bills-discounting.component';
import {ImportLoanTrustReceiptLoanComponent} from './sme-loan-type/import-loan-trust-receipt-loan/import-loan-trust-receipt-loan.component';
import {RevolvingShortTermLoanComponent} from './sme-loan-type/revolving-short-term-loan/revolving-short-term-loan.component';
import {DemandLoanForWorkingCapitalComponent} from './sme-loan-type/demand-loan-for-working-capital/demand-loan-for-working-capital.component';
import {PreExportLoanComponent} from './sme-loan-type/pre-export-loan/pre-export-loan.component';
import {DocumentaryBillPurchaseNegotiationComponent} from './sme-loan-type/documentary-bill-purchase-negotiation/documentary-bill-purchase-negotiation.component';
import {OverdraftLoanForWorkingCapitalRequirementComponent} from './sme-loan-type/overdraft-loan-for-working-capital-requirement/overdraft-loan-for-working-capital-requirement.component';
import {EquityMortgagedOverdraftComponent} from './sme-loan-type/equity-mortgaged-overdraft/equity-mortgaged-overdraft.component';
import {OverdraftFacilityAgainstFixedDepositComponent} from './sme-loan-type/overdraft-facility-against-fixed-deposit/overdraft-facility-against-fixed-deposit.component';
import {OverdraftFacilityAgainstBondComponent} from './sme-loan-type/overdraft-facility-against-bond/overdraft-facility-against-bond.component';
import {BridgeGapLoanComponent} from './sme-loan-type/bridge-gap-loan/bridge-gap-loan.component';
import {TermLoanToOrForComponent} from './sme-loan-type/term-loan-to-or-for/term-loan-to-or-for.component';
import {MortgageOrEquityMortgageTermLoanComponent} from './sme-loan-type/mortgage-or-equity-mortgage-term-loan/mortgage-or-equity-mortgage-term-loan.component';
import {AutoLoanMasterComponent} from './sme-loan-type/auto-loan-master/auto-loan-master.component';
import {BankGuaranteeComponent} from './sme-loan-type/bank-guarantee/bank-guarantee.component';
import {BillPurchaseComponent} from './sme-loan-type/bill-purchase/bill-purchase.component';

@Component({
  selector: 'app-sme-master-template',
  templateUrl: './sme-master-template.component.html',
  styleUrls: ['./sme-master-template.component.scss']
})
export class SmeMasterTemplateComponent implements OnInit {
  @Input() customerApprovedDoc: CustomerApprovedLoanCadDocumentation;
  loanData = [];
  @ViewChild('smeGlobalContent', {static: false}) smeGlobalContent: SmeGlobalContentComponent;
  @ViewChild('irrevocableLetterOfCreditFacility', {static: false})
  irrevocableLetterOfCreditFacility: IrrevocableLetterOfCreditFacilityComponent;
  @ViewChild('customerAcceptanceForTimeLetterOfCreditComponent', {static: false})
  customerAcceptanceForTimeLetterOfCreditComponent: CustomerAcceptanceForTimeLetterOfCreditComponent;
  @ViewChild('billsDiscountingComponent', {static: false})
  importBillsDiscountingComponent: ImportBillsDiscountingComponent;
  @ViewChild('importLoanTrustReceiptLoanComponent', {static: false})
  importLoanTrustReceiptLoanComponent: ImportLoanTrustReceiptLoanComponent;
  @ViewChild('revolvingShortTermLoanComponent', {static: false})
  revolvingShortTermLoanComponent: RevolvingShortTermLoanComponent;
  @ViewChild('demandLoanForWorkingCapitalComponent', {static: false})
  demandLoanForWorkingCapitalComponent: DemandLoanForWorkingCapitalComponent;
  @ViewChild('preExportLoanComponent', {static: false})
  preExportLoanComponent: PreExportLoanComponent;
  @ViewChild('billPurchaseNegotiationComponent', {static: false})
  documentaryBillPurchaseNegotiationComponent: DocumentaryBillPurchaseNegotiationComponent;
  @ViewChild('overdraftLoanForWorkingCapitalRequirementComponent', {static: false})
  overdraftLoanForWorkingCapitalRequirementComponent: OverdraftLoanForWorkingCapitalRequirementComponent;
  @ViewChild('equityMortgagedOverdraftComponent', {static: false})
  equityMortgagedOverdraftComponent: EquityMortgagedOverdraftComponent;
  @ViewChild('overdraftFacilityAgainstFixedDepositComponent', {static: false})
  overdraftFacilityAgainstFixedDepositComponent: OverdraftFacilityAgainstFixedDepositComponent;
  @ViewChild('overdraftFacilityAgainstBondComponent', {static: false})
  overdraftFacilityAgainstBondComponent: OverdraftFacilityAgainstBondComponent;
  @ViewChild('bridgeGapLoanComponent', {static: false})
  bridgeGapLoanComponent: BridgeGapLoanComponent;
  @ViewChild('termLoanToOrForComponent', {static: false})
  termLoanToOrForComponent: TermLoanToOrForComponent;
  @ViewChild('mortgageOrEquityMortgageTermLoanComponent', {static: false})
  mortgageOrEquityMortgageTermLoanComponent: MortgageOrEquityMortgageTermLoanComponent;
  @ViewChild('autoLoanMasterComponent', {static: false})
  autoLoanMasterComponent: AutoLoanMasterComponent;
  @ViewChild('bankGuaranteeComponent', {static: false})
  bankGuaranteeComponent: BankGuaranteeComponent;
  @ViewChild('billPurchaseComponent', {static: false})
  billPurchaseComponent: BillPurchaseComponent;

  offerLetterConst = NabilOfferLetterConst;

  spinner = false;
  disableBtn = false;
  dialogRef: NbDialogRef<any>;

  constructor(private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private nbDialogueService: NbDialogService) { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.customerApprovedDoc)) {
      this.getLoanName();
    }
  }

  getLoanName() {
    this.customerApprovedDoc.assignedLoan.forEach(val => {
      const loanName = val.loan.name;
      this.loanData.push(loanName);
    });
  }

  onSubmit() {
    this.spinner = true;
    this.customerApprovedDoc.docStatus = 'OFFER_AND_LEGAL_PENDING';
    const offerDocument = new OfferDocument();
    offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.COMBINED_LETTER);
    // object for loan type
    const smeMasterForm = {
      smeGlobalForm: this.smeGlobalContent.globalForm.value,
      letterOfCreditForm: this.irrevocableLetterOfCreditFacility.letterOfCreditForm.value,
      timeLetterCreditForm: this.customerAcceptanceForTimeLetterOfCreditComponent.timeLetterCreditForm.value,
      importBillsDiscountForm: this.importBillsDiscountingComponent.importBillsDiscountForm.value,
      importTrustForm: this.importLoanTrustReceiptLoanComponent.importLoanTrust.value,
      revolvingShortTermForm: this.revolvingShortTermLoanComponent.revolvingShortTermLoan.value,
      demandLoanForm: this.demandLoanForWorkingCapitalComponent.demandLoanForm.value,
      preExportForm: this.preExportLoanComponent.preExportForm.value,
      documentaryBillPurchaseForm: this.documentaryBillPurchaseNegotiationComponent.documentaryBillPurchase.value,
      overdraftLoanForm: this.overdraftLoanForWorkingCapitalRequirementComponent.overdraftLoanForm.value,
      equityMortgageForm: this.equityMortgagedOverdraftComponent.equityMortgaged.value,
      overdraftFixedForm: this.overdraftFacilityAgainstFixedDepositComponent.overdraftFixedForm.value,
      overDraftFacilityForm: this.overdraftFacilityAgainstBondComponent.overDraftFacilityForm.value,
      bridgeGapLoanForm: this.bridgeGapLoanComponent.bridgeGapLoan.value,
      termLoanForm: this.termLoanToOrForComponent.termLoanForm.value,
      mortgageEquityTermForm: this.mortgageOrEquityMortgageTermLoanComponent.mortgageEquityTermForm.value,
      // autoLoanMasterForm: this.autoLoanMasterComponent.autoLoanMasterForm,
      bankGuaranteeForm: this.bankGuaranteeComponent.bankGuarantee.value,
      billPurchaseForm: this.billPurchaseComponent.billPurchasecomponent.value,
    };

    offerDocument.initialInformation = JSON.stringify(smeMasterForm);
    this.customerApprovedDoc.offerDocumentList.push(offerDocument);


    this.administrationService.saveCadDocumentBulk(this.customerApprovedDoc).subscribe((res: any) => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
      this.customerApprovedDoc = res.detail;
      this.spinner = false;
      this.disableBtn = true;
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
      this.spinner = false;
    });
  }

  public openCombinedOfferLetter() {
    this.dialogRef = this.nbDialogueService.open(CombinedOfferLetterComponent, {
      hasScroll: true,
      dialogClass: 'model-full'
    });
  }

}
