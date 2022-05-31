import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UnassignedLoanComponent} from './component/unassigned-loan-list/unassigned-loan.component';
import {RouterModule} from '@angular/router';
import {routes} from './credit-administration-routing';
import {ThemeModule} from '../../@theme/theme.module';
import {AssignPopUpComponent} from './component/assign-pop-up/assign-pop-up.component';
import {LoanListComponent} from './component/loan-list/loan-list.component';
import {VerifyPopUpComponent} from './component/verify-pop-up/verify-pop-up.component';
import {LegalAndDisbursementComponent} from './cad-work-flow/cad-work-flow-base/legal-and-disbursement/legal-and-disbursement.component';
import {CadActionComponent} from './cad-work-flow/cad-work-flow-base/cad-action/cad-action.component';
import {ExposureComponent} from './cad-work-flow/cad-work-flow-base/legal-and-disbursement/exposure/exposure.component';
import {MegaOfferLetterTemplateModule} from './mega-offer-letter-template/mega-offer-letter-template.module';
import {CadDocumentTemplateModule} from './cad-document-template/cad-document-template.module';
import {NbDialogModule} from '@nebular/theme';
import {OfferLetterListComponent} from './component/offer-letter/offer-letter-list/offer-letter-list.component';
import {CadOfferLetterProfileComponent} from './cad-offerletter-profile/cad-offerletter-profile.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {DocumentChecklistComponent} from './cad-work-flow/cad-work-flow-base/legal-and-disbursement/document-checklist/document-checklist.component';
import {FeesCommissionComponent} from './cad-work-flow/cad-work-flow-base/legal-and-disbursement/fees-commission/fees-commission.component';
import {CoreModule} from '../../@core/core.module';
import {CadOfferLetterModalComponent} from './cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {CommentComponent} from './comment/comment.component';
import {OfferLetterDocumentUploadComponent} from './cad-offerletter-profile/offer-letter-document-upload/offer-letter-document-upload.component';
import {OfferLetterApprovedComponent} from './component/offer-letter/offer-letter-approved/offer-letter-approved.component';
import {LegalReviewPendingComponent} from './component/legal/legal-review-pending/legal-review-pending.component';
import {LegalReviewApprovedComponent} from './component/legal/legal-review-approved/legal-review-approved.component';
import {DisbursementApprovedComponent} from './component/disbursement/disbursement-approved/disbursement-approved.component';
import {DisbursementPendingComponent} from './component/disbursement/disbursement-pending/disbursement-pending.component';
import {CadDocumentListComponent} from './component/cad-document-list/cad-document-list.component';
import {GeneralDocumentComponent} from './cad-offerletter-profile/customer-document/cad-general-document/general-document.component';
import {CadLoanDocumentComponent} from './cad-offerletter-profile/customer-document/cad-loan-document/cad-loan-document.component';
import {FilterComponent} from './component/filter/filter.component';
import {CustomerInsuranceComponent} from './cad-offerletter-profile/customer-document/cad-general-document/customer-insurance/customer-insurance.component';
import {CadSummaryComponent} from './cad-work-flow/cad-summary/cad-summary.component';
import {CadChecklistDocTemplateModalComponent} from './cad-offerletter-profile/cad-checklist-doc-template-modal/cad-checklist-doc-template-modal.component';
import {MegaModule} from './cad-document-template/mega/mega.module';
import {ProfileViewComponent} from './cad-view/profile-view/profile-view.component';
import {ExposureViewComponent} from './cad-view/exposure-view/exposure-view.component';
import {FeesCommissionsViewComponent} from './cad-view/fees-commissions-view/fees-commissions-view.component';
import {DocumentChecklistViewComponent} from './cad-view/document-checklist-view/document-checklist-view.component';
import {CustomOfferLetterDocumentComponent} from './cad-offerletter-profile/cad-offer-letter-modal/custom-offer-letter-document/custom-offer-letter-document.component';
import {UpdateCustomerCadInfoComponent} from './cad-offerletter-profile/update-customer-cad-info/update-customer-cad-info.component';
import {AdditionalDocumentComponent} from './cad-work-flow/cad-work-flow-base/legal-and-disbursement/additional-document/additional-document.component';
import {AddAdditionalDocumentComponent} from './cad-work-flow/cad-work-flow-base/legal-and-disbursement/additional-document/add-additional-document/add-additional-document.component';
import {DocumentChecklistLiteComponent} from './cad-work-flow/cad-work-flow-base/legal-and-disbursement/document-checklist-lite/document-checklist-lite.component';
import {DocumentChecklistViewLiteComponent} from './cad-view/document-checklist-view-lite/document-checklist-view-lite.component';
import {SecurityComplianceCertificateComponent} from './cad-work-flow/cad-work-flow-base/legal-and-disbursement/security-compliance-certificate/security-compliance-certificate.component';
import {NgxPrintModule} from 'ngx-print';
import {AdditionalExposureComponent} from './component/disbursement/additional-exposure/additional-exposure.component';
import {CadOfferLetterConfigurationComponent} from './cad-offerletter-profile/cad-offer-letter-configuration/cad-offer-letter-configuration.component';
import {AngularDraggableModule} from 'angular2-draggable';
import {NepaliCalendarModule} from '../nepali-calendar/nepali-calendar.module';
import {NepProposedAmountFormComponent} from './cad-offerletter-profile/cad-offer-letter-configuration/nep-proposed-amount-form/nep-proposed-amount-form.component';
import {CadFileSetupComponent} from './cad-work-flow/cad-work-flow-base/legal-and-disbursement/cad-file-setup/cad-file-setup.component';
import {ApprovedLoanListComponent} from './component/approved-loan-list/approved-loan-list.component';
import {RouterUtilsService} from './utils/router-utils.service';
import {DisbursementModalComponent} from './component/disbursement/disbursement-pending/disbursement-modal/disbursement-modal.component';
import {PreviewCadComponent} from './component/preview-cad/preview-cad.component';
import {CadReportComponent} from './component/cad-report/cad-report.component';
import {TemplateDataComponent} from './cad-view/template-data/template-data.component';
import {HirePurchaseTemplateDataComponent} from './cad-view/template-data/hire-purchase-template-data/hire-purchase-template-data.component';
import {RetailEducationTemplateDataComponent} from './cad-view/template-data/retail-education-template-data/retail-education-template-data.component';
import {RetailMortgageLoanTemplateDataComponent} from './cad-view/template-data/retail-mortgage-loan-template-data/retail-mortgage-loan-template-data.component';
import {RetailLoanAgainstInsuranceTemplateDataComponent} from './cad-view/template-data/retail-loan-against-insurance-template-data/retail-loan-against-insurance-template-data.component';
import {SmeTemplateDataComponent} from './cad-view/template-data/sme-template-data/sme-template-data.component';
import {EducationalLoanTemplateDataComponent} from './cad-view/template-data/educational-loan-template-data/educational-loan-template-data.component';
import {AdminModule} from '../admin/admin.module';
import {LoanCreateComponent} from './cad-offerletter-profile/cad-offer-letter-configuration/loan-create/loan-create.component';
import {RetailHousingLoanTemplateDataComponent} from './cad-view/template-data/retail-housing-loan-template-data/retail-housing-loan-template-data.component';
import {NepaliPatroModule} from 'nepali-patro';
import {PersonalOverdraftTemplateDataComponent} from './cad-view/template-data/personal-overdraft-template-data/personal-overdraft-template-data.component';
import {CadPullComponent} from './cad-work-flow/cad-pull/cad-pull.component';
import {PersonalLoanAndPersonalOverdraftTemplateDataComponent} from './cad-view/template-data/personal-loan-and-personal-overdraft-template-data/personal-loan-and-personal-overdraft-template-data.component';
import {NabilModule} from './cad-document-template/nabil/nabil.module';
import {PersonalLoanTemplateDataComponent} from './cad-view/template-data/personal-loan-template-data/personal-loan-template-data.component';
import {DocCheckComponent} from './component/doc-check/doc-check.component';
import {DocCheckPendingComponent} from './component/doc-check/doc-check-pending/doc-check-pending.component';
import {EducationalLoanTemplateEditComponent} from './cad-view/template-data/educational-loan-template-edit/educational-loan-template-edit.component';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {EditLoanDetailComponent} from './cad-view/template-data/edit-loan-detail/edit-loan-detail.component';
import {PersonalLoanTemplateEditComponent} from './cad-view/template-data/personal-loan-template-edit/personal-loan-template-edit.component';
import {PersonalOverdraftTemplateDataEditComponent} from './cad-view/template-data/personal-overdraft-template-data-edit/personal-overdraft-template-data-edit.component';
import {HomeLoanTemplateDataComponent} from './cad-view/template-data/home-loan-template-data/home-loan-template-data.component';
import {ConstructionLoanComponent} from './cad-view/template-data/home-loan-type/construction-loan/construction-loan.component';
import {HomeLandAndBuildingComponent} from './cad-view/template-data/home-loan-type/home-land-and-building/home-land-and-building.component';
import {HomeLoanTemplateEditComponent} from './cad-view/template-data/home-loan-template-edit/home-loan-template-edit.component';
import {ConstructionLoanEditComponent} from './cad-view/template-data/home-loan-template-edit/construction-loan-edit/construction-loan-edit.component';
import {HomeLandAndBuildingLoanEditComponent} from './cad-view/template-data/home-loan-template-edit/home-land-and-building-loan-edit/home-land-and-building-loan-edit.component';
import {PerosnalOverdraftWithoutCollateralTemplateDataComponent} from './cad-view/template-data/perosnal-overdraft-without-collateral-template-data/perosnal-overdraft-without-collateral-template-data.component';
import {AutoLoanTemplateEditComponent} from './cad-view/template-data/auto-loan-template-edit/auto-loan-template-edit.component';
import {RetailMortageLoanTemplateDataEditComponent} from './cad-view/template-data/retail-mortage-loan-template-data-edit/retail-mortage-loan-template-data-edit.component';
import {UdhyamsilKarjaSubsidyTemplateDataComponent} from './cad-view/template-data/nabil-sme-template-data/udhyamsil-karja-subsidy/udhyamsil-karja-subsidy-template-data/udhyamsil-karja-subsidy-template-data.component';
import {KisanKarjaSubsidyTemplateDataComponent} from './cad-view/template-data/nabil-sme-template-data/kisan-karja-subsidy/kisan-karja-subsidy-template-data/kisan-karja-subsidy-template-data.component';
import {UdhyamsilKarjaSubsidyTemplateEditComponent} from './cad-view/template-data/nabil-sme-template-data/udhyamsil-karja-subsidy/udhyamsil-karja-subsidy-template-edit/udhyamsil-karja-subsidy-template-edit.component';
import {DdslWithoutSubsidyTemplateDataComponent} from './cad-view/template-data/nabil-sme-template-data/ddsl-without-subsidy/ddsl-without-subsidy-template-data/ddsl-without-subsidy-template-data.component';
import {InterestSubsidySanctionLetterComponent} from './cad-document-template/nabil/nabil-sme/interest-subsidy-sanction-letter/interest-subsidy-sanction-letter.component';
import {InterestSubsidySanctionLetterPrintComponent} from './cad-document-template/nabil/nabil-sme/interest-subsidy-sanction-letter/interest-subsidy-sanction-letter-print/interest-subsidy-sanction-letter-print.component';
import {KisanKarjaSubsidyTemplateEditComponent} from './cad-view/template-data/nabil-sme-template-data/kisan-karja-subsidy/kisan-karja-subsidy-template-edit/kisan-karja-subsidy-template-edit.component';
import {InterestSubsidySanctionLetterTemplateDataComponent} from './cad-view/template-data/nabil-sme-template-data/interest-subsidy-sanction-letter/interest-subsidy-sanction-letter-template-data/interest-subsidy-sanction-letter-template-data.component';
import {PersonalOverdraftWithoutCollateralTemplateEditComponent} from './cad-view/template-data/personal-overdraft-without-collateral-template-edit/personal-overdraft-without-collateral-template-edit.component';
import {InterestSubsidySanctionLetterTemplateEditComponent} from './cad-view/template-data/nabil-sme-template-data/interest-subsidy-sanction-letter/interest-subsidy-sanction-letter-template-edit/interest-subsidy-sanction-letter-template-edit.component';
import {DdslWithoutSubsidyTemplateEditComponent} from './cad-view/template-data/nabil-sme-template-data/ddsl-without-subsidy/ddsl-without-subsidy-template-edit/ddsl-without-subsidy-template-edit.component';
import {PersonalLoanAndPersonalOverdraftTemplateEditComponent} from './cad-view/template-data/personal-loan-and-personal-overdraft-template-edit/personal-loan-and-personal-overdraft-template-edit.component';
import {ClassASanctionLetterComponent} from './cad-document-template/nabil/nabil-sme/class-a-sanction-letter/class-a-sanction-letter.component';
import {ClassASanctionLetterPrintComponent} from './cad-document-template/nabil/nabil-sme/class-a-sanction-letter/class-a-sanction-letter-print/class-a-sanction-letter-print.component';
import {ClassASanctionLetterTemplateDataComponent} from './cad-view/template-data/nabil-sme-template-data/class-a-sanction-letter-template-data/class-a-sanction-letter-template-data.component';
import {SmeMasterTemplateComponent} from './cad-view/template-data/nabil-sme-template-data/sme-template-data/sme-master-template/sme-master-template.component';
import {SmeGlobalContentComponent} from './cad-view/template-data/nabil-sme-template-data/sme-template-data/sme-master-template/global-template/sme-global-content/sme-global-content.component';
import {IrrevocableLetterOfCreditFacilityComponent} from './cad-view/template-data/nabil-sme-template-data/sme-template-data/sme-master-template/sme-loan-type/irrevocable-letter-of-credit-facility/irrevocable-letter-of-credit-facility.component';
import {SmeSecurityComponent} from './cad-view/template-data/nabil-sme-template-data/sme-template-data/sme-master-template/sme-security/sme-security.component';
import {CustomerAcceptanceForTimeLetterOfCreditComponent} from './cad-view/template-data/nabil-sme-template-data/sme-template-data/sme-master-template/sme-loan-type/customer-acceptance-for-time-letter-of-credit/customer-acceptance-for-time-letter-of-credit.component';
import {ImportBillsDiscountingComponent} from './cad-view/template-data/nabil-sme-template-data/sme-template-data/sme-master-template/sme-loan-type/import-bills-discounting/import-bills-discounting.component';
import {ImportLoanTrustReceiptLoanComponent} from './cad-view/template-data/nabil-sme-template-data/sme-template-data/sme-master-template/sme-loan-type/import-loan-trust-receipt-loan/import-loan-trust-receipt-loan.component';
import {DemandLoanForWorkingCapitalComponent} from './cad-view/template-data/nabil-sme-template-data/sme-template-data/sme-master-template/sme-loan-type/demand-loan-for-working-capital/demand-loan-for-working-capital.component';
import {PreExportLoanComponent} from './cad-view/template-data/nabil-sme-template-data/sme-template-data/sme-master-template/sme-loan-type/pre-export-loan/pre-export-loan.component';
import {DocumentaryBillPurchaseNegotiationComponent} from './cad-view/template-data/nabil-sme-template-data/sme-template-data/sme-master-template/sme-loan-type/documentary-bill-purchase-negotiation/documentary-bill-purchase-negotiation.component';
import {OverdraftLoanForWorkingCapitalRequirementComponent} from './cad-view/template-data/nabil-sme-template-data/sme-template-data/sme-master-template/sme-loan-type/overdraft-loan-for-working-capital-requirement/overdraft-loan-for-working-capital-requirement.component';
import {RevolvingShortTermLoanComponent} from './cad-view/template-data/nabil-sme-template-data/sme-template-data/sme-master-template/sme-loan-type/revolving-short-term-loan/revolving-short-term-loan.component';
import {EquityMortgagedOverdraftComponent} from './cad-view/template-data/nabil-sme-template-data/sme-template-data/sme-master-template/sme-loan-type/equity-mortgaged-overdraft/equity-mortgaged-overdraft.component';
import {OverdraftFacilityAgainstFixedDepositComponent} from './cad-view/template-data/nabil-sme-template-data/sme-template-data/sme-master-template/sme-loan-type/overdraft-facility-against-fixed-deposit/overdraft-facility-against-fixed-deposit.component';
import {OverdraftFacilityAgainstBondComponent} from './cad-view/template-data/nabil-sme-template-data/sme-template-data/sme-master-template/sme-loan-type/overdraft-facility-against-bond/overdraft-facility-against-bond.component';
import {BridgeGapLoanComponent} from './cad-view/template-data/nabil-sme-template-data/sme-template-data/sme-master-template/sme-loan-type/bridge-gap-loan/bridge-gap-loan.component';
import {TermLoanToOrForComponent} from './cad-view/template-data/nabil-sme-template-data/sme-template-data/sme-master-template/sme-loan-type/term-loan-to-or-for/term-loan-to-or-for.component';
import {MortgageOrEquityMortgageTermLoanComponent} from './cad-view/template-data/nabil-sme-template-data/sme-template-data/sme-master-template/sme-loan-type/mortgage-or-equity-mortgage-term-loan/mortgage-or-equity-mortgage-term-loan.component';
import {AutoLoanMasterComponent} from './cad-view/template-data/nabil-sme-template-data/sme-template-data/sme-master-template/sme-loan-type/auto-loan-master/auto-loan-master.component';
import {BankGuaranteeComponent} from './cad-view/template-data/nabil-sme-template-data/sme-template-data/sme-master-template/sme-loan-type/bank-guarantee/bank-guarantee.component';
import {BillPurchaseComponent} from './cad-view/template-data/nabil-sme-template-data/sme-template-data/sme-master-template/sme-loan-type/bill-purchase/bill-purchase.component';
import {CombinedOfferLetterComponent} from './cad-document-template/nabil/nabil-sme/combined-offer-letter/combined-offer-letter.component';
import {Section1SmeSecurityComponent} from './cad-view/template-data/nabil-sme-template-data/sme-template-data/sme-master-template/sme-security/sme-security-sections/section1-sme-security/section1-sme-security.component';
import {Section2SmeSecurityComponent} from './cad-view/template-data/nabil-sme-template-data/sme-template-data/sme-master-template/sme-security/sme-security-sections/section2-sme-security/section2-sme-security.component';
import { RequiredLegalDocumentSectionComponent } from './cad-view/template-data/nabil-sme-template-data/sme-template-data/sme-master-template/required-legal-document-section/required-legal-document-section.component';
import { CommonSecuritySectionPrimaryComponent } from './cad-view/template-data/nabil-sme-template-data/common-security-section/common-security-section-primary/common-security-section-primary.component';
import { CommonSecuritySectionSecondaryComponent } from './cad-view/template-data/nabil-sme-template-data/common-security-section/common-security-section-secondary/common-security-section-secondary.component';
import { RetailTemplateDataComponent } from './cad-view/template-data/retail-template-data/retail-template-data.component';
import { RetailGlobalContentComponent } from './cad-view/template-data/retail-template-data/retail-global-content/retail-global-content.component';
import { PersonalLoanCombinedTemplateDataComponent } from './cad-view/template-data/retail-template-data/personal-loan-combined-template-data/personal-loan-combined-template-data.component';
import { EducationLoanCombinedTemplateDataComponent } from './cad-view/template-data/retail-template-data/education-loan-combined-template-data/education-loan-combined-template-data.component';
import { MortgageLoanCombinedTemplateDataComponent } from './cad-view/template-data/retail-template-data/mortgage-loan-combined-template-data/mortgage-loan-combined-template-data.component';
import { PersonalOverdraftCombinedTemplateDataComponent } from './cad-view/template-data/retail-template-data/personal-overdraft-combined-template-data/personal-overdraft-combined-template-data.component';
import {
    RetailCombinedOfferLetterComponent
} from './cad-document-template/nabil/nabil-sme/retail-combined-offer-letter/retail-combined-offer-letter.component';
import { AutoLoanCombinedTemplateDataComponent } from './cad-view/template-data/retail-template-data/auto-loan-combined-template-data/auto-loan-combined-template-data.component';
import { HomeLoanCombinedTemplateDataComponent } from './cad-view/template-data/retail-template-data/home-loan-combined-template-data/home-loan-combined-template-data.component';
import { NabilSahayatriKarjaCombinedComponent } from './cad-view/template-data/retail-template-data/nabil-sahayatri-karja-combined/nabil-sahayatri-karja-combined.component';
import { PersonalOverdraftWithoutCollateralCombinedTemplateDataComponent } from './cad-view/template-data/retail-template-data/personal-overdraft-without-collateral-combined-template-data/personal-overdraft-without-collateral-combined-template-data.component';
import { RetailMasterSecurityComponent } from './cad-view/template-data/retail-template-data/retail-master-security/retail-master-security.component';
import { RetailPrimarySecurityComponent } from './cad-view/template-data/retail-template-data/retail-master-security/retail-primary-security/retail-primary-security.component';
import { RetailSecondarySecurityComponent } from './cad-view/template-data/retail-template-data/retail-master-security/retail-secondary-security/retail-secondary-security.component';
import { NabilShareLoanPodTemplateDataComponent } from './cad-view/template-data/retail-template-data/nabil-share-loan-pod-template-data/nabil-share-loan-pod-template-data.component';
import { ShareLoanDemandTemplateDataComponent } from './cad-view/template-data/retail-template-data/share-loan-demand-template-data/share-loan-demand-template-data.component';
import { RetailCombinedRequiredDocumentComponent } from './cad-view/template-data/retail-template-data/retail-combined-required-document/retail-combined-required-document.component';
import { ExistingLoanTemplateDataComponent } from './cad-view/template-data/retail-template-data/existing-loan-template-data/existing-loan-template-data.component';
import { GuarantorInformationTaggingComponent } from './cad-view/template-data/guarantor-information-tagging/guarantor-information-tagging.component';

@NgModule({
    declarations: [UnassignedLoanComponent,
        AssignPopUpComponent,
        LoanListComponent,
        VerifyPopUpComponent,
        LegalAndDisbursementComponent,
        CadActionComponent,
        ExposureComponent,
        OfferLetterListComponent,
        CadOfferLetterProfileComponent,
        DocumentChecklistComponent,
        FeesCommissionComponent,
        CadOfferLetterModalComponent,
        CommentComponent,
        OfferLetterDocumentUploadComponent,
        OfferLetterApprovedComponent,
        LegalReviewPendingComponent,
        LegalReviewApprovedComponent,
        DisbursementApprovedComponent,
        DisbursementPendingComponent,
        CadDocumentListComponent,
        FilterComponent,
        CadDocumentListComponent,
        GeneralDocumentComponent,
        CadLoanDocumentComponent,
        CustomerInsuranceComponent,
        CadSummaryComponent,
        CadChecklistDocTemplateModalComponent,
        ProfileViewComponent,
        ExposureViewComponent,
        FeesCommissionsViewComponent,
        DocumentChecklistViewComponent,
        CustomOfferLetterDocumentComponent,
        UpdateCustomerCadInfoComponent,
        AdditionalDocumentComponent,
        AddAdditionalDocumentComponent,
        DocumentChecklistLiteComponent,
        DocumentChecklistViewLiteComponent,
        SecurityComplianceCertificateComponent,
        AdditionalExposureComponent,
        CadOfferLetterConfigurationComponent,
        NepProposedAmountFormComponent,
        CadFileSetupComponent,
        ApprovedLoanListComponent,
        DisbursementModalComponent,
        PreviewCadComponent,
        CadReportComponent,
        TemplateDataComponent,
        HirePurchaseTemplateDataComponent,
        RetailEducationTemplateDataComponent,
        RetailMortgageLoanTemplateDataComponent,
        RetailLoanAgainstInsuranceTemplateDataComponent,
        EducationalLoanTemplateDataComponent,
        LoanCreateComponent,
        RetailLoanAgainstInsuranceTemplateDataComponent,
        RetailHousingLoanTemplateDataComponent,
        PersonalOverdraftTemplateDataComponent,
        CadPullComponent,
        SmeTemplateDataComponent,
        PersonalLoanAndPersonalOverdraftTemplateDataComponent,
        PersonalLoanTemplateDataComponent,
        DocCheckComponent,
        DocCheckPendingComponent,
        EducationalLoanTemplateEditComponent,
        EditLoanDetailComponent,
        EditLoanDetailComponent,
        PersonalLoanTemplateEditComponent,
        PersonalOverdraftTemplateDataEditComponent,
        DocCheckPendingComponent,
        PersonalLoanTemplateDataComponent,
        HomeLoanTemplateDataComponent,
        ConstructionLoanComponent,
        HomeLandAndBuildingComponent,
        HomeLoanTemplateEditComponent,
        ConstructionLoanEditComponent,
        HomeLandAndBuildingLoanEditComponent,
        RetailMortageLoanTemplateDataEditComponent,
        PerosnalOverdraftWithoutCollateralTemplateDataComponent,
        AutoLoanTemplateEditComponent,
        KisanKarjaSubsidyTemplateDataComponent,
        UdhyamsilKarjaSubsidyTemplateDataComponent,
        DdslWithoutSubsidyTemplateDataComponent,
        UdhyamsilKarjaSubsidyTemplateEditComponent,
        InterestSubsidySanctionLetterComponent,
        InterestSubsidySanctionLetterPrintComponent,
        PersonalOverdraftWithoutCollateralTemplateEditComponent,
        InterestSubsidySanctionLetterTemplateDataComponent,
        InterestSubsidySanctionLetterTemplateEditComponent,
        ClassASanctionLetterComponent, ClassASanctionLetterPrintComponent, ClassASanctionLetterTemplateDataComponent,
        DdslWithoutSubsidyTemplateEditComponent,
        PersonalLoanAndPersonalOverdraftTemplateEditComponent,
        KisanKarjaSubsidyTemplateEditComponent,
        SmeMasterTemplateComponent,
        SmeGlobalContentComponent,
        IrrevocableLetterOfCreditFacilityComponent,
        SmeSecurityComponent,
        CustomerAcceptanceForTimeLetterOfCreditComponent,
        ImportBillsDiscountingComponent,
        ImportLoanTrustReceiptLoanComponent,
        DemandLoanForWorkingCapitalComponent,
        PreExportLoanComponent,
        DocumentaryBillPurchaseNegotiationComponent,
        OverdraftLoanForWorkingCapitalRequirementComponent,
        RevolvingShortTermLoanComponent,
        EquityMortgagedOverdraftComponent,
        OverdraftFacilityAgainstFixedDepositComponent,
        OverdraftFacilityAgainstBondComponent,
        BridgeGapLoanComponent,
        TermLoanToOrForComponent,
        MortgageOrEquityMortgageTermLoanComponent,
        AutoLoanMasterComponent,
        BankGuaranteeComponent,
        BillPurchaseComponent,
        Section1SmeSecurityComponent,
        Section2SmeSecurityComponent,
        RequiredLegalDocumentSectionComponent,
        CommonSecuritySectionPrimaryComponent,
        CommonSecuritySectionSecondaryComponent,
        RetailTemplateDataComponent,
        RetailGlobalContentComponent,
        PersonalLoanCombinedTemplateDataComponent,
        EducationLoanCombinedTemplateDataComponent,
        MortgageLoanCombinedTemplateDataComponent,
        PersonalOverdraftCombinedTemplateDataComponent,
        AutoLoanCombinedTemplateDataComponent,
        HomeLoanCombinedTemplateDataComponent,
        NabilSahayatriKarjaCombinedComponent,
        PersonalOverdraftWithoutCollateralCombinedTemplateDataComponent,
        NabilSahayatriKarjaCombinedComponent,
        RetailMasterSecurityComponent,
        RetailPrimarySecurityComponent,
        RetailSecondarySecurityComponent,
        NabilShareLoanPodTemplateDataComponent,
        ShareLoanDemandTemplateDataComponent,
        RetailCombinedRequiredDocumentComponent,
        PersonalOverdraftWithoutCollateralCombinedTemplateDataComponent,
        ExistingLoanTemplateDataComponent,
        GuarantorInformationTaggingComponent],
  imports: [
    ThemeModule,
    CommonModule,
    NbDialogModule.forRoot(),
    MegaOfferLetterTemplateModule,
    CadDocumentTemplateModule,
    RouterModule.forChild(routes),
    NgSelectModule,
    CoreModule,
    MegaModule,
    NgxPrintModule,
    AngularDraggableModule,
    NepaliCalendarModule,
    AdminModule,
    NepaliPatroModule,
    NabilModule,
  ],
  entryComponents: [
    AssignPopUpComponent,
    VerifyPopUpComponent,
    CadOfferLetterModalComponent,
    ExposureComponent,
    CadChecklistDocTemplateModalComponent,
    CustomOfferLetterDocumentComponent,
    UpdateCustomerCadInfoComponent,
    AddAdditionalDocumentComponent,
    SecurityComplianceCertificateComponent,
    AdditionalExposureComponent,
    CadOfferLetterConfigurationComponent,
    CadFileSetupComponent,
    ApprovedLoanListComponent, ExposureViewComponent, DisbursementModalComponent, PreviewCadComponent, CadReportComponent,
    EducationalLoanTemplateEditComponent, EditLoanDetailComponent, PersonalLoanTemplateEditComponent, PersonalOverdraftTemplateDataEditComponent,
  HomeLoanTemplateEditComponent, RetailMortageLoanTemplateDataEditComponent,
    AutoLoanTemplateEditComponent, UdhyamsilKarjaSubsidyTemplateEditComponent, PersonalOverdraftWithoutCollateralTemplateEditComponent,
      InterestSubsidySanctionLetterTemplateDataComponent,
    InterestSubsidySanctionLetterTemplateEditComponent,
      DdslWithoutSubsidyTemplateEditComponent, PersonalLoanAndPersonalOverdraftTemplateEditComponent,
      KisanKarjaSubsidyTemplateEditComponent, ClassASanctionLetterComponent, ClassASanctionLetterPrintComponent, ClassASanctionLetterTemplateDataComponent,
      CombinedOfferLetterComponent, SmeMasterTemplateComponent, RetailTemplateDataComponent, RetailCombinedOfferLetterComponent],
  exports: [CadFileSetupComponent, FilterComponent, InterestSubsidySanctionLetterComponent, ClassASanctionLetterComponent],
  providers: [RouterUtilsService, NgbActiveModal]
})
export class CreditAdministrationModule {
}
