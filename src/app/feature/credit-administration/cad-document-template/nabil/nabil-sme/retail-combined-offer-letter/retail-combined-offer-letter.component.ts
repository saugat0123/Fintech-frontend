import {Component, Input, OnInit, Optional, ViewChild} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {NbDialogRef} from '@nebular/theme';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {OfferDocument} from '../../../../model/OfferDocument';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {NabilOfferLetterConst} from '../../../../nabil-offer-letter-const';
import {ToastService} from '../../../../../../@core/utils';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {
    Section1CustomerOfferLetterTypeComponent
} from './retail-combined-offer-letter-sections/section1-customer-offer-letter-type/section1-customer-offer-letter-type.component';
import {
    Section2LoanTypeRetailComponent
} from './retail-combined-offer-letter-sections/section2-loan-type-retail/section2-loan-type-retail.component';
import {
    Section7InterestAndEmiPaymentRelatedComponent
} from './retail-combined-offer-letter-sections/section7-interest-and-emi-payment-related/section7-interest-and-emi-payment-related.component';
import {
    Section8LoanDisbursementRelatedClauseComponent
} from './retail-combined-offer-letter-sections/section8-loan-disbursement-related-clause/section8-loan-disbursement-related-clause.component';
import {
    Section18RequiredSecurityDocumentsComponent
} from './retail-combined-offer-letter-sections/section18-required-security-documents/section18-required-security-documents.component';
import {
    Section19ToSection22Component
} from './retail-combined-offer-letter-sections/section19-to-section22/section19-to-section22.component';
import {
    Section16AndSection17Component
} from './retail-combined-offer-letter-sections/section16-and-section17/section16-and-section17.component';
import {Section14OtherTermsComponent} from './retail-combined-offer-letter-sections/section14-other-terms/section14-other-terms.component';

@Component({
    selector: 'app-retail-combined-offer-letter',
    templateUrl: './retail-combined-offer-letter.component.html',
    styleUrls: ['./retail-combined-offer-letter.component.scss']
})
export class RetailCombinedOfferLetterComponent implements OnInit {
    @Input() customerApprovedDoc: CustomerApprovedLoanCadDocumentation;
    @ViewChild('section1', {static: false}) section1: Section1CustomerOfferLetterTypeComponent;
    @ViewChild('section2', {static: false}) section2: Section2LoanTypeRetailComponent;
    @ViewChild('section7', {static: false}) section7: Section7InterestAndEmiPaymentRelatedComponent;
    @ViewChild('section8', {static: false}) section8: Section8LoanDisbursementRelatedClauseComponent;
    @ViewChild('section14', {static: false}) section14: Section14OtherTermsComponent;
    @ViewChild('section18', {static: false}) section18: Section18RequiredSecurityDocumentsComponent;
    @ViewChild('section22', {static: false}) section22: Section19ToSection22Component;
    @ViewChild('section16', {static: false}) section16: Section16AndSection17Component;
    @Input() preview = false;
    spinner = false;
    offerLetterConst = NabilOfferLetterConst;
    loanHolderInfo: any;
    existingOfferLetter = false;
    offerLetterDocument: OfferDocument;
    offerLetterData;
    allFreeText;

    constructor(@Optional() private dialogRef: NbDialogRef<RetailCombinedOfferLetterComponent>,
                private toastService: ToastService,
                private administrationService: CreditAdministrationService
    ) {
    }

    ngOnInit() {
        this.checkOfferLetterData();
    }

    checkOfferLetterData() {
        if (!ObjectUtil.isEmpty(this.customerApprovedDoc) &&
            !ObjectUtil.isEmpty(this.customerApprovedDoc.offerDocumentList)) {
            if (this.customerApprovedDoc.offerDocumentList.length > 0) {
                this.offerLetterDocument = this.customerApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
                    === this.offerLetterConst.value(this.offerLetterConst.COMBINED_LETTER).toString())[0];
                if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
                    this.offerLetterDocument = new OfferDocument();
                    this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.COMBINED_LETTER);
                } else {
                    const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
                    if (!ObjectUtil.isEmpty(this.offerLetterDocument.supportedInformation)) {
                        this.offerLetterData = this.offerLetterDocument;
                        this.allFreeText = JSON.parse(this.offerLetterData.supportedInformation);
                    }
                    this.existingOfferLetter = true;
                }
            }
        }
    }

    onSubmit() {
        this.spinner = true;
        this.customerApprovedDoc.docStatus = 'OFFER_AND_LEGAL_PENDING';

        if (this.existingOfferLetter) {
            this.customerApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
                if (offerLetterPath.docName.toString() === this.offerLetterConst.value(this.offerLetterConst.COMBINED_LETTER)
                    .toString()) {
                    offerLetterPath.supportedInformation = this.setFreeText();
                }
            });
        } else {
            const offerDocument = new OfferDocument();
            offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.COMBINED_LETTER);
            offerDocument.supportedInformation = this.setFreeText();
        }

        this.administrationService.saveCadDocumentBulk(this.customerApprovedDoc).subscribe((res: any) => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
            this.customerApprovedDoc = res.detail;
            this.spinner = false;
            this.dialogRef.close();
            // this.routerUtilsService.reloadCadProfileRoute(this.customerApprovedDoc.id);
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
            this.spinner = false;
            this.dialogRef.close();
            // this.routerUtilsService.reloadCadProfileRoute(this.customerApprovedDoc.id);
        });
    }

    setFreeText() {
        const section1FreeText = this.section1.form.get('freetext1').value ? this.section1.form.get('freetext1').value : '';
        const section2FreeText = this.section2.setTextAreaValue();
        const section7FreeText = this.section7.form.get('freeDate').value ? this.section7.form.get('freeDate').value : '';
        const section8FreeText = this.section8.setTextAreaValue();
        // tslint:disable-next-line:max-line-length
    const section14FreeText = this.section14.form.get('nameOfEmbassyFreeTxt').value ? this.section14.form.get('nameOfEmbassyFreeTxt').value : '';
    const section18FreeText = {
        freeText2: this.section18.form.get('freeText2').value ? this.section18.form.get('freeText2').value : '',
        borrowerKhataNum: this.section18.form.get('borrowerKhataNum').value ? this.section18.form.get('borrowerKhataNum').value : '',
        letterOfConsentForContOfExistingMortgageName: this.section18.form.get('letterOfConsentForContOfExistingMortgageName').value ? this.section18.form.get('letterOfConsentForContOfExistingMortgageName').value : '',
        newOrAdditionalLoan: this.section18.form.get('newOrAdditionalLoan').value ?
            this.section18.form.get('newOrAdditionalLoan').value : '',
        pdoNabil: this.section18.form.get('pdoNabil').value ?
            this.section18.form.get('pdoNabil').value : '',
        mortgageDate: this.section18.form.get('mortgageDate').value ?
            this.section18.form.get('mortgageDate').value : '',
        mortgageDeedAmountInFigure: this.section18.form.get('mortgageDeedAmountInFigure').value ?
            this.section18.form.get('mortgageDeedAmountInFigure').value : '',
        remortgageDeedAmountInFigure: this.section18.form.get('remortgageDeedAmountInFigure').value ?
            this.section18.form.get('remortgageDeedAmountInFigure').value : '',
        insuranceAmount: this.section18.form.get('insuranceAmount').value ?
            this.section18.form.get('insuranceAmount').value : '',
    };
        const section22FreeText = {
            freeText1: this.section22.form.get('freeText1').value ? this.section22.form.get('freeText1').value : '',
            freeText2: this.section22.form.get('freeText2').value ? this.section22.form.get('freeText2').value : '',
            freeText3: this.section22.form.get('freeText3').value ? this.section22.form.get('freeText3').value : '',
            freeText4: this.section22.form.get('freeText4').value ? this.section22.form.get('freeText4').value : '',
            freeText5: this.section22.form.get('freeText5').value ? this.section22.form.get('freeText5').value : '',
            position: this.section22.form.get('position').value ? this.section22.form.get('position').value : '',
            position1: this.section22.form.get('position1').value ? this.section22.form.get('position1').value : '',
            sakshiDistrict1: this.section22.form.get('sakshiDistrict1').value ? this.section22.form.get('sakshiDistrict1').value : '',
            sakshiMunicipality1: this.section22.form.get('sakshiMunicipality1').value ? this.section22.form.get('sakshiMunicipality1').value : '',
            sakshiWard1: this.section22.form.get('sakshiWard1').value ? this.section22.form.get('sakshiWard1').value : '',
            sakshiAge1: this.section22.form.get('sakshiAge1').value ? this.section22.form.get('sakshiAge1').value : '',
            sakshiName1: this.section22.form.get('sakshiName1').value ? this.section22.form.get('sakshiName1').value : '',
            sakshiDistrict2: this.section22.form.get('sakshiDistrict2').value ? this.section22.form.get('sakshiDistrict2').value : '',
            sakshiMunicipality2: this.section22.form.get('sakshiMunicipality2').value ? this.section22.form.get('sakshiMunicipality2').value : '',
            sakshiWard2: this.section22.form.get('sakshiWard2').value ? this.section22.form.get('sakshiWard2').value : '',
            sakshiAge2: this.section22.form.get('sakshiAge2').value ? this.section22.form.get('sakshiAge2').value : '',
            sakshiName2: this.section22.form.get('sakshiName2').value ? this.section22.form.get('sakshiName2').value : '',
            nameOfBankStaff: this.section22.form.get('nameOfBankStaff').value ? this.section22.form.get('nameOfBankStaff').value : '',
            additionalClauseChecked: this.section22.form.get('additionalClauseChecked').value ?
                this.section22.form.get('additionalClauseChecked').value : '',

        };
        const section16FreeText = {
            loanCommitmentCheck: this.section16.form.get('loanCommitmentCheck').value ?
                this.section16.form.get('loanCommitmentCheck').value : '',
            crossDefaultCheck: this.section16.form.get('crossDefaultCheck').value ?
                this.section16.form.get('crossDefaultCheck').value : '',
        };


        const freeTextVal = {
            section1: section1FreeText,
            section2: section2FreeText,
            section7: section7FreeText,
            section8: section8FreeText,
            section14: section14FreeText,
            section18: section18FreeText,
            section22: section22FreeText,
            section16: section16FreeText,
        };
        return JSON.stringify(freeTextVal);
    }

    close() {
        this.dialogRef.close();
    }

}
