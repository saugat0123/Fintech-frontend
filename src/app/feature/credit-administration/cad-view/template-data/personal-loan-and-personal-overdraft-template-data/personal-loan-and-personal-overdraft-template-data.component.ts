import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {SbTranslateService} from '../../../../../@core/service/sbtranslate.service';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {NabilOfferLetterConst} from '../../../nabil-offer-letter-const';
import { NbDialogService} from '@nebular/theme';
import {CadDocStatus} from '../../../model/CadDocStatus';
import {OfferDocument} from '../../../model/OfferDocument';
import {Attributes} from '../../../../../@core/model/attributes';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ToastService} from '../../../../../@core/utils';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PersonalLoanAndPersonalOverdraftComponent} from '../../../mega-offer-letter-template/mega-offer-letter/personal-loan-and-personal-overdraft/personal-loan-and-personal-overdraft.component';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {EngToNepaliNumberPipe} from '../../../../../@core/pipe/eng-to-nepali-number.pipe';


@Component({
    selector: 'app-personal-loan-and-personal-overdraft-template-data',
    templateUrl: './personal-loan-and-personal-overdraft-template-data.component.html',
    styleUrls: ['./personal-loan-and-personal-overdraft-template-data.component.scss']
})
export class PersonalLoanAndPersonalOverdraftTemplateDataComponent implements OnInit {
    @Input() cadData: CustomerApprovedLoanCadDocumentation;
    @Input() customerApprovedDoc: CustomerApprovedLoanCadDocumentation;
    offerLetterTypes = [];
    offerLetterConst = NabilOfferLetterConst;
    offerLetterSelect;
    translatedValues: any = {};
    form: FormGroup;
    spinner = false;
    btnDisable = true;
    loanLimit = false;
    existingOfferLetter = false;
    attributes;
    tdValues: any = {};
    podtranslatedData;
    offerLetterDocument: OfferDocument;
    dateTypeBS = false;
    dateTypeAD = false;
    dateTypeBS1 = false;
    dateTypeAD1 = false;
    dateTypeBS2 = false;
    dateTypeAD2 = false;
    dateTypeBS3 = false;
    dateTypeAD3 = false;
    previewBtn = true;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private dialogService: NbDialogService,
        private modelService: NgbModal,
        private nepToEngNumberPipe: NepaliToEngNumberPipe,
        private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
        private translateService: SbTranslateService,
        private administrationService: CreditAdministrationService,
        private toastService: ToastService,
        private engToNepaliNumberPipe: EngToNepaliNumberPipe
    ) {
    }

    ngOnInit() {
        this.buildPersonal();
    }

    buildPersonal() {
        this.form = this.formBuilder.group({
            referenceNumber: [undefined],
            dateofApproval: [undefined],
            dateofApplication: [undefined],
            purposeofLoan: [undefined],
            baseRate: [undefined],
            premiumRate: [undefined],
            yearlyInterestRate: [undefined],
            loanAdminFeeinFigure: [undefined],
            loanAdminFeeinWords: [undefined],
            emiInFigure: [undefined],
            emiInWords: [undefined],
            loanExpiryDate: [undefined],
            accountNumber: [undefined],
            nameofCompanyCustomerWorking: [undefined],
            relationshipofficerName: [undefined],
            branchManager: [undefined],
            signatureDate: [undefined],
            staffName: [undefined],
            // translated value
            referenceNumberTransVal: [undefined, Validators.required],
            dateofApprovalTransVal: [undefined],
            dateofApplicationTransVal: [undefined],
            purposeofLoanTransVal: [undefined],
            baseRateTransVal: [undefined, Validators.required],
            premiumRateTransVal: [undefined, Validators.required],
            yearlyInterestRateTransVal: [undefined],
            loanAdminFeeinFigureTransVal: [undefined, Validators.required],
            loanAdminFeeinWordsTransVal: [undefined],
            emiInFigureTransVal: [undefined, Validators.required],
            emiInWordsTransVal: [undefined],
            loanExpiryDateTransVal: [undefined],
            accountNumberTransVal: [undefined, Validators.required],
            nameofCompanyCustomerWorkingTransVal: [undefined, Validators.required],
            relationshipofficerNameTransVal: [undefined, Validators.required],
            signatureDateTransVal: [undefined],
            branchManagerTransVal: [undefined, Validators.required],
            staffNameTransVal: [undefined, Validators.required],
        });
    }

    async translate() {
        this.spinner = true;
        this.podtranslatedData = await this.translateService.translateForm(this.form);
        this.tdValues = this.podtranslatedData;
        this.setTemplatedCTData();
        this.spinner = false;
        this.btnDisable = false;
    }
    private setTemplatedCTData(): void {
        // this.form.get('referenceNumberTransVal').patchValue(this.podtranslatedData.referenceNumber);
        this.form.get('dateofApprovalTransVal').patchValue(this.podtranslatedData.dateofApproval);
        this.form.get('dateofApplicationTransVal').patchValue(this.podtranslatedData.dateofApplication);
        this.form.get('purposeofLoanTransVal').patchValue(this.podtranslatedData.purposeofLoan);
        // this.form.get('baseRateTransVal').patchValue(this.podtranslatedData.baseRate);
        // this.form.get('premiumRateTransVal').patchValue(this.podtranslatedData.premiumRate);
        // this.form.get('yearlyInterestRateTransVal').patchValue(this.podtranslatedData.yearlyInterestRate);
        // this.form.get('loanAdminFeeinFigureTransVal').patchValue(this.podtranslatedData.loanAdminFeeinFigure);
        this.form.get('loanAdminFeeinWordsTransVal').patchValue(this.podtranslatedData.loanAdminFeeinWords);
        // this.form.get('emiInFigureTransVal').patchValue(this.podtranslatedData.emiInFigure);
        this.form.get('emiInWordsTransVal').patchValue(this.podtranslatedData.emiInWords);
        this.form.get('loanExpiryDateTransVal').patchValue(this.podtranslatedData.loanExpiryDate);
        // this.form.get('accountNumberTransVal').patchValue(this.podtranslatedData.accountNumber);
        this.form.get('nameofCompanyCustomerWorkingTransVal').patchValue(this.podtranslatedData.nameofCompanyCustomerWorking);
        this.form.get('relationshipofficerNameTransVal').patchValue(this.podtranslatedData.relationshipofficerName);
        this.form.get('branchManagerTransVal').patchValue(this.podtranslatedData.branchManager);
        this.form.get('signatureDateTransVal').patchValue(this.podtranslatedData.signatureDate);
        this.form.get('staffNameTransVal').patchValue(this.podtranslatedData.staffName);
    }

    getNumAmountWord(numLabel, wordLabel) {
        const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value.toString());
        this.form.get(numLabel + 'TransVal').patchValue(this.engToNepaliNumberPipe.transform(this.form.get(numLabel).value.toString()));
        const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
        this.form.get(wordLabel).patchValue(returnVal);
        this.form.get(wordLabel + 'TransVal').patchValue(returnVal);
    }
    translateNumber(source, target) {
        const wordLabelVar = this.engToNepaliNumberPipe.transform(this.form.get(source).value.toString());
        this.form.get(target).patchValue(wordLabelVar);
    }
    calInterestRate() {
        const baseRate = this.form.get('baseRate').value;
        const premiumRate = this.form.get('premiumRate').value;
        const sum = parseFloat(baseRate) + parseFloat(premiumRate);
        this.form.get('yearlyInterestRate').patchValue(sum);
        this.translateNumber('baseRate', 'baseRateTransVal');
        this.translateNumber('premiumRate', 'premiumRateTransVal');
        this.translateNumber('yearlyInterestRate', 'yearlyInterestRateTransVal');
    }

    mappedData() {
        Object.keys(this.form.controls).forEach(key => {
            // tslint:disable-next-line:no-shadowed-variable
            Object.keys(this.form.controls).forEach(key => {
                if (key.indexOf('TransVal') > -1) {
                    return;
                }
                this.attributes = new Attributes();
                this.attributes.en = this.form.get(key).value;
                this.attributes.np = this.tdValues[key];
                this.attributes.ct = this.form.get(key + 'TransVal').value;
                this.tdValues[key] = this.attributes;
            });
        });
    }

    get Form() {
        return this.form.controls;
    }

    checkboxVal(event, formControlName) {
        // if (!ObjectUtil.isEmpty(this.translatedValues[formControlName])) {
        //   const val = this.translatedValues[formControlName];
        //   this.form.get(formControlName + 'TransVal').patchValue(val);
        // }
        const checkVal = event.target.checked;
        this[formControlName + 'Check'] = checkVal;
        console.log('checked Value', this[formControlName + 'Check']);
        if (!checkVal) {
            this.clearForm(formControlName + 'TransVal');
        }
    }

    clearForm(controlName) {
        this.form.get(controlName).setValue(null);
    }

    setDateTypeBS() {
        this.dateTypeBS = true;
        this.dateTypeAD = false;
    }

    setDateTypeAD() {
        this.dateTypeBS = false;
        this.dateTypeAD = true;
    }

    setDateTypeBS1() {
        this.dateTypeBS1 = true;
        this.dateTypeAD1 = false;
    }

    setDateTypeAD1() {
        this.dateTypeBS1 = false;
        this.dateTypeAD1 = true;
    }
    setDateTypeBS2() {
        this.dateTypeBS2 = true;
        this.dateTypeAD2 = false;
    }

    setDateTypeAD2() {
        this.dateTypeBS2 = false;
        this.dateTypeAD2 = true;
    }
    setDateTypeBS3() {
        this.dateTypeBS3 = true;
        this.dateTypeAD3 = false;
    }

    setDateTypeAD3() {
        this.dateTypeBS3 = false;
        this.dateTypeAD3 = true;
    }

    openModel() {
        // this.modelService.open(modalName, {size: 'xl', centered: true});
        this.dialogService.open(PersonalLoanAndPersonalOverdraftComponent, {
            closeOnBackdropClick: false,
            closeOnEsc: false,
            hasBackdrop: false,
            context: {
                cadOfferLetterApprovedDoc: this.customerApprovedDoc,
                preview: true,
            }
        });
    }

    submit() {
        this.submitted = true;
        if (this.form.invalid) {
            this.toastService.show(new Alert(AlertType.DANGER, 'Please check validation'));
            this.spinner = false;
            return;
        }
        this.spinner = true;
        this.btnDisable = true;
        this.customerApprovedDoc.docStatus = CadDocStatus.OFFER_AND_LEGAL_PENDING;

        if (this.customerApprovedDoc.offerDocumentList.length > 0) {
            this.offerLetterDocument = this.customerApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
                === this.offerLetterConst.value(this.offerLetterConst.PERSONAL_LOAN_AND_PERSONAL_OVERDRAFT).toString())[0];
            if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
                this.existingOfferLetter = true;
            }
        }

        if (this.existingOfferLetter) {
            this.customerApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
                if (offerLetterPath.docName.toString() ===
                    this.offerLetterConst.value(this.offerLetterConst.PERSONAL_LOAN_AND_PERSONAL_OVERDRAFT).toString()) {
                    this.mappedData();
                    offerLetterPath.initialInformation = JSON.stringify(this.tdValues);
                }
            });
        } else {
            const offerDocument = new OfferDocument();
            offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.PERSONAL_LOAN_AND_PERSONAL_OVERDRAFT);
            Object.keys(this.form.controls).forEach(key => {
                if (key.indexOf('TransVal') > -1) {
                    return;
                }
                this.attributes = new Attributes();
                this.attributes.en = this.form.get(key).value;
                this.attributes.np = this.tdValues[key];
                this.attributes.ct = this.form.get(key + 'TransVal').value;
                this.tdValues[key] = this.attributes;
            });
            this.podtranslatedData = {};
            offerDocument.initialInformation = JSON.stringify(this.tdValues);
            this.customerApprovedDoc.offerDocumentList.push(offerDocument);
        }
        this.administrationService.saveCadDocumentBulk(this.customerApprovedDoc).subscribe((res: any) => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
            this.customerApprovedDoc = res.detail;
            this.spinner = false;
            this.previewBtn = false;
            this.btnDisable = true;
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
            this.spinner = false;
            this.btnDisable = true;
        });
    }
}

