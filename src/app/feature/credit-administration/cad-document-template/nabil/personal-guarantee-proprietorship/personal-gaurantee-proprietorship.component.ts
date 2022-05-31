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
import {NabilDocumentChecklist} from '../../../../admin/modal/nabil-document-checklist.enum';
import {LoanNameConstant} from '../../../cad-view/template-data/nabil-sme-template-data/sme-costant/loan-name-constant';
import { DatePipe } from '@angular/common';

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
    offerLetterConst = NabilDocumentChecklist;
    taggedGuarantorsDetailsInLoan = [];
    loanHolderNepData: any;
    offerDocumentDetails: any;
    nepaliNumber = new NepaliNumberAndWords();
    loanPurpose = 'व्यापार / व्यवसाय संचालन';
    tempData;
    nameOfAuthorizedBody = 'नेपाल सरकार';
    cadInitialInfo;
    individualGuarantorNepDataArray: Array<any> = new Array<any>();
    freeText: Array<any> = new Array<any>();
    finalAmount;
    loanAmountWord;
    spinner = false;
    constructor(private formBuilder: FormBuilder,
                private administrationService: CreditAdministrationService,
                private toastService: ToastService,
                private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
                private nepToEngNumberPipe: NepaliToEngNumberPipe,
                private englishNepaliDatePipe: EngNepDatePipe,
                private engToNepNumberPipe: EngToNepaliNumberPipe,
                private currencyFormatPipe: CurrencyFormatterPipe,
                private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
                private routerUtilsService: RouterUtilsService,
                private datePipe: DatePipe) {
    }

    ngOnInit() {
        this.loadPersonalGuarantorData();
        this.setTotalAmount();
        this.buildForm();
        this.fillGuarantee();
    }

    setFreeText() {
        const free = this.personalGuaranteeProprietorship.value;
        for (let val = 0; val < free.guaranteeProprietorship.length; val++) {
            const tempFreeText = {
                year: this.personalGuaranteeProprietorship.get(['guaranteeProprietorship', val, 'year']).value ?
                    this.personalGuaranteeProprietorship.get(['guaranteeProprietorship', val, 'year']).value : '',
                month: this.personalGuaranteeProprietorship.get(['guaranteeProprietorship', val, 'month']).value ?
                    this.personalGuaranteeProprietorship.get(['guaranteeProprietorship', val, 'month']).value : '',
                date: this.personalGuaranteeProprietorship.get(['guaranteeProprietorship', val, 'date']).value ?
                    this.personalGuaranteeProprietorship.get(['guaranteeProprietorship', val, 'date']).value : '',
                day: this.personalGuaranteeProprietorship.get(['guaranteeProprietorship', val, 'day']).value ?
                    this.personalGuaranteeProprietorship.get(['guaranteeProprietorship', val, 'day']).value : '',
                bankStaff: this.personalGuaranteeProprietorship.get(['guaranteeProprietorship', val, 'bankStaff']).value ?
                    this.personalGuaranteeProprietorship.get(['guaranteeProprietorship', val, 'bankStaff']).value : '',
                witnessDistrict: this.personalGuaranteeProprietorship.get(['guaranteeProprietorship', val, 'witnessDistrict']).value ?
                    this.personalGuaranteeProprietorship.get(['guaranteeProprietorship', val, 'witnessDistrict']).value : '',
                witnessMunicipality: this.personalGuaranteeProprietorship.get(
                    ['guaranteeProprietorship', val, 'witnessMunicipality']).value ?
                    this.personalGuaranteeProprietorship.get(['guaranteeProprietorship', val, 'witnessMunicipality']).value : '',
                WitnessWardNumber: this.personalGuaranteeProprietorship.get(['guaranteeProprietorship', val, 'WitnessWardNumber']).value ?
                    this.personalGuaranteeProprietorship.get(['guaranteeProprietorship', val, 'WitnessWardNumber']).value : '',
                witnessAge: this.personalGuaranteeProprietorship.get(['guaranteeProprietorship', val, 'witnessAge']).value ?
                    this.personalGuaranteeProprietorship.get(['guaranteeProprietorship', val, 'witnessAge']).value : '',
                witnessName: this.personalGuaranteeProprietorship.get(['guaranteeProprietorship', val, 'witnessName']).value ?
                    this.personalGuaranteeProprietorship.get(['guaranteeProprietorship', val, 'witnessName']).value : '',
                witnessDistrict2: this.personalGuaranteeProprietorship.get(['guaranteeProprietorship', val, 'witnessDistrict2']).value ?
                    this.personalGuaranteeProprietorship.get(['guaranteeProprietorship', val, 'witnessDistrict2']).value : '',
                witnessMunicipality2: this.personalGuaranteeProprietorship.get(
                    ['guaranteeProprietorship', val, 'witnessMunicipality2']).value ?
                    this.personalGuaranteeProprietorship.get(['guaranteeProprietorship', val, 'witnessMunicipality2']).value : '',
                WitnessWardNumber2: this.personalGuaranteeProprietorship.get(['guaranteeProprietorship', val, 'WitnessWardNumber2']).value ?
                    this.personalGuaranteeProprietorship.get(['guaranteeProprietorship', val, 'WitnessWardNumber2']).value : '',
                witnessAge2: this.personalGuaranteeProprietorship.get(['guaranteeProprietorship', val, 'witnessAge2']).value ?
                    this.personalGuaranteeProprietorship.get(['guaranteeProprietorship', val, 'witnessAge2']).value : '',
                witnessName2: this.personalGuaranteeProprietorship.get(['guaranteeProprietorship', val, 'witnessName2']).value ?
                    this.personalGuaranteeProprietorship.get(['guaranteeProprietorship', val, 'witnessName2']).value : '',
                freeText: this.personalGuaranteeProprietorship.get(['guaranteeProprietorship', val, 'freeText']).value ?
                    this.personalGuaranteeProprietorship.get(['guaranteeProprietorship', val, 'freeText']).value : '',
            };
        this.freeText.push(tempFreeText);
        }
        return JSON.stringify(this.freeText);
    }

    fillGuarantee() {
        if (this.cadData.cadFileList.length > 0) {
            if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
                this.cadData.cadFileList.forEach(singleCadFile => {
                    if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
                        this.cadInitialInfo = JSON.parse(singleCadFile.supportedInformation);
                    }
                });
                const free = this.personalGuaranteeProprietorship.value;
                if (this.cadInitialInfo !== null) {
                    for (let val = 0; val < free.guaranteeProprietorship.length; val++) {
                        this.personalGuaranteeProprietorship.get(['guaranteeProprietorship', val, 'year']).patchValue(this.cadInitialInfo ?
                            this.cadInitialInfo[val].year : '');
                        this.personalGuaranteeProprietorship.get(['guaranteeProprietorship', val, 'month']).patchValue(this.cadInitialInfo ?
                            this.cadInitialInfo[val].month : '');
                        this.personalGuaranteeProprietorship.get(['guaranteeProprietorship', val, 'date']).patchValue(this.cadInitialInfo ?
                            this.cadInitialInfo[val].date : '');
                        this.personalGuaranteeProprietorship.get(['guaranteeProprietorship', val, 'day']).patchValue(this.cadInitialInfo ?
                            this.cadInitialInfo[val].day : '');
                        this.personalGuaranteeProprietorship.get(['guaranteeProprietorship', val, 'witnessDistrict']).patchValue(
                            this.cadInitialInfo ?
                            this.cadInitialInfo[val].witnessDistrict : '');
                        this.personalGuaranteeProprietorship.get(['guaranteeProprietorship', val, 'witnessMunicipality']).patchValue(
                            this.cadInitialInfo ?
                            this.cadInitialInfo[val].witnessMunicipality : '');
                        this.personalGuaranteeProprietorship.get(['guaranteeProprietorship', val, 'WitnessWardNumber']).patchValue(
                            this.cadInitialInfo ?
                            this.cadInitialInfo[val].WitnessWardNumber : '');
                        this.personalGuaranteeProprietorship.get(['guaranteeProprietorship', val, 'witnessAge']).patchValue(
                            this.cadInitialInfo ?
                            this.cadInitialInfo[val].witnessAge : '');
                        this.personalGuaranteeProprietorship.get(['guaranteeProprietorship', val, 'witnessName']).patchValue(
                            this.cadInitialInfo ?
                            this.cadInitialInfo[val].witnessName : '');
                        this.personalGuaranteeProprietorship.get(['guaranteeProprietorship', val, 'witnessDistrict2']).patchValue(
                            this.cadInitialInfo ?
                            this.cadInitialInfo[val].witnessDistrict2 : '');
                        this.personalGuaranteeProprietorship.get(['guaranteeProprietorship', val, 'witnessMunicipality2']).patchValue(
                            this.cadInitialInfo ?
                            this.cadInitialInfo[val].witnessMunicipality2 : '');
                        this.personalGuaranteeProprietorship.get(['guaranteeProprietorship', val, 'WitnessWardNumber2']).patchValue(
                            this.cadInitialInfo ?
                            this.cadInitialInfo[val].WitnessWardNumber2 : '');
                        this.personalGuaranteeProprietorship.get(['guaranteeProprietorship', val, 'witnessAge2']).patchValue(
                            this.cadInitialInfo ?
                            this.cadInitialInfo[val].witnessAge2 : '');
                        this.personalGuaranteeProprietorship.get(['guaranteeProprietorship', val, 'witnessName2']).patchValue(
                            this.cadInitialInfo ?
                            this.cadInitialInfo[val].witnessName2 : '');
                        this.personalGuaranteeProprietorship.get(['guaranteeProprietorship', val, 'bankStaff']).patchValue(
                            this.cadInitialInfo ?
                            this.cadInitialInfo[val].bankStaff : '');
                        this.personalGuaranteeProprietorship.get(['guaranteeProprietorship', val, 'freeText']).patchValue(
                            this.cadInitialInfo ?
                                this.cadInitialInfo[val].freeText : '');
                    }
                }
            }
        }
    }

    setTotalAmount() {
        if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList)) {
            if (this.cadData.offerDocumentList[0].docName === 'Combined Offer Letter') {
                this.finalAmount = (this.offerDocumentDetails.smeGlobalForm && this.offerDocumentDetails.smeGlobalForm.totalLimitInFigureCT) ?
                    this.offerDocumentDetails.smeGlobalForm.totalLimitInFigureCT : '';
                this.loanAmountWord = (this.offerDocumentDetails.smeGlobalForm && this.offerDocumentDetails.smeGlobalForm.totalLimitInWordsCT ) ?
                    this.offerDocumentDetails.smeGlobalForm.totalLimitInWordsCT : '';
            } if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'DDSL Without Subsidy') {
                this.finalAmount = (this.offerDocumentDetails && this.offerDocumentDetails.loanLimitAmountFigure) ?
                    this.offerDocumentDetails.loanLimitAmountFigure.ct : '';
                this.loanAmountWord = (this.offerDocumentDetails && this.offerDocumentDetails.loanLimitAmountFigureWords) ?
                    this.offerDocumentDetails.loanLimitAmountFigureWords.ct : '';
            } if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Class A Sanction letter') {
                this.finalAmount = (this.offerDocumentDetails && this.offerDocumentDetails.totalLimitInFigure) ?
                    this.offerDocumentDetails.totalLimitInFigure.ct : '';
                this.loanAmountWord = (this.offerDocumentDetails && this.offerDocumentDetails.totalLimitInWords) ?
                    this.offerDocumentDetails.totalLimitInWords.ct : '';
            } if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Interest subsidy sanction letter') {
                this.finalAmount = (this.offerDocumentDetails && this.offerDocumentDetails.totalLimitFigure) ?
                    this.offerDocumentDetails.totalLimitFigure.ct : '';
                this.loanAmountWord = (this.offerDocumentDetails && this.offerDocumentDetails.totalLimitWords) ?
                    this.offerDocumentDetails.totalLimitWords.ct : '';
            } if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Kisan Karja Subsidy') {
                const proposedLimit = this.cadData.assignedLoan[0] ?
                    this.cadData.assignedLoan[0].proposal.proposedLimit : 0;
                this.finalAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(proposedLimit ? proposedLimit : 0));
                this.loanAmountWord = this.nepaliCurrencyWordPipe.transform(proposedLimit ? proposedLimit : '');
            } if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Udyamsil Karja Subsidy') {
                this.finalAmount = (this.offerDocumentDetails && this.offerDocumentDetails.loanAmountFigure) ?
                    this.offerDocumentDetails.loanAmountFigure.ct : '';
                this.loanAmountWord = (this.offerDocumentDetails && this.offerDocumentDetails.loanAmountFigureWords) ?
                    this.offerDocumentDetails.loanAmountFigureWords.ct : '';
            }
        }
    }

    loadPersonalGuarantorData() {
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
    }

    buildForm() {
        this.personalGuaranteeProprietorship = this.formBuilder.group({
          guaranteeProprietorship: this.formBuilder.array([]),
        });
        this.calulation();
        this.taggedPersonalGuarantorsDetailsForm();
    }

    initIndividualGuarantors() {
        return this.formBuilder.group({});
    }

    taggedPersonalGuarantorsDetailsForm() {
        if (!ObjectUtil.isEmpty(this.taggedGuarantorsDetailsInLoan)) {
            this.taggedGuarantorsDetailsInLoan.forEach((val) => {
                if (JSON.parse(val.nepData).guarantorType.en === 'Personal Guarantor') {
                    const individualGuarantorNepData = val.nepData
                        ? JSON.parse(val.nepData)
                        : val.nepData;
                    if (ObjectUtil.isEmpty(individualGuarantorNepData)) {
                        return;
                    }
                    let fatherName;
                    let grandFatherName;
                    if (!ObjectUtil.isEmpty(individualGuarantorNepData)) {
                        if (!ObjectUtil.isEmpty(individualGuarantorNepData.gender) &&
                            !ObjectUtil.isEmpty(individualGuarantorNepData.gender.en)) {
                            if (individualGuarantorNepData.gender.en === 'MALE') {
                                fatherName = individualGuarantorNepData.fatherName ? individualGuarantorNepData.fatherName.ct : '';
                                grandFatherName = individualGuarantorNepData.grandFatherName ? individualGuarantorNepData.grandFatherName.ct : '';
                            }
                            if (individualGuarantorNepData.gender.en === 'FEMALE') {
                                if (!ObjectUtil.isEmpty(individualGuarantorNepData.guarantorMaritalStatus) &&
                                    !ObjectUtil.isEmpty(individualGuarantorNepData.guarantorMaritalStatus.en)) {
                                    if (individualGuarantorNepData.guarantorMaritalStatus.en === 'Married') {
                                        if (!ObjectUtil.isEmpty(individualGuarantorNepData.relationMedium.en) &&
                                            individualGuarantorNepData.relationMedium.en === '1') {
                                            fatherName = individualGuarantorNepData.fatherName ? individualGuarantorNepData.fatherName.ct : '';
                                            grandFatherName = individualGuarantorNepData.grandFatherName ?
                                                individualGuarantorNepData.grandFatherName.ct : '';
                                        } else {
                                            fatherName = individualGuarantorNepData.husbandName ? individualGuarantorNepData.husbandName.ct : '';
                                            grandFatherName = individualGuarantorNepData.fatherInLawName ?
                                                individualGuarantorNepData.fatherInLawName.ct : '';
                                        }
                                    }
                                    if (individualGuarantorNepData.guarantorMaritalStatus.en === 'Unmarried') {
                                        fatherName = individualGuarantorNepData.fatherName ? individualGuarantorNepData.fatherName.ct : '';
                                        grandFatherName = individualGuarantorNepData.grandFatherName ?
                                            individualGuarantorNepData.grandFatherName.ct : '';
                                    }
                                }
                            }
                        }
                    }
                    this.individualGuarantorNepDataArray.push(individualGuarantorNepData);
                    (this.personalGuaranteeProprietorship.get('guaranteeProprietorship') as FormArray).push(
                        this.formBuilder.group({
                            branchName: [this.loanHolderNepData.branch ? this.loanHolderNepData.branch.ct : ''],
                            actDetails: [this.loanHolderNepData.actName ? this.loanHolderNepData.actName.ct : ''],
                            actYearInFigure: [this.setActYear()],
                            // tslint:disable-next-line:max-line-length
                            authorizedBodyName: [this.loanHolderNepData.authorizedBodyName ? this.loanHolderNepData.authorizedBodyName.ct : 'नेपाल सरकार'],
                            headDepartment: [this.loanHolderNepData.registeredWith &&
                            this.loanHolderNepData.registeredWith.ct ? this.loanHolderNepData.registeredWith.ct : ''],
                            registrationDate: [this.setRegistrationDate()],
                            registrationNo: [this.loanHolderNepData.registrationNo ? this.loanHolderNepData.registrationNo.ct : ''],
                            registeredDistrict: [this.loanHolderNepData.registeredDistrict ? this.loanHolderNepData.registeredDistrict.ct : ''],
                            // tslint:disable-next-line:max-line-length
                            municipalityOfFirm: [this.loanHolderNepData.registeredMunicipality ? this.loanHolderNepData.registeredMunicipality.ct : ''],
                            wardNumOfFirm: [this.loanHolderNepData.permanentWard ? this.loanHolderNepData.permanentWard.ct : ''],
                            // tslint:disable-next-line:max-line-length
                            addressOfFirm: [this.loanHolderNepData.registeredStreetTole ? this.loanHolderNepData.registeredStreetTole.ct : ''],
                            loaneeName: [this.loanHolderNepData.name ? this.loanHolderNepData.name.ct : ''],
                            loanPurpose: [this.setLoanPurpose()],
                            letterIssuedDate: [this.setIssuedDate()],
                            loanAmount: [this.finalAmount],
                            loanAmountInWord: [this.loanAmountWord],
                            // tslint:disable-next-line:max-line-length
                            approvedLoanAmount: [this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(individualGuarantorNepData.gurantedAmount.en))],
                            approvedLoanAmountInWord: [this.nepaliCurrencyWordPipe.transform(individualGuarantorNepData.gurantedAmount.en)],
                            freeText: [undefined],
                            guarantorName: [individualGuarantorNepData.guarantorName ? individualGuarantorNepData.guarantorName.ct : ''],
                            // tslint:disable-next-line:max-line-length
                            guarantorFatherOrHusbandName: [fatherName ? fatherName : ''],
                            // tslint:disable-next-line:max-line-length
                            grandFatherOrFatherInLaw: [grandFatherName ? grandFatherName : ''],
                            permanentDistrict: [individualGuarantorNepData.permanentDistrict ? individualGuarantorNepData.permanentDistrict.ct : ''],
                            // tslint:disable-next-line:max-line-length
                            permanentMunicipalities: [individualGuarantorNepData.permanentMunicipality ? individualGuarantorNepData.permanentMunicipality.ct : ''],
                            permanentWard: [individualGuarantorNepData.permanentWard ? individualGuarantorNepData.permanentWard.ct : ''],
                            guarantorForeignAddress: [!ObjectUtil.isEmpty(individualGuarantorNepData.guarantorOtherAddress) ? individualGuarantorNepData.guarantorOtherAddress.ct : ''],
                            temporaryDistrict: [individualGuarantorNepData.temporaryDistrict ? individualGuarantorNepData.temporaryDistrict.ct : ''],
                            // tslint:disable-next-line:max-line-length
                            temporaryMunicipalities: [individualGuarantorNepData.temporaryMunicipality ? individualGuarantorNepData.temporaryMunicipality.ct : ''],
                            temporaryWard: [individualGuarantorNepData.temporaryWard ? individualGuarantorNepData.temporaryWard.ct : ''],
                            guarantorTempForeignAddress: [!ObjectUtil.isEmpty(individualGuarantorNepData.guarantorOtherAddressTemp) ? individualGuarantorNepData.guarantorOtherAddressTemp.ct : ''],
                            citizenshipNo: [this.setIdentityNo(individualGuarantorNepData)],
                            issuedBy: [this.setIdentityIssuedPlace(individualGuarantorNepData)],
                            // tslint:disable-next-line:max-line-length
                            issuedDate: [this.setIdentityIssuedDate(individualGuarantorNepData)],
                            passportExpiryDate: [this.setValidityDate(individualGuarantorNepData)],
                            year: [undefined],
                            month: [undefined],
                            day: [undefined],
                            date: [undefined],
                            bankStaff: [undefined],
                            witnessDistrict: [undefined],
                            witnessMunicipality: [undefined],
                            WitnessWardNumber: [undefined],
                            witnessAge: [undefined],
                            witnessName: [undefined],
                            witnessDistrict2: [undefined],
                            witnessMunicipality2: [undefined],
                            WitnessWardNumber2: [undefined],
                            witnessAge2: [undefined],
                            witnessName2: [undefined],
                        })
                    );
                }
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

    setLoanPurpose() {
      let loanKoPurpose = '';
      if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'DDSL Without Subsidy') {
        loanKoPurpose = this.offerDocumentDetails.purposeOfLoan.ct;
      }
      if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Kisan Karja Subsidy') {
        loanKoPurpose = this.offerDocumentDetails.purposeOfLoan.ct;
      }
      if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Udyamsil Karja Subsidy') {
        loanKoPurpose = this.offerDocumentDetails.purposeOfLoan.ct;
      }
      if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Udyamsil Karja Subsidy') {
        loanKoPurpose = this.offerDocumentDetails.purposeOfLoan.ct;
      }
      if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.offerDocumentDetails.mortgageEquityTermForm) {
        loanKoPurpose = this.offerDocumentDetails.mortgageEquityTermForm.purposeOfLoanCT;
      }
      if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.offerDocumentDetails.autoLoanMasterForm) {
        loanKoPurpose = this.offerDocumentDetails.autoLoanMasterForm.purposeOfLoanCT;
      }
      return loanKoPurpose ? loanKoPurpose : this.loanPurpose;
    }

    submit() {
        let flag = true;
        this.spinner = true;
        if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
            this.cadData.cadFileList.forEach(singleCadFile => {
                console.log(this.cadData, 'caddate');
                if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
                    flag = false;
                    // singleCadFile.initialInformation = JSON.stringify(this.personalGuaranteeProprietorship.value);
                    singleCadFile.supportedInformation = this.setFreeText();
                }
            });
            if (flag) {
                const cadFile = new CadFile();
                const document = new Document();
                // cadFile.initialInformation = JSON.stringify(this.personalGuaranteeProprietorship.value);
                cadFile.supportedInformation = this.setFreeText();
                document.id = this.documentId;
                cadFile.cadDocument = document;
                cadFile.customerLoanId = this.customerLoanId;
                this.cadData.cadFileList.push(cadFile);
            }
        } else {
            const cadFile = new CadFile();
            const document = new Document();
            // cadFile.initialInformation = JSON.stringify(this.personalGuaranteeProprietorship.value);
            cadFile.supportedInformation = this.setFreeText();
            document.id = this.documentId;
            cadFile.cadDocument = document;
            cadFile.customerLoanId = this.customerLoanId;
            this.cadData.cadFileList.push(cadFile);
        }

        this.administrationService.saveCadDocumentBulk(this.cadData).subscribe(() => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
            this.spinner = false;
            this.dialogRef.close();
            this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
            this.spinner = false;
            this.dialogRef.close();
        });
    }
  setActYear() {
      let yearOfAct = '';
      if (!ObjectUtil.isEmpty(this.loanHolderNepData.radioActYearDate)) {
          if (this.loanHolderNepData.radioActYearDate.np === 'BS') {
              yearOfAct = this.loanHolderNepData.actYear ? this.loanHolderNepData.actYear.en : '';
          } else {
              yearOfAct = this.loanHolderNepData.actYear ? this.loanHolderNepData.actYear.en : '';
          }
      }
    return yearOfAct ? yearOfAct : '';
  }

  setRegistrationDate() {
    let regDate = '';
      if (!ObjectUtil.isEmpty(this.loanHolderNepData.registrationDateOption)) {
          if (this.loanHolderNepData.registrationDateOption.en === 'AD') {
              regDate = this.englishNepaliDatePipe.transform(this.loanHolderNepData.registrationDate ?
                  this.loanHolderNepData.registrationDate.en : this.loanHolderNepData.registrationDate.en, true) || '';
          } else {
              regDate = this.loanHolderNepData.registrationDateNepali.en ? this.loanHolderNepData.registrationDateNepali.en.nDate : '';
          }
      }
    return regDate ? regDate : '';
  }
  setIssuedDate() {
    let issuedDate = '';
    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'DDSL Without Subsidy') {
        const dateOfApproval = this.offerDocumentDetails.sanctionLetterDateType ? this.offerDocumentDetails.sanctionLetterDateType.en : '';
        if (dateOfApproval === 'AD') {
            issuedDate = this.offerDocumentDetails.sanctionLetterDate ? this.offerDocumentDetails.sanctionLetterDate.ct : '';
        } else {
            issuedDate = this.offerDocumentDetails.sanctionLetterDateNepali ? this.offerDocumentDetails.sanctionLetterDateNepali.ct : '';
        }
    }
    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Kisan Karja Subsidy') {
        const dateOfApprovalType = this.offerDocumentDetails.dateOfApprovalType ? this.offerDocumentDetails.dateOfApprovalType.en : '';
        if (dateOfApprovalType === 'AD') {
            issuedDate = this.offerDocumentDetails.dateOfApproval ? this.offerDocumentDetails.dateOfApproval.ct : '';
        } else {
            issuedDate = this.offerDocumentDetails.dateOfApprovalNepali ? this.offerDocumentDetails.dateOfApprovalNepali.ct : '';
        }
    }
    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Udyamsil Karja Subsidy') {
        const dateOfApprovalType = this.offerDocumentDetails.dateOfApprovalType ? this.offerDocumentDetails.dateOfApprovalType.en : '';
        if (dateOfApprovalType === 'AD') {
            issuedDate = this.offerDocumentDetails.dateOfApproval ? this.offerDocumentDetails.dateOfApproval.ct : '';
        } else {
            issuedDate = this.offerDocumentDetails.dateOfApprovalNepali ? this.offerDocumentDetails.dateOfApprovalNepali.ct : '';
        }
    }
    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Interest subsidy sanction letter') {
        if (!ObjectUtil.isEmpty(this.offerDocumentDetails.dateOfApprovalType) && this.offerDocumentDetails.dateOfApprovalType.en === 'AD') {
            issuedDate = this.offerDocumentDetails.dateOfApproval ? this.offerDocumentDetails.dateOfApproval.ct : '';
        } else {
            issuedDate = this.offerDocumentDetails.dateOfApprovalNepali ? this.offerDocumentDetails.dateOfApprovalNepali.ct : '';
        }
    }
    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Class A Sanction letter') {
        const sanctionLetterDate = this.offerDocumentDetails.sanctionLetterDateType ? this.offerDocumentDetails.sanctionLetterDateType.en : '';
        if (sanctionLetterDate === 'AD') {
            const templateDateSanctionDate = this.offerDocumentDetails.sanctionLetterDate ? this.offerDocumentDetails.sanctionLetterDate.en : '';
            issuedDate = this.englishNepaliDatePipe.transform(this.datePipe.transform(templateDateSanctionDate), true);
        } else {
            const templateDateSanctionDate = this.offerDocumentDetails.sanctionLetterDateNepali ? this.offerDocumentDetails.sanctionLetterDateNepali.en : '';
            issuedDate = templateDateSanctionDate ? templateDateSanctionDate.nDate : '';
        }
    }
      if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.offerDocumentDetails.smeGlobalForm) {
          if (!ObjectUtil.isEmpty(this.offerDocumentDetails.smeGlobalForm.dateOfApprovalType) && this.offerDocumentDetails.smeGlobalForm.dateOfApprovalType === 'AD') {
              issuedDate = this.offerDocumentDetails.smeGlobalForm.dateOfApprovalCT ? this.offerDocumentDetails.smeGlobalForm.dateOfApprovalCT : '';
          } else {
              issuedDate = this.offerDocumentDetails.smeGlobalForm.dateOfApprovalNepali ?
                  this.offerDocumentDetails.smeGlobalForm.dateOfApprovalNepali.nDate : '';
          }
      }
    return issuedDate ? issuedDate : '';
  }

  setIdentityNo(individualGuarantorNepData) {
    let identityNumber = '';
    if (!ObjectUtil.isEmpty(individualGuarantorNepData.guarantorNationality)) {
      if (individualGuarantorNepData.guarantorNationality === 'Nepali') {
        identityNumber = !ObjectUtil.isEmpty(individualGuarantorNepData.citizenNumber) ? individualGuarantorNepData.citizenNumber.ct : '';
      }
      if (individualGuarantorNepData.guarantorNationality === 'Indian') {
        if (!ObjectUtil.isEmpty(individualGuarantorNepData.indianGuarantorDetailOption) && individualGuarantorNepData.indianGuarantorDetailOption.en === 'Embassy Certificate') {
          identityNumber = !ObjectUtil.isEmpty(individualGuarantorNepData.embassyNo) ? individualGuarantorNepData.embassyNo.ct : '';

        } else if (!ObjectUtil.isEmpty(individualGuarantorNepData.indianGuarantorDetailOption) && individualGuarantorNepData.indianGuarantorDetailOption.en === 'Adhar Card') {
          identityNumber = !ObjectUtil.isEmpty(individualGuarantorNepData.adharCardNo) ? individualGuarantorNepData.adharCardNo.ct : '';
        } else {
          identityNumber = !ObjectUtil.isEmpty(individualGuarantorNepData.passportNo) ? individualGuarantorNepData.passportNo.ct : '';
        }
      }
      if (individualGuarantorNepData.guarantorNationality === 'Other') {
        identityNumber = !ObjectUtil.isEmpty(individualGuarantorNepData.otherGuarantorPassportNo) ? individualGuarantorNepData.otherGuarantorPassportNo.ct : '';
      }
      return identityNumber ? identityNumber : '';
    }
  }
  setIdentityIssuedPlace(individualGuarantorNepData) {
    let identityIssuedPlace = '';
    if (!ObjectUtil.isEmpty(individualGuarantorNepData.guarantorNationality)) {
      if (individualGuarantorNepData.guarantorNationality === 'Nepali') {
        identityIssuedPlace = !ObjectUtil.isEmpty(individualGuarantorNepData.issuedPlace) ? individualGuarantorNepData.issuedPlace.ct : '';
      }
      if (individualGuarantorNepData.guarantorNationality === 'Indian') {
        if (!ObjectUtil.isEmpty(individualGuarantorNepData.indianGuarantorDetailOption) && individualGuarantorNepData.indianGuarantorDetailOption.en === 'Embassy Certificate') {
          identityIssuedPlace = !ObjectUtil.isEmpty(individualGuarantorNepData.embassyIssuedFrom) ? individualGuarantorNepData.embassyIssuedFrom.ct : '';

        } else if (!ObjectUtil.isEmpty(individualGuarantorNepData.indianGuarantorDetailOption) && individualGuarantorNepData.indianGuarantorDetailOption.en === 'Adhar Card') {
          identityIssuedPlace = !ObjectUtil.isEmpty(individualGuarantorNepData.adharCardIssuedFrom) ? individualGuarantorNepData.adharCardIssuedFrom.ct : '';
        } else {
          identityIssuedPlace = !ObjectUtil.isEmpty(individualGuarantorNepData.passportIssuedFrom) ? individualGuarantorNepData.passportIssuedFrom.ct : '';
        }
      }
      if (individualGuarantorNepData.guarantorNationality === 'Other') {
        identityIssuedPlace = !ObjectUtil.isEmpty(individualGuarantorNepData.otherGuarantorPassportIssuedFrom) ? individualGuarantorNepData.otherGuarantorPassportIssuedFrom.ct : '';
      }
      return identityIssuedPlace ? identityIssuedPlace : '';
    }
  }
    setIdentityIssuedDate(individualGuarantorNepData) {
        let identityIssuedDate = '';
        if (!ObjectUtil.isEmpty(individualGuarantorNepData.guarantorNationality)) {
            if (individualGuarantorNepData.guarantorNationality === 'Nepali') {
                if (!ObjectUtil.isEmpty(individualGuarantorNepData.radioCitizenIssuedDate) && (individualGuarantorNepData.radioCitizenIssuedDate === 'AD')) {
                    identityIssuedDate = !ObjectUtil.isEmpty(individualGuarantorNepData.citizenIssuedDate) ? this.englishNepaliDatePipe.transform((individualGuarantorNepData.citizenIssuedDate.en) ? (individualGuarantorNepData.citizenIssuedDate.en) : (individualGuarantorNepData.citizenIssuedDate.en), true) : '' || '';
                } else {
                    identityIssuedDate = !ObjectUtil.isEmpty(individualGuarantorNepData.citizenIssuedDateNepali) ? individualGuarantorNepData.citizenIssuedDateNepali.en.nDate : '';
                }
            }
            if (individualGuarantorNepData.guarantorNationality === 'Indian') {
                if (!ObjectUtil.isEmpty(individualGuarantorNepData.indianGuarantorDetailOption) && individualGuarantorNepData.indianGuarantorDetailOption.en === 'Embassy Certificate') {
                    identityIssuedDate = !ObjectUtil.isEmpty(individualGuarantorNepData.embassyIssuedDate) ? this.englishNepaliDatePipe.transform((individualGuarantorNepData.embassyIssuedDate.en) ? (individualGuarantorNepData.embassyIssuedDate.en) : (individualGuarantorNepData.embassyIssuedDate.en), true) : '' || '';

                } else if (!ObjectUtil.isEmpty(individualGuarantorNepData.indianGuarantorDetailOption) && individualGuarantorNepData.indianGuarantorDetailOption.en === 'Adhar Card') {
                    identityIssuedDate = !ObjectUtil.isEmpty(individualGuarantorNepData.adharCardIssuedDate) ? this.englishNepaliDatePipe.transform((individualGuarantorNepData.adharCardIssuedDate.en) ? (individualGuarantorNepData.adharCardIssuedDate.en) : (individualGuarantorNepData.adharCardIssuedDate.en), true) : '' || '';
                } else {
                    identityIssuedDate = !ObjectUtil.isEmpty(individualGuarantorNepData.passportIssuedDate) ? this.englishNepaliDatePipe.transform((individualGuarantorNepData.passportIssuedDate.en) ? (individualGuarantorNepData.passportIssuedDate.en) : (individualGuarantorNepData.passportIssuedDate.en), true) : '' || '';
                }
            }
            if (individualGuarantorNepData.guarantorNationality === 'Other') {
                if (!ObjectUtil.isEmpty(individualGuarantorNepData.otherGuarantorPassportIssuedDateOption) && (individualGuarantorNepData.otherGuarantorPassportIssuedDateOption === 'AD')) {
                    identityIssuedDate = !ObjectUtil.isEmpty(individualGuarantorNepData.otherGuarantorPassportIssuedDate) ? this.englishNepaliDatePipe.transform((individualGuarantorNepData.otherGuarantorPassportIssuedDate.en) ? (individualGuarantorNepData.otherGuarantorPassportIssuedDate.en) : (individualGuarantorNepData.otherGuarantorPassportIssuedDate.en), true) : '' || '';
                } else {
                    identityIssuedDate = !ObjectUtil.isEmpty(individualGuarantorNepData.otherGuarantorPassportIssuedDateNepali) ? individualGuarantorNepData.otherGuarantorPassportIssuedDateNepali.en.nDate : '';
                }
            }
            return identityIssuedDate ? identityIssuedDate : '';
        }
    }

    setValidityDate(individualGuarantorNepData) {
        let passportValidityDate = '';
        if (!ObjectUtil.isEmpty(individualGuarantorNepData.guarantorNationality)) {
            if (individualGuarantorNepData.guarantorNationality === 'Indian') {
                if (!ObjectUtil.isEmpty(individualGuarantorNepData.indianGuarantorDetailOption) && individualGuarantorNepData.indianGuarantorDetailOption.en === 'Passport') {
                    passportValidityDate = !ObjectUtil.isEmpty(individualGuarantorNepData.passportValidityDate) ? this.englishNepaliDatePipe.transform((individualGuarantorNepData.passportValidityDate.en) ? (individualGuarantorNepData.passportValidityDate.en) : (individualGuarantorNepData.passportValidityDate.en), true) : '' || '';
                }
            }
            if (individualGuarantorNepData.guarantorNationality === 'Other') {
                if (!ObjectUtil.isEmpty(individualGuarantorNepData.otherGuarantorPassportValidityDateOption) && individualGuarantorNepData.otherGuarantorPassportValidityDateOption === 'AD') {
                    passportValidityDate = !ObjectUtil.isEmpty(individualGuarantorNepData.otherGuarantorPassportValidityDate) ? this.englishNepaliDatePipe.transform((individualGuarantorNepData.otherGuarantorPassportValidityDate.en) ? (individualGuarantorNepData.otherGuarantorPassportValidityDate.en) : (individualGuarantorNepData.otherGuarantorPassportValidityDate.en), true) : '' || '';
                } else {
                    passportValidityDate = !ObjectUtil.isEmpty(individualGuarantorNepData.otherGuarantorPassportValidityDateNepali.en) ? individualGuarantorNepData.otherGuarantorPassportValidityDateNepali.en.nDate : '';
                }
            }
            return passportValidityDate ? passportValidityDate : '';
        }
    }
}
