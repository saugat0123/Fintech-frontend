import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ToastService} from '../../../../../@core/utils';
import {Router} from '@angular/router';
import {MegaOfferLetterConst} from '../../../mega-offer-letter-const';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {OfferDocument} from '../../../model/OfferDocument';
import {CadDocStatus} from '../../../model/CadDocStatus';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {NepaliEditor} from '../../../../../@core/utils/constants/nepaliEditor';

@Component({
    selector: 'app-hayer-purchase',
    templateUrl: './hayer-purchase.component.html',
    styleUrls: ['./hayer-purchase.component.scss']
})
export class HayerPurchaseComponent implements OnInit {
    // todo replace enum constant string compare
    hayarPurchase: FormGroup;
    spinner = false;
    existingOfferLetter = false;
    initialInfoPrint;
    offerLetterConst = MegaOfferLetterConst;
    hayerPurchaseLetter: OfferDocument;
    isPresentPrevious = false;
    ckeConfig = NepaliEditor.CK_CONFIG;

    @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;


    constructor(private formBuilder: FormBuilder,
                private toastService: ToastService,
                private router: Router,
                private routerUtilsService: RouterUtilsService,
                private administrationService: CreditAdministrationService,
                protected dialogRef: NbDialogRef<CadOfferLetterModalComponent>) {
    }

    ngOnInit() {
        this.buildForm();
        this.checkOfferLetterData();
    }

    buildForm() {
        this.hayarPurchase = this.formBuilder.group({
            refNo: [undefined],
            name: [undefined],
            borrowerAddress: [undefined],
            contactNumber: [undefined],

            guarantor: [undefined],
            guarantorFlag: [true],
            addedPercentage: [undefined],
            identityCardNo1: [undefined],
            identityCardNo2: [undefined],
            date: [undefined],
            pageCount: [undefined],
            clausesTextEditor: [undefined],
            expiryDateTimeDuration: [undefined],
            timeDuration: [undefined],

            hayarPurchaseLoanArray: this.formBuilder.array([this.buildHayarPurchaseArrayForm()]),
            riskCoverageArray: this.formBuilder.array([this.buildRiskCoverageArrayForm()]),
        });
    }

    buildHayarPurchaseArrayForm() {
        return this.formBuilder.group({
            amount: [undefined],
            amountInWord: [undefined],
            vehicle: [undefined],
            samaya: [undefined],
            baseRate: [undefined],
            premiumRate: [undefined],
            presentRate: [undefined],
            month: [undefined],
            totalMonth: [undefined],
            emiAmount: [undefined],
            emiAmountInWord: [undefined],
            vatPercent: [undefined],
            serviceAmount: [undefined],
            company: [undefined],
            servicePercentage: [undefined],
            servicePercentageWords: [undefined],
            charge: [undefined],
            chargeFlag: [true],
            loanClearanceMonthlyDate: [undefined],
            PurwaBhuktaniSulka: [undefined],
            PurwaBhuktaniSewaSulkaRate: [undefined]
        });
    }

    buildRiskCoverageArrayForm() {
        return this.formBuilder.group({
            sn: [undefined],
            details: [undefined],
            amount: [undefined],
            riskCoverage: [undefined],
        });
    }

    addMoreHirePurchaseLoan() {
        (this.hayarPurchase.get('hayarPurchaseLoanArray') as FormArray).push(this.buildHayarPurchaseArrayForm());
    }

    removeHirePurchaseLoan(i) {
        (this.hayarPurchase.get('hayarPurchaseLoanArray') as FormArray).removeAt(i);
    }

    addMoreRiskCoverageArray() {
        (this.hayarPurchase.get('riskCoverageArray') as FormArray).push(this.buildRiskCoverageArrayForm());
    }

    removeRiskCoverageArray(i) {
        (this.hayarPurchase.get('riskCoverageArray') as FormArray).removeAt(i);
    }

    removeOptionalField(formGroup, fieldControlName) {
        formGroup.get(fieldControlName).patchValue(false);
    }

    undoRemovalOfOptionalField(formGroup, fieldControlName) {
        formGroup.get(fieldControlName).patchValue(true);
    }

    checkOfferLetterData() {
        if (this.cadOfferLetterApprovedDoc.offerDocumentList.length > 0) {
            this.hayerPurchaseLetter = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value =>
                value.docName.toString() === this.offerLetterConst.value(this.offerLetterConst.HAYER_PURCHASE).toString())[0];
            if (!ObjectUtil.isEmpty(this.hayerPurchaseLetter) && !ObjectUtil.isEmpty(this.hayerPurchaseLetter.id)) {
                const initialInfo = JSON.parse(this.hayerPurchaseLetter.initialInformation);
                this.initialInfoPrint = initialInfo;
                this.existingOfferLetter = true;
                this.hayarPurchase.patchValue(initialInfo, {emitEvent: false});

                (this.hayarPurchase.get('hayarPurchaseLoanArray') as FormArray).clear();
                initialInfo.hayarPurchaseLoanArray.forEach( value => {
                    (this.hayarPurchase.get('hayarPurchaseLoanArray') as FormArray).push(this.formBuilder.group(value));
                });
                (this.hayarPurchase.get('riskCoverageArray') as FormArray).clear();
                initialInfo.riskCoverageArray.forEach( value => {
                    (this.hayarPurchase.get('riskCoverageArray') as FormArray).push(this.formBuilder.group(value));
                });
                this.initialInfoPrint = initialInfo;
            } else {
                this.hayerPurchaseLetter = new OfferDocument();
                this.hayerPurchaseLetter.docName = this.offerLetterConst.value(this.offerLetterConst.HAYER_PURCHASE);
            }
        }
    }


    submit(): void {
        this.spinner = true;
        this.cadOfferLetterApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;

        if (this.existingOfferLetter) {
            this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
                if (offerLetterPath.docName.toString() === this.offerLetterConst.value(this.offerLetterConst.HAYER_PURCHASE).toString()) {
                    offerLetterPath.initialInformation = JSON.stringify(this.hayarPurchase.value);
                }
            });
        } else {
            const offerDocument = new OfferDocument();
            offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.HAYER_PURCHASE);
            offerDocument.initialInformation = JSON.stringify(this.hayarPurchase.value);
            this.cadOfferLetterApprovedDoc.offerDocumentList.push(offerDocument);
        }

        this.administrationService.saveCadDocumentBulk(this.cadOfferLetterApprovedDoc).subscribe(() => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Hayer Purchase Offer Letter'));
            this.spinner = false;
            this.dialogRef.close();
            this.routerUtilsService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save  Hayer Purchase Offer Letter'));
            this.spinner = false;
            this.dialogRef.close();
            this.routerUtilsService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
        });

    }
}




