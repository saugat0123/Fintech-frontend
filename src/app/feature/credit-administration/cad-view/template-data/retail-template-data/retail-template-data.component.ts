import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {
  SmeGlobalContentComponent
} from '../nabil-sme-template-data/sme-template-data/sme-master-template/global-template/sme-global-content/sme-global-content.component';
import {
  IrrevocableLetterOfCreditFacilityComponent
} from '../nabil-sme-template-data/sme-template-data/sme-master-template/sme-loan-type/irrevocable-letter-of-credit-facility/irrevocable-letter-of-credit-facility.component';
import {
  RequiredLegalDocumentSectionComponent
} from '../nabil-sme-template-data/sme-template-data/sme-master-template/required-legal-document-section/required-legal-document-section.component';
import {NabilOfferLetterConst} from '../../../nabil-offer-letter-const';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {ToastService} from '../../../../../@core/utils';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {
  CombinedOfferLetterComponent
} from '../../../cad-document-template/nabil/nabil-sme/combined-offer-letter/combined-offer-letter.component';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {LoanNameConstant} from '../nabil-sme-template-data/sme-costant/loan-name-constant';
import {OfferDocument} from '../../../model/OfferDocument';
import {PersonalLoanTemplateDataComponent} from '../personal-loan-template-data/personal-loan-template-data.component';
import {RetailGlobalContentComponent} from './retail-global-content/retail-global-content.component';
import {
  PersonalLoanCombinedTemplateDataComponent
} from './personal-loan-combined-template-data/personal-loan-combined-template-data.component';
import {
  PersonalOverdraftCombinedTemplateDataComponent
} from './personal-overdraft-combined-template-data/personal-overdraft-combined-template-data.component';
import {
  EducationLoanCombinedTemplateDataComponent
} from './education-loan-combined-template-data/education-loan-combined-template-data.component';
import {
  MortgageLoanCombinedTemplateDataComponent
} from './mortgage-loan-combined-template-data/mortgage-loan-combined-template-data.component';
import {
  RetailCombinedOfferLetterComponent
} from '../../../cad-document-template/nabil/nabil-sme/retail-combined-offer-letter/retail-combined-offer-letter.component';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {SmeSecurityComponent} from '../nabil-sme-template-data/sme-template-data/sme-master-template/sme-security/sme-security.component';
import {AutoLoanCombinedTemplateDataComponent} from './auto-loan-combined-template-data/auto-loan-combined-template-data.component';
import {HomeLoanCombinedTemplateDataComponent} from './home-loan-combined-template-data/home-loan-combined-template-data.component';
import {NabilSahayatriKarjaCombinedComponent} from './nabil-sahayatri-karja-combined/nabil-sahayatri-karja-combined.component';
import {PersonalOverdraftWithoutCollateralCombinedTemplateDataComponent} from './personal-overdraft-without-collateral-combined-template-data/personal-overdraft-without-collateral-combined-template-data.component';
import {RetailMasterSecurityComponent} from './retail-master-security/retail-master-security.component';
import {NabilShareLoanPodTemplateDataComponent} from './nabil-share-loan-pod-template-data/nabil-share-loan-pod-template-data.component';
import {ShareLoanDemandTemplateDataComponent} from './share-loan-demand-template-data/share-loan-demand-template-data.component';
import {RetailCombinedRequiredDocumentComponent} from './retail-combined-required-document/retail-combined-required-document.component';
import {ExistingLoanTemplateDataComponent} from './existing-loan-template-data/existing-loan-template-data.component';

@Component({
  selector: 'app-retail-template-data',
  templateUrl: './retail-template-data.component.html',
  styleUrls: ['./retail-template-data.component.scss']
})
export class RetailTemplateDataComponent implements OnInit {
  @Input() customerApprovedDoc: CustomerApprovedLoanCadDocumentation;
  @Input() offerDocumentList: any;
  @Input() initialInformation: any;
  @Input() isEdit = false;
  @ViewChild('retailGlobalContent', {static: false}) retailGlobalContent: RetailGlobalContentComponent;
  @ViewChild('existingLoanContent', {static: false}) existingLoanContent: ExistingLoanTemplateDataComponent;
  @ViewChild('personalLoanCombined', {static: false})
  personalLoanCombined: PersonalLoanCombinedTemplateDataComponent;
  @ViewChild('personalOverdraftCombined', {static: false})
  personalOverdraftCombined: PersonalOverdraftCombinedTemplateDataComponent;
  @ViewChild('educationLoanCombined', {static: false})
  educationLoanCombined: EducationLoanCombinedTemplateDataComponent;
  @ViewChild('mortgageLoanCombined', {static: false})
  mortgageLoanCombined: MortgageLoanCombinedTemplateDataComponent;
  @ViewChild('autoLoanCombined', {static: false})
  autoLoanCombined: AutoLoanCombinedTemplateDataComponent;
  @ViewChild('homeLoanCombined', {static: false})
  homeLoanCombined: HomeLoanCombinedTemplateDataComponent;
  @ViewChild('sahayatriCombined', {static: false})
  sahayatriCombined: NabilSahayatriKarjaCombinedComponent;
  @ViewChild('personalOverDraftWithoutCollateralCombined', {static: false})
  personalOverDraftWithoutCollateralCombined: PersonalOverdraftWithoutCollateralCombinedTemplateDataComponent;
  @ViewChild('nabilShareLoanCombined', {static: false})
  nabilShareLoanCombined: NabilShareLoanPodTemplateDataComponent;
  @ViewChild('shareLoanDemandCombined', {static: false})
  shareLoanDemandCombined: ShareLoanDemandTemplateDataComponent;

  @ViewChild('masterSecurity', {static: false})
  retailSecurityComponent: RetailMasterSecurityComponent;
  @ViewChild('requiredLegalDocumentSectionComponent', {static: false})
  requiredLegalDocumentSectionComponent: RetailCombinedRequiredDocumentComponent;

  offerLetterConst = NabilOfferLetterConst;

  spinner = false;
  disableBtn = false;
  dialogRef: NbDialogRef<any>;
  loanData = [];
  loanExtraDetails = [];
  offerLetterDocument: OfferDocument;
  existingOfferLetter = false;
  attributes;
  tdValues: any = {};
  isPersonalLoan = false;
  isPersonalOverdraftLoan = false;
  isMortgageLoan = false;
  isHomeLoan = false;
  isEducationLoan = false;
  isPersonalAndPersonalOverdraft = false;
  isAutoLoan = false;
  isNabilSahayatri = false;
  isPersonalOverDraftWithoutCollateral = false;
  isNabilShareLoan = false;
  isShareLoanDemand = false;
  globalBaseRate: any;
  constructor(private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private nbDialogueService: NbDialogService,
              private modalService: NgbModal,
              private modalDialogRef: NbDialogRef<RetailTemplateDataComponent>,
              public nbDialogRef: NbDialogRef<RetailTemplateDataComponent>) { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.customerApprovedDoc)) {
      this.getLoanName();
      this.checkLoanName();
    }
  }

  getLoanName() {
    const tempTotalLimit = {name: 'TOTAL LIMIT', loanAmount: 0};
    this.loanExtraDetails.push(tempTotalLimit);
    console.log('to verify:', this.customerApprovedDoc);
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
        if (v === 'PERSONAL LOAN COMBINED') {
          this.isPersonalLoan = true;
        }
        if (v === 'PERSONAL OVERDRAFT COMBINED') {
          this.isPersonalOverdraftLoan = true;
        }
        if (v === 'PERSONAL LOAN AND PERSONAL OVERDRAFT COMBINED') {
          this.isPersonalAndPersonalOverdraft = true;
        }
        if (v === 'EDUCATION LOAN COMBINED') {
          this.isEducationLoan = true;
        }
        if (v === 'MORTGAGE LOAN COMBINED') {
          this.isMortgageLoan = true;
        }
        if (v === 'HOME LOAN COMBINED') {
          this.isHomeLoan = true;
        }
        if (v === 'AUTO LOAN COMBINED') {
          this.isAutoLoan = true;
        }
        if (v === 'NABIL SAHAYATRI KARJA') {
          this.isNabilSahayatri = true;
        }
        if (v === 'PERSONAL OVERDRAFT WITHOUT COLLATERAL COMBINED') {
          this.isPersonalOverDraftWithoutCollateral = true;
        }
        if (v === 'NABIL SHARE LOAN POD COMBINED') {
          this.isNabilShareLoan = true;
        }
        if (v === 'SHARE LOAN DEMAND COMBINED') {
          this.isShareLoanDemand = true;
        }
      });
    }
  }

  public openCombinedOfferLetter() {
    this.dialogRef = this.nbDialogueService.open(RetailCombinedOfferLetterComponent, {
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
    const retailGlobalForm = this.retailGlobalContent.globalForm.value;
    const existingLoanForm = this.existingLoanContent.existingLoanCombinedForm.value;
    let personalOverdraftForm;
    if (this.isPersonalOverdraftLoan) {
      personalOverdraftForm = this.personalOverdraftCombined.personalOverdraftCombinedForm.value;
    }

    let mortgageCombineForm;
    if (this.isMortgageLoan) {
      mortgageCombineForm = this.mortgageLoanCombined.mortgageCombineLoanForm.value;
    }

    let personalLoanCombinedForm;
    if (this.isPersonalLoan) {
      personalLoanCombinedForm = this.personalLoanCombined.personalLoanCombinedForm.value;
    }

    let educationLoanForm;
    if (this.isEducationLoan) {
      educationLoanForm = this.educationLoanCombined.educationLoanCombinedForm.value;
    }

    let autoLoanForm;
    if (this.isAutoLoan) {
      autoLoanForm = this.autoLoanCombined.autoLoanCombinedForm.value;
    }

    let homeLoanForm;
    if (this.isHomeLoan) {
      homeLoanForm = this.homeLoanCombined.homeLoanCombinedForm.value;
    }

    let nabilSahayatriForm;
    if (this.isNabilSahayatri) {
      nabilSahayatriForm = this.sahayatriCombined.nabilSahayatriCombinedForm.value;
    }

    let personalOverDraftWithoutCollateralForm;
    if (this.isPersonalOverDraftWithoutCollateral) {
      // tslint:disable-next-line:max-line-length
      personalOverDraftWithoutCollateralForm = this.personalOverDraftWithoutCollateralCombined.personalOverDraftWithoutCollateralCombinedForm.value;
    }

    let shareLoanDemandForm;
    if (this.isShareLoanDemand) {
      shareLoanDemandForm = this.shareLoanDemandCombined.shareLoanDemandCombinedForm.value;
    }

    let nabilShareLoanPODForm;
    if (this.isNabilShareLoan) {
      nabilShareLoanPODForm = this.nabilShareLoanCombined.nabilShareLoanPODForm.value;
    }
    const securityData = this.retailSecurityComponent.setSecurityData();
    let securityForm;
    if (!ObjectUtil.isEmpty(securityData)) {
      securityForm = securityData;
    }

    const requiredLegalDocument = this.requiredLegalDocumentSectionComponent.requireDocumentForm.value;

    const retailCombinedForm = {
      retailGlobalForm: retailGlobalForm,
      existingLoanForm: existingLoanForm,
      educationLoanForm: educationLoanForm,
      personalOverdraftCombinedForm: personalOverdraftForm,
      mortgageCombineForm: mortgageCombineForm,
      personalLoanCombinedForm: personalLoanCombinedForm,
      autoLoanCombinedForm: autoLoanForm,
      homeLoanCombinedForm: homeLoanForm,
      nabilSahayatriCombinedForm: nabilSahayatriForm,
      personalOverDraftWithoutCollateralCombinedForm: personalOverDraftWithoutCollateralForm,
      nabilShareLoanPODForm: nabilShareLoanPODForm,
      shareLoanDemandCombinedForm: shareLoanDemandForm,
      securities: securityForm,
      requiredLegalDocument: requiredLegalDocument,
    };
    return JSON.stringify(retailCombinedForm);
  }
  getBaseRate(data) {
    this.globalBaseRate = data;
  }

}
