import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NabilOfferLetterConst} from '../../../../nabil-offer-letter-const';
import {NbDialogRef} from '@nebular/theme';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {NepaliNumberAndWords} from '../../../../model/nepaliNumberAndWords';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {OfferDocument} from '../../../../model/OfferDocument';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {ToastService} from '../../../../../../@core/utils';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';

@Component({
    selector: 'app-ddsl-without-subsidy',
    templateUrl: './ddsl-without-subsidy.component.html',
    styleUrls: ['./ddsl-without-subsidy.component.scss']
})
export class DdslWithoutSubsidyComponent implements OnInit {
    @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
    @Input() preview;
    @Input() letter: any;
    @Input() renewal: any;
    @Input() loanLimit;
    form: FormGroup;
    offerLetterConst = NabilOfferLetterConst;
    offerLetterDocument: OfferDocument;
    initialInfoPrint;
    spinner = false;
    afterSave = false;
    existingOfferLetter = false;
    selectedSecurity;
    position1 = 'सम्पर्क अधिकृत';
    position2 = 'शाखा प्रबन्धक÷बरिष्ठ सम्पर्क प्रबन्धक';
    offerLetterData;
    nepaliNumber = new NepaliNumberAndWords();
    nepaliAmount = [];
    loanHolderInfo;
    loanOptions;
    tempData;
    customerType;
    guarantorData;
    guarantorNames;
    allguarantorNames;
    guarantorAmount = 0;
    finalName;
    offerDocumentDetails;
    freeTextVal: any = {};
    freeInformation: any;

    constructor(
        private formBuilder: FormBuilder,
        private dialogRef: NbDialogRef<DdslWithoutSubsidyComponent>,
        private administrationService: CreditAdministrationService,
        private toastService: ToastService,
        private routerUtilsService: RouterUtilsService,
        public nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
    ) {
    }

    ngOnInit() {
        this.buildForm();
        // console.log('Initial Info Data', this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);
        if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
            this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
            this.tempData = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);
        }
        this.loanOptions = this.tempData.loanOption.ct;
        this.selectedSecurity = this.tempData.securityType.ct;
        this.customerType = this.loanHolderInfo.clientType.en;
        console.log('Temp Data', this.tempData);
        this.guarantorData = this.cadOfferLetterApprovedDoc.assignedLoan[0].taggedGuarantors;
        // console.log('Guarantors Details', this.cadOfferLetterApprovedDoc.assignedLoan[0].taggedGuarantors);
        if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.offerDocumentList)) {
            this.offerDocumentDetails = this.cadOfferLetterApprovedDoc.offerDocumentList[0] ? JSON.parse(
                this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation) : '';
        }
        this.checkOfferLetterData();
    }

    buildForm() {
        return this.form = this.formBuilder.group({
            referenceNo: [undefined],
            selectedSecurity: [undefined],
            loanOptions: [undefined],
            freeTextVal: [undefined],
            sanctionLetterDate: [undefined],
            borrowersName: [undefined],
            borrowerAddress: [undefined],
            customerLoanApplicationDate: [undefined],
            previousSanctionLetterDate: [undefined],
            requestLetterDate: [undefined],
            karjaPurpose: [undefined],
            loanAmount: [undefined],
            loanAmountInWord: [undefined],
            marginInPercentageFoot: [undefined],
            marginInPercentageMotor: [undefined],
            baseRate: [undefined],
            premiumRate: [undefined],
            totalInterestRate: [undefined],
            EMIAmount: [undefined],
            EMIAmountInWord: [undefined],
            totalNoOfInstallment: [undefined],
            nameOfFacility: [undefined],
            serviceCharge: [undefined],
            totalTenureOfLoan: [undefined],
            approvedCFRLoanAmount: [undefined],
            approvedCFRLoanAmountInWord: [undefined],
            approvedCFRPersonalGuarantor: [undefined],
            totalLimit: [undefined],
            totalLimitInWord: [undefined],
            nameOfBranch: [undefined],
            extraFinancialClause: [undefined],
            additionalOtherClause: [undefined],
            mortgageDeedPlotNo: [undefined],
            personalGuaranteeAmount: [undefined],
            nameOfPersonalGuarantor: [undefined],
            extraSecurityDocument: [undefined],
            nameOfARO: [undefined],
            position1: [undefined],
            nameOfBranchManager: [undefined],
            position2: [undefined],
            extraTermsAndConditionsNRB: [undefined],
            sanctionLetterAcceptedDate: [undefined],
            securities: this.formBuilder.array([]),
        });
    }

    fillForm() {
        const customerAddress = this.loanHolderInfo.permanentMunicipality.ct + '-' +
            this.loanHolderInfo.permanentWard.ct + ', ' + this.loanHolderInfo.permanentDistrict.ct + ' ,' +
            this.loanHolderInfo.permanentProvince.ct;
        let autoRefNumber;
        if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.assignedLoan)) {
            autoRefNumber = this.cadOfferLetterApprovedDoc.assignedLoan[0].refNo;
        }
        // Date of Application
        const dateOfApplication = this.tempData.dateOfApplicationType ? this.tempData.dateOfApplicationType.en : '';
        let finaldateOfApplication;
        if (dateOfApplication === 'AD') {
            finaldateOfApplication = this.tempData.dateOfApplication ? this.tempData.dateOfApplication.ct : '';
        } else {
            finaldateOfApplication = this.tempData.dateOfApplicationNepali ? this.tempData.dateOfApplicationNepali.ct : '';
        }
        // Date of Approval
        const dateOfApproval = this.tempData.sanctionLetterDateType ? this.tempData.sanctionLetterDateType.en : '';
        let finaldateOfApproval;
        if (dateOfApproval === 'AD') {
            finaldateOfApproval = this.tempData.sanctionLetterDate ? this.tempData.sanctionLetterDate.ct : '';
        } else {
            finaldateOfApproval = this.tempData.sanctionLetterDateNepali ? this.tempData.sanctionLetterDateNepali.ct : '';
        }
        // Previous Sanction Date
        const dateOfPreviousSanction = this.tempData.previousSanctionType ? this.tempData.previousSanctionType.en : '';
        let finalPreviousSanction;
        if (dateOfPreviousSanction === 'AD') {
            finalPreviousSanction = this.tempData.previousSanctionDate ? this.tempData.previousSanctionDate.ct : '';
        } else {
            finalPreviousSanction = this.tempData.previousSanctionDateNepali ? this.tempData.previousSanctionDateNepali.ct : '';
        }
        this.guarantorDetails();
        this.form.patchValue({
            referenceNo: autoRefNumber ? autoRefNumber : '',
            borrowersName: this.loanHolderInfo.name ? this.loanHolderInfo.name.ct : '',
            borrowerAddress: customerAddress ? customerAddress : '',
            // customerLoanApplicationDate: finaldateOfApplication ? finaldateOfApplication : '',
            sanctionLetterDate: finaldateOfApproval ? finaldateOfApproval : '',
            previousSanctionLetterDate: finalPreviousSanction ? finalPreviousSanction : '',
            requestLetterDate: finaldateOfApplication ? finaldateOfApplication : '',
            karjaPurpose: this.tempData.purposeOfLoan ? this.tempData.purposeOfLoan.ct : '',
            loanAmount: this.tempData.loanAmountFigure ? this.tempData.loanAmountFigure.ct : '',
            loanAmountInWord: this.tempData.loanAmountFigureWords ? this.tempData.loanAmountFigureWords.ct : '',
            marginInPercentageMotor: this.tempData.marginInPercentageMotor ? this.tempData.marginInPercentageMotor.ct : '',
            marginInPercentageFoot: this.tempData.marginInPercentageFoot ? this.tempData.marginInPercentageFoot.ct : '',
            totalLimit: this.tempData.loanLimitAmountFigure ? this.tempData.loanLimitAmountFigure.ct : '',
            totalLimitInWord: this.tempData.loanLimitAmountFigureWords ? this.tempData.loanLimitAmountFigureWords.ct : '',
            baseRate: this.tempData.baseRate ? this.tempData.baseRate.ct : '',
            premiumRate: this.tempData.premiumRate ? this.tempData.premiumRate.ct : '',
            totalInterestRate: this.tempData.interestRate ? this.tempData.interestRate.ct : '',
            EMIAmount: this.tempData.EMIAmountFigure ? this.tempData.EMIAmountFigure.ct : '',
            EMIAmountInWord: this.tempData.EMIAmountWord ? this.tempData.EMIAmountWord.ct : '',
            totalNoOfInstallment: this.tempData.totalInstallmentFigure ? this.tempData.totalInstallmentFigure.ct : '',
            nameOfFacility: this.tempData.nameOfFacility ? this.tempData.nameOfFacility.ct : '',
            serviceCharge: this.tempData.serviceCharge ? this.tempData.serviceCharge.ct : '',
            totalTenureOfLoan: this.tempData.totalTenureOfLoan ? this.tempData.totalTenureOfLoan.ct : '',
            /*approvedCFRLoanAmount: this.tempData.loanAmountFigure ? this.tempData.loanAmountFigure.ct : '',
            approvedCFRLoanAmountInWord: this.tempData.loanAmountFigure ? this.tempData.loanAmountFigure.ct : '',*/
            nameOfBranch: this.loanHolderInfo.branch ? this.loanHolderInfo.branch.ct : '',
            nameOfPersonalGuarantor: this.finalName ? this.finalName : '',
            nameOfARO: this.tempData.nameOfStaff ? this.tempData.nameOfStaff.ct : '',
            nameOfBranchManager: this.tempData.nameOfBranchManager ? this.tempData.nameOfBranchManager.ct : '',
            extraFinancialClause: !ObjectUtil.isEmpty(this.freeInformation) ? this.freeInformation.firstText : '',
            additionalOtherClause: !ObjectUtil.isEmpty(this.freeInformation) ? this.freeInformation.secondText : '',
            extraSecurityDocument: !ObjectUtil.isEmpty(this.freeInformation) ? this.freeInformation.thirdText : '',
            extraTermsAndConditionsNRB: !ObjectUtil.isEmpty(this.freeInformation) ? this.freeInformation.fourthText : '',
            position1: !ObjectUtil.isEmpty(this.freeInformation) ? this.freeInformation.fifthText : '',
            position2: !ObjectUtil.isEmpty(this.freeInformation) ? this.freeInformation.sixthText : '',
        });
    }

    close() {
        this.dialogRef.close();
    }

    checkOfferLetterData() {
        if (this.cadOfferLetterApprovedDoc.offerDocumentList.length > 0) {
            this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
                === this.offerLetterConst.value(this.offerLetterConst.DDSL_WITHOUT_SUBSIDY).toString())[0];
            if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
                this.offerLetterDocument = new OfferDocument();
                this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.DDSL_WITHOUT_SUBSIDY);
            } else {
                const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
                if (!ObjectUtil.isEmpty(this.offerLetterDocument.supportedInformation)) {
                    this.offerLetterData = this.offerLetterDocument;
                    this.setFreeText();
                    this.freeInformation = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].supportedInformation);
                }
                this.initialInfoPrint = initialInfo;
                this.existingOfferLetter = true;
                this.initialInfoPrint = initialInfo;
                // this.selectedSecurity = initialInfo.securityType.en;
                this.fillForm();
            }
        } else {
            this.setFreeText();
            this.freeInformation = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].supportedInformation);
            this.fillForm();
        }
    }

    submit(): void {
        this.spinner = true;
        this.cadOfferLetterApprovedDoc.docStatus = 'OFFER_AND_LEGAL_PENDING';
        this.form.get('selectedSecurity').patchValue(this.selectedSecurity);

        if (this.existingOfferLetter) {
            this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
                if (offerLetterPath.docName.toString() ===
                    this.offerLetterConst.value(this.offerLetterConst.DDSL_WITHOUT_SUBSIDY).toString()) {
                    this.setFreeText();
                    offerLetterPath.supportedInformation = JSON.stringify(this.freeTextVal);
                }
            });
        } else {
            const offerDocument = new OfferDocument();
            offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.DDSL_WITHOUT_SUBSIDY);
            offerDocument.initialInformation = JSON.stringify(this.form.value);
            this.setFreeText();
            offerDocument.supportedInformation = JSON.stringify(this.freeTextVal);
            // offerDocument.supportedInformation = this.form.get('additionalGuarantorDetails').value;
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

    setFreeText() {
        this.freeTextVal = {
            firstText: this.form.get('extraFinancialClause').value,
            secondText: this.form.get('additionalOtherClause').value,
            thirdText: this.form.get('extraSecurityDocument').value,
            fourthText: this.form.get('extraTermsAndConditionsNRB').value,
            fifthText: this.form.get('position1').value,
            sixthText: this.form.get('position2').value,
        };
    }

    guarantorDetails() {
        if (this.guarantorData.length === 1) {
            const temp = JSON.parse(this.guarantorData[0].nepData);
            this.finalName = temp.guarantorName.ct;
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
            this.finalName = this.allguarantorNames + ' र ' + temp1.guarantorName.ct;
        }
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
