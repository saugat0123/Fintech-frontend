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
import {LoanNameConstant} from '../../sme-costant/loan-name-constant';
import {SmeSecurityComponent} from './sme-security/sme-security.component';
import {RequiredLegalDocumentSectionComponent} from './required-legal-document-section/required-legal-document-section.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Attributes} from '../../../../../../../@core/model/attributes';

@Component({
  selector: 'app-sme-master-template',
  templateUrl: './sme-master-template.component.html',
  styleUrls: ['./sme-master-template.component.scss']
})
export class SmeMasterTemplateComponent implements OnInit {
  @Input() customerApprovedDoc: CustomerApprovedLoanCadDocumentation;
  @Input() offerDocumentList: any;
  @Input() initialInformation: any;
  @Input() isEdit = false;
  loanData = [];
  @ViewChild('smeGlobalContent', {static: false}) smeGlobalContent: SmeGlobalContentComponent;
  @ViewChild('irrevocableLetterOfCreditFacility', {static: false})
  irrevocableLetterOfCreditFacility: IrrevocableLetterOfCreditFacilityComponent;
  @ViewChild('customerAcceptanceLetterOfCredit', {static: false})
  customerAcceptanceLetterOfCredit: CustomerAcceptanceForTimeLetterOfCreditComponent;
  @ViewChild('importBillsDiscounting', {static: false}) importBillsDiscounting: ImportBillsDiscountingComponent;
  @ViewChild('importLoanTrustReceiptLoan', {static: false}) importLoanTrustReceiptLoan: ImportLoanTrustReceiptLoanComponent;
  @ViewChild('revolvingShortTermLoan', {static: false}) revolvingShortTermLoan: RevolvingShortTermLoanComponent;
  @ViewChild('demandLoanForWorkingCapital', {static: false}) demandLoanForWorkingCapital: DemandLoanForWorkingCapitalComponent;
  @ViewChild('preExportLoan', {static: false}) preExportLoan: PreExportLoanComponent;
  @ViewChild('documentaryBillPurchaseNegotiation', {static: false}) documentaryBillPurchaseNegotiation:
      DocumentaryBillPurchaseNegotiationComponent;
  @ViewChild('overdraftLoanForWorkingCapitalRequirement', {static: false}) overdraftLoanForWorkingCapitalRequirement:
      OverdraftLoanForWorkingCapitalRequirementComponent;
  @ViewChild('equityMortgagedOverdraft', {static: false}) equityMortgagedOverdraft: EquityMortgagedOverdraftComponent;
  @ViewChild('overdraftFacilityAgainstFixedDeposit', {static: false}) overdraftFacilityAgainstFixedDeposit:
      OverdraftFacilityAgainstFixedDepositComponent;
  @ViewChild('overdraftFacilityAgainstBond', {static: false}) overdraftFacilityAgainstBond: OverdraftFacilityAgainstBondComponent;
  @ViewChild('bridgeGapLoan', {static: false}) bridgeGapLoan: BridgeGapLoanComponent;
  @ViewChild('termLoanToOrFor', {static: false}) termLoanToOrFor: TermLoanToOrForComponent;
  @ViewChild('mortgageOrEquityMortgageTermLoanComponent', {static: false})
  mortgageOrEquityMortgageTermLoanComponent: MortgageOrEquityMortgageTermLoanComponent;
  @ViewChild('autoLoanMasterComponent', {static: false})
  autoLoanMasterComponent: AutoLoanMasterComponent;
  @ViewChild('bankGuaranteeComponent', {static: false})
  bankGuaranteeComponent: BankGuaranteeComponent;
  @ViewChild('billPurchaseComponent', {static: false})
  billPurchaseComponent: BillPurchaseComponent;
  @ViewChild('masterSecurity', {static: false})
  smeSecurityComponent: SmeSecurityComponent;
  @ViewChild('requiredLegalDocumentSectionComponent', {static: false})
  requiredLegalDocumentSectionComponent: RequiredLegalDocumentSectionComponent;

  offerLetterConst = NabilOfferLetterConst;

  spinner = false;
  disableBtn = false;
  dialogRef: NbDialogRef<any>;
  isCustomerAcceptance = false;
  isIrrevocableLetter = false;
  isBillDiscounting = false;
  isLoanTrustReceiptLoan = false;
  isRevolvingShortTermLoan = false;
  isDemandLoanWorkingCapital = false;
  isPreExportLoan = false;
  isDocumentaryBillPurchase = false;
  isOverdraftLoanWorkingCapital = false;
  isEquityMortgageOverdraft = false;
  isOverDraftFacilityFixedDeposit = false;
  isOverdraftFacilityAgainstBond = false;
  isBridgeGapLoan = false;
  isTermLoanToOrFor = false;
  isEquityMortgageTermLoan = false;
  isAutoLoanMaster = false;
  isBankGuarantee = false;
  isBillPurchase = false;
  loanExtraDetails = [];
  offerLetterDocument: OfferDocument;
  existingOfferLetter = false;
  attributes;
  tdValues: any = {};

  constructor(private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private nbDialogueService: NbDialogService,
              private modalService: NgbModal,
              private modalDialogRef: NbDialogRef<SmeMasterTemplateComponent>,
              public nbDialogRef: NbDialogRef<SmeMasterTemplateComponent>) { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.customerApprovedDoc)) {
      this.getLoanName();
      this.checkLoanName();
    }
  }

  getLoanName() {
    const tempTotalLimit = {name: 'TOTAL LIMIT', loanAmount: 0};
    this.loanExtraDetails.push(tempTotalLimit);
    this.customerApprovedDoc.assignedLoan.forEach(val => {
      const loanName = val.loan.name;
      this.loanData.push(loanName);
      const tempStructure = {
        name: loanName,
        loanAmount: val.proposal.proposedLimit,
      };
      this.loanExtraDetails.push(tempStructure);
    });
  }

  private checkLoanName(): void {
    if (this.loanData.length > 0) {
      this.loanData.forEach(v => {
        if (v === LoanNameConstant.CUSTOMER_ACCEPTANCE_FOR_TIME_LETTER_OF_CREDIT) {
            this.isCustomerAcceptance = true;
        }
        if (v === LoanNameConstant.IRREVOCABLE_LETTER_OF_CREDIT_FACILITY) {
            this.isIrrevocableLetter = true;
        }
        if (v === LoanNameConstant.IMPORT_BILLS_DISCOUNTING) {
          this.isBillDiscounting = true;
        }
        if (v === LoanNameConstant.IMPORT_LOAN_TRUST_RECEIPT_LOAN) {
          this.isLoanTrustReceiptLoan = true;
        }
        if (v === LoanNameConstant.SHORT_TERM_LOAN) {
          this.isRevolvingShortTermLoan = true;
        }
        if (v === LoanNameConstant.DEMAND_LOAN_FOR_WORKING_CAPITAL) {
          this.isDemandLoanWorkingCapital = true;
        }
        if (v === LoanNameConstant.PRE_EXPORT_LOAN) {
          this.isPreExportLoan = true;
        }
        if (v === LoanNameConstant.DOCUMENTARY_BILL_PURCHASE_NEGOTIATION) {
          this.isDocumentaryBillPurchase = true;
        }
        if (v === LoanNameConstant.OVERDRAFT_LOAN_FOR_WORKING_CAPITAL_REQUIREMENT) {
          this.isOverdraftLoanWorkingCapital = true;
        }
        if (v === LoanNameConstant.MORTGAGE_OVERDRAFT || v === LoanNameConstant.EQUITY_MORTGAGED_OVERDRAFT) {
          this.isEquityMortgageOverdraft = true;
        }
        if (v === LoanNameConstant.OVERDRAFT_FACILITY_FIXED_DEPOSIT || v === LoanNameConstant.OVERDRAFT_FACILITY_LIEN_ON_DEPOSIT_ACCOUNT ||
            v === LoanNameConstant.STL_AGAINST_FIXED_DEPOSIT || v === LoanNameConstant.STL_LIEN_ON_DEPOSIT_ACCOUNT ||
            v === LoanNameConstant.DL_AGAINST_FIXED_DEPOSIT || v === LoanNameConstant.DL_LIEN_ON_DEPOSIT_ACCOUNT) {
            this.isOverDraftFacilityFixedDeposit = true;
        }
        if (v === LoanNameConstant.OVERDRAFT_FACILITY_AGAINST_BOND || v === LoanNameConstant.STL_FACILITY_AGAINST_BOND ||
            v === LoanNameConstant.DL_FACILITY_AGAINST_BOND) {
            this.isOverdraftFacilityAgainstBond = true;
        }
        if (v === LoanNameConstant.BRIDGE_GAP_LOAN) {
          this.isBridgeGapLoan = true;
        }
        if (v === LoanNameConstant.TERM_LOAN_TO_FOR_PURCHASE_OF_VEHICLE) {
            this.isTermLoanToOrFor = true;
        }
        if (v === LoanNameConstant.MORTGAGE_TERM_LOAN || v === LoanNameConstant.EQUITY_MORTGAGE_TERM_LOAN) {
          this.isEquityMortgageTermLoan = true;
        }
        if (v === LoanNameConstant.AUTO_LOAN) {
          this.isAutoLoanMaster = true;
        }
        if (v === LoanNameConstant.BANK_GUARANTEE) {
          this.isBankGuarantee = true;
        }
        if (v === LoanNameConstant.BILLS_PURCHASE) {
          this.isBillPurchase = true;
        }
      });
    }
  }

  onSubmit() {
    this.spinner = true;
    this.customerApprovedDoc.docStatus = 'OFFER_AND_LEGAL_PENDING';

    if (this.isEdit) {
      if (this.customerApprovedDoc.offerDocumentList.length > 0) {
        this.offerLetterDocument = this.customerApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
            === this.offerLetterConst.value(this.offerLetterConst.COMBINED_LETTER).toString())[0];
        if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
          this.existingOfferLetter = true;
        }
      }
      if (this.existingOfferLetter) {
        console.log('Existing is true:');
        this.customerApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
          if (offerLetterPath.docName.toString() ===
              this.offerLetterConst.value(this.offerLetterConst.COMBINED_LETTER).toString()) {
            offerLetterPath.initialInformation = this.getLoanTemplateFormValue();
          }
        });
      }
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.COMBINED_LETTER);
      // loan template form value
      offerDocument.initialInformation = this.getLoanTemplateFormValue();
      this.customerApprovedDoc.offerDocumentList.push(offerDocument);
    }

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
  private getLoanTemplateFormValue(): string {
    const smeGlobalForm = this.smeGlobalContent.globalForm.value;
    let letterOfCreditForm;
    if (this.isIrrevocableLetter) {
      letterOfCreditForm = this.irrevocableLetterOfCreditFacility.letterOfCreditForm.value;
    }
    let timeLetterCreditForm;
    if (this.isCustomerAcceptance) {
      timeLetterCreditForm = this.customerAcceptanceLetterOfCredit.timeLetterCreditForm.value;
    }
    let importBillsDiscountForm;
    if (this.isBillDiscounting) {
      importBillsDiscountForm = this.importBillsDiscounting.importBillsDiscountForm.value;
    }
    let importLoanTrust;
    if (this.isLoanTrustReceiptLoan) {
      importLoanTrust = this.importLoanTrustReceiptLoan.importLoanTrust.value;
    }
    let revolvingShortTermLoan;
    if (this.isRevolvingShortTermLoan) {
      revolvingShortTermLoan = this.revolvingShortTermLoan.revolvingShortTermLoan.value;
    }
    let demandLoanForm;
    if (this.isDemandLoanWorkingCapital) {
      demandLoanForm = this.demandLoanForWorkingCapital.demandLoanForm.value;
    }
    let preExportForm;
    if (this.isPreExportLoan) {
      preExportForm = this.preExportLoan.preExportForm.value;
    }
    let documentaryBillPurchase;
    if (this.isDocumentaryBillPurchase) {
      documentaryBillPurchase = this.documentaryBillPurchaseNegotiation.documentaryBillPurchase.value;
    }
    let overdraftLoanForm;
    if (this.isOverdraftLoanWorkingCapital) {
      overdraftLoanForm = this.overdraftLoanForWorkingCapitalRequirement.overdraftLoanForm.value;
    }
    let equityMortgaged;
    if (this.isEquityMortgageOverdraft) {
      equityMortgaged = this.equityMortgagedOverdraft.equityMortgaged.value;
    }
    let overdraftFixedForm;
    if (this.isOverDraftFacilityFixedDeposit) {
      overdraftFixedForm = this.overdraftFacilityAgainstFixedDeposit.overdraftFixedForm.value;
    }
    let overDraftFacilityForm;
    if (this.isOverdraftFacilityAgainstBond) {
      overDraftFacilityForm = this.overdraftFacilityAgainstBond.overDraftFacilityForm.value;
    }
    let bridgeGapLoan;
    if (this.isBridgeGapLoan) {
      bridgeGapLoan = this.bridgeGapLoan.bridgeGapLoan.value;
    }
    let termLoanForm;
    if (this.isTermLoanToOrFor) {
      termLoanForm = this.termLoanToOrFor.termLoanForm.value;
    }
    let mortgageEquityTermForm;
    if (this.isEquityMortgageTermLoan) {
      mortgageEquityTermForm = this.mortgageOrEquityMortgageTermLoanComponent.mortgageEquityTermForm.value;
    }
    let autoLoanMasterForm;
    if (this.isAutoLoanMaster) {
      autoLoanMasterForm = this.autoLoanMasterComponent.autoLoanMasterForm.value;
    }
    let bankGuarantee;
    if (this.isBankGuarantee) {
      bankGuarantee = this.bankGuaranteeComponent.bankGuarantee.value;
    }
    let billPurchaseForm;
    if (this.isBillPurchase) {
      billPurchaseForm = this.billPurchaseComponent.billPurchaseForm.value;
    }

    const securityData = this.smeSecurityComponent.setSecurityData();
    let securityForm;
    if (!ObjectUtil.isEmpty(securityData)) {
      securityForm = securityData;
    }

    const requiredLegalDocument = this.requiredLegalDocumentSectionComponent.requireDocumentForm.value;

    const smeMasterForm = {
      smeGlobalForm: smeGlobalForm,
      letterOfCreditForm: letterOfCreditForm,
      timeLetterCreditForm: timeLetterCreditForm,
      importBillsDiscountForm: importBillsDiscountForm,
      importLoanTrust: importLoanTrust,
      revolvingShortTermLoan: revolvingShortTermLoan,
      demandLoanForm: demandLoanForm,
      preExportForm: preExportForm,
      documentaryBillPurchase: documentaryBillPurchase,
      overdraftLoanForm: overdraftLoanForm,
      equityMortgaged: equityMortgaged,
      overdraftFixedForm: overdraftFixedForm,
      overDraftFacilityForm: overDraftFacilityForm,
      bridgeGapLoan: bridgeGapLoan,
      termLoanForm: termLoanForm,
      mortgageEquityTermForm: mortgageEquityTermForm,
      autoLoanMasterForm: autoLoanMasterForm,
      bankGuarantee: bankGuarantee,
      billPurchaseForm: billPurchaseForm,
      securities: securityForm,
      requiredLegalDocument: requiredLegalDocument,
    };
    return JSON.stringify(smeMasterForm);
  }

  public openCombinedOfferLetter() {
    this.dialogRef = this.nbDialogueService.open(CombinedOfferLetterComponent, {
      hasScroll: true,
      dialogClass: 'model-full',
      context: {
        customerApprovedDoc: this.customerApprovedDoc
      }
    });
  }

  dismiss(template) {
    this.modalService.dismissAll();
  }

  openCloseTemplate(template) {
    this.modalService.open(template);
  }

  decline(template) {
    this.modalService.dismissAll();
  }

  accept() {
    this.modalService.dismissAll();
    this.modalDialogRef.close();
  }

}
