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
    selector: 'app-continuation-deed',
    templateUrl: './continuation-deed.component.html',
    styleUrls: ['./continuation-deed.component.scss']
})
export class ContinuationDeedComponent implements OnInit {

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
        private dialogRef: NbDialogRef<ContinuationDeedComponent>,
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
            customerPermanentDistrict: this.nepaliData.permanentDistrict ? this.nepaliData.permanentDistrict : '',
            customerPermanentMunicipality: this.nepaliData.permanentMunicipality ? this.nepaliData.permanentMunicipality : '',
            customerPermanentWard: this.nepaliData.permanentWard ? this.nepaliData.permanentWard : '',
            address6: [undefined],
            customerTemporaryDistrict: this.nepaliData.temporaryDistrict ? this.nepaliData.temporaryDistrict : '',
            customerTemporaryMunicipality: this.nepaliData.temporaryMunicipality ? this.nepaliData.temporaryMunicipality : '',
            customerTemporaryWard: this.nepaliData.temporaryWard ? this.nepaliData.temporaryWard : '',
            address7: [undefined],
            customerCitizenshipIssueDate: this.nepaliData.citizenshipIssueDate ? this.nepaliData.citizenshipIssueDate : '',
            customerCitizenshipIssuePlace: this.nepaliData.citizenshipIssueDistrict ? this.nepaliData.citizenshipIssueDistrict : '',
            customerCitizenshipNum: this.nepaliData.citzenshipNo ? this.nepaliData.citzenshipNo : '',
            customerGrandParent: this.nepaliData.grandFatherName ? this.nepaliData.grandFatherName : '',
            customerParent: this.nepaliData.fatherName ? this.nepaliData.fatherName : '',
            customerSpouse: this.nepaliData.husbandName ? this.nepaliData.husbandName : '',
            customerInLaws: this.nepaliData.fatherInLawName ? this.nepaliData.fatherInLawName : '',
            customerAge: this.nepaliData.age ? this.nepaliData.age : '',
            customerName: this.nepaliData.name ? this.nepaliData.name : '',

            tapsilLandOwnerName: [undefined],
            tapsilLandOwnerParent: [undefined],
            tapsilLandOwnerGrandParent: [undefined],

        });
        this.setGuarantors(this.nepaliData.guarantorDetails);
        this.addEmptyTapsil();
    }

    checkOfferLetter() {
        this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
            === this.offerLetterConst.value(this.offerLetterConst.CONTINUATIONDEED).toString())[0];
        if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
            this.offerLetterDocument = new OfferDocument();
            this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.CONTINUATIONDEED);
            this.fillForm();
        } else {
            const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
            this.initialInfoPrint = initialInfo;
            this.existingOfferLetter = true;
            this.setGuarantors(initialInfo.guarantors);
            this.setTapsil(initialInfo.tapsils);
            this.form.patchValue(initialInfo);
        }
    }

    submit(): void {
        this.spinner = true;
        this.cadOfferLetterApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;

        if (this.existingOfferLetter) {
            this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
                if (offerLetterPath.docName.toString() ===
                    this.offerLetterConst.value(this.offerLetterConst.CONTINUATIONDEED).toString()) {
                    offerLetterPath.initialInformation = JSON.stringify(this.form.value);
                }
            });
        } else {
            const offerDocument = new OfferDocument();
            offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.CONTINUATIONDEED);
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


    setTapsil(data) {
        const formArray = this.form.get('tapsils') as FormArray;
        if (data.length === 0) {
            this.addEmptyTapsil();
            return;
        }
        data.forEach(value => {
            formArray.push(this.formBuilder.group({
                district: [value.district],
                municipality: [value.municipality],
                wardNum: [value.wardNum],
                kittaNum: [value.kittaNum],
                area: [value.area],
                kaifiyat: [value.kaifiyat],
            }));
        });
    }

    addEmptyTapsil() {
        (this.form.get('tapsils') as FormArray).push(
            this.formBuilder.group({
                district: [undefined],
                municipality: [undefined],
                wardNum: [undefined],
                kittaNum: [undefined],
                area: [undefined],
                kaifiyat: [undefined],
            }));
    }

    removeTapsil(index) {
        (this.form.get('tapsils') as FormArray).removeAt(index);
    }

    setGuarantors(data) {
        const formArray = this.form.get('guarantors') as FormArray;
        if (!data || data.length === 0) {
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

            registrationOffice: [undefined],
            registrationYear: [undefined],
            registrationMonth: [undefined],
            registrationDay: [undefined],
            registrationNum: [undefined],

            registrationDistrict: [undefined],
            registrationMunicipality: [undefined],
            registrationWardNum: [undefined],

            registrationText: [undefined],
            registrationDistrict2: [undefined],
            registrationMunicipality2: [undefined],
            registrationWardNum2: [undefined],
            address2: [undefined],

            registrationName: [undefined],

            dhitowalaParent: [undefined],
            dhitowalaSpouse: [undefined],
            dhitowalaInLaws: [undefined],

            dhitowalaPermanentDistrict: [undefined],
            dhitowalaPermanentMunicipality: [undefined],
            dhitowalaPermanentWardNum: [undefined],
            address3: [undefined],
            dhitowalaAge: [undefined],
            dhitowalaName: [undefined],
            dhitowalaType: [undefined],

            aageCombination: [undefined],
            aageGrandParent: [undefined],
            aageParent: [undefined],
            aageSpouse: [undefined],
            aageInLaws: [undefined],
            aagePermanentDistrict: [undefined],
            aagePermanentMunicipality: [undefined],
            aagePermanentWardNum: [undefined],
            address4: [undefined],
            aageTemporaryDistrict: [undefined],
            aageTemporaryMunicipality: [undefined],
            aageTemporaryWardNum: [undefined],
            address5: [undefined],
            aageCitizenshipIssueDate: [undefined],
            aageCitizenshipIssuePlace: [undefined],
            aageCitizenshipNum: [undefined],
            aageAge: [undefined],
            aageName: [undefined],

            customerInLaws: [undefined],
            customerPermanentDistrict: [undefined],
            customerPermanentMunicipality: [undefined],
            customerPermanentWard: [undefined],
            address6: [undefined],
            customerTemporaryDistrict: [undefined],
            customerTemporaryMunicipality: [undefined],
            customerTemporaryWard: [undefined],
            address7: [undefined],
            customerCitizenshipIssueDate: [undefined],
            customerCitizenshipIssuePlace: [undefined],
            customerCitizenshipNum: [undefined],
            customerAge: [undefined],
            customerName: [undefined],

            etbl: [undefined],
            crt: [undefined],
            etilDate: [undefined],

            loanPlan: [undefined],

            amount: [undefined],
            amountInWords: [undefined],

            mapoka1: [undefined],
            mapokaDate: [undefined],
            marana: [undefined],
            date: [undefined],
            chana: [undefined],
            loanTitle: [undefined],


            tapsilLandOwnerName: [undefined],
            tapsilLandOwnerParent: [undefined],
            tapsilLandOwnerGrandParent: [undefined],

            docYear: [undefined],
            docMonth: [undefined],
            docDay: [undefined],
            docTime: [undefined],

            tapsils: this.formBuilder.array([]),
            guarantors: this.formBuilder.array([]),

            employeeName: [undefined]
        });
    }

    getNumAmountWord(numLabel, wordLabel) {
        const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
        const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
        this.form.get(wordLabel).patchValue(returnVal);
    }

}
