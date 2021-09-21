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
import {NepaliNumberAndWords} from '../../../model/nepaliNumberAndWords';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../@core/pipe/currency-formatter.pipe';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliPercentWordPipe} from '../../../../../@core/pipe/nepali-percent-word.pipe';

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
    nepaliNumber = new NepaliNumberAndWords();
    nepaliAmount = [];
    finalNepaliWord = [];
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
    @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;

    nepData;
    external = [];
    loanHolderInfo;


    constructor(private formBuilder: FormBuilder,
                private router: Router,
                private toastService: ToastService,
                private administrationService: CreditAdministrationService,
                private routerUtilsService: RouterUtilsService,
                protected dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
                private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
                private engToNepNumberPipe: EngToNepaliNumberPipe,
                private currencyFormatPipe: CurrencyFormatterPipe,
                private nepToEngNumberPipe: NepaliToEngNumberPipe,
                private nepPercentWordPipe: NepaliPercentWordPipe) {
    }

    ngOnInit() {
        this.buildForm();
        if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
            this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
        }
        this.checkOfferLetterData();    }


    buildForm() {
        this.form = this.formBuilder.group({
            dateOfGeneration: [undefined],
            referenceNumber: [undefined],
            customerName: [undefined],
            customerAddress: [undefined],
            applicationDateInAD: [undefined],
            nameoftheVehicle: [undefined],
            loanAmount: [undefined],
            loanNameInWord: [undefined],
            percent: [undefined],
            baseRate: [undefined],
            premiumRate: [undefined],
            yearlyLoanRate: [undefined],
            loanadminFee: [undefined],
            loanadminFeeWords: [undefined],
            fees: [undefined],
            emiAmount: [undefined],
            unitName: [undefined],
            emiAmountInWords: [undefined],
            emiNumber: [undefined],
            loanCommitmentFee: [undefined],
            nameofGuarantors: [undefined],
            guarantorsName: [undefined],
            nameofRelationshipOfficer: [undefined],
            guaranteedAmountFigure: [undefined],
            guaranteedAmountWords: [undefined],
            ownerName: [undefined],
            ownersAddress: [undefined],
            propertyPlotNumber: [undefined],
            propertyArea: [undefined],
            sheetNumber: [undefined],
            nameofBranchManager: [undefined],
            nameofBranch: [undefined],
            loanAmountInWord: [undefined],
            loanAmountInFigure: [undefined],
            branchName: [undefined],
            guaranteedAmountinFigure: [undefined],
            insuranceAmountinFigure: [undefined],
            textFill: [undefined],
            signatureDate: [undefined],
            district: [undefined],
            wardNum: [undefined],
            witnessName: [undefined],
            staffName: [undefined],
        });
    }
    setLoanConfigData(data: any) {
        let cadNepData = {
            numberNepali: ')',
            nepaliWords: 'सुन्य',
        };
        const customerAddress =
            data.permanentMunicipality + ' , ' +
            data.permanentWard + ' , ' +
            data.permanentProvince + ' , ' +
            data.permanentDistrict;
        if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.nepData)) {
            cadNepData = JSON.parse(this.cadOfferLetterApprovedDoc.nepData);
        }
        this.form.patchValue({
            customerName: data.name ? data.name : '',
            customerAddress: customerAddress ? customerAddress : '',
            loanAmount: cadNepData.numberNepali,
            loanNameInWords: cadNepData.nepaliWords,
        });
    }
    checkOfferLetterData() {
        if (this.cadOfferLetterApprovedDoc.offerDocumentList.length > 0) {
            this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
                === this.offerLetterConst.value(this.offerLetterConst.RETAIL_HOUSING).toString())[0];
            if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
                this.offerLetterDocument = new OfferDocument();
                this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.RETAIL_HOUSING);
            } else {
                const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
                this.initialInfoPrint = initialInfo;
                this.existingOfferLetter = true;
                this.form.patchValue(initialInfo, {emitEvent: false});
                this.initialInfoPrint = initialInfo;
            }
        } else {
            if (!ObjectUtil.isEmpty(this.loanHolderInfo)) {
                this.setLoanConfigData(this.loanHolderInfo);
            }
        }

    }

    submit(): void {
        this.spinner = true;
        this.cadOfferLetterApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;

        if (this.existingOfferLetter) {
            this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
                if (offerLetterPath.docName.toString() === this.offerLetterConst.value(this.offerLetterConst.RETAIL_HOUSING).toString()) {
                    offerLetterPath.initialInformation = JSON.stringify(this.form.value);
                }
            });
        } else {
            const offerDocument = new OfferDocument();
            offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.RETAIL_HOUSING);
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
    calcYearlyRate() {
        const baseRate = this.nepToEngNumberPipe.transform(this.form.get('baseRate').value);
        const premiumRate = this.nepToEngNumberPipe.transform(this.form.get('premiumRate').value);
        const addRate = parseFloat(baseRate) + parseFloat(premiumRate);
        const asd = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(addRate));
        this.form.get('yearlyLoanRate').patchValue(asd);
    }
    getNumAmountWord(numLabel, wordLabel) {
        const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
        const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
        this.form.get(wordLabel).patchValue(returnVal);
    }
}
