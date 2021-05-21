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
    selector: 'app-pg-retail-loan',
    templateUrl: './pg-retail-loan.component.html',
    styleUrls: ['./pg-retail-loan.component.scss']
})
export class PgRetailLoanComponent implements OnInit {


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
        private dialogRef: NbDialogRef<PgRetailLoanComponent>,
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
        this.form.patchValue({
            customerPermanentDistrict2: this.nepaliData.permanentDistrict ? this.nepaliData.permanentDistrict : '',
            customerPermanentMunicipality2: this.nepaliData.permanentMunicipality ? this.nepaliData.permanentMunicipality : '',
            customerPermanentWard2: this.nepaliData.permanentWard ? this.nepaliData.permanentWard : '',
            customerTemporaryDistrict2: this.nepaliData.temporaryDistrict ? this.nepaliData.temporaryDistrict : '',
            customerTemporaryMunicipality2: this.nepaliData.temporaryMunicipality ? this.nepaliData.temporaryMunicipality : '',
            customerTemporaryWard2: this.nepaliData.temporaryWard ? this.nepaliData.temporaryWard : '',
            customerCitizenshipIssueDate2: this.nepaliData.citizenshipIssueDate ? this.nepaliData.citizenshipIssueDate : '',
            customerCitizenshipIssuePlace2: this.nepaliData.citizenshipIssueDistrict ? this.nepaliData.citizenshipIssueDistrict : '',
            customerCitizenshipNum2: this.nepaliData.citzenshipNo ? this.nepaliData.citzenshipNo : '',
            customerGrandParent2: this.nepaliData.grandFatherName ? this.nepaliData.grandFatherName : '',
            customerParent2: this.nepaliData.fatherName ? this.nepaliData.fatherName : '',
            customerSpouse2: this.nepaliData.husbandName ? this.nepaliData.husbandName : '',
            customerInLaws2: this.nepaliData.fatherInLawName ? this.nepaliData.fatherInLawName : '',
            customerAge2: this.nepaliData.age ? this.nepaliData.age : '',
            customerName: this.nepaliData.name ? this.nepaliData.name : '',
        });
        this.setGuarantors(this.nepaliData.guarantorDetails);
    }

    checkOfferLetter() {
        this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
            === this.offerLetterConst.value(this.offerLetterConst.PGRETAILLOAN).toString())[0];
        if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
            this.offerLetterDocument = new OfferDocument();
            this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.PGRETAILLOAN);
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
                    this.offerLetterConst.value(this.offerLetterConst.PGRETAILLOAN).toString()) {
                    offerLetterPath.initialInformation = JSON.stringify(this.form.value);
                }
            });
        } else {
            const offerDocument = new OfferDocument();
            offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.PGRETAILLOAN);
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

            relative: [undefined],
            customerGrandParent: [undefined],
            customerParent: [undefined],
            customerSpouse: [undefined],
            customerInLaws: [undefined],

            customerPermanentDistrict: [undefined],
            customerPermanentMunicipality: [undefined],
            customerPermanentWard: [undefined],
            customerTemporaryDistrict: [undefined],
            customerTemporaryMunicipality: [undefined],
            customerTemporaryWard: [undefined],

            customerCitizenshipIssueDate: [undefined],
            customerCitizenshipIssuePlace: [undefined],
            customerCitizenshipNum: [undefined],
            customerAge: [undefined],

            customerGrandParent2: [undefined],
            customerParent2: [undefined],
            customerSpouse2: [undefined],
            customerInLaws2: [undefined],

            customerPermanentDistrict2: [undefined],
            customerPermanentMunicipality2: [undefined],
            customerPermanentWard2: [undefined],
            customerTemporaryDistrict2: [undefined],
            customerTemporaryMunicipality2: [undefined],
            customerTemporaryWard2: [undefined],

            customerCitizenshipIssueDate2: [undefined],
            customerCitizenshipIssuePlace2: [undefined],
            customerCitizenshipNum2: [undefined],

            customerAge2: [undefined],
            customerName: [undefined],

            loanPlan: [undefined],
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
