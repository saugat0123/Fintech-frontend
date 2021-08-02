import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ProgressiveOfferLetterConst} from '../progressive-offer-letter-const';
import {CustomerOfferLetter} from '../../../../../loan/model/customer-offer-letter';
import {OfferDocument} from '../../../../model/OfferDocument';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {CustomerOfferLetterService} from '../../../../../loan/service/customer-offer-letter.service';
import {NbDialogRef} from '@nebular/theme';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CadDocStatus} from '../../../../model/CadDocStatus';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../@core/pipe/currency-formatter.pipe';
import {NepaliPercentWordPipe} from '../../../../../../@core/pipe/nepali-percent-word.pipe';

@Component({
    selector: 'app-offer-letter-corporate',
    templateUrl: './offer-letter-corporate.component.html',
    styleUrls: ['./offer-letter-corporate.component.scss']
})
export class OfferLetterCorporateComponent implements OnInit {
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
                private dialogRef: NbDialogRef<OfferLetterCorporateComponent>) {
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
        this.addEmptySecurityDetail();
    }

    checkOfferLetter() {
        this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
            === this.offerLetterConst.value(this.offerLetterConst.OFFER_LETTER_CORPORATE).toString())[0];
        if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
            this.offerLetterDocument = new OfferDocument();
            this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.OFFER_LETTER_CORPORATE);
            this.fillForm();
        } else {
            const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
            this.initialInfoPrint = initialInfo;
            this.existingOfferLetter = true;
            this.setGuarantors(initialInfo.guarantors);
            this.setSecurityDetails(initialInfo.securityDetails);
            this.setLoan(initialInfo.loan);

            this.form.patchValue(this.initialInfoPrint);
        }
    }

    onSubmit(): void {
        this.spinner = true;
        this.cadOfferLetterApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;

        if (this.existingOfferLetter) {
            this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
                if (offerLetterPath.docName.toString() ===
                    this.offerLetterConst.value(this.offerLetterConst.OFFER_LETTER_CORPORATE).toString()) {
                    offerLetterPath.initialInformation = JSON.stringify(this.form.value);
                }
            });
        } else {
            const offerDocument = new OfferDocument();
            offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.OFFER_LETTER_CORPORATE);
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


    setSecurityDetails(data) {
        const formArray = this.form.get('securityDetails') as FormArray;
        if (data.length === 0) {
            this.addEmptySecurityDetail();
            return;
        }
        data.forEach(value => {
            formArray.push(this.formBuilder.group({
                name: [value.name],
                parentName: [value.parentName],
                grandParentName: [value.grandParentName],
                address: [value.address],
                jaggaDistrict: [value.jaggaDistrict],
                jaggaWard: [value.jaggaWard],
                jaggaKittaNum: [value.jaggaKittaNum],
                jaggaArea: [value.jaggaArea],
                jaggaSiNum: [value.jaggaSiNum],
            }));
        });
    }

    addEmptySecurityDetail() {
        (this.form.get('securityDetails') as FormArray).push(
            this.formBuilder.group({
                name: [undefined],
                parentName: [undefined],
                grandParentName: [undefined],
                address: [undefined],
                jaggaDistrict: [undefined],
                jaggaWard: [undefined],
                jaggaKittaNum: [undefined],
                jaggaArea: [undefined],
                jaggaSiNum: [undefined],
            }));
    }

    removeSecurityDetail(index) {
        (this.form.get('securityDetails') as FormArray).removeAt(index);
    }

    setGuarantors(data) {
        const formArray = this.form.get('guarantors') as FormArray;
        if (data.length === 0) {
            this.addEmptyGuarantor();
            return;
        }
        data.forEach(value => {
            formArray.push(this.formBuilder.group({
                guarantorLegalDocumentAddress: [value.guarantorLegalDocumentAddress],
                name: [value.name],
            }));
        });
    }

    addEmptyGuarantor() {
        (this.form.get('guarantors') as FormArray).push(
            this.formBuilder.group({
                guarantorLegalDocumentAddress: [undefined],
                name: [undefined],
            }));
    }

    removeGuarantor(index) {
        (this.form.get('guarantors') as FormArray).removeAt(index);
    }

    buildForm() {
        this.form = this.formBuilder.group({
            patraNum: [undefined],
            date: [undefined],
            customerName: [undefined],
            customerAddress: [undefined],
            shreeName: [undefined],
            shreeMobile: [undefined],



            securityDetails: this.formBuilder.array([]),

            dhitoDate: [undefined],
            dhitoAuditor: [undefined],
            dhitoAmount: [undefined],
            dhitoDistress: [undefined],
            dhitoLekhi: [undefined],

            shreeName1: [undefined],
            shreeAmount: [undefined],
            shreeAmountInWord: [undefined],

            amount2: [undefined],
            amountInWords2: [undefined],

            bulletText641: [undefined],
            bulletText642: [undefined],

            financeBranch: [undefined],
            financeMunicipality: [undefined],
            financeWardNum: [undefined],
            financeDistrict: [undefined],
            financeTelephoneNum: [undefined],
            financeTelephoneNum2: [undefined],
            financeTelephoneNum3: [undefined],
            financeFaxNum: [undefined],
            financeEmail: [undefined],
            customerMunicipality: [undefined],
            customerWardNum: [undefined],
            customerDistrict: [undefined],
            customerTelephone: [undefined],
            customerTelephone2: [undefined],
            customerTelephone3: [undefined],
            customerFax: [undefined],
            customerEmail: [undefined],
            akhtiyarName: [undefined],
            akhtiyarContactNum: [undefined],

            employeeName: [undefined],
            employeeFinanceBranch: [undefined],
            employeeFinanceDistrict: [undefined],

            employeeName2: [undefined],
            employeeFinanceBranch2: [undefined],
            employeeFinanceDistrict2: [undefined],

            signatoryName: [undefined],
            signatoryCitizenshipNum: [undefined],
            signatoryCitizenshipIssueDate: [undefined],
            signatoryCitizenshipIssuePlace: [undefined],
            akhtiyarName2: [undefined],
            akhtiyarMunicipality2: [undefined],
            akhtiyarWardNum2: [undefined],
            signatoryGrandParentName: [undefined],
            signatoryParentName: [undefined],
            loan : this.formBuilder.array([]),
            guarantors: this.formBuilder.array([]),

            sahichhapEmployee: [undefined],
            docYear: [undefined],
            docMonth: [undefined],
            docDate: [undefined],
            docRoj: [undefined],


            bottomFinanceBranch: [undefined],
            bottomFinanceBranchAddress: [undefined],
            bottomDate: [undefined],
            bottomPatraNum: [undefined],

            tapsilGuarantorName: [undefined],
            tapsilGuarantorCitizenshipNum: [undefined],
            tapsilGuarantorCitizenshipIssueDate: [undefined],
            tapsilGuarantorCitizenshipIssuePlace: [undefined],
            tapsilGuarantorDistrict: [undefined],
            tapsilGuarantorMunicipality: [undefined],
            tapsilGuarantorWardNum: [undefined],
            tapsilGuarantorRelation: [undefined],
            tapsilGuarantorInLawName: [undefined],
            tapsilGuarantorSpouseName: [undefined],
            tapsilGuarantorContactNum: [undefined],
            tapsilGuarantorEmail: [undefined],
            tapsilGuarantorDate: [undefined],
        });
    }

    getNumAmountWord(numLabel, wordLabel) {
        const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
        const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
        this.form.get(wordLabel).patchValue(returnVal);
    }

    calcYearlyRate(base, premium, discount, target,i) {
        const baseRate = this.nepToEngNumberPipe.transform(this.form.get(['loan',i,base]).value);
        const premiumRate = this.nepToEngNumberPipe.transform(this.form.get(['loan',i,premium]).value);
        const discountRate = this.nepToEngNumberPipe.transform(this.form.get(['loan',i,discount]).value);
        const addRate = parseFloat(baseRate) + parseFloat(premiumRate) - parseFloat(discountRate);
        const finalValue = this.engToNepaliNumberPipe.transform(this.currencyFormatPipe.transform(addRate));
        this.form.get(['loan',i,target]).patchValue(finalValue);
    }

    addLoan(){
const formArray = this.form.get('loan') as FormArray
        formArray.push(this.LoanFormGroup())
    }
    removeLoan(i)
    {
        const formArray = this.form.get('loan') as FormArray
        formArray.removeAt(i)
    }


    LoanFormGroup():FormGroup{

        return this.formBuilder.group({


            loanTypeNepali: [undefined],
            loanTypeEnglish: [undefined],
            amount: [undefined],
            amountInWords: [undefined],
            loanPurpose: [undefined],
            interestRate: [undefined],
            interestRepayMonths: [undefined],
            interestBaseRate: [undefined],
            interestPremiumRate: [undefined],
            interestTempDiscountRate: [undefined],
            interestFinalRate: [undefined],
            // loanLimit: [undefined],
            interestRepayPlan: [undefined],
            loanLimitYearAD: [undefined],
            loanLimitYearBS: [undefined],
            loanLimitMonths: [undefined],

            pratibadhataAmount: [undefined],
            pratibadhataAdditionalAmount: [undefined],
            pratibadhataRate: [undefined],
            pratibadhataYearlyRate: [undefined],

            sthantarandRate: [undefined],

        })

    }



    setLoan(data){
        const formArray = this.form.get('loan') as FormArray
        if(data.length ===0)
        {
            this.addLoan()
            return
        }
        data.forEach((data)=>{
            formArray.push(this.formBuilder.group({
                loanTypeNepali: [data.loanTypeNepali],
                loanTypeEnglish: [data.loanTypeEnglish],
                amount: [data.amount],
                amountInWords: [data.amountInWords],
                loanPurpose: [data.loanPurpose],
                interestRate: [data.interestRate],
                interestRepayMonths: [data.interestRepayMonths],
                interestBaseRate: [data.interestBaseRate],
                interestPremiumRate: [data.interestPremiumRate],
                interestTempDiscountRate: [data.interestTempDiscountRate],
                interestFinalRate: [data.interestFinalRate],
                // loanLimit: [undefined],
                interestRepayPlan: [data.interestRepayPlan],
                loanLimitYearAD: [data.loanLimitYearAD],
                loanLimitYearBS: [data.loanLimitYearBS],
                loanLimitMonths: [data.loanLimitMonths],

                pratibadhataAmount: [data.pratibadhataAmount],
                pratibadhataAdditionalAmount: [data.pratibadhataAdditionalAmount],
                pratibadhataRate: [data.pratibadhataRate],
                pratibadhataYearlyRate: [data.pratibadhataYearlyRate],

                sthantarandRate: [data.sthantarandRate],
            }))

        })

    }

}
