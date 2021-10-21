import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CadFile} from '../../../model/CadFile';
import {Document} from '../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {ToastService} from '../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {NepaliNumberAndWords} from '../../../model/nepaliNumberAndWords';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {EngNepDatePipe} from 'nepali-patro';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../@core/pipe/currency-formatter.pipe';
import {ProposalCalculationUtils} from '../../../../loan/component/loan-summary/ProposalCalculationUtils';

@Component({
    selector: 'app-personal-guarantee-proprietorship',
    templateUrl: './personal-guarantee-proprietorship.component.html',
    styleUrls: ['./personal-guarantee-proprietorship.component.scss']
})
export class PersonalGuaranteeProprietorshipComponent implements OnInit {
    personalGuaranteeProprietorship: FormGroup;
    @Input() cadData: CustomerApprovedLoanCadDocumentation;
    @Input() documentId: number;
    @Input() customerLoanId: number;
    @Input() nepaliAmount: NepaliNumberAndWords;
    nepData;
    guarantorData;
    submitted = false;

    taggedGuarantorsDetailsInLoan = [];
    loanHolderNepData: any;
    offerDocumentDetails: any;
    nepaliNumber = new NepaliNumberAndWords();

    constructor(private formBuilder: FormBuilder,
                private administrationService: CreditAdministrationService,
                private toastService: ToastService,
                private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
                private nepToEngNumberPipe: NepaliToEngNumberPipe,
                private englishNepaliDatePipe: EngNepDatePipe,
                private engToNepNumberPipe: EngToNepaliNumberPipe,
                private currencyFormatPipe: CurrencyFormatterPipe,
                private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
                private routerUtilsService: RouterUtilsService) {
    }

    ngOnInit() {
        this.loadPersonalGuarantorData();
        this.buildForm();
    }

    loadPersonalGuarantorData() {
        console.log('cadData: ', this.cadData);
        if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.assignedLoan)) {
            this.loanHolderNepData = this.cadData.loanHolder.nepData
                ? JSON.parse(this.cadData.loanHolder.nepData)
                : this.cadData.loanHolder.nepData;
            this.cadData.assignedLoan.map((value) => {
                value.taggedGuarantors.forEach((val) => {
                    this.taggedGuarantorsDetailsInLoan.push(val);
                });
            });
            if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList) && this.cadData.offerDocumentList.length !== 0) {
                this.offerDocumentDetails = JSON.parse(this.cadData.offerDocumentList[0].initialInformation);
            }
        }
        this.taggedGuarantorsDetailsInLoan = Array.from(
            new Set(
                this.taggedGuarantorsDetailsInLoan.map((val) => JSON.stringify(val))
            )
        ).map((val) => JSON.parse(val));
        console.log('loanHolderNepData: ', this.loanHolderNepData);
        console.log('taggedGuarantorsDetailsInLoan: ', this.taggedGuarantorsDetailsInLoan);
    }

    buildForm() {
        this.personalGuaranteeProprietorship = this.formBuilder.group({
            guaranteeCompanies: this.formBuilder.array([]),
        });
        this.calulation();
        this.taggedPersonalGuarantorsDetailsForm();
    }

    initIndividualGuarantors() {
        return this.formBuilder.group({});
    }

    taggedPersonalGuarantorsDetailsForm() {
        // get today's date
        let todayDate: any = this.englishNepaliDatePipe.transform(new Date(), true);
        todayDate = todayDate.replace(',', '').split(' ');
        const daysInNumber = new Date().getDay();

        if (!ObjectUtil.isEmpty(this.taggedGuarantorsDetailsInLoan)) {
            this.taggedGuarantorsDetailsInLoan.forEach((val) => {
                const individualGuarantorNepData = val.nepData
                    ? JSON.parse(val.nepData)
                    : val.nepData;
                if (ObjectUtil.isEmpty(individualGuarantorNepData)) {
                    return;
                }
                console.log('individualGuarantorNepData: ', individualGuarantorNepData);
                console.log('offerDocumentDetails: ', this.offerDocumentDetails);
                (this.personalGuaranteeProprietorship.get('guaranteeCompanies') as FormArray).push(
                    this.formBuilder.group({
                        branchName: [this.loanHolderNepData.branch ? this.loanHolderNepData.branch.ct : ''],
                        actDetails: [undefined],
                        actYearInFigure: [undefined],
                        headDepartment: [undefined],
                        registrationDate: [undefined],
                        registrationNo: [undefined],
                        location: [undefined],
                        loaneeName: [this.loanHolderNepData.name ? this.loanHolderNepData.name.ct : ''],
                        loanPurpose: [this.offerDocumentDetails && this.offerDocumentDetails.purposeOfLoan ? this.offerDocumentDetails.purposeOfLoan.ct : ''],
                        letterIssuedDate: [undefined],
                        loanAmount: [this.nepaliNumber.numberNepali],
                        loanAmountInWord: [this.nepaliNumber.nepaliWords],
                        approvedLoanAmount: [this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(individualGuarantorNepData.gurantedAmount.en))],
                        approvedLoanAmountInWord: [this.nepaliCurrencyWordPipe.transform(individualGuarantorNepData.gurantedAmount.en)],
                        freeText: [undefined],
                        guarantorName: [individualGuarantorNepData.guarantorName ? individualGuarantorNepData.guarantorName.ct : ''],
                        guarantorFatherOrHusbandName: [individualGuarantorNepData.fatherName ? individualGuarantorNepData.fatherName.ct : individualGuarantorNepData.husbandName ? individualGuarantorNepData.husbandName.ct : ''],
                        grandFatherOrFatherInLaw: [individualGuarantorNepData.grandFatherName ? individualGuarantorNepData.grandFatherName.ct : individualGuarantorNepData.fatherInLawName ? individualGuarantorNepData.fatherInLawName.ct : ''],
                        permanentDistrict: [individualGuarantorNepData.permanentDistrict ? individualGuarantorNepData.permanentDistrict.ct : '',],
                        permanentMunicipalities: [individualGuarantorNepData.permanentMunicipality ? individualGuarantorNepData.permanentMunicipality.ct : '',],
                        permanentWard: [individualGuarantorNepData.permanentWard ? individualGuarantorNepData.permanentWard.ct : '',],
                        temporaryDistrict: [individualGuarantorNepData.temporaryDistrict ? individualGuarantorNepData.temporaryDistrict.ct : '',],
                        temporaryMunicipalities: [individualGuarantorNepData.temporaryMunicipality ? individualGuarantorNepData.temporaryMunicipality.ct : '',],
                        temporaryWard: [individualGuarantorNepData.temporaryWard ? individualGuarantorNepData.temporaryWard.ct : '',],
                        citizenshipNo: [individualGuarantorNepData.citizenNumber ? individualGuarantorNepData.citizenNumber.ct : '',],
                        issuedBy: [individualGuarantorNepData.issuedPlace ? individualGuarantorNepData.issuedPlace.ct : '',],
                        issuedDate: [
                            this.englishNepaliDatePipe.transform(individualGuarantorNepData.citizenIssuedDate.en.eDate ? individualGuarantorNepData.citizenIssuedDate.en.eDate : individualGuarantorNepData.citizenIssuedDate.en, true) || ''
                        ],

                        year: [todayDate[2]],
                        month: [todayDate[1]],
                        day: [todayDate[0]],
                        date: [this.engToNepNumberPipe.transform(String(daysInNumber + 1))],

                    })
                );
            });
        }
    }

    calulation() {
        if (ObjectUtil.isEmpty(this.cadData.nepData)) {
            const number = ProposalCalculationUtils.calculateTotalFromProposalListKey(this.cadData.assignedLoan);
            this.nepaliNumber.numberNepali = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(number));
            this.nepaliNumber.nepaliWords = this.nepaliCurrencyWordPipe.transform(number);
            this.nepaliNumber.engNumber = number;
        } else {
            this.nepaliNumber = JSON.parse(this.cadData.nepData);
        }

    }

    submit() {
        let flag = true;
        if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
            this.cadData.cadFileList.forEach(singleCadFile => {
                if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
                    flag = false;
                    singleCadFile.initialInformation = JSON.stringify(this.personalGuaranteeProprietorship.value);
                }
            });
            if (flag) {
                const cadFile = new CadFile();
                const document = new Document();
                cadFile.initialInformation = JSON.stringify(this.personalGuaranteeProprietorship.value);
                document.id = this.documentId;
                cadFile.cadDocument = document;
                cadFile.customerLoanId = this.customerLoanId;
                this.cadData.cadFileList.push(cadFile);
            }
        } else {
            const cadFile = new CadFile();
            const document = new Document();
            cadFile.initialInformation = JSON.stringify(this.personalGuaranteeProprietorship.value);
            document.id = this.documentId;
            cadFile.cadDocument = document;
            cadFile.customerLoanId = this.customerLoanId;
            this.cadData.cadFileList.push(cadFile);
        }

        this.administrationService.saveCadDocumentBulk(this.cadData).subscribe(() => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
            this.dialogRef.close();
            this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
            this.dialogRef.close();
        });
        console.log(this.personalGuaranteeProprietorship.value);
    }
}
