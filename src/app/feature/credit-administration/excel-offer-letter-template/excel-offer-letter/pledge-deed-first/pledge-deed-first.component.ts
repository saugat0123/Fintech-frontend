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
    selector: 'app-pledge-deed-first',
    templateUrl: './pledge-deed-first.component.html',
    styleUrls: ['./pledge-deed-first.component.scss']
})
export class PledgeDeedFirstComponent implements OnInit {

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
        private dialogRef: NbDialogRef<PledgeDeedFirstComponent>,
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
            customerTemporaryDistrict: this.nepaliData.temporaryDistrict ? this.nepaliData.temporaryDistrict : '',
            customerTemporaryMunicipality: this.nepaliData.temporaryMunicipality ? this.nepaliData.temporaryMunicipality : '',
            customerTemporaryWard: this.nepaliData.temporaryWard ? this.nepaliData.temporaryWard : '',
            customerCitizenshipIssueDate: this.nepaliData.citizenshipIssueDate ? this.nepaliData.citizenshipIssueDate : '',
            customerCitizenshipIssuePlace: this.nepaliData.citizenshipIssueDistrict ? this.nepaliData.citizenshipIssueDistrict : '',
            customerCitizenshipNum: this.nepaliData.citzenshipNo ? this.nepaliData.citzenshipNo : '',
            customerGrandParent: this.nepaliData.grandFatherName ? this.nepaliData.grandFatherName : '',
            customerParent: this.nepaliData.fatherName ? this.nepaliData.fatherName : '',
            customerSpouse: this.nepaliData.husbandName ? this.nepaliData.husbandName : '',
            customerInLaws: this.nepaliData.fatherInLawName ? this.nepaliData.fatherInLawName : '',
            customerAge: this.nepaliData.age ? this.nepaliData.age : '',
            customerName: this.nepaliData.name ? this.nepaliData.name : '',
        });
        this.addEmptyTapsil();
        this.addEmptySecurity();
        this.addEmptyShareBond();
        this.setGuarantors(this.nepaliData.guarantorDetails);
    }

    checkOfferLetter() {
        this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
            === this.offerLetterConst.value(this.offerLetterConst.PLEDGEDEEDFIRST
            ).toString())[0];
        if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
            this.offerLetterDocument = new OfferDocument();
            this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.PLEDGEDEEDFIRST
            );
            this.fillForm();
        } else {
            const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
            this.initialInfoPrint = initialInfo;
            this.existingOfferLetter = true;
            this.setSecurities(initialInfo.securities);
            this.setShareBonds(initialInfo.shareBonds);
            this.setTapsils(initialInfo.tapsils);
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
                    this.offerLetterConst.value(this.offerLetterConst.PLEDGEDEEDFIRST
                    ).toString()) {
                    offerLetterPath.initialInformation = JSON.stringify(this.form.value);
                }
            });
        } else {
            const offerDocument = new OfferDocument();
            offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.PLEDGEDEEDFIRST
            );
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

    setTapsils(data) {
        const formArray = this.form.get('tapsils') as FormArray;
        if (data.length === 0) {
            this.addEmptyTapsil();
            return;
        }
        data.forEach(value => {
            formArray.push(this.formBuilder.group({
                bank: [value.bank],
                receiptNum: [value.receiptNum],
                date: [value.date],
                amount: [value.amount],
                rate: [value.rate],
                repayDate: [value.repayDate],
                kaifiyat: [value.kaifiyat],
            }));
        });
    }

    addEmptyTapsil() {
        (this.form.get('tapsils') as FormArray).push(
            this.formBuilder.group({
                bank: [undefined],
                receiptNum: [undefined],
                date: [undefined],
                amount: [undefined],
                rate: [undefined],
                repayDate: [undefined],
                kaifiyat: [undefined],

            }));
    }

    removeTapsil(index) {
        (this.form.get('tapsils') as FormArray).removeAt(index);
    }

    setShareBonds(data) {
        const formArray = this.form.get('shareBonds') as FormArray;
        if (data.length === 0) {
            this.addEmptyShareBond();
            return;
        }
        data.forEach(value => {
            formArray.push(this.formBuilder.group({
                company: [value.company],
                companyNum: [value.companyNum],
                numStartDate: [value.numStartDate],
                numEndDate: [value.numEndDate],
                numTotal: [value.numTotal],
                repayAmount: [value.repayAmount],
                kaifiyat: [value.kaifiyat],
            }));
        });
    }

    addEmptyShareBond() {
        (this.form.get('shareBonds') as FormArray).push(
            this.formBuilder.group({
                company: [undefined],
                companyNum: [undefined],
                numStartDate: [undefined],
                numEndDate: [undefined],
                numTotal: [undefined],
                repayAmount: [undefined],
                kaifiyat: [undefined],
            }));
    }

    removeShareBond(index) {
        (this.form.get('shareBonds') as FormArray).removeAt(index);
    }

    setSecurities(data) {
        const formArray = this.form.get('securities') as FormArray;
        if (data.length === 0) {
            this.addEmptySecurity();
            return;
        }
        data.forEach(value => {
            formArray.push(this.formBuilder.group({
                type: [value.type],
                department: [value.department],
                sn: [value.sn],
                amount: [value.amount],
                issueDate: [value.issueDate],
                payDate: [value.payDate],
                rate: [value.rate],
                kafiyat: [value.kafiyat],
            }));
        });
    }

    addEmptySecurity() {
        (this.form.get('securities') as FormArray).push(
            this.formBuilder.group({
                type: [undefined],
                department: [undefined],
                sn: [undefined],
                amount: [undefined],
                payDate: [undefined],
                issueDate: [undefined],
                rate: [undefined],
                kafiyat: [undefined],
            }));
    }

    removeSecurity(index) {
        (this.form.get('securities') as FormArray).removeAt(index);
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

            registrationOffice: [undefined],
            registrationDate: [undefined],
            registrationNum: [undefined],

            registrationDistrict: [undefined],
            registrationMunicipality: [undefined],
            registrationWardNum: [undefined],
            registrationDistrict2: [undefined],
            registrationMunicipality2: [undefined],
            registrationWardNum2: [undefined],
            registrationName: [undefined],

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
            customerName: [undefined],

            customerOccupation: [undefined],
            date: [undefined],
            loanPlan: [undefined],
            amount: [undefined],
            amountInWords: [undefined],
            loanerSecurity: [undefined],
            loanerRights: [undefined],
            loanerRights2: [undefined],

            tapsils: this.formBuilder.array([]),
            shareBonds: this.formBuilder.array([]),
            securities: this.formBuilder.array([]),

            docYear: [undefined],
            docMonth: [undefined],
            docDay: [undefined],
            docTime: [undefined],
            docText: [undefined],
            docAmount: [undefined],
            docDate: [undefined],
            authorizedGuarantor: [undefined],

            guarantors: this.formBuilder.array([]),

            employeeName: [undefined]

        });
    }

    getNumAmountWord(numLabel, wordLabel) {
        const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
        const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
        this.form.get('docAmount').patchValue(returnVal);
        this.form.get(wordLabel).patchValue(returnVal);
    }

}
