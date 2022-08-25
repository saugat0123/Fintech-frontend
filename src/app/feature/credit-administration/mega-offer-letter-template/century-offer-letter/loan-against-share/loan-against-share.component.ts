import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {MegaOfferLetterConst} from '../../../mega-offer-letter-const';
import {OfferDocument} from '../../../model/OfferDocument';
import {NepaliNumberAndWords} from '../../../model/nepaliNumberAndWords';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {ToastService} from '../../../../../@core/utils';
import {Router} from '@angular/router';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {EngToNepaliNumberPipe} from '../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../@core/pipe/currency-formatter.pipe';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliPercentWordPipe} from '../../../../../@core/pipe/nepali-percent-word.pipe';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CadDocStatus} from '../../../model/CadDocStatus';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';

@Component({
    selector: 'app-loan-against-share',
    templateUrl: './loan-against-share.component.html',
    styleUrls: ['./loan-against-share.component.scss']
})
export class LoanAgainstShareComponent implements OnInit {
    form: FormGroup;
    spinner = false;
    existingOfferLetter = false;
    offerLetterConst = MegaOfferLetterConst;
    offerLetterDocument: OfferDocument;
    initialInfoPrint;
    nepaliNumber = new NepaliNumberAndWords();
    nepaliAmount = [];
    finalNepaliWord = [];
    @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
    nepData;
    external = [];
    loanHolderInfo;

    constructor(private formBuilder: FormBuilder,
                private toastService: ToastService,
                private router: Router,
                private administrationService: CreditAdministrationService,
                protected dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
                private routerUtilsService: RouterUtilsService,
                private engToNepNumberPipe: EngToNepaliNumberPipe,
                private currencyFormatPipe: CurrencyFormatterPipe,
                private nepToEngNumberPipe: NepaliToEngNumberPipe,
                private nepPercentWordPipe: NepaliPercentWordPipe,) {
    }

    ngOnInit() {
        this.buildForm();
        console.log('cadOfferLetterApprovedDoc', this.cadOfferLetterApprovedDoc);
        this.checkOfferLetterData();
        if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
            this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
        }
    }

    buildForm() {
        this.form = this.formBuilder.group({
            loanAgainstShare: this.formBuilder.array([]),
            date: [undefined],
            chalaniNo: [undefined],
            permanentAddress: [undefined],
            district: [undefined],
            vdcMuncipality: [undefined],
            temporaryAddress: [undefined],
            provinanceNo: [undefined],
            provinanceDistrict: [undefined],
            provinanceMuncipality: [undefined],
            provinanceTole: [undefined],
            provinanceHouseNo: [undefined],
            road: [undefined],
            email: [undefined],
            contactPhoneNo: [undefined],
            faxNo: [undefined],
            avarageBaseRate: [undefined],
            pratisat: [undefined],
            approvedKarjaAmount: [undefined],
            remainingLoan: [undefined],
            dhitoSurachankoName: [undefined],
            sriName: [undefined],
            amount: [undefined],
            amountInWords: [undefined],
            loanDeedAmount: [undefined],
            rupaiyaMatra: [undefined],
            personalGuarantorName: [undefined],
            extendedTime: [undefined],
            postBoxNumber: [undefined],
            marfat: [undefined],
            sakhaKaryalaya: [undefined],
            telephoneNumber: [undefined],
            faxNumber2: [undefined],
            name2: [undefined],
            permanentAddress2: [undefined],
            district2: [undefined],
            vdcMuncipalityWordNo: [undefined],
            halkoThegana: [undefined],
            pradeshPradeshNo: [undefined],
            zila: [undefined],
            mahanagarpalikaGaupalika: [undefined],
            toleGaau: [undefined],
            gharNO: [undefined],
            sadakMarga: [undefined],
            email2: [undefined],
            samparkMobileNo: [undefined],
            name3: [undefined],
            post: [undefined],
            name4: [undefined],
            post2: [undefined],
            garekoMiti: [undefined],
            name5: [undefined],
            shree: [undefined]
        });
    }

    checkOfferLetterData() {
        this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
            === this.offerLetterConst.value(this.offerLetterConst.LOAN_AGAINST_SHARE).toString())[0];
        if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
            this.addEmptyLoanAgainstShareForm();
            this.offerLetterDocument = new OfferDocument();
            this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.LOAN_AGAINST_SHARE);
        } else {
            const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
            console.log(initialInfo);
            this.initialInfoPrint = initialInfo;
            console.log(this.offerLetterDocument);
            this.existingOfferLetter = true;
            this.form.patchValue(initialInfo);
            if (!ObjectUtil.isEmpty(initialInfo)) {
                this.setLoanAgainstShare(initialInfo.loanAgainstShare);
            }
            this.initialInfoPrint = initialInfo;
        }
    }

    submit() {
        this.spinner = true;
        this.cadOfferLetterApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;
        if (this.existingOfferLetter) {
            this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
                if (offerLetterPath.docName.toString() ===
                    this.offerLetterConst.value(this.offerLetterConst.LOAN_AGAINST_SHARE).toString()) {
                    offerLetterPath.initialInformation = JSON.stringify(this.form.value);
                }
            });
        } else {
            const offerDocument = new OfferDocument();
            offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.LOAN_AGAINST_SHARE);
            offerDocument.initialInformation = JSON.stringify(this.form.value);
            this.cadOfferLetterApprovedDoc.offerDocumentList.push(offerDocument);
        }
        this.administrationService.saveCadDocumentBulk(this.cadOfferLetterApprovedDoc).subscribe(() => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
            this.spinner = false;
            this.dialogRef.close();
            this.routerUtilsService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
            this.spinner = false;
            this.dialogRef.close();
            this.routerUtilsService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
        });
    }

    addEmptyLoanAgainstShare() {
        return this.formBuilder.group({
            facilityType: [undefined],
            adhiktamAmount: [undefined],
            amountInWord: [undefined],
            sadharanShare: [undefined],
            maximumAmount: [undefined],
            limitExpiryDate: [undefined],
            interestAmount: [undefined],
        });
    }

    addEmptyLoanAgainstShareForm() {
        (this.form.get('loanAgainstShare') as FormArray).push(this.addEmptyLoanAgainstShare());
    }

    setLoanAgainstShare(data) {
        const formArray = this.form.get('loanAgainstShare') as FormArray;
        if (ObjectUtil.isEmpty(data)) {
            this.addEmptyLoanAgainstShareForm();
            return;
        }
        data.forEach(value => {
            formArray.push(this.formBuilder.group({
                facilityType: [value.facilityType],
                adhiktamAmount: [value.adhiktamAmount],
                amountInWord: [value.amountInWord],
                sadharanShare: [value.sadharanShare],
                maximumAmount: [value.maximumAmount],
                limitExpiryDate: [value.limitExpiryDate],
                interestAmount: [value.interestAmount],
            }));
        });
    }

    removeloanAgainstShare(i) {
        (this.form.get('loanAgainstShare') as FormArray).removeAt(i);
    }
}
