import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ExcelOfferLetterConst} from '../../../../cad-documents/cad-document-core/excel-offer-letter/excel-offer-letter-const';
import {NbDialogRef} from '@nebular/theme';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {CustomerOfferLetter} from '../../../../loan/model/customer-offer-letter';
import {OfferDocument} from '../../../model/OfferDocument';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {ToastService} from '../../../../../@core/utils';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {CustomerOfferLetterService} from '../../../../loan/service/customer-offer-letter.service';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CadDocStatus} from '../../../model/CadDocStatus';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';

@Component({
    selector: 'app-pg-firm',
    templateUrl: './pg-firm.component.html',
    styleUrls: ['./pg-firm.component.scss']
})
export class PgFirmComponent implements OnInit {

    @Input() offerLetterType;
    @Input() cadOfferLetterApprovedDoc;
    spinner;
    form: FormGroup;
    offerLetterConst = ExcelOfferLetterConst;
    customerOfferLetter: CustomerOfferLetter;
    initialInfoPrint;
    existingOfferLetter = false;
    offerLetterDocument: OfferDocument;
    nepaliData;


    constructor(
        private dialogRef: NbDialogRef<PgFirmComponent>,
        private formBuilder: FormBuilder,
        private nepToEngNumberPipe: NepaliToEngNumberPipe,
        private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
        private administrationService: CreditAdministrationService,
        private toastService: ToastService,
        private routerUtilsService: RouterUtilsService,
        private customerOfferLetterService: CustomerOfferLetterService,
    ) {
    }

    ngOnInit() {
        this.buildForm();
        this.checkOfferLetter();
    }

    fillForm() {
        this.nepaliData = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
        if (this.nepaliData.guarantorDetails.length > 0) {
            this.setGuarantors(this.nepaliData.guarantorDetails);
        }
        this.form.patchValue({
            customerPermanentDistrict: this.nepaliData.permanentDistrict ? this.nepaliData.permanentDistrict : '',
            customerPermanentMunicipality: this.nepaliData.permanentMunicipality ? this.nepaliData.permanentMunicipality : '',
            customerPermanentWard: this.nepaliData.permanentWard ? this.nepaliData.permanentWard : '',
            customerTemporaryDistrict: this.nepaliData.temporaryDistrict ? this.nepaliData.temporaryDistrict : '',
            customerTemporaryMunicipality: this.nepaliData.temporaryMunicipality ? this.nepaliData.temporaryMunicipality : '',
            customerTemporaryWard: this.nepaliData.temporaryWard ? this.nepaliData.temporaryWard : '',
            customerName: this.nepaliData.name ? this.nepaliData.name : '',

        });
    }

    checkOfferLetter() {
        this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
            === this.offerLetterConst.value(this.offerLetterConst.PGFIRM).toString())[0];
        if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
            this.offerLetterDocument = new OfferDocument();
            this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.PGFIRM);
            this.fillForm();
        } else {
            const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
            this.initialInfoPrint = initialInfo;
            this.existingOfferLetter = true;
            this.setGuarantors(initialInfo.guarantors);
            this.form.patchValue(initialInfo);
        }
    }

    submit(): void {
        this.spinner = true;
        this.cadOfferLetterApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;

        if (this.existingOfferLetter) {
            this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
                if (offerLetterPath.docName.toString() ===
                    this.offerLetterConst.value(this.offerLetterConst.PGFIRM).toString()) {
                    offerLetterPath.initialInformation = JSON.stringify(this.form.value);
                }
            });
        } else {
            const offerDocument = new OfferDocument();
            offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.PGFIRM);
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

    setGuarantors(data) {
        const formArray = this.form.get('guarantors') as FormArray;
        if (data.length === 0) {
            this.addEmptyGuarantor();
            return;
        }
        data.forEach(value => {
            formArray.push(this.formBuilder.group({
                district: [value.district],
                municipality: [value.municipality],
                wardNum: [value.wardNum],
                age: [value.age],
                name: [value.name],
            }));
        });
    }

    addEmptyGuarantor() {
        (this.form.get('guarantors') as FormArray).push(
            this.formBuilder.group({
                district: [undefined],
                municipality: [undefined],
                wardNum: [undefined],
                age: [undefined],
                name: [undefined],
            }));
    }

    removeGuarantor(index) {
        (this.form.get('guarantors') as FormArray).removeAt(index);
    }


    buildForm() {
        this.form = this.formBuilder.group({
            branch: [undefined],

            jamanikartaGrandParent: [undefined],
            jamanikartaParent: [undefined],
            jamanikartaSpouse: [undefined],
            jamanikartaInLaws: [undefined],

            jamanikartaPermanentDistrict: [undefined],
            jamanikartaPermanentMunicipality: [undefined],
            jamanikartaPermanentWardNum: [undefined],
            jamanikartaTemporaryDistrict: [undefined],
            jamanikartaTemporaryMunicipality: [undefined],
            jamanikartaTemporaryWardNum: [undefined],

            jamanikartaCitizenshipIssueDate: [undefined],
            jamanikartaCitizenshipIssuePlace: [undefined],
            jamanikartaCitizenshipNum: [undefined],

            jamanikartaAge: [undefined],
            jamanikartaName: [undefined],

            office: [undefined],
            date: [undefined],
            registrationNum: [undefined],
            customerPermanentDistrict: [undefined],
            customerPermanentMunicipality: [undefined],
            customerPermanentWard: [undefined],
            customerTemporaryDistrict: [undefined],
            customerTemporaryMunicipality: [undefined],
            customerTemporaryWard: [undefined],
            customerName: [undefined],

            amount: [undefined],
            amountInWords: [undefined],

            docYear: [undefined],
            docMonth: [undefined],
            docDay: [undefined],
            docTime: [undefined],

            guarantors: this.formBuilder.array([]),

            employeeName: [undefined],
        });
    }

    getNumAmountWord(numLabel, wordLabel) {
        const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
        const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
        this.form.get(wordLabel).patchValue(returnVal);
    }

}
