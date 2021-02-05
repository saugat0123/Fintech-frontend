import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {MegaOfferLetterConst} from '../../../mega-offer-letter-const';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {OfferDocument} from '../../../model/OfferDocument';
import {CadDocStatus} from '../../../model/CadDocStatus';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {Editor} from '../../../../../@core/utils/constants/editor';
import {NepaliEditor} from '../../../../../@core/utils/constants/nepaliEditor';

@Component({
    selector: 'app-retail-housing-loan',
    templateUrl: './retail-housing-loan.component.html',
    styleUrls: ['./retail-housing-loan.component.scss']
})
export class RetailHousingLoanComponent implements OnInit {
    form: FormGroup;
    // todo replace enum constant string compare
    spinner = false;
    existingOfferLetter = false;
    initialInfoPrint;
    offerLetterConst = MegaOfferLetterConst;
    offerLetterDocument: OfferDocument;
    selectedArray = [];
    loanOption = ['Housing Finance', 'Mortgage Finance', 'Mortgage Overdraft'];
    housingFinanceSelected: boolean;
    mortgageFinanceSelected: boolean;
    mortgageOverdraftSelected: boolean;
    ckeConfig = NepaliEditor.CK_CONFIG;
    note = '<ul><li><span style="font-family:Preeti">C0fL tyf JolQmutsf] ;DklQ v\'nfpg] lnvt -</span><span>Net Worth Statement<span style="font-family:Preeti">_ kmf]6f] tyf ;Dks{ 7]ufgf ;lxt k]z ug\'kg]{5 .</span></li>' +
        '<li><span style="font-family:Preeti">tcGo a}+sx?;+u u/]sf] sf/f]jf/ af/] lnlvt ?kdf v\'nfpg\'kg]{ -</span><span>Multiple Banking Declaration<span style="font-family:Preeti">_ k]z ug\'{kg]{5 .</span></li> ' +
        '<li><span style="font-family:Preeti">tpNn]lvt k|:tfljt crn ;DklQsf] k"0f{ d\'Nofªsg k|ltj]bg -</span><span>Complete Valuation Report<span style="font-family:Preeti">_ k]z ePkZrft dfq shf{ e\'Qmfg ul/g]5 .</span></li> </ul>';
    @Input() cadOfferLetterApprovedDoc;


    constructor(private formBuilder: FormBuilder,
                private router: Router,
                private toastService: ToastService,
                private administrationService: CreditAdministrationService,
                private routerUtilsService: RouterUtilsService,
                protected dialogRef: NbDialogRef<CadOfferLetterModalComponent>) {
    }

    ngOnInit() {
        this.buildForm();
        this.checkOfferLetterData();
        this.change(this.selectedArray);
        console.log(this.form.value, 'form');
    }


    buildForm() {
        this.form = this.formBuilder.group({
            date: [undefined],
            loanData: this.formBuilder.array([]),
            referenceNo: [undefined],
            applicantRelative: [undefined],
            applicantName: [undefined],
            parmanentAddress: [undefined],
            currentAddress: [undefined],
            mobileNo: [undefined],
            housingFinance: this.formBuilder.array([]),
            mortgageFinance: this.formBuilder.array([]),
            mortgageOverdraft: this.formBuilder.array([]),
            clearanceDate: [undefined],
            district: [undefined],
            wardNo: [undefined],
            statekeyNo: [undefined],
            keyNo: [undefined],
            selectedArray: undefined,
            noteOfCollateral: this.note,
            facility: undefined,
            action: undefined,
            link: undefined,
            registrationType: undefined,
            applicantRelativeOne: undefined,
            applicantRelativeTwo: undefined,
            landNumber: undefined,
            previousOwner: undefined,
            landNumberPreviousOwnerShow: true,
            tableShow: true,
            address: undefined,
        });
    }



    removeLoanDetail(index) {
        (this.form.get('loanData') as FormArray).removeAt(index);
    }

    addTableData() {
        (this.form.get('loanData') as FormArray).push(
            this.formBuilder.group({
                description: [undefined],
                sumInsured: [undefined],
                riskBearer: [undefined]
            })
        );
    }

    checkOfferLetterData() {
        if (this.cadOfferLetterApprovedDoc.offerDocumentList.length > 0) {
            this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
                === this.offerLetterConst.value(this.offerLetterConst.RETAIL_HOUSING).toString())[0];
            if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
                this.addEmptyHousingFinancial();
                this.addEmptyMortgageOverdraft();
                this.addEmptyMortgageFinance();
                this.offerLetterDocument = new OfferDocument();
                this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.RETAIL_HOUSING);
            } else {
                const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
                this.selectedArray = initialInfo.selectedArray;
                console.log(initialInfo);
                this.initialInfoPrint = initialInfo;
                console.log(this.offerLetterDocument);
                this.existingOfferLetter = true;
                this.form.patchValue(initialInfo, {emitEvent: false});
                // this.form.get('noteOfCollateral').patchValue(this.note);
                if (!ObjectUtil.isEmpty(initialInfo)) {
                    this.setHousingFinancial(initialInfo.housingFinance);
                    this.setMortgageFinance(initialInfo.mortgageFinance);
                    this.setMortgageOverdraft(initialInfo.mortgageOverdraft);

                }
                // else {
                //     this.addEmptyHousingFinancial('housingFinance');
                //     this.addEmptyHousingFinancial('mortgageFinance');
                //     this.addEmptyHousingFinancial('mortgageOverdraft');
                //
                // }
                this.initialInfoPrint = initialInfo;
            }
        }
    }

    addEmptyHousingFinancial() {
        const formArray = this.form.get('housingFinance') as FormArray;
        formArray.push(this.formBuilder.group({
            Byaj: undefined,
            loanAmount: undefined,
            loanAmountInWord: undefined,
            month: undefined,
            prices: undefined,
            loanAmountReturn: undefined,
            loanAmountReturnInWord: undefined,
            clearanceDate: undefined,
            loanRate: undefined,
            loanRateShow: true,
            use: undefined,
            years: undefined,
            baseRate: undefined,
            premiumRate: undefined,
            maxAmount: undefined,
            serviceChargePercent: undefined,
            serviceChargeAmount: undefined,
        }));
    }

    setHousingFinancial(data) {
        const formArray =  this.form.get('housingFinance') as FormArray;
        if (ObjectUtil.isEmpty(data)) {
            this.addEmptyHousingFinancial();
            return;
        }
      data.forEach(value => {
          formArray.push(this.formBuilder.group({
              Byaj:[value.Byaj],
              loanAmount : [value.loanAmount],
              loanAmountInWord: [value.loanAmountInWord],
              month: [value.month],
              prices: [value.prices],
              loanAmountReturn: [value.loanAmountReturn],
              loanAmountReturnInWord: [value.loanAmountReturnInWord],
              clearanceDate: [value.clearanceDate],
              loanRate: [value.loanRate],
              loanRateShow: [value.loanRateShow],
              use: [value.use],
              years: [value.years],
              baseRate: [value.baseRate],
              premiumRate: [value.premiumRate],
              maxAmount: [value.maxAmount],
              serviceChargePercent: [value.serviceChargePercent],
              serviceChargeAmount: [value.serviceChargeAmount],
          }));
      });
    }

    removeHousing(index) {
        (this.form.get('housingFinance') as FormArray).removeAt(index);
    }

    addEmptyMortgageFinance() {
        const formArray = this.form.get('mortgageFinance') as FormArray;
        formArray.push(this.formBuilder.group({
            loanAmount: undefined,
            loanAmountInWord: undefined,
            month: undefined,
            prices: undefined,
            loanAmountReturn: undefined,
            loanAmountReturnInWord: undefined,
            clearanceDate: undefined,
            loanRate: undefined,
            loanRateShow: true,
            use: undefined,
            years: undefined,
            baseRate: undefined,
            premiumRate: undefined,
            maxAmount: undefined,
            serviceChargePercent: undefined,
            serviceChargeAmount: undefined,
        }));
    }

    setMortgageFinance(data) {
        const formArray =  this.form.get('mortgageFinance') as FormArray;
        if (ObjectUtil.isEmpty(data)) {
            this.addEmptyMortgageFinance();
            return;
        }
        data.forEach(value => {
            formArray.push(this.formBuilder.group({
                loanAmount : [value.loanAmount],
                loanAmountInWord: [value.loanAmountInWord],
                month: [value.month],
                prices: [value.prices],
                loanAmountReturn: [value.loanAmountReturn],
                loanAmountReturnInWord: [value.loanAmountReturnInWord],
                clearanceDate: [value.clearanceDate],
                loanRate: [value.loanRate],
                loanRateShow: [value.loanRateShow],
                use: [value.use],
                years: [value.years],
                baseRate: [value.baseRate],
                premiumRate: [value.premiumRate],
                maxAmount: [value.maxAmount],
                serviceChargePercent: [value.serviceChargePercent],
                serviceChargeAmount: [value.serviceChargeAmount],
            }));
        });
    }

    removeMortgageFinance(index) {
        (this.form.get('mortgageFinance') as FormArray).removeAt(index);
    }

    addEmptyMortgageOverdraft() {
        const formArray = this.form.get('mortgageOverdraft') as FormArray;
        formArray.push(this.formBuilder.group({
            Byaj: undefined,
            loanAmount: undefined,
            loanAmountInWord: undefined,
            month: undefined,
            prices: undefined,
            loanAmountReturn: undefined,
            loanAmountReturnInWord: undefined,
            clearanceDate: undefined,
            loanRate: undefined,
            loanRateShow: true,
            use: undefined,
            years: undefined,
            baseRate: undefined,
            premiumRate: undefined,
            maxAmount: undefined,
            serviceChargePercent: undefined,
            serviceChargeAmount: undefined,
            timeInterval: undefined,
        }));
    }

    setMortgageOverdraft(data) {
        const formArray =  this.form.get('mortgageOverdraft') as FormArray;
        if (ObjectUtil.isEmpty(data)) {
            this.addEmptyMortgageOverdraft();
            return;
        }
        data.forEach(value => {
            formArray.push(this.formBuilder.group({
                loanAmount : [value.loanAmount],
                loanAmountInWord: [value.loanAmountInWord],
                month: [value.month],
                prices: [value.prices],
                loanAmountReturn: [value.loanAmountReturn],
                loanAmountReturnInWord: [value.loanAmountReturnInWord],
                clearanceDate: [value.clearanceDate],
                loanRate: [value.loanRate],
                loanRateShow: [value.loanRateShow],
                use: [value.use],
                years: [value.years],
                baseRate: [value.baseRate],
                premiumRate: [value.premiumRate],
                maxAmount: [value.maxAmount],
                serviceChargePercent: [value.serviceChargePercent],
                serviceChargeAmount: [value.serviceChargeAmount],
                timeInterval: [value.timeInterval],
            }));
        });
    }

    removeMortgageOverdraft(index) {
        (this.form.get('mortgageOverdraft') as FormArray).removeAt(index);
    }
    change(arraySelected) {
        console.log(arraySelected, 'sel');
        this.selectedArray = arraySelected;
        this.housingFinanceSelected = this.mortgageFinanceSelected = this.mortgageOverdraftSelected = false;
        if (!ObjectUtil.isEmpty(arraySelected)) {
            arraySelected.forEach(selectedValue => {
                switch (selectedValue) {
                    case 'Housing Finance' :
                        this.housingFinanceSelected = true;
                        break;
                    case 'Mortgage Finance' :
                        this.mortgageFinanceSelected = true;
                        break;
                    case 'Mortgage Overdraft' :
                        this.mortgageOverdraftSelected = true;
                        break;
                }
            });

        }

    }



    submit(): void {
        this.spinner = true;
        this.cadOfferLetterApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;

        if (this.existingOfferLetter) {
            this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
                if (offerLetterPath.docName.toString() === this.offerLetterConst.value(this.offerLetterConst.RETAIL_HOUSING).toString()) {
                    this.form.get('selectedArray').patchValue(this.selectedArray);
                    offerLetterPath.initialInformation = JSON.stringify(this.form.value);
                }
            });
        } else {
            const offerDocument = new OfferDocument();
            offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.RETAIL_HOUSING);
            this.form.get('selectedArray').patchValue(this.selectedArray);
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

    removeOptionalField(formArrayName, index, formControlName) {
        if (ObjectUtil.isEmpty(formArrayName)) {
            this.form.get(formControlName).patchValue(false);
            return;
        }
        this.form.get([formArrayName, index, formControlName]).patchValue(false);
    }
    undoRemovalOfOptionalField(formArrayName, index, formControlName) {
        if (ObjectUtil.isEmpty(formArrayName)) {
            this.form.get(formControlName).patchValue(true);
            return;
        }
        this.form.get([formArrayName, index, formControlName]).patchValue(true);

    }
}
