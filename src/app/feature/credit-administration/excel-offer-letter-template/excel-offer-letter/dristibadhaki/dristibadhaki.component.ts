import {Component, Input, OnInit} from '@angular/core';
import {NbDialogRef} from '@nebular/theme';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ExcelOfferLetterConst} from '../../../../cad-documents/cad-document-core/excel-offer-letter/excel-offer-letter-const';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ToastService} from '../../../../../@core/utils';
import {CustomerOfferLetterService} from '../../../../loan/service/customer-offer-letter.service';
import {CustomerOfferLetter} from '../../../../loan/model/customer-offer-letter';
import {CadDocStatus} from '../../../model/CadDocStatus';
import {OfferDocument} from '../../../model/OfferDocument';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';

@Component({
    selector: 'app-dristibadhaki',
    templateUrl: './dristibadhaki.component.html',
    styleUrls: ['./dristibadhaki.component.scss']
})
export class DristibadhakiComponent implements OnInit {
    @Input() offerLetterType;
    @Input() cadOfferLetterApprovedDoc;
    spinner;
    form: FormGroup;
    offerLetterConst = ExcelOfferLetterConst;
    customerOfferLetter: CustomerOfferLetter;
    initialInfoPrint;
    existingOfferLetter = false;
    offerLetterDocument: OfferDocument;


    constructor(
        private dialogRef: NbDialogRef<DristibadhakiComponent>,
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

    checkOfferLetter() {
        this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
            === this.offerLetterConst.value(this.offerLetterConst.DRISTIBANDHAKI).toString())[0];
        if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
            this.offerLetterDocument = new OfferDocument();
            this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.DRISTIBANDHAKI);
            this.fillForm();
        } else {
            const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
            this.initialInfoPrint = initialInfo;
            this.existingOfferLetter = true;
            this.form.patchValue(initialInfo);
        }
    }

    fillForm() {
        const nepaliData = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
        this.form.patchValue({
            grandParent: nepaliData.grandFatherName ? nepaliData.grandFatherName : '',
            parent: nepaliData.fatherName ? nepaliData.fatherName : '',
            permanentDistrict: nepaliData.permanentDistrict ? nepaliData.permanentDistrict : '',
            permanentMunicipalities: nepaliData.permanentMunicipality ? nepaliData.permanentMunicipality : '',
            permanentWard: nepaliData.permanentWard ? nepaliData.permanentWard : '',
            temporaryDistrict: nepaliData.temporaryDistrict ? nepaliData.temporaryDistrict : '',
            temporaryMunicipalities: nepaliData.temporaryMunicipality ? nepaliData.temporaryMunicipality : '',
            temporaryWard: nepaliData.temporaryWard ? nepaliData.temporaryWard : '',
            age: nepaliData.age ? nepaliData.age : '',
            // guarantor: [undefined],
            // ministry: [undefined],
            // department: [undefined],
            // office: [undefined],
            // date: [undefined],
            // registrationNumber: [undefined],
            // companyDistrict: [undefined],
            // companyMunicipalities: [undefined],
            // number: [undefined],
            // company: [undefined],
            // guarantorGrandParent: [undefined],
            // guarantorParent: [undefined],
            // guarantorDistrict: [undefined],
            // guarantorMunicipalities: [undefined],
            // guarantorWard: [undefined],
            // guarantorAge: [undefined],
            name: nepaliData.name ? nepaliData.name : '',
            // creditor: [undefined],
            // freight: [undefined],
            // self: [undefined],
        });
    }

    submit(): void {
        this.spinner = true;
        this.cadOfferLetterApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;

        if (this.existingOfferLetter) {
            this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
                if (offerLetterPath.docName.toString() ===
                    this.offerLetterConst.value(this.offerLetterConst.DRISTIBANDHAKI).toString()) {
                    offerLetterPath.initialInformation = JSON.stringify(this.form.value);
                }
            });
        } else {
            const offerDocument = new OfferDocument();
            offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.DRISTIBANDHAKI);
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
            grandParent: [undefined],
            parent: [undefined],
            permanentDistrict: [undefined],
            permanentMunicipalities: [undefined],
            permanentWard: [undefined],
            temporaryDistrict: [undefined],
            temporaryMunicipalities: [undefined],
            temporaryWard: [undefined],
            age: [undefined],
            guarantor: [undefined],
            ministry: [undefined],
            department: [undefined],
            office: [undefined],
            date: [undefined],
            registrationNumber: [undefined],
            companyDistrict: [undefined],
            companyMunicipalities: [undefined],
            number: [undefined],
            company: [undefined],
            guarantorGrandParent: [undefined],
            guarantorParent: [undefined],
            guarantorDistrict: [undefined],
            guarantorMunicipalities: [undefined],
            guarantorWard: [undefined],
            guarantorAge: [undefined],
            name: [undefined],
            amountInNumber: [undefined],
            amountInWord: [undefined],
            creditor: [undefined],
            freight: [undefined],
            self: [undefined],
        });
    }

    getNumAmountWord(numLabel, wordLabel) {
        const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
        const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
        this.form.get(wordLabel).patchValue(returnVal);
    }
}
