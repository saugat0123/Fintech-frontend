import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../model/customerApprovedLoanCadDocumentation';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomerLoanOptions} from '../../../../cad-constant/customer-loan-options';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';
import {NepaliCurrencyWordPipe} from '../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../../@core/pipe/currency-formatter.pipe';
import {Attributes} from '../../../../../../../@core/model/attributes';
import {SbTranslateService} from '../../../../../../../@core/service/sbtranslate.service';
import {DatePipe, TitleCasePipe} from '@angular/common';
import {EngNepDatePipe} from 'nepali-patro';
import {District} from '../../../../../../admin/modal/district';
import {AddressService} from '../../../../../../../@core/service/baseservice/address.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {Alert, AlertType} from '../../../../../../../@theme/model/Alert';
import {ToastService} from '../../../../../../../@core/utils';
import {OfferDocument} from '../../../../../model/OfferDocument';
import {NabilOfferLetterConst} from '../../../../../nabil-offer-letter-const';
import {CreditAdministrationService} from '../../../../../service/credit-administration.service';
import {CadDocStatus} from '../../../../../model/CadDocStatus';
import {DdslWithoutSubsidyComponent} from '../../../../../cad-document-template/nabil/nabil-sme/ddsl-without-subsidy/ddsl-without-subsidy.component';
import {CommonSecuritySectionPrimaryComponent} from '../../common-security-section/common-security-section-primary/common-security-section-primary.component';
import {CommonSecuritySectionSecondaryComponent} from '../../common-security-section/common-security-section-secondary/common-security-section-secondary.component';
import {RequiredLegalDocumentSectionComponent} from '../../sme-template-data/sme-master-template/required-legal-document-section/required-legal-document-section.component';
import {EnglishDateTransformPipe} from '../../../../../../../@core/pipe/english-date-transform.pipe';

@Component({
    selector: 'app-ddsl-without-subsidy-template-data',
    templateUrl: './ddsl-without-subsidy-template-data.component.html',
    styleUrls: ['./ddsl-without-subsidy-template-data.component.scss']
})
export class DdslWithoutSubsidyTemplateDataComponent implements OnInit {
    @Input() customerApprovedDoc: CustomerApprovedLoanCadDocumentation;
    @ViewChild('primarySecurity', {static: false})
    commonSecuritySectionPrimaryComponent: CommonSecuritySectionPrimaryComponent;
    @ViewChild('secondarySecurity', {static: false})
    commonSecuritySectionSecondaryComponent: CommonSecuritySectionSecondaryComponent;
    @ViewChild('requiredLegalDocument', {static: false})
    requiredLegalDocumentSectionComponent: RequiredLegalDocumentSectionComponent;
    ddslFormGroup: FormGroup;
    spinner = false;
    customerLoanOptions: Array<String> = new Array<String>();
    isLoanOptionSelected = false;
    isCustomerNew = false;
    isSecurityOptionSelected;
    isMortgageOptionSelected;
    isLoanSubTypeSelected;
    ADSanctionLetterDate = false;
    BSSanctionLetterDate = false;
    ADApplication = false;
    BSApplication = false;
    ADPrevious = false;
    BSPrevious = false;
    displayNepali: boolean;
    saveEnable = false;
    submitted = false;
    closeEnable = false;
    isPreview = false;
    dateType = [{key: 'AD', value: 'AD', checked: true}, {key: 'BS', value: 'BS'}];
    loanOptions = CustomerLoanOptions;
    translatedValues: any = {};
    tdVal: any = {};
    translateFormGroup: FormGroup;
    oneForm: FormGroup;
    attributes;
    cadDocStatus;
    municipalityListForSecurities = [];
    allDistrictList = [];
    offerLetterConst = NabilOfferLetterConst;
    offerLetterDocument: OfferDocument;
    securities;
    loanSubTypeList = [
        {nData: 'ब्यापारिक कृषि तथा पशुपंछी कर्जा', eData: 'Commercial Agro and Livestock Loan'},
        {nData: 'साना तथा लघु उद्यम आवधिक कर्जा', eData: 'Small & Micro EnterpriseTerm Loan'},
        {nData: 'महिलाद्धारा सञ्चालित लघु उद्यम आवधिक कर्जा ', eData: 'Loan to Women Run Micro Enterprises Term Loan'}
    ];

    constructor(
        private formBuilder: FormBuilder,
        private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
        private engToNepaliNumberPipe: EngToNepaliNumberPipe,
        private currencyFormatterPipe: CurrencyFormatterPipe,
        private translatedService: SbTranslateService,
        private datePipe: DatePipe,
        private engNepDatePipe: EngNepDatePipe,
        private addressService: AddressService,
        private modalService: NgbModal,
        private dialogRef: NbDialogRef<DdslWithoutSubsidyTemplateDataComponent>,
        private dialogService: NbDialogService,
        private toastService: ToastService,
        private titleCasePipe: TitleCasePipe,
        private administrationService: CreditAdministrationService,
        private englishCalenderPipe: EnglishDateTransformPipe
    ) {
    }

    ngOnInit() {
        this.buildForm();
        this.getLoanOptionsType();
        this.getAllDistrict();
        // getting key from cad doc status:
        this.cadDocStatus = CadDocStatus.key();
    }

    buildForm() {
        this.ddslFormGroup = this.formBuilder.group({
            loanOption: [undefined],
            sanctionLetterDateType: [undefined],
            sanctionLetterDateNepali: [undefined],
            sanctionLetterDate: [undefined],
            dateOfApplicationType: [undefined],
            dateOfApplicationNepali: [undefined],
            dateOfApplication: [undefined],
            previousSanctionType: [undefined],
            previousSanctionDateNepali: [undefined],
            previousSanctionDate: [undefined],
            purposeOfLoan: [undefined],
            loanAmountFigure: [undefined],
            loanAmountFigureWords: [undefined],
            loanLimitAmountFigure: [undefined],
            loanLimitAmountFigureWords: [undefined],
            marginInPercentageMotor: [undefined],
            marginInPercentageFoot: [undefined],
            baseRate: [undefined],
            premiumRate: [undefined],
            interestRate: [undefined],
            serviceCharge: [undefined],
            nameOfFacility: [undefined],
            totalTenureOfLoan: [undefined],
            nameOfStaff: [undefined],
            nameOfBranchManager: [undefined],
            EMIAmountFigure: [undefined],
            EMIAmountWord: [undefined],
            totalInstallmentFigure: [undefined],
            securityType: [undefined],
            securities: this.formBuilder.array([]),
            // FIELDS FOR TRANSLATED FIELDS (TRANS):
            loanOptionTrans: [undefined],
            securityTypeTrans: [undefined],
            repaymentTypeTrans: [undefined],
            sanctionLetterDateTypeTrans: [undefined],
            sanctionLetterDateNepaliTrans: [undefined],
            sanctionLetterDateTrans: [undefined],
            dateOfApplicationTypeTrans: [undefined],
            dateOfApplicationNepaliTrans: [undefined],
            dateOfApplicationTrans: [undefined],
            previousSanctionTypeTrans: [undefined],
            previousSanctionDateTrans: [undefined],
            previousSanctionDateNepaliTrans: [undefined],
            purposeOfLoanTrans: [undefined],
            loanAmountFigureTrans: [undefined],
            loanAmountFigureWordsTrans: [undefined],
            loanLimitAmountFigureTrans: [undefined],
            loanLimitAmountFigureWordsTrans: [undefined],
            marginInPercentageMotorTrans: [undefined],
            marginInPercentageFootTrans: [undefined],
            baseRateTrans: [undefined],
            premiumRateTrans: [undefined],
            interestRateTrans: [undefined],
            serviceChargeTrans: [undefined],
            nameOfFacilityTrans: [undefined],
            totalTenureOfLoanTrans: [undefined],
            nameOfStaffTrans: [undefined],
            nameOfBranchManagerTrans: [undefined],
            EMIAmountFigureTrans: [undefined],
            totalInstallmentFigureTrans: [undefined],
            EMIAmountWordTrans: [undefined],
            // FIELDS FOR CT VALUES:
            loanOptionCT: [undefined],
            securityTypeCT: [undefined],
            repaymentTypeCT: [undefined],
            sanctionLetterDateTypeCT: [undefined],
            sanctionLetterDateNepaliCT: [undefined, Validators.required],
            sanctionLetterDateCT: [undefined, Validators.required],
            dateOfApplicationTypeCT: [undefined],
            dateOfApplicationNepaliCT: [undefined, Validators.required],
            dateOfApplicationCT: [undefined, Validators.required],
            previousSanctionTypeCT: [undefined],
            previousSanctionDateNepaliCT: [undefined, Validators.required],
            previousSanctionDateCT: [undefined, Validators.required],
            purposeOfLoanCT: [undefined, Validators.required],
            loanAmountFigureCT: [undefined, Validators.required],
            loanAmountFigureWordsCT: [undefined, Validators.required],
            loanLimitAmountFigureCT: [undefined, Validators.required],
            loanLimitAmountFigureWordsCT: [undefined, Validators.required],
            marginInPercentageMotorCT: [undefined, Validators.required],
            marginInPercentageFootCT: [undefined, Validators.required],
            baseRateCT: [undefined, Validators.required],
            premiumRateCT: [undefined, Validators.required],
            interestRateCT: [undefined, Validators.required],
            serviceChargeCT: [undefined, Validators.required],
            nameOfFacilityCT: [undefined, Validators.required],
            totalTenureOfLoanCT: [undefined, Validators.required],
            nameOfStaffCT: [undefined, Validators.required],
            nameOfBranchManagerCT: [undefined, Validators.required],
            EMIAmountFigureCT: [undefined, Validators.required],
            EMIAmountWordCT: [undefined, Validators.required],
            totalInstallmentFigureCT: [undefined, Validators.required],
            mortgageType: [undefined],
            mortgageTypeTrans: [undefined],
            mortgageTypeCT: [undefined],
            loanSubType: [undefined],
            loanSubTypeTrans: [undefined],
            loanSubTypeCT: [undefined],
        });
        this.addDefaultSecurity();
    }

    get FormControls() {
        return this.ddslFormGroup.controls;
    }
    public sanctionLetterDate(value): void {
        this.ADSanctionLetterDate = value === 'AD';
        this.BSSanctionLetterDate = value === 'BS';
    }

    public dateOfApplication(value): void {
        this.ADApplication = value === 'AD';
        this.BSApplication = value === 'BS';
    }

    public previousSanctionDate(value): void {
        this.ADPrevious = value === 'AD';
        this.BSPrevious = value === 'BS';
    }

    getLoanOptionsType() {
        CustomerLoanOptions.enumObject().forEach(val => {
            this.customerLoanOptions.push(val);
        });
    }

    transferValue(val) {
        this.isLoanOptionSelected = !ObjectUtil.isEmpty(val);
        this.isCustomerNew = val === 'NEW';
    }

    securityValue() {
        const security = this.ddslFormGroup.get('securityType').value;
        if (!ObjectUtil.isEmpty(security)) {
            this.isSecurityOptionSelected = security;
        }
    }
    mortgageValue() {
        const mortgage = this.ddslFormGroup.get('mortgageType').value;
        if (!ObjectUtil.isEmpty(mortgage)) {
            this.isMortgageOptionSelected = mortgage;
        }
    }
    loanSubTypeValue() {
        const loanSub = this.ddslFormGroup.get('loanSubType').value;
        if (!ObjectUtil.isEmpty(loanSub)) {
            this.isLoanSubTypeSelected = loanSub;
        }
    }


    public getNumAmountWord(numLabel, wordLabel): void {
        const transformValue = this.nepaliCurrencyWordPipe.transform(this.ddslFormGroup.get(numLabel).value);
        this.ddslFormGroup.get(wordLabel).patchValue(transformValue);
    }

    translateNumber(source, target, currencyFormat?) {
        const formVal = this.ddslFormGroup.get(source).value;
        if (!ObjectUtil.isEmpty(formVal)) {
            let formattedVal;
            if (!ObjectUtil.isEmpty(currencyFormat)) {
                formattedVal = this.currencyFormatterPipe.transform(this.ddslFormGroup.get(source).value.toString());
            } else {
                formattedVal = this.ddslFormGroup.get(source).value.toString();
            }
            const wordLabelVar = this.engToNepaliNumberPipe.transform(formattedVal);
            this.ddslFormGroup.get(target).patchValue(wordLabelVar);
        }
    }

    calInterestRate() {
        const baseRate = this.ddslFormGroup.get('baseRate').value;
        const premiumRate = this.ddslFormGroup.get('premiumRate').value;
        const sum = parseFloat(baseRate) + parseFloat(premiumRate);
        this.ddslFormGroup.get('interestRate').patchValue(sum);
        // Converting value from existed pipe:
        this.translateNumber('baseRate', 'baseRateTrans');
        this.translateNumber('premiumRate', 'premiumRateTrans');
        this.translateNumber('interestRate', 'interestRateTrans');
    }

    convertNumbersToNepali(val, type: boolean) {
        let finalConvertedVal;
        if (!ObjectUtil.isEmpty(val)) {
            if (type) {
                finalConvertedVal = this.engToNepaliNumberPipe.transform(
                    this.currencyFormatterPipe.transform(val.toString())
                );
            } else {
                finalConvertedVal = this.engToNepaliNumberPipe.transform(val.toString());
            }
        }
        return finalConvertedVal;
    }

    setTranslatedData(data) {
        // SET TRANSLATED DATA:
        this.ddslFormGroup.get('purposeOfLoanTrans').patchValue(this.translatedValues.purposeOfLoan);
        this.ddslFormGroup.get('nameOfStaffTrans').patchValue(this.translatedValues.nameOfStaff);
        this.ddslFormGroup.get('nameOfFacilityTrans').patchValue(this.translatedValues.nameOfFacility);
        this.ddslFormGroup.get('nameOfBranchManagerTrans').patchValue(this.translatedValues.nameOfBranchManager);
        this.ddslFormGroup.get('sanctionLetterDateTypeTrans').patchValue(this.translatedValues.sanctionLetterDateType);
        this.ddslFormGroup.get('dateOfApplicationTypeTrans').patchValue(this.translatedValues.dateOfApplicationType);
        this.ddslFormGroup.get('previousSanctionTypeTrans').patchValue(this.translatedValues.previousSanctionType);
    }

    async translate(form) {
        this.spinner = true;
        const translatedData = await this.translatedService.translateForm(form);
        this.spinner = false;
        return translatedData;
    }

    mappedData() {
        Object.keys(this.ddslFormGroup.controls).forEach(key => {
            if (key.indexOf('Trans') > -1 || key === 'municipalityOrVdc' || key === 'securities' || key.indexOf('CT') > -1) {
                return;
            }
            this.attributes = new Attributes();
            this.attributes.en = this.ddslFormGroup.get(key).value;
            this.attributes.np = this.ddslFormGroup.get(key + 'Trans').value;
            this.attributes.ct = this.ddslFormGroup.get(key + 'CT').value;
            this.tdVal[key] = this.attributes;
        });
    }

    async translateAndSetValue() {
        this.spinner = true;
        // Translation Data
        this.ddslFormGroup.get('loanOptionTrans').patchValue(this.ddslFormGroup.get('loanOption').value);
        this.ddslFormGroup.get('securityTypeTrans').patchValue(this.ddslFormGroup.get('securityType').value);
        this.ddslFormGroup.get('mortgageTypeTrans').patchValue(this.ddslFormGroup.get('mortgageType').value);
        this.ddslFormGroup.get('loanSubTypeTrans').patchValue(this.ddslFormGroup.get('loanSubType').value);
        // Set Translated Sanction letter Date:
        const sanctionType = this.ddslFormGroup.get('sanctionLetterDateType').value;
        let approvalDateTrans;
        if (sanctionType === 'AD') {
            const approvalForm = this.datePipe.transform(this.ddslFormGroup.get('sanctionLetterDate').value);
            approvalDateTrans = !ObjectUtil.isEmpty(approvalForm) ?
                this.datePipe.transform(approvalForm) : '';
            const finalAppDate = !ObjectUtil.isEmpty(approvalDateTrans) ?
                this.engNepDatePipe.transform(approvalDateTrans, true) : '';
            if (!ObjectUtil.isEmpty(approvalForm)) {
                this.ddslFormGroup.get('sanctionLetterDateTrans').patchValue(finalAppDate);
            }
        } else {
            const approvalNepali = this.ddslFormGroup.get('sanctionLetterDateNepali').value;
            approvalDateTrans = !ObjectUtil.isEmpty(approvalNepali) ?
                approvalNepali.nDate : '';
            this.ddslFormGroup.get('sanctionLetterDateNepaliTrans').patchValue(approvalDateTrans);
        }
        // Set Translated Application Date:
        const applicationType = this.ddslFormGroup.get('dateOfApplicationType').value;
        let applicationDateTrans;
        if (applicationType === 'AD') {
            const applicationForm = this.datePipe.transform(this.ddslFormGroup.get('dateOfApplication').value);
            applicationDateTrans = !ObjectUtil.isEmpty(applicationForm) ?
                this.datePipe.transform(applicationForm) : '';
            const finalAppDate = this.englishCalenderPipe.transform(applicationDateTrans);
            if (!ObjectUtil.isEmpty(applicationForm)) {
                this.ddslFormGroup.get('dateOfApplicationTrans').patchValue(finalAppDate);
            }
        } else {
            const applicationNepali = this.ddslFormGroup.get('dateOfApplicationNepali').value;
            applicationDateTrans = !ObjectUtil.isEmpty(applicationNepali) ?
                applicationNepali.nDate : '';
            this.ddslFormGroup.get('dateOfApplicationNepaliTrans').patchValue(applicationDateTrans);
        }
        // Set Translation Date of Previous Sanction letter:
        const previousSanctionType = this.ddslFormGroup.get('previousSanctionType').value;
        let previousSanctionTrans;
        if (previousSanctionType === 'AD') {
            const previousSanctionForm = this.datePipe.transform(this.ddslFormGroup.get('previousSanctionDate').value);
            previousSanctionTrans = !ObjectUtil.isEmpty(previousSanctionForm) ?
                this.datePipe.transform(previousSanctionForm) : '';
            const finalAppDate = this.englishCalenderPipe.transform(previousSanctionTrans);
            if (!ObjectUtil.isEmpty(previousSanctionForm)) {
                this.ddslFormGroup.get('previousSanctionDateTrans').patchValue(finalAppDate);
            }
        } else {
            const previousSanctionNepali = this.ddslFormGroup.get('previousSanctionDateNepali').value;
            previousSanctionTrans = !ObjectUtil.isEmpty(previousSanctionNepali) ?
                previousSanctionNepali.nDate : '';
            this.ddslFormGroup.get('previousSanctionDateNepaliTrans').patchValue(previousSanctionTrans);
        }
        // For Existed Pipe Value :
        const loanAmountData = this.ddslFormGroup.get('loanAmountFigure').value;
        if (!ObjectUtil.isEmpty(loanAmountData)) {
            const changeNumber = this.convertNumbersToNepali(loanAmountData, true);
            this.ddslFormGroup.get('loanAmountFigureTrans').patchValue(changeNumber);
        }
        const loanAmountFigData = this.ddslFormGroup.get('loanAmountFigureWords').value;
        if (!ObjectUtil.isEmpty(loanAmountFigData)) {
            this.ddslFormGroup.get('loanAmountFigureWordsTrans').patchValue(loanAmountFigData);
        }
        const loanLimitAmountData = this.ddslFormGroup.get('loanLimitAmountFigure').value;
        if (!ObjectUtil.isEmpty(loanLimitAmountData)) {
            const changeNumberLimit = this.convertNumbersToNepali(loanLimitAmountData, true);
            this.ddslFormGroup.get('loanLimitAmountFigureTrans').patchValue(changeNumberLimit);
        }
        const loanLimitAmountFigData = this.ddslFormGroup.get('loanLimitAmountFigureWords').value;
        if (!ObjectUtil.isEmpty(loanLimitAmountFigData)) {
            this.ddslFormGroup.get('loanLimitAmountFigureWordsTrans').patchValue(loanLimitAmountFigData);
        }
        const marginNum = this.ddslFormGroup.get('marginInPercentageFoot').value;
        if (!ObjectUtil.isEmpty(marginNum)) {
            const convertedMarginNum = this.convertNumbersToNepali(marginNum, false);
            this.ddslFormGroup.get('marginInPercentageFootTrans').patchValue(convertedMarginNum);
        }
        const marginNumMotor = this.ddslFormGroup.get('marginInPercentageMotor').value;
        if (!ObjectUtil.isEmpty(marginNumMotor)) {
            const convertedMarginNumMotor = this.convertNumbersToNepali(marginNumMotor, false);
            this.ddslFormGroup.get('marginInPercentageMotorTrans').patchValue(convertedMarginNumMotor);
        }
        const serviceChargeNum = this.ddslFormGroup.get('serviceCharge').value;
        if (!ObjectUtil.isEmpty(serviceChargeNum)) {
            const convertServiceCharge = this.convertNumbersToNepali(serviceChargeNum, false);
            this.ddslFormGroup.get('serviceChargeTrans').patchValue(convertServiceCharge);
        }
        const totalInstallmentFigureNum = this.ddslFormGroup.get('totalInstallmentFigure').value;
        if (!ObjectUtil.isEmpty(totalInstallmentFigureNum)) {
            const convertTotalInstallmentFigure = this.convertNumbersToNepali(totalInstallmentFigureNum, false);
            this.ddslFormGroup.get('totalInstallmentFigureTrans').patchValue(convertTotalInstallmentFigure);
        }
        const tenureData = this.ddslFormGroup.get('totalTenureOfLoan').value;
        if (!ObjectUtil.isEmpty(tenureData)) {
            const convertTenureData = this.convertNumbersToNepali(tenureData, false);
            this.ddslFormGroup.get('totalTenureOfLoanTrans').patchValue(convertTenureData);
        }
        const EMIAmountFigureData = this.ddslFormGroup.get('EMIAmountFigure').value;
        if (!ObjectUtil.isEmpty(EMIAmountFigureData)) {
            const convertEMIAmountFigure = this.convertNumbersToNepali(EMIAmountFigureData, true);
            this.ddslFormGroup.get('EMIAmountFigureTrans').patchValue(convertEMIAmountFigure);
        }
        const EMIAmountWordData = this.ddslFormGroup.get('EMIAmountWord').value;
        if (!ObjectUtil.isEmpty(EMIAmountWordData)) {
            this.ddslFormGroup.get('EMIAmountWordTrans').patchValue(EMIAmountWordData);
        }
        // Set Translated Data of Loan sub type:
        const tempSubTypeVal = this.ddslFormGroup.get('loanSubType').value;
        if (!ObjectUtil.isEmpty(tempSubTypeVal)) {
            this.ddslFormGroup.get('loanSubTypeTrans').patchValue(tempSubTypeVal.nData);
        }
        // For Required Translation Data:
        this.translateFormGroup = this.formBuilder.group({
            purposeOfLoan: this.ddslFormGroup.get('purposeOfLoan').value,
            nameOfStaff: this.ddslFormGroup.get('nameOfStaff').value,
            nameOfFacility: this.ddslFormGroup.get('nameOfFacility').value,
            nameOfBranchManager: this.ddslFormGroup.get('nameOfBranchManager').value,
            sanctionLetterDateType: this.ddslFormGroup.get('sanctionLetterDateType').value,
            dateOfApplicationType: this.ddslFormGroup.get('dateOfApplicationType').value,
            previousSanctionType: this.ddslFormGroup.get('previousSanctionType').value,
        });
        this.translatedValues = await this.translate(this.translateFormGroup);
        this.setTranslatedData(this.translatedValues);
        this.setCTValuesAfterTranslation();
        this.mappedData();
        this.spinner = false;
        this.saveEnable = true;
    }

    setCTValuesAfterTranslation() {
        // Set CT values
        this.ddslFormGroup.get('loanOptionCT').patchValue(this.ddslFormGroup.get('loanOption').value);
        this.ddslFormGroup.get('securityTypeCT').patchValue(this.ddslFormGroup.get('securityType').value);
        this.ddslFormGroup.get('mortgageTypeCT').patchValue(this.ddslFormGroup.get('mortgageType').value);
        this.ddslFormGroup.get('loanSubTypeCT').patchValue(this.ddslFormGroup.get('loanSubType').value);
        // set CT value of Sanction Letter Date
        this.ddslFormGroup.get('sanctionLetterDateTypeCT').patchValue(this.ddslFormGroup.get('sanctionLetterDateType').value);
        if (this.ADSanctionLetterDate) {
            const transDate = this.ddslFormGroup.get('sanctionLetterDateTrans').value;
            this.ddslFormGroup.get('sanctionLetterDateCT').patchValue(transDate);
        }
        if (this.BSSanctionLetterDate) {
            this.ddslFormGroup.get('sanctionLetterDateNepaliCT').patchValue(this.ddslFormGroup.get('sanctionLetterDateNepaliTrans').value);
        }
        // Set CT Value of Date of Application
        this.ddslFormGroup.get('dateOfApplicationTypeCT').patchValue(this.ddslFormGroup.get('dateOfApplicationType').value);
        if (this.ADApplication) {
            const transDate = this.ddslFormGroup.get('dateOfApplicationTrans').value;
            this.ddslFormGroup.get('dateOfApplicationCT').patchValue(transDate);
        }
        if (this.BSApplication) {
            this.ddslFormGroup.get('dateOfApplicationNepaliCT').patchValue(this.ddslFormGroup.get('dateOfApplicationNepaliTrans').value);
        }
        // Set of CT value of Previous Sanction Letter Date
        this.ddslFormGroup.get('previousSanctionTypeCT').patchValue(this.ddslFormGroup.get('previousSanctionType').value);
        if (this.ADPrevious) {
            const transPreviousDate = this.ddslFormGroup.get('previousSanctionDateTrans').value;
            this.ddslFormGroup.get('previousSanctionDateCT').patchValue(transPreviousDate);
        }
        if (this.BSPrevious) {
            this.ddslFormGroup.get('previousSanctionDateNepaliCT').patchValue(
                this.ddslFormGroup.get('previousSanctionDateNepaliTrans').value);
        }
        this.ddslFormGroup.get('purposeOfLoanCT').patchValue(this.ddslFormGroup.get('purposeOfLoanTrans').value);
        this.ddslFormGroup.get('loanAmountFigureCT').patchValue(this.ddslFormGroup.get('loanAmountFigureTrans').value);
        this.ddslFormGroup.get('loanAmountFigureWordsCT').patchValue(this.ddslFormGroup.get('loanAmountFigureWordsTrans').value);
        this.ddslFormGroup.get('loanLimitAmountFigureCT').patchValue(this.ddslFormGroup.get('loanLimitAmountFigureTrans').value);
        this.ddslFormGroup.get('loanLimitAmountFigureWordsCT').patchValue(this.ddslFormGroup.get('loanLimitAmountFigureWordsTrans').value);
        this.ddslFormGroup.get('marginInPercentageFootCT').patchValue(this.ddslFormGroup.get('marginInPercentageFootTrans').value);
        this.ddslFormGroup.get('marginInPercentageMotorCT').patchValue(this.ddslFormGroup.get('marginInPercentageMotorTrans').value);
        this.ddslFormGroup.get('baseRateCT').patchValue(this.ddslFormGroup.get('baseRateTrans').value);
        this.ddslFormGroup.get('premiumRateCT').patchValue(this.ddslFormGroup.get('premiumRateTrans').value);
        this.ddslFormGroup.get('interestRateCT').patchValue(this.ddslFormGroup.get('interestRateTrans').value);
        this.ddslFormGroup.get('serviceChargeCT').patchValue(this.ddslFormGroup.get('serviceChargeTrans').value);
        this.ddslFormGroup.get('totalInstallmentFigureCT').patchValue(this.ddslFormGroup.get('totalInstallmentFigureTrans').value);
        this.ddslFormGroup.get('totalTenureOfLoanCT').patchValue(this.ddslFormGroup.get('totalTenureOfLoanTrans').value);
        this.ddslFormGroup.get('nameOfStaffCT').patchValue(this.ddslFormGroup.get('nameOfStaffTrans').value);
        this.ddslFormGroup.get('nameOfFacilityCT').patchValue(this.ddslFormGroup.get('nameOfFacilityTrans').value);
        this.ddslFormGroup.get('nameOfBranchManagerCT').patchValue(this.ddslFormGroup.get('nameOfBranchManagerTrans').value);
        this.ddslFormGroup.get('EMIAmountFigureCT').patchValue(this.ddslFormGroup.get('EMIAmountFigureTrans').value);
        this.ddslFormGroup.get('EMIAmountWordCT').patchValue(this.ddslFormGroup.get('EMIAmountWordTrans').value);
        this.ddslFormGroup.get('loanSubTypeCT').patchValue(this.ddslFormGroup.get('loanSubTypeTrans').value);
    }

    buildSecurityForm() {
        return this.formBuilder.group({
            securityOwnersName: [undefined],
            securityOwnersMunicipalityOrVdc: [undefined],
            securityOwnersMunicipality: [undefined],
            securityOwnersDistrict: [undefined],
            securityOwnersWardNo: [undefined],
            securityOwnersPlotNo: [undefined],
            securityOwnersLandArea: [undefined],
            securityOwnersSheetNo: [undefined],
            // TRANSLATION FIELD OF SECURITY:
            securityOwnersNameTrans: [undefined],
            securityOwnersDistrictTrans: [undefined],
            securityOwnersMunicipalityTrans: [undefined],
            securityOwnersWardNoTrans: [undefined],
            securityOwnersPlotNoTrans: [undefined],
            securityOwnersLandAreaTrans: [undefined],
            securityOwnersSheetNoTrans: [undefined],
            // CT FIELDS OF SECURITY
            securityOwnersNameCT: [undefined],
            securityOwnersDistrictCT: [undefined],
            securityOwnersMunicipalityCT: [undefined],
            securityOwnersWardNoCT: [undefined],
            securityOwnersPlotNoCT: [undefined],
            securityOwnersLandAreaCT: [undefined],
            securityOwnersSheetNoCT: [undefined],
        });
    }

    addDefaultSecurity() {
        (this.ddslFormGroup.get('securities') as FormArray).push(
            this.buildSecurityForm()
        );
    }

    async onChangeTranslateSecurity(arrName, source, index, target) {
        this.oneForm = this.formBuilder.group({
            securityOwnersName: this.ddslFormGroup.get([String(arrName), index, String(source)]).value
        });
        const sourceResponse = await this.translatedService.translateForm(this.oneForm);
        this.ddslFormGroup.get([String(arrName), index, String(target)]).patchValue(sourceResponse.securityOwnersName);
        this.ddslFormGroup.get([String(arrName), index, String(source + 'CT')]).patchValue(sourceResponse.securityOwnersName);
    }

    public getAllDistrict(): void {
        this.addressService.getAllDistrict().subscribe((response: any) => {
            this.allDistrictList = response.detail;
        });
    }

    public getMunicipalityByDistrict(data, event, index): void {
        const district = new District();
        district.id = data;
        this.addressService.getMunicipalityVDCByDistrict(district).subscribe(
            (response: any) => {
                this.municipalityListForSecurities[index] = response.detail;
                this.municipalityListForSecurities[index].sort((a, b) => a.name.localeCompare(b.name));
                if (event !== null) {
                    this.ddslFormGroup.get(['securities', index, 'securityOwnersMunicipalityOrVdc']).patchValue(null);
                }
            }
        );
    }

    clearSecurityMunType(controlName, index, formArrayName) {
        const tempVal = this.ddslFormGroup.get([formArrayName, index, 'securityOwnersMunicipalityOrVdc']).value;
        if (tempVal === 'VDC') {
            this.ddslFormGroup.get([formArrayName, index, controlName]).setValue(null);
        }
    }

    setDefaultNepaliResponse(arrName, source, index, target) {
        this.ddslFormGroup.get([String(arrName), index, String(target)]).patchValue(
            this.ddslFormGroup.get([String(arrName), index, String(source)]).value.nepaliName);
        this.ddslFormGroup.get([String(arrName), index, String(source + 'CT')]).patchValue(
            this.ddslFormGroup.get([String(arrName), index, String(source)]).value.nepaliName);
    }

    translateSecurityDetailsNumberFields(arrName, source, index, target) {
        const translatedNepaliNum = this.engToNepaliNumberPipe.transform(
            String(this.ddslFormGroup.get([String(arrName), index, String(source)]).value));
        this.ddslFormGroup.get([String(arrName), index, String(target)]).patchValue(translatedNepaliNum);
        this.ddslFormGroup.get([String(arrName), index, String(source + 'CT')]).patchValue(translatedNepaliNum);
    }

    removeSecurityDetails(index) {
        (this.ddslFormGroup.get('securities') as FormArray).removeAt(index);
    }

    openCloseTemplate(template) {
        this.modalService.open(template);
    }

    dismiss(template) {
        this.modalService.dismissAll();
    }

    accept() {
        this.modalService.dismissAll();
        this.dialogRef.close();
    }

    openModal() {
        this.dialogService.open(DdslWithoutSubsidyComponent, {
            closeOnBackdropClick: false,
            hasBackdrop: false,
            hasScroll: true,
            dialogClass: 'modal-full',
            context: {
                cadOfferLetterApprovedDoc: this.customerApprovedDoc,
                preview: true
            }
        });
    }

    clearConditionalValidation() {
        // Clear Validation for Approval Date:
        if (this.BSSanctionLetterDate) {
            this.ddslFormGroup.get('sanctionLetterDateCT').clearValidators();
            this.ddslFormGroup.get('sanctionLetterDateCT').updateValueAndValidity();
        } else {
            this.ddslFormGroup.get('sanctionLetterDateNepaliCT').clearValidators();
            this.ddslFormGroup.get('sanctionLetterDateNepaliCT').updateValueAndValidity();
        }
        // Clear Validation for Application Date:
        if (this.BSApplication) {
            this.ddslFormGroup.get('dateOfApplicationCT').clearValidators();
            this.ddslFormGroup.get('dateOfApplicationCT').updateValueAndValidity();
        } else {
            this.ddslFormGroup.get('dateOfApplicationNepaliCT').clearValidators();
            this.ddslFormGroup.get('dateOfApplicationNepaliCT').updateValueAndValidity();
        }
        const tempSelectedOption = this.ddslFormGroup.get('loanOption').value;
        // Clear Validation for previous Sanction Date:
        if (tempSelectedOption === this.loanOptions.EXISTING) {
            if (this.BSPrevious) {
                this.ddslFormGroup.get('previousSanctionDateCT').clearValidators();
                this.ddslFormGroup.get('previousSanctionDateCT').updateValueAndValidity();
            } else {
                this.ddslFormGroup.get('previousSanctionDateNepaliCT').clearValidators();
                this.ddslFormGroup.get('previousSanctionDateNepaliCT').updateValueAndValidity();
            }
        } else {
            this.ddslFormGroup.get('previousSanctionDateNepaliCT').clearValidators();
            this.ddslFormGroup.get('previousSanctionDateNepaliCT').updateValueAndValidity();
            this.ddslFormGroup.get('previousSanctionDateCT').clearValidators();
            this.ddslFormGroup.get('previousSanctionDateCT').updateValueAndValidity();
        }
    }

    save() {
        this.submitted = true;
        const tempSecurityDetails = this.setSecurityData();
        this.tdVal['securities'] = tempSecurityDetails;
        const tempRequiredDocument = this.setRequiredDocumemts();
        this.tdVal['requiredDocuments'] = tempRequiredDocument;
        this.clearConditionalValidation();
        const invalidControls = [];
        const controls = this.ddslFormGroup.controls;
        for (const name in controls) {
            if (controls[name].invalid) {
                invalidControls.push(this.titleCasePipe.transform(name).replace('CT', '').replace('Trans', ''));
            }
        }
        if (this.ddslFormGroup.invalid) {
            this.toastService.show(new Alert(AlertType.DANGER, 'Please Check validation For :\n' + invalidControls.filter((
                value, index, self) => self.indexOf(value) === index).join(', ')));
            this.spinner = false;
            return;
        }
        this.spinner = true;
        this.customerApprovedDoc.docStatus = this.cadDocStatus[0];
        if (this.customerApprovedDoc.offerDocumentList.length > 0) {
            this.offerLetterDocument = this.customerApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
                === this.offerLetterConst.value(this.offerLetterConst.DDSL_WITHOUT_SUBSIDY).toString())[0];
            if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
                this.customerApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
                    if (offerLetterPath.docName.toString() ===
                        this.offerLetterConst.value(this.offerLetterConst.DDSL_WITHOUT_SUBSIDY).toString()) {
                        offerLetterPath.initialInformation = JSON.stringify(this.tdVal);
                    }
                });
            }
        } else {
            const offerDocument = new OfferDocument();
            offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.DDSL_WITHOUT_SUBSIDY);
            offerDocument.initialInformation = JSON.stringify(this.tdVal);
            this.customerApprovedDoc.offerDocumentList.push(offerDocument);
        }
        this.administrationService.saveCadDocumentBulk(this.customerApprovedDoc).subscribe((res: any) => {
            this.customerApprovedDoc = res.detail;
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
            this.spinner = false;
            this.isPreview = this.closeEnable = true;
            this.saveEnable = false;
        }, error => {
            console.log(error);
            this.spinner = false;
            this.isPreview = false;
            this.saveEnable = false;
            this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
        });
    }
    setSecurityData() {
        const primarySecurity = this.commonSecuritySectionPrimaryComponent.commonPrimarySecurity.value.securityDetails;
        const secondarySecurity = this.commonSecuritySectionSecondaryComponent.commonSecondarySecurity.value.securityDetails;
        const allData = {
            primarySecurity: primarySecurity,
            secondarySecurity: secondarySecurity
        };
        return (allData);
    }

    private setRequiredDocumemts() {
        const requiredLegalDocument = this.requiredLegalDocumentSectionComponent.requireDocumentForm.value;
        const requiredData = {
            requiredLegalDocument: requiredLegalDocument,
        };
        return (requiredData);
    }
}
