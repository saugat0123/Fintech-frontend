import {Component, Input, OnInit} from '@angular/core';
import {ProgressiveOfferLetterConst} from '../../progressive-offer-letter-const';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {CustomerOfferLetter} from '../../../../../loan/model/customer-offer-letter';
import {OfferDocument} from '../../../../model/OfferDocument';
import {NbDialogRef} from '@nebular/theme';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {CustomerOfferLetterService} from '../../../../../loan/service/customer-offer-letter.service';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CadDocStatus} from '../../../../model/CadDocStatus';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';

@Component({
    selector: 'app-promissory-note',
    templateUrl: './promissory-note.component.html',
    styleUrls: ['./promissory-note.component.scss']
})
export class PromissoryNoteComponent implements OnInit {

    @Input() offerLetterType;
    @Input() cadOfferLetterApprovedDoc;
    spinner;
    form: FormGroup;
    offerLetterConst = ProgressiveOfferLetterConst;
    customerOfferLetter: CustomerOfferLetter;
    initialInfoPrint;
    existingOfferLetter = false;
    offerLetterDocument: OfferDocument;
    nepaliData;

    constructor(private dialogRef: NbDialogRef<PromissoryNoteComponent>,
                private formBuilder: FormBuilder,
                private nepToEngNumberPipe: NepaliToEngNumberPipe,
                private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
                private administrationService: CreditAdministrationService,
                private toastService: ToastService,
                private routerUtilsService: RouterUtilsService,
                private customerOfferLetterService: CustomerOfferLetterService) {
    }

    ngOnInit() {
        this.buildForm();
        this.checkOfferLetter();
    }

    fillForm() {
        this.nepaliData = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);

        this.form.patchValue({
            customerName: this.nepaliData.name ? this.nepaliData.name : '',
        });
        console.log('1st')
        this.setGuarantorDetails(this.nepaliData.guarantorDetails);
        this.setsecGuarantorDetails(this.nepaliData.guarantorDetails);
        console.log('2nd')
    }

    checkOfferLetter() {
        this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
            === this.offerLetterConst.value(this.offerLetterConst.PROMISSORY_NOTE).toString())[0];
        if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
            this.offerLetterDocument = new OfferDocument();
            this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.PROMISSORY_NOTE);
            this.fillForm();
        } else {
            const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
            this.initialInfoPrint = initialInfo;
            this.existingOfferLetter = true;
            this.setGuarantorDetails(initialInfo.guarantorDetails);
            this.setsecGuarantorDetails(initialInfo.secguarantorDetails);
            this.form.patchValue(initialInfo);
        }
    }

    onSubmit(): void {
        this.spinner = true;
        this.cadOfferLetterApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;

        if (this.existingOfferLetter) {
            this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
                if (offerLetterPath.docName.toString() ===
                    this.offerLetterConst.value(this.offerLetterConst.PROMISSORY_NOTE).toString()) {
                    offerLetterPath.initialInformation = JSON.stringify(this.form.value);
                }
            });
        } else {
            const offerDocument = new OfferDocument();
            offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.PROMISSORY_NOTE);
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

    buildForm() {
        this.form = this.formBuilder.group({
            grandParentName: [undefined],
            fatherName: [undefined],
            motherName: [undefined],
            husbandName: [undefined],
            districtName: [undefined],
            municipality: [undefined],
            wadNo: [undefined],
            temporaryDistrict: [undefined],
            tempMunicipality: [undefined],
            tempWadNo: [undefined],
            age: [undefined],
            customerName: [undefined],
            citizenShipNo: [undefined],
            date: [undefined],
            cdoOffice: [undefined],
            branchName: [undefined],
            amount: [undefined],
            amountInNumber: [undefined],
            sincerlyName: [undefined],
            sabikVDC:[undefined],
            sincerlySign: [undefined],
            sincerlyCitizenshipNo: [undefined],
            sincerlyDate: [undefined],
            sincerlyCDOoffice: [undefined],
            sincerlyPermanentMunicipality: [undefined],
            sincerlyPermanentDistrict: [undefined],
            sincerlyPermanentWadNo: [undefined],
            sabikWadNo: [undefined],
            sincerlyTemporaryDistrict: [undefined],
            sincerlyTemporaryVDCname: [undefined],
            sincerlyTemporaryWadNo: [undefined],
            sincerlyParentName: [undefined],
            sincerlyGrandParentName: [undefined],
            sincerlyHusbandWifeName: [undefined],
            guarantor2WadNo: [undefined],
            IdentifiedGuarantorName: [undefined],
            IdentifiedHintNo: [undefined],
            ItisambatYear: [undefined],
            ItisambatMonth: [undefined],
            ItisambatDay: [undefined],
            ItisambatTime: [undefined],
            ItisambatRojSubham: [undefined],
            MinistryOffice: [undefined],
            DepartmentName: [undefined],
            RegisterOffice: [undefined],
            Act: [undefined],
            UnderName: [undefined],
            UnderDate: [undefined],
            PraliNo: [undefined],
            ServiceOfficeName: [undefined],
            CertifiedCompany: [undefined],
            certificateNo: [undefined],
            CertifiedDistrict: [undefined],
            CertifiedMunicipality: [undefined],
            CertifiedWadNo: [undefined],
            bottomGrandfatherName: [undefined],
            bottomGrandMotherName: [undefined],
            bottomFatherName: [undefined],
            bottomMotherName: [undefined],
            bottomHusbandName: [undefined],
            bottomDistrictName: [undefined],
            bottomMunicipalityName: [undefined],
            bottomWadNo: [undefined],
            bottomTempDistrict: [undefined],
            bottomTempMunicipality: [undefined],
            bottomTempWadNo: [undefined],
            bottomAge: [undefined],
            bottoCustomerName: [undefined],
            bottoCustomerCizenshipNo: [undefined],
            bottomDate: [undefined],
            bottomCDOoffice: [undefined],
            bottomBranchName: [undefined],
            bottomAmount: [undefined],
            bottomAmountInWord: [undefined],
            bottomSincerlySign: [undefined],
            AkhtiyarName: [undefined],
            bottomSincerlyCitizenShipNo: [undefined],
            bottomSincerlyDate: [undefined],
            bottomSincerlyCDOoffice: [undefined],
            AkhtiyarPermanentDistrict: [undefined],
            AkhtiyarPermanentVDC: [undefined],
            AkhtiyarPermanentWadNo: [undefined],
            SabikVDC: [undefined],
            SabikWadNo: [undefined],
            AkhtiyarTempDistrict: [undefined],
            AkhtiyarTempVDC: [undefined],
            AkhtiyarTempWadNo: [undefined],
            buttomSincerlyParentName: [undefined],
            buttomSincerlyGrandParentName: [undefined],
            buttomSincerlyHusbandName: [undefined],
            buttomIdentifiedGuarantorName: [undefined],
            buttomIdentifiedHintNo: [undefined],
            buttomItisambatYear: [undefined],
            buttomItisambatMonth: [undefined],
            buttomItisambatDay: [undefined],
            buttomItisambatTime: [undefined],
            buttomItisambatRojSubham: [undefined],
            guarantorDetails: this.formBuilder.array([]),
            secguarantorDetails: this.formBuilder.array([])

        })
    }

    addGuarantor(): void {
        const formArray = this.form.get('guarantorDetails') as FormArray;
        formArray.push(this.guarantorFormGroup());
    }

    removeGuarantor(index: number): void {
        const formArray = this.form.get('guarantorDetails') as FormArray;
        formArray.removeAt(index);
    }


    guarantorFormGroup(): FormGroup {
        return this.formBuilder.group({
            name: [undefined],
            citizenNumber: [undefined],
            issuedYear: [undefined],
            guarantorCDOoffice: [undefined],
            guarantorDistrict: [undefined],
            guarantorMunicipality: [undefined],
            guarantorWadNo: [undefined]
        })
    }


    setGuarantorDetails(data) {
        const formArray = this.form.get('guarantorDetails') as FormArray;
        if (data.length === 0) {
            this.addGuarantor();
            return;
        }
        data.forEach((value) => {
            formArray.push(this.formBuilder.group({
                name: [value.name],
                citizenNumber: [value.citizenNumber],
                issuedYear: [value.issuedYear],
                guarantorCDOoffice: [value.guarantorCDOoffice],
                guarantorDistrict: [value.guarantorDistrict],
                guarantorMunicipality: [value.guarantorMunicipality],
                guarantorWadNo: [value.guarantorWadNo]
            }))
        })
    }

    secaddGuarantor(): void {
        const formArray = this.form.get('secguarantorDetails') as FormArray;
        formArray.push(this.secguarantorFormGroup());
    }

    secremoveGuarantor(index: number): void {
        const formArray = this.form.get('secguarantorDetails') as FormArray;
        formArray.removeAt(index);
    }


    secguarantorFormGroup(): FormGroup {
        return this.formBuilder.group({
            name: [undefined],
            citizenNumber: [undefined],
            issuedYear: [undefined],
            guarantorCDOoffice: [undefined],
            guarantorDistrict: [undefined],
            guarantorMunicipality: [undefined],
            guarantorWadNo: [undefined]
        })
    }


    setsecGuarantorDetails(data) {
        const formArray = this.form.get('secguarantorDetails') as FormArray;
        if (data.length === 0) {
            this.secaddGuarantor();
            return;
        }
        data.forEach((value) => {
            formArray.push(this.formBuilder.group({
                name: [value.name],
                citizenNumber: [value.citizenNumber],
                issuedYear: [value.issuedYear],
                guarantorCDOoffice: [value.guarantorCDOoffice],
                guarantorDistrict: [value.guarantorDistrict],
                guarantorMunicipality: [value.guarantorMunicipality],
                guarantorWadNo: [value.guarantorWadNo]
            }))
        })
    }


    getNumAmountWord(numLabel, wordLabel) {
        const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
        const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
        this.form.get(wordLabel).patchValue(returnVal);
    }
}
