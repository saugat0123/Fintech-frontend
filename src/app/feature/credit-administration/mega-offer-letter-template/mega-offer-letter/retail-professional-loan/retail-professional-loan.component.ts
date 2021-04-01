import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ToastService} from '../../../../../@core/utils';
import {Router} from '@angular/router';
import {CustomerOfferLetterService} from '../../../../loan/service/customer-offer-letter.service';
import {MegaOfferLetterConst} from '../../../mega-offer-letter-const';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {OfferDocument} from '../../../model/OfferDocument';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CadDocStatus} from '../../../model/CadDocStatus';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {NepaliEditor} from '../../../../../@core/utils/constants/nepaliEditor';
import {NepaliNumberAndWords} from '../../../model/nepaliNumberAndWords';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../@core/pipe/currency-formatter.pipe';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';

@Component({
    selector: 'app-retail-professional-loan',
    templateUrl: './retail-professional-loan.component.html',
    styleUrls: ['./retail-professional-loan.component.scss']
})
export class RetailProfessionalLoanComponent implements OnInit {
    retailProfessionalLoan: FormGroup;
    // todo replace enum constant string compare
    spinner = false;
    existingOfferLetter = false;
    initialInfoPrint;
    offerLetterConst = MegaOfferLetterConst;
    offerLetterDocument: OfferDocument;
    selectedArray = [];
    ckeConfig = NepaliEditor.CK_CONFIG;
    nepData;
    external = [];
    loanHolderInfo;
    loanTypeArray = ['Professional Term Loan', 'Professional Overdraft Loan'];
    proTermLoanSelected = false;
    proOverdraftLoanSelected = false;
    note = '<ul><li><span style="font-family:Preeti">C0fL tyf JolQmutsf] ;DklQ v\'nfpg] lnvt -</span><span>Net Worth Statement<span style="font-family:Preeti">_ kmf]6f] tyf ;Dks{ 7]ufgf ;lxt k]z ug\'kg]{5 .</span></li>' +
        '<li><span style="font-family:Preeti">tcGo a}+sx?;+u u/]sf] sf/f]jf/ af/] lnlvt ?kdf v\'nfpg\'kg]{ -</span><span>Multiple Banking Declaration<span style="font-family:Preeti">_ k]z ug\'{kg]{5 .</span></li> ' +
        '<li><span style="font-family:Preeti">tpNn]lvt k|:tfljt crn ;DklQsf] k"0f{ d\'Nofªsg k|ltj]bg -</span><span>Complete Valuation Report<span style="font-family:Preeti">_ k]z ePkZrft dfq shf{ e\'Qmfg ul/g]5 .</span></li> </ul>';
    @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;

    constructor(private formBuilder: FormBuilder,
                private customerOfferLetterService: CustomerOfferLetterService,
                private toastService: ToastService,
                private router: Router,
                private administrationService: CreditAdministrationService,
                protected dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
                private routerUtilsService: RouterUtilsService,
                private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
                private engToNepNumberPipe: EngToNepaliNumberPipe,
                private currencyFormatPipe: CurrencyFormatterPipe,
                private nepToEngNumberPipe: NepaliToEngNumberPipe
    ) {
    }

    ngOnInit() {
        this.buildForm();
        console.log('this is cad data', this.cadOfferLetterApprovedDoc);
        this.checkOfferLetterData();
    //    this.change(this.selectedArray);
        console.log(this.retailProfessionalLoan.value, 'form');
        console.log('this is cadofferLetterApproved LoanHolder', this.cadOfferLetterApprovedDoc.loanHolder);
        if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
            this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
        }
        console.log(this.loanHolderInfo , 'Loan Data');
    }

    buildForm() {
        this.retailProfessionalLoan = this.formBuilder.group({
            refNo: [undefined],
            borrowerName: [undefined],
            borrowerAddress: [undefined],
            contactNumber: [undefined],
            timePeriod: [undefined],
            gurantorName: [undefined],
            gurantorNameFlag: [true],
            citizenshipNo1: [undefined],
            citizenshipNo2: [undefined],
            date: [undefined],
            loanTypeSelectedArray: [undefined],
            karjaFirstLine: [undefined],
            clausesTextEditor: this.note,
            pageCount: [undefined],
            professionalTermLoanArray: this.formBuilder.array([this.buildProfessionalTermLoanGroup()]),
            professionalOverDraftLoanArray: this.formBuilder.array([this.buildProfessionalOverDraftLoanGroup()]),
        });
    }

    buildProfessionalTermLoanGroup() {
        return this.formBuilder.group({
            karjaSeemaRakam: [undefined],
            karjaSeemaRakamWord: [undefined],
            prayojan: [undefined],
            tenure: [undefined],
            rate: [undefined],
            aadharRate: [undefined],
            premiumRate: [undefined],
            reenChuktaDate: [undefined],
            reenChuktaMaasik: [undefined],
            noOfInstallments: [undefined],
            emiAmount: [undefined],
            amountInWords: [undefined],
            sewaSulka: [undefined],
            chargeAmount: [undefined],
            chargeAmountFlag: [true],
        });
    }

    buildProfessionalOverDraftLoanGroup() {
        return this.formBuilder.group({
            karjaSeemaRakam: [undefined],
            karjaSeemaRakamWord: [undefined],
            prayojan: [undefined],
            tenure: [undefined],
            rate: [undefined],
            aadharRate: [undefined],
            premiumRate: [undefined],
            sewaSulka: [undefined],
            chargeAmount: [undefined],
            chargeAmountFlag: [true],
            emiAmount: [undefined],
            amountInWords: [undefined],
        });
    }

    changeLoanType($event) {
        this.selectedArray = $event;
        $event.includes('Professional Term Loan') ? this.proTermLoanSelected = true : this.proTermLoanSelected = false;
        $event.includes('Professional Overdraft Loan') ? this.proOverdraftLoanSelected = true : this.proOverdraftLoanSelected = false;
    }

    addMoreProfessionalOverDraftLoan() {
        (this.retailProfessionalLoan.get('professionalOverDraftLoanArray') as FormArray).push(this.buildProfessionalOverDraftLoanGroup());
    }

    addMoreProfessionalTermLoan() {
        (this.retailProfessionalLoan.get('professionalTermLoanArray') as FormArray).push(this.buildProfessionalTermLoanGroup());
    }

    removeProfessionalOverDraftLoan(i) {
        (this.retailProfessionalLoan.get('professionalOverDraftLoanArray') as FormArray).removeAt(i);
    }

    removeProfessionalTermLoan(i) {
        (this.retailProfessionalLoan.get('professionalTermLoanArray') as FormArray).removeAt(i);
    }

    removeOptionalField(formGroup, fieldControlName) {
        formGroup.get(fieldControlName).patchValue(false);
    }

    undoRemovalOfOptionalField(formGroup, fieldControlName) {
        formGroup.get(fieldControlName).patchValue(true);
    }

    checkOfferLetterData() {
        if (this.cadOfferLetterApprovedDoc.offerDocumentList.length > 0) {
            this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
                === this.offerLetterConst.value(this.offerLetterConst.RETAIL_PROFESSIONAL_LOAN).toString())[0];
            if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
                this.offerLetterDocument = new OfferDocument();
                this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.RETAIL_PROFESSIONAL_LOAN);
            } else {
                const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
                this.initialInfoPrint = initialInfo;
                this.existingOfferLetter = true;
                this.retailProfessionalLoan.patchValue(initialInfo, {emitEvent: false});

                this.selectedArray = initialInfo.loanTypeSelectedArray;
                this.changeLoanType(this.selectedArray);
                (this.retailProfessionalLoan.get('professionalTermLoanArray') as FormArray).clear();
                initialInfo.professionalTermLoanArray.forEach( value => {
                    (this.retailProfessionalLoan.get('professionalTermLoanArray') as FormArray).push(this.formBuilder.group(value));
                });
                (this.retailProfessionalLoan.get('professionalOverDraftLoanArray') as FormArray).clear();
                initialInfo.professionalOverDraftLoanArray.forEach( value => {
                    (this.retailProfessionalLoan.get('professionalOverDraftLoanArray') as FormArray).push(this.formBuilder.group(value));
                });
                this.initialInfoPrint = initialInfo;
            }
        }
    }


    // change(arraySelected) {
    //     console.log(arraySelected, 'sel');
    //     this.selectedArray = arraySelected;
    //     this.proTermLoanSelected = this.proOverdraftLoanSelected = false;
    //     if (!ObjectUtil.isEmpty(arraySelected)) {
    //         arraySelected.forEach(selectedValue => {
    //             switch (selectedValue) {
    //                 case 'Professional Term Loan' :
    //                     this.proTermLoanSelected = true;
    //                     break;
    //                 case 'Professional Overdraft Loan' :
    //                     this.mortgageFinanceSelected = true;
    //                     break;
    //             }
    //         });
    //              }
    //
    //     }

submit(): void {
        console.log('Check Value', this.retailProfessionalLoan.value);
        this.spinner = true;
        this.cadOfferLetterApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;

        if (this.existingOfferLetter) {
            this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
                if (offerLetterPath.docName.toString() ===
                    this.offerLetterConst.value(this.offerLetterConst.RETAIL_PROFESSIONAL_LOAN).toString()) {
                    this.retailProfessionalLoan.get('loanTypeSelectedArray').patchValue(this.selectedArray);
                    offerLetterPath.initialInformation = JSON.stringify(this.retailProfessionalLoan.value);
                }
            });
        } else {
            const offerDocument = new OfferDocument();
            offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.RETAIL_PROFESSIONAL_LOAN);
            this.retailProfessionalLoan.get('loanTypeSelectedArray').patchValue(this.selectedArray);
            offerDocument.initialInformation = JSON.stringify(this.retailProfessionalLoan.value);
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
    // // nepaliToEng(formArrayName, i , formControlName) {
    // //     this.nepaliAmount[i] = this.retailProfessionalLoan.get([formArrayName, i, formControlName]).value;
    // //     this.finalNepaliWord[i] = this.nepaliCurrencyWordPipe.transform(this.nepaliAmount[i]);
    // //     this.external[i] = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.nepaliAmount[i]));
    // //     this.retailProfessionalLoan.get([formArrayName, i, formControlName]).patchValue(this.external[i]);
    // //     if (formControlName === 'loanAmount') {
    // //         this.retailProfessionalLoan.get([formArrayName, i, 'loanAmountInWord']).patchValue(this.finalNepaliWord[i]);
    // //     }
    // //     if (formControlName === 'loanAmountReturn') {
    // //         this.retailProfessionalLoan.get([formArrayName, i, 'loanAmountReturnInWord']).patchValue(this.finalNepaliWord[i]);
    // //     }
    // }
    nepaliToEng(event: any, i , formArrayName) {
        this.retailProfessionalLoan.get([formArrayName, i, 'amountInWords']).patchValue(event.nepVal);
        this.retailProfessionalLoan.get([formArrayName, i, 'emiAmount']).patchValue(event.val);
    }

    calcYearlyRate(formArrayName, i ) {
        const aadharRate = this.nepToEngNumberPipe.transform(this.retailProfessionalLoan.get([formArrayName, i , 'aadharRate']).value);
        const premiumRate = this.nepToEngNumberPipe.transform(this.retailProfessionalLoan.get([formArrayName, i , 'premiumRate']).value);
        const addRate = parseFloat(aadharRate) + parseFloat(premiumRate);
        const asd = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(addRate));
        this.retailProfessionalLoan.get([formArrayName, i, 'rate']).patchValue(asd);
    }

    changeToNepAmount(event: any, i , formArrayName) {
        this.retailProfessionalLoan.get([formArrayName, i, 'karjaSeemaRakamWord']).patchValue(event.nepVal);
        this.retailProfessionalLoan.get([formArrayName, i, 'karjaSeemaRakam']).patchValue(event.val);
    }

    patchFunction(formArrayName, i, formControlName) {
        // if (!ObjectUtil.isEmpty(this.retailProfessionalLoan.get([formArrayName, i, formControlName]).value)) {
            const patchValue1 = this.retailProfessionalLoan.get([formArrayName, i, formControlName]).value;
            return patchValue1;
        // }
    }
}
