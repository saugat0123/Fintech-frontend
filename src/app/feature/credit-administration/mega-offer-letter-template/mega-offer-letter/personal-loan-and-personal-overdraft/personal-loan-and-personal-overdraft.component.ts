import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NepaliNumberAndWords} from '../../../model/nepaliNumberAndWords';
import {OfferDocument} from '../../../model/OfferDocument';
import {NepaliEditor} from '../../../../../@core/utils/constants/nepaliEditor';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {Router} from '@angular/router';
import {ToastService} from '../../../../../@core/utils';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../@core/pipe/currency-formatter.pipe';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliPercentWordPipe} from '../../../../../@core/pipe/nepali-percent-word.pipe';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {NabilOfferLetterConst} from '../../../nabil-offer-letter-const';
import {EngNepDatePipe} from 'nepali-patro';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-personal-loan-and-personal-overdraft',
  templateUrl: './personal-loan-and-personal-overdraft.component.html',
  styleUrls: ['./personal-loan-and-personal-overdraft.component.scss']
})
export class PersonalLoanAndPersonalOverdraftComponent implements OnInit {
  form: FormGroup;
  // todo replace enum constant string compare
  spinner = false;
  existingOfferLetter = false;
  initialInfoPrint;
  nepaliNumber = new NepaliNumberAndWords();
  nepaliAmount = [];
  offerLetterConst = NabilOfferLetterConst;
  offerLetterDocument: OfferDocument;
  selectedArray = [];
  ckeConfig = NepaliEditor.CK_CONFIG;
  @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
  @Input() preview;
  nepData;
  external = [];
  offerLetterData;
  tempData;
  loanHolderInfo;
  guarantorData;
  afterSave = false;
  finalName;
  guarantorNames: Array<String> = [];
  allguarantorNames;
  guarantorAmount: number = 0;
  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private toastService: ToastService,
              private administrationService: CreditAdministrationService,
              private routerUtilsService: RouterUtilsService,
              protected dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
              public nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private engToNepNumberPipe: EngToNepaliNumberPipe,
              private currencyFormatPipe: CurrencyFormatterPipe,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private nepPercentWordPipe: NepaliPercentWordPipe,
              private ref: NbDialogRef<PersonalLoanAndPersonalOverdraftComponent>,
              private engToNepaliDate: EngNepDatePipe,
              public datePipe: DatePipe  ) { }

    ngOnInit() {
        console.log(this.cadOfferLetterApprovedDoc, 'asa');
        this.buildPersonal();
        if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
            this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
            this.tempData = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);
            console.log('data', this.tempData);
            console.log('Loan Holder Info',this.loanHolderInfo);
        }
        this.guarantorData = this.cadOfferLetterApprovedDoc.assignedLoan[0].taggedGuarantors;
        this.checkOfferLetterData();
        this.guarantorDetails();
    }

    buildPersonal() {
        this.form = this.formBuilder.group({
            referenceNumber: [undefined],
            dateofApproval: [undefined],
            customerName: [undefined],
            customerAddress: [undefined],
            dateofApplication: [undefined],
            purposeofLoan: [undefined],
            purposeofLoanOd: [undefined],
            loanAmountinFigure: [undefined],
            loanAmountInWords: [undefined],
            loanAmountPl: [undefined],
            loanAmountPlInWords: [undefined],
            loanAmountOd: [undefined],
            loanAmountOdInWords: [undefined],
            baseRate: [undefined],
            premiumRate: [undefined],
            yearlyInterestRate: [undefined],
            loanAdminFeeinFigure: [undefined],
            loanAdminFeeinWords: [undefined],
            baseRateOd: [undefined],
            premiumRateOd: [undefined],
            yearlyInterestRateOd: [undefined],
            loanAdminFeeinFigureOd: [undefined],
            loanAdminFeeinWordsOd: [undefined],
            emiInFigure: [undefined],
            emiInWords: [undefined],
            loanExpiryDate: [undefined],
            guarantorName: [undefined],
            guaranteedAmountFigure: [undefined],
            guaranteedAmountWords: [undefined],
            nameofBranch: [undefined],
            accountNumberOfCustomer: [undefined],
            nameofCompanyCustomerWorking: [undefined],
            accountofCustomer: [undefined],
            relationshipofficerName: [undefined],
            managerName: [undefined],
            branchName: [undefined],
            additionalGuarantorDetails: [undefined],
            staffName: [undefined],
            loanPeriodInMonth: [undefined],
        });
    }

    guarantorDetails() {
        if (this.guarantorData.length === 1) {
            const temp = JSON.parse(this.guarantorData[0].nepData);
            this.finalName =  temp.guarantorName.ct;
        } else if (this.guarantorData.length === 2) {
            for (let i = 0; i < this.guarantorData.length; i++) {
                const temp = JSON.parse(this.guarantorData[i].nepData);
                this.guarantorNames.push(temp.guarantorName.ct);
                // this.guarantorAmount = this.guarantorAmount + parseFloat(temp.gurantedAmount.en) ;
            }
            // this.guarantorAmountNepali = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.guarantorAmount));
            this.allguarantorNames = this.guarantorNames.join(' र ');
            this.finalName = this.allguarantorNames;
        } else {
            for (let i = 0; i < this.guarantorData.length - 1; i++) {
                const temp = JSON.parse(this.guarantorData[i].nepData);
                this.guarantorNames.push(temp.guarantorName.ct);
                // this.guarantorAmount = this.guarantorAmount + parseFloat(temp.gurantedAmount.en) ;
            }
            // this.guarantorAmountNepali = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.guarantorAmount));
            this.allguarantorNames = this.guarantorNames.join(' , ');
            const temp1 = JSON.parse(this.guarantorData[this.guarantorData.length - 1].nepData);
            this.finalName =  this.allguarantorNames + ' र ' + temp1.guarantorName.ct;
        }
        console.log('Guarantor Name:', this.finalName);
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
                === this.offerLetterConst.value(this.offerLetterConst.PERSONAL_LOAN_AND_PERSONAL_OVERDRAFT).toString())[0];
            if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
                this.offerLetterDocument = new OfferDocument();
                this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.PERSONAL_LOAN_AND_PERSONAL_OVERDRAFT);
            } else {
                const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
                if (!ObjectUtil.isEmpty(this.offerLetterDocument.supportedInformation)) {
                    this.offerLetterData = this.offerLetterDocument;
                    this.form.get('additionalGuarantorDetails').patchValue(this.offerLetterData.supportedInformation);
                }
                this.initialInfoPrint = initialInfo;
                this.existingOfferLetter = true;
                this.selectedArray = initialInfo.loanTypeSelectedArray;
                this.initialInfoPrint = initialInfo;
                this.fillForm();
            }
        } else {
            this.fillForm();
        }
    }

    fillForm() {
        const proposalData = this.cadOfferLetterApprovedDoc.assignedLoan[0].proposal;
        let customerAddress;
        if (!ObjectUtil.isEmpty(this.loanHolderInfo)) {
            customerAddress =  ((!ObjectUtil.isEmpty(this.loanHolderInfo.permanentMunicipality) &&
                    !ObjectUtil.isEmpty(this.loanHolderInfo.permanentMunicipality.ct)) ?
                    this.loanHolderInfo.permanentMunicipality.ct : '') +
                ((!ObjectUtil.isEmpty(this.loanHolderInfo.permanentWard) &&
                    !ObjectUtil.isEmpty(this.loanHolderInfo.permanentWard.ct)) ?
                    '-' + this.loanHolderInfo.permanentWard.ct : '') +
                ((!ObjectUtil.isEmpty(this.loanHolderInfo.permanentDistrict) &&
                    !ObjectUtil.isEmpty(this.loanHolderInfo.permanentDistrict.ct)) ?
                    ', ' + this.loanHolderInfo.permanentDistrict.ct : '') +
                ((!ObjectUtil.isEmpty(this.loanHolderInfo.permanentProvince) &&
                    !ObjectUtil.isEmpty(this.loanHolderInfo.permanentProvince.ct)) ?
                    ' ,' + this.loanHolderInfo.permanentProvince.ct + ' प्रदेश ' : '');
        }
        const loanAmount = this.engToNepNumberPipe.transform(proposalData.proposedLimit);
        let totalLoanAmount = 0;
        this.cadOfferLetterApprovedDoc.assignedLoan.forEach(value => {
            const val = value.proposal.proposedLimit;
            totalLoanAmount = totalLoanAmount + val;
        });
        let autoRefNumber;
        if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.assignedLoan)) {
            autoRefNumber = this.cadOfferLetterApprovedDoc.assignedLoan[0].refNo;
        }
        // For date of Approval
        const dateOfApprovalType = this.initialInfoPrint.dateofApprovalType ? this.initialInfoPrint.dateofApprovalType.en : '';
        let finalDateOfApproval;
        if (dateOfApprovalType === 'AD') {
            const templateDateApproval = this.initialInfoPrint.dateofApproval ? this.initialInfoPrint.dateofApproval.en : '';
            finalDateOfApproval = this.engToNepaliDate.transform(this.datePipe.transform(templateDateApproval), true);
        } else {
            const templateDateApproval = this.initialInfoPrint.dateofApprovalNepali ? this.initialInfoPrint.dateofApprovalNepali.en : '';
            finalDateOfApproval = templateDateApproval ? templateDateApproval.nDate : '';
        }
        // For Date of Application:
        const dateOfApplication = this.initialInfoPrint.dateofApplicationType ? this.initialInfoPrint.dateofApplicationType.en : '';
        let finalDateOfApplication;
        if (dateOfApplication === 'AD') {
            const templateDateApplication = this.initialInfoPrint.dateofApplication ? this.initialInfoPrint.dateofApplication.en : '';
            finalDateOfApplication = this.engToNepaliDate.transform(this.datePipe.transform(templateDateApplication), true);
        } else {
            const templateDateApplication = this.initialInfoPrint.dateofApplicationNepali ? this.initialInfoPrint.dateofApplicationNepali.en : '';
            finalDateOfApplication = templateDateApplication ? templateDateApplication.nDate : '';
        }
        // For Expiry Date:
        const dateOfExpiry = this.initialInfoPrint.loanExpiryDateType ? this.initialInfoPrint.loanExpiryDateType.en : '';
        let finalDateOfExpiry;
        if (dateOfExpiry === 'AD') {
            const templateDateExpiry = this.initialInfoPrint.loanExpiryDate ? this.initialInfoPrint.loanExpiryDate.en : '';
            finalDateOfExpiry = this.engToNepaliDate.transform(this.datePipe.transform(templateDateExpiry), true);
        } else {
            const templateDateExpiry = this.initialInfoPrint.loanExpiryDateNepali ? this.initialInfoPrint.loanExpiryDateNepali.en : '';
            finalDateOfExpiry = templateDateExpiry ? templateDateExpiry.nDate : '';
        }
        this.form.patchValue({
            customerName: this.loanHolderInfo.name.ct ? this.loanHolderInfo.name.ct : '',
            customerAddress: customerAddress ? customerAddress : '',
            loanAmountinFigure: this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(totalLoanAmount)),
            loanAmountInWords: this.nepaliCurrencyWordPipe.transform(totalLoanAmount),
            loanAmountPl: this.tempData.loanAmountPl.ct ? this.tempData.loanAmountPl.ct : '',
            loanAmountPlInWords: this.tempData.loanAmountPlInWords.ct ? this.tempData.loanAmountPlInWords.ct : '',
            loanAmountOd: this.tempData.loanAmountOd.ct ? this.tempData.loanAmountOd.ct : '',
            loanAmountOdInWords: this.tempData.loanAmountOdInWords.ct ? this.tempData.loanAmountOdInWords.ct : '',
            referenceNumber: autoRefNumber ? autoRefNumber : '',
            purposeofLoan: this.tempData.purposeofLoan.ct ? this.tempData.purposeofLoan.ct : '',
            purposeofLoanOd: this.tempData.purposeofLoanOd.ct ? this.tempData.purposeofLoanOd.ct : '',
            baseRate: this.tempData.baseRate.ct ? this.tempData.baseRate.ct : '',
            premiumRate: this.tempData.premiumRate.ct ? this.tempData.premiumRate.ct : '',
            yearlyInterestRate: this.tempData.yearlyInterestRate.ct ? this.tempData.yearlyInterestRate.ct : '',
            loanAdminFeeinFigure: this.tempData.loanAdminFeeinFigure.ct ? this.tempData.loanAdminFeeinFigure.ct : '',
            loanAdminFeeinWords: this.tempData.loanAdminFeeinWords.ct ? this.tempData.loanAdminFeeinWords.ct : '',
            baseRateOd: this.tempData.baseRateOd.ct ? this.tempData.baseRateOd.ct : '',
            premiumRateOd: this.tempData.premiumRateOd.ct ? this.tempData.premiumRateOd.ct : '',
            yearlyInterestRateOd: this.tempData.yearlyInterestRateOd.ct ? this.tempData.yearlyInterestRateOd.ct : '',
            loanAdminFeeinFigureOd: this.tempData.loanAdminFeeinFigureOd.ct ? this.tempData.loanAdminFeeinFigureOd.ct : '',
            loanAdminFeeinWordsOd: this.tempData.loanAdminFeeinWordsOd.ct ? this.tempData.loanAdminFeeinWordsOd.ct : '',
            emiInFigure: this.tempData.emiInFigure.ct ? this.tempData.emiInFigure.ct : '',
            emiInWords: this.tempData.emiInWords.ct ? this.tempData.emiInWords.ct : '',
            nameofBranch: this.loanHolderInfo.branch.ct ? this.loanHolderInfo.branch.ct : '',
            accountNumberOfCustomer: this.tempData.accountNumber.ct ? this.tempData.accountNumber.ct : '',
            nameofCompanyCustomerWorking: this.tempData.nameofCompanyCustomerWorking.ct ? this.tempData.nameofCompanyCustomerWorking.ct : '',
            accountofCustomer: this.tempData.accountNumber.ct ? this.tempData.accountNumber.ct : '',
            relationshipofficerName: this.tempData.relationshipofficerName.ct ? this.tempData.relationshipofficerName.ct : '',
            managerName: this.tempData.branchManager.ct ? this.tempData.branchManager.ct : '',
            branchName: this.loanHolderInfo.branch.ct ? this.loanHolderInfo.branch.ct : '',
            dateofApproval: finalDateOfApproval ? finalDateOfApproval : '',
            loanExpiryDate: finalDateOfExpiry ? finalDateOfExpiry : '',
            dateofApplication: finalDateOfApplication ? finalDateOfApplication : '',
            loanPeriodInMonth: this.tempData.loanPeriodInMonth.ct ? this.tempData.loanPeriodInMonth.ct : '',
        });
    }

    submit(): void {
        this.spinner = true;
        this.cadOfferLetterApprovedDoc.docStatus = 'OFFER_AND_LEGAL_PENDING';

        if (this.existingOfferLetter) {
            this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
                if (offerLetterPath.docName.toString() ===
                    this.offerLetterConst.value(this.offerLetterConst.PERSONAL_LOAN_AND_PERSONAL_OVERDRAFT).toString()) {
                    offerLetterPath.supportedInformation = this.form.get('additionalGuarantorDetails').value;
                }
            });
        } else {
            const offerDocument = new OfferDocument();
            offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.PERSONAL_LOAN_AND_PERSONAL_OVERDRAFT);
            offerDocument.initialInformation = JSON.stringify(this.form.value);
            offerDocument.supportedInformation = this.form.get('additionalGuarantorDetails').value;
            this.cadOfferLetterApprovedDoc.offerDocumentList.push(offerDocument);
        }

        this.administrationService.saveCadDocumentBulk(this.cadOfferLetterApprovedDoc).subscribe(() => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
            this.spinner = false;
            this.dialogRef.close();
            this.afterSave = true;
            this.routerUtilsService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
            this.spinner = false;
            this.dialogRef.close();
            this.afterSave = false;
            this.routerUtilsService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
        });

    }
  calcYearlyRate() {
    const baseRate = this.nepToEngNumberPipe.transform(this.form.get('baseRate').value);
    const premiumRate = this.nepToEngNumberPipe.transform(this.form.get('premiumRate').value);
    const addRate = parseFloat(baseRate) + parseFloat(premiumRate);
    const asd = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(addRate));
    this.form.get('yearlyInterestRate').patchValue(asd);
  }
  getNumAmountWord(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.form.get(wordLabel).patchValue(returnVal);
  }
  close() {
    this.ref.close();
  }
    guarantorParse(nepData, key, trans?) {
        const data = JSON.parse(nepData);
        try {
            if (ObjectUtil.isEmpty(trans)) {
                return data[key].ct;
            } else {
                return data[key].en;
            }
        } catch (exp) {
            console.log(exp);
        }
    }
}
