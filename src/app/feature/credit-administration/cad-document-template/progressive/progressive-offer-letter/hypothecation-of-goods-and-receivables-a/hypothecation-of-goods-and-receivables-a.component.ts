import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ProgressiveOfferLetterConst} from '../../progressive-offer-letter-const';
import {CustomerOfferLetter} from '../../../../../loan/model/customer-offer-letter';
import {OfferDocument} from '../../../../model/OfferDocument';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../@core/pipe/currency-formatter.pipe';
import {NepaliPercentWordPipe} from '../../../../../../@core/pipe/nepali-percent-word.pipe';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {CustomerOfferLetterService} from '../../../../../loan/service/customer-offer-letter.service';
import {NbDialogRef} from '@nebular/theme';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CadDocStatus} from '../../../../model/CadDocStatus';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';

@Component({
    selector: 'app-hypothecation-of-goods-and-receivables-a',
    templateUrl: './hypothecation-of-goods-and-receivables-a.component.html',
    styleUrls: ['./hypothecation-of-goods-and-receivables-a.component.scss']
})
export class HypothecationOfGoodsAndReceivablesAComponent implements OnInit {
    @Input() offerLetterType;
    @Input() cadOfferLetterApprovedDoc;
    form: FormGroup;
    spinner;
    offerLetterConst = ProgressiveOfferLetterConst;
    customerOfferLetter: CustomerOfferLetter;
    initialInfoPrint;
    existingOfferLetter = false;
    offerLetterDocument: OfferDocument;
    nepaliData;

    constructor(private formBuilder: FormBuilder,
                private nepToEngNumberPipe: NepaliToEngNumberPipe,
                private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
                private engToNepaliNumberPipe: EngToNepaliNumberPipe,
                private engToNepNumberPipe: EngToNepaliNumberPipe,
                private currencyFormatPipe: CurrencyFormatterPipe,
                private nepPercentWordPipe: NepaliPercentWordPipe,
                private administrationService: CreditAdministrationService,
                private toastService: ToastService,
                private routerUtilsService: RouterUtilsService,
                private customerOfferLetterService: CustomerOfferLetterService,
                private dialogRef: NbDialogRef<HypothecationOfGoodsAndReceivablesAComponent>) {
    }

    ngOnInit() {
        this.buildForm();
        this.checkOfferLetter();
    }

    fillForm() {
        this.nepaliData = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
        console.log(this.nepaliData);
        const customerAddress =
            this.nepaliData.permanentMunicipality + ' j8f g ' +
            this.nepaliData.permanentWard + ' , ' +
            this.nepaliData.permanentDistrict;
        this.form.patchValue({
            customerName: this.nepaliData.name ? this.nepaliData.name : '',
            customerAddress: customerAddress ? customerAddress : '',

            customerMunicipality: this.nepaliData.permanentMunicipality ? this.nepaliData.permanentMunicipality : '',
            customerWardNum: this.nepaliData.permanentWard ? this.nepaliData.permanentWard : '',
            customerDistrict: this.nepaliData.permanentDistrict ? this.nepaliData.permanentDistrict : '',

            tapsilGuarantorRelation: this.nepaliData.guarantorDetails[0].relationship ? this.nepaliData.guarantorDetails[0].relationship : '',
        });
        this.setGuarantors(this.nepaliData.guarantorDetails);
        this.addEmptyFinanceGuarantor();
        this.addEmptyAnusuchi();
    }

    checkOfferLetter() {
        this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
            === this.offerLetterConst.value(this.offerLetterConst.A_HYPOTHECATION_OF_GOODS_AND_RECEIVABLES).toString())[0];
        if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
            this.offerLetterDocument = new OfferDocument();
            this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.A_HYPOTHECATION_OF_GOODS_AND_RECEIVABLES);
            this.fillForm();
        } else {
            const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
            this.initialInfoPrint = initialInfo;
            this.existingOfferLetter = true;
            this.setGuarantors(initialInfo.guarantors);
            this.setFinanceGuarantors(initialInfo.financeGuarantors);
            this.setAnusuchis(initialInfo.anusuchis);
            this.form.patchValue(this.initialInfoPrint);
        }
    }

    onSubmit(): void {
        this.spinner = true;
        this.cadOfferLetterApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;

        if (this.existingOfferLetter) {
            this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
                if (offerLetterPath.docName.toString() ===
                    this.offerLetterConst.value(this.offerLetterConst.A_HYPOTHECATION_OF_GOODS_AND_RECEIVABLES).toString()) {
                    offerLetterPath.initialInformation = JSON.stringify(this.form.value);
                }
            });
        } else {
            const offerDocument = new OfferDocument();
            offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.A_HYPOTHECATION_OF_GOODS_AND_RECEIVABLES);
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

    setAnusuchis(data) {
        const formArray = this.form.get('anusuchis') as FormArray;
        if (data.length === 0) {
            this.addEmptyAnusuchi();
            return;
        }
        data.forEach(value => {
            formArray.push(this.formBuilder.group({
                name: [value.name],
                quantity: [value.quantity],
                amount: [value.amount],
                remarks: [value.remarks],
            }));
        });
    }

    addEmptyAnusuchi() {
        (this.form.get('anusuchis') as FormArray).push(
            this.formBuilder.group({
                name: [undefined],
                quantity: [undefined],
                amount: [undefined],
                remarks: [undefined],
            }));
    }

    removeAnusuchi(index) {
        (this.form.get('anusuchis') as FormArray).removeAt(index);
    }


    setFinanceGuarantors(data) {
        const formArray = this.form.get('financeGuarantors') as FormArray;
        if (data.length === 0) {
            this.addEmptyFinanceGuarantor();
            return;
        }
        data.forEach(value => {
            formArray.push(this.formBuilder.group({
                name: [value.name],
            }));
        });
    }

    addEmptyFinanceGuarantor() {
        (this.form.get('financeGuarantors') as FormArray).push(
            this.formBuilder.group({
                name: [undefined],
            }));
    }

    removeFinanceGuarantor(index) {
        (this.form.get('financeGuarantors') as FormArray).removeAt(index);
    }

    setGuarantors(data) {
        const formArray = this.form.get('guarantors') as FormArray;
        if (data.length === 0) {
            this.addEmptyGuarantor();
            return;
        }
        data.forEach(value => {
            formArray.push(this.formBuilder.group({
                name: [value.name],
            }));
        });
    }

    addEmptyGuarantor() {
        (this.form.get('guarantors') as FormArray).push(
            this.formBuilder.group({
                name: [undefined],
            }));
    }

    removeGuarantor(index) {
        (this.form.get('guarantors') as FormArray).removeAt(index);
    }

    buildForm() {
        this.form = this.formBuilder.group({
            financePlace: [undefined],
            financeBranch: [undefined],
            customerName: [undefined],
            customerAddress: [undefined],
            transactionPlace: [undefined],
            regNum: [undefined],
            regDate: [undefined],
            regOffice: [undefined],
            properitierName: [undefined],
            properitierAge: [undefined],
            properitierCitizenNum: [undefined],
            properitierCitizenAddress: [undefined],
            properitierCurrentAddress: [undefined],
            properitierParentName: [undefined],
            properitierGrandParentName: [undefined],
            loanApproveDate: [undefined],
            loanApprovePasa: [undefined],
            jamanatAmount: [undefined],
            jamanatOther: [undefined],
            jamanatOtherAmount: [undefined],
            cashCreditAmount: [undefined],
            revolvingAmount: [undefined],
            demandLoanAmount: [undefined],
            fixedTermAmount: [undefined],
            koshOther1: [undefined],
            koshOtherAmount1: [undefined],
            koshOther2: [undefined],
            koshOtherAmount2: [undefined],
            totalLimitAmount: [undefined],
            totalLimitAmountInWords: [undefined],
            docYear: [undefined],
            docMonth: [undefined],
            docDate: [undefined],
            docRoj: [undefined],
            docSubham: [undefined],

            guarantors: this.formBuilder.array([]),
            financeGuarantors: this.formBuilder.array([]),
            anusuchis: this.formBuilder.array([]),
        });
    }

    getNumAmountWord(numLabel, wordLabel) {
        const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
        const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
        this.form.get(wordLabel).patchValue(returnVal);
    }

    addAmounts() {
        let total = 0;
        let res;
        const toAddFormControl = [
            'jamanatAmount',
            'jamanatOtherAmount',
            'cashCreditAmount',
            'revolvingAmount',
            'demandLoanAmount',
            'fixedTermAmount',
            'koshOtherAmount1',
            'koshOtherAmount2',
        ];
        toAddFormControl.forEach(f => {
            res = +this.nepToEngNumberPipe.transform(this.form.get(f).value);
            total += res;
            this.form.patchValue({
                totalLimitAmount: this.engToNepNumberPipe.transform(total.toString()),
                totalLimitAmountInWords: this.nepaliCurrencyWordPipe.transform(total)
            });
        });
    }
}