import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../model/customerApprovedLoanCadDocumentation';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomerLoanOptions} from '../../../../cad-constant/customer-loan-options';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';
import {NepaliCurrencyWordPipe} from '../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {District} from '../../../../../../admin/modal/district';
import {AddressService} from '../../../../../../../@core/service/baseservice/address.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {EngToNepaliNumberPipe} from '../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../../@core/pipe/currency-formatter.pipe';
import {DatePipe, TitleCasePipe} from '@angular/common';
import {EngNepDatePipe} from 'nepali-patro';
import {SbTranslateService} from '../../../../../../../@core/service/sbtranslate.service';
import {Attributes} from '../../../../../../../@core/model/attributes';
import {OfferDocument} from '../../../../../model/OfferDocument';
import {CadDocStatus} from '../../../../../model/CadDocStatus';
import {NabilOfferLetterConst} from '../../../../../nabil-offer-letter-const';
import {CreditAdministrationService} from '../../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../../../@theme/model/Alert';
import {UdyamsilKarjaSubsidyComponent} from '../../../../../cad-document-template/nabil/nabil-sme/udyamsil-karja-subsidy/udyamsil-karja-subsidy.component';
import {RequiredLegalDocumentSectionComponent} from '../../sme-template-data/sme-master-template/required-legal-document-section/required-legal-document-section.component';
import {EnglishDateTransformPipe} from '../../../../../../../@core/pipe/english-date-transform.pipe';

@Component({
    selector: 'app-udhyamsil-karja-subsidy-template-data',
    templateUrl: './udhyamsil-karja-subsidy-template-data.component.html',
    styleUrls: ['./udhyamsil-karja-subsidy-template-data.component.scss']
})
export class UdhyamsilKarjaSubsidyTemplateDataComponent implements OnInit {
    @Input() customerApprovedDoc: CustomerApprovedLoanCadDocumentation;
    udhyamsilKarja: FormGroup;
    spinner = false;
    customerLoanOptions: Array<String> = new Array<String>();
    isLoanOptionSelected = false;
    ADApproval = false;
    BSApproval = false;
    dateType = [{key: 'AD', value: 'AD', checked: true}, {key: 'BS', value: 'BS'}];
    ADApplication = false;
    BSApplication = false;
    ADPrevious = false;
    BSPrevious = false;
    municipalityListForSecurities = [];
    provinceList = [];
    allDistrictList = [];
    selectedAD = true;
    isInterestSubsidy = false;
    isCustomerNew = false;
    attributes;
    translatedValues: any = {};
    tdVal: any = {};
    translateFormGroup: FormGroup;
    oneForm: FormGroup;
    offerLetterDocument: OfferDocument;
    cadDocStatus;
    offerLetterConst = NabilOfferLetterConst;
    isPreview = false;
    saveEnable = false;
    closeEnable = false;
    submitted = false;
    loanOptions = CustomerLoanOptions;
    @ViewChild('requiredLegalDocument', {static: false})
    requiredLegalDocumentSectionComponent: RequiredLegalDocumentSectionComponent;

    constructor(private formBuilder: FormBuilder,
                private dialogService: NbDialogService,
                private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
                private addressService: AddressService,
                private modalService: NgbModal,
                private dialogRef: NbDialogRef<UdhyamsilKarjaSubsidyTemplateDataComponent>,
                private engToNepaliNumberPipe: EngToNepaliNumberPipe,
                private currencyFormatterPipe: CurrencyFormatterPipe,
                private datePipe: DatePipe,
                private engNepDatePipe: EngNepDatePipe,
                private translatedService: SbTranslateService,
                private engDateTransPipe: EnglishDateTransformPipe,
                private administrationService: CreditAdministrationService,
                private toastService: ToastService,
                private titleCasePipe: TitleCasePipe) {
    }

    ngOnInit() {
        this.buildForm();
        this.getLoanOptionsType();
        // Retrieving Province List:
        this.getAllProvince();
        // Retrieving District List:
        this.getAllDistrict();
        // getting key from cad doc status:
        this.cadDocStatus = CadDocStatus.key();
    }

    getLoanOptionsType() {
        CustomerLoanOptions.enumObject().forEach(val => {
            this.customerLoanOptions.push(val);
        });
    }

    buildForm() {
        this.udhyamsilKarja = this.formBuilder.group({
            loanOption: [undefined],
            repaymentType: [undefined],
            dateOfApprovalType: [undefined],
            dateOfApprovalNepali: [undefined],
            dateOfApproval: [undefined],
            purposeOfLoan: [undefined],
            dateOfApplicationType: [undefined],
            dateOfApplicationNepali: [undefined],
            dateOfApplication: [undefined],
            previousSanctionType: [undefined],
            previousSanctionDateNepali: [undefined],
            previousSanctionDate: [undefined],
            loanAmountFigure: [undefined],
            loanAmountFigureWords: [undefined],
            marginInPercentage: [undefined],
            baseRate: [undefined],
            premiumRate: [undefined],
            interestRate: [undefined],
            serviceCharge: [undefined],
            totalTenureOfLoan: [undefined],
            commitmentFee: [undefined],
            circularRate: [undefined],
            nameOfStaff: [undefined],
            nameOfBranchManager: [undefined],
            interestSubsidy: [undefined],
            securities: this.formBuilder.array([]),
            // FIELDS FOR TRANSLATED FIELDS (TRANS):
            loanOptionTrans: [undefined],
            repaymentTypeTrans: [undefined],
            dateOfApprovalTypeTrans: [undefined],
            dateOfApprovalTrans: [undefined],
            dateOfApprovalNepaliTrans: [undefined],
            dateOfApplicationTypeTrans: [undefined],
            dateOfApplicationTrans: [undefined],
            dateOfApplicationNepaliTrans: [undefined],
            previousSanctionTypeTrans: [undefined],
            previousSanctionDateTrans: [undefined],
            previousSanctionDateNepaliTrans: [undefined],
            purposeOfLoanTrans: [undefined],
            loanAmountFigureTrans: [undefined],
            loanAmountFigureWordsTrans: [undefined],
            marginInPercentageTrans: [undefined],
            baseRateTrans: [undefined],
            premiumRateTrans: [undefined],
            interestRateTrans: [undefined],
            serviceChargeTrans: [undefined],
            totalTenureOfLoanTrans: [undefined],
            commitmentFeeTrans: [undefined],
            circularRateTrans: [undefined],
            nameOfStaffTrans: [undefined],
            nameOfBranchManagerTrans: [undefined],
            interestSubsidyTrans: [undefined],
            // FIELDS FOR CT VALUE
            loanOptionCT: [undefined],
            repaymentTypeCT: [undefined],
            dateOfApprovalCT: [undefined, Validators.required],
            dateOfApprovalNepaliCT: [undefined, Validators.required],
            dateOfApplicationCT: [undefined, Validators.required],
            dateOfApplicationNepaliCT: [undefined, Validators.required],
            previousSanctionDateCT: [undefined, Validators.required],
            previousSanctionDateNepaliCT: [undefined, Validators.required],
            dateOfApprovalTypeCT: [undefined],
            dateOfApplicationTypeCT: [undefined],
            previousSanctionTypeCT: [undefined],
            purposeOfLoanCT: [undefined, Validators.required],
            loanAmountFigureCT: [undefined, Validators.required],
            loanAmountFigureWordsCT: [undefined, Validators.required],
            marginInPercentageCT: [undefined, Validators.required],
            baseRateCT: [undefined, Validators.required],
            premiumRateCT: [undefined, Validators.required],
            interestRateCT: [undefined, Validators.required],
            serviceChargeCT: [undefined, Validators.required],
            totalTenureOfLoanCT: [undefined, Validators.required],
            commitmentFeeCT: [undefined, Validators.required],
            circularRateCT: [undefined, Validators.required],
            nameOfStaffCT: [undefined, Validators.required],
            nameOfBranchManagerCT: [undefined, Validators.required],
            interestSubsidyCT: [undefined],
        });
        this.addDefaultSecurity();
    }

    transferValue(val) {
        this.isLoanOptionSelected = !ObjectUtil.isEmpty(val);
        this.isCustomerNew = val === 'NEW';
    }

    public getNumAmountWord(numLabel, wordLabel): void {
        const transformValue = this.nepaliCurrencyWordPipe.transform(this.udhyamsilKarja.get(numLabel).value);
        this.udhyamsilKarja.get(wordLabel).patchValue(transformValue);
    }

    public dateOfApproval(value): void {
        this.ADApproval = value === 'AD';
        this.BSApproval = value === 'BS';
    }

    public dateOfApplication(value): void {
        this.ADApplication = value === 'AD';
        this.BSApplication = value === 'BS';
    }

    public previousSanctionDate(value): void {
        this.ADPrevious = value === 'AD';
        this.BSPrevious = value === 'BS';
    }

    calInterestRate() {
        const baseRate = this.udhyamsilKarja.get('baseRate').value;
        const premiumRate = this.udhyamsilKarja.get('premiumRate').value;
        const sum = parseFloat(baseRate) + parseFloat(premiumRate);
        this.udhyamsilKarja.get('interestRate').patchValue(sum);
        // Converting value from existed pipe:
        this.translateNumber('baseRate', 'baseRateTrans');
        this.translateNumber('premiumRate', 'premiumRateTrans');
        this.translateNumber('interestRate', 'interestRateTrans');
    }

    public getAllProvince(): void {
        this.addressService.getProvince().subscribe((response: any) => {
            this.provinceList = response.detail;
        });
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
                    this.udhyamsilKarja.get(['securities', index, 'securityOwnersMunicipalityOrVdc']).patchValue(null);
                }
            }
        );
    }

    setDefaultNepaliResponse(arrName, source, index, target) {
        this.udhyamsilKarja.get([String(arrName), index, String(target)]).patchValue(
            this.udhyamsilKarja.get([String(arrName), index, String(source)]).value.nepaliName);
        this.udhyamsilKarja.get([String(arrName), index, String(source + 'CT')]).patchValue(
            this.udhyamsilKarja.get([String(arrName), index, String(source)]).value.nepaliName);
    }

    addDefaultSecurity() {
        (this.udhyamsilKarja.get('securities') as FormArray).push(
            this.buildSecurityForm()
        );
    }

    removeSecurityDetails(index) {
        (this.udhyamsilKarja.get('securities') as FormArray).removeAt(index);
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

    translateNumber(source, target, currencyFormat?) {
        const formVal = this.udhyamsilKarja.get(source).value;
        if (!ObjectUtil.isEmpty(formVal)) {
            // tslint:disable-next-line:max-line-length
            let formattedVal;
            if (!ObjectUtil.isEmpty(currencyFormat)) {
                formattedVal = this.currencyFormatterPipe.transform(this.udhyamsilKarja.get(source).value.toString());
            } else {
                formattedVal = this.udhyamsilKarja.get(source).value.toString();
            }
            const wordLabelVar = this.engToNepaliNumberPipe.transform(formattedVal);
            this.udhyamsilKarja.get(target).patchValue(wordLabelVar);
        }
    }

    get FormControls() {
        return this.udhyamsilKarja.controls;
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

    interestSubsidyCheck(data) {
        this.isInterestSubsidy = data;
        this.udhyamsilKarja.get('interestSubsidy').patchValue(this.isInterestSubsidy);
    }

    mappedData() {
        Object.keys(this.udhyamsilKarja.controls).forEach(key => {
            if (key.indexOf('Trans') > -1 || key === 'municipalityOrVdc' || key === 'securities' || key.indexOf('CT') > -1) {
                return;
            }
            this.attributes = new Attributes();
            this.attributes.en = this.udhyamsilKarja.get(key).value;
            this.attributes.np = this.udhyamsilKarja.get(key + 'Trans').value;
            this.attributes.ct = this.udhyamsilKarja.get(key + 'CT').value;
            this.tdVal[key] = this.attributes;
        });
        console.log('This is Attributes', this.tdVal);
    }

    async translateAndSetVal() {
        this.spinner = true;
        // Set Translate Data:
        this.udhyamsilKarja.get('interestSubsidy').patchValue(this.isInterestSubsidy);
        this.udhyamsilKarja.get('loanOptionTrans').patchValue(this.udhyamsilKarja.get('loanOption').value);
        this.udhyamsilKarja.get('repaymentTypeTrans').patchValue(this.udhyamsilKarja.get('repaymentType').value);
        // Set Translated Date of Approval
        const approvalType = this.udhyamsilKarja.get('dateOfApprovalType').value;
        let approvalD;
        let approvalDateTrans;
        if (approvalType === 'AD') {
            const approvalForm = this.udhyamsilKarja.get('dateOfApproval').value;
            approvalD = !ObjectUtil.isEmpty(approvalForm) ?
                this.datePipe.transform(approvalForm) : '';
            approvalDateTrans = !ObjectUtil.isEmpty(approvalD) ? this.engNepDatePipe.transform(approvalD, true) : '';
            this.udhyamsilKarja.get('dateOfApprovalTrans').patchValue(approvalDateTrans);
        } else {
            const approvalNepali = this.udhyamsilKarja.get('dateOfApprovalNepali').value;
            approvalDateTrans = !ObjectUtil.isEmpty(approvalNepali) ?
                approvalNepali.nDate : '';
            this.udhyamsilKarja.get('dateOfApprovalNepaliTrans').patchValue(approvalDateTrans);
        }

        // Set Translated Date Of Application:
        const applicationType = this.udhyamsilKarja.get('dateOfApplicationType').value;
        let appDateTrans;
        let applicationDateTrans;
        if (applicationType === 'AD') {
            const applicationForm = this.udhyamsilKarja.get('dateOfApplication').value;
            appDateTrans = !ObjectUtil.isEmpty(applicationForm) ?
                this.datePipe.transform(applicationForm) : '';
            applicationDateTrans = !ObjectUtil.isEmpty(appDateTrans) ? this.engDateTransPipe.transform(appDateTrans, true) : '';
            this.udhyamsilKarja.get('dateOfApplicationTrans').patchValue(applicationDateTrans);
        } else {
            const applicationNepali = this.udhyamsilKarja.get('dateOfApplicationNepali').value;
            applicationDateTrans = !ObjectUtil.isEmpty(applicationNepali) ?
                applicationNepali.nDate : '';
            this.udhyamsilKarja.get('dateOfApplicationNepaliTrans').patchValue(applicationDateTrans);
        }

        // Set Translated Date Of previous Sanction letter:
        const previousSanctionType = this.udhyamsilKarja.get('previousSanctionType').value;
        let preSDate;
        let prevSancDate;
        if (previousSanctionType === 'AD') {
            const previousForm = this.udhyamsilKarja.get('previousSanctionDate').value;
            preSDate = !ObjectUtil.isEmpty(previousForm) ?
                this.datePipe.transform(previousForm) : '';
            prevSancDate = !ObjectUtil.isEmpty(preSDate) ? this.engDateTransPipe.transform(preSDate, true) : '';
            this.udhyamsilKarja.get('previousSanctionDateTrans').patchValue(prevSancDate);
        } else {
            const previousNepali = this.udhyamsilKarja.get('previousSanctionDateNepali').value;
            prevSancDate = !ObjectUtil.isEmpty(previousNepali) ?
                previousNepali.nDate : '';
            this.udhyamsilKarja.get('previousSanctionDateNepaliTrans').patchValue(prevSancDate);
        }

        // For Existed Pipe Value :
        const loanAmountData = this.udhyamsilKarja.get('loanAmountFigure').value;
        if (!ObjectUtil.isEmpty(loanAmountData)) {
            const changeNumber = this.convertNumbersToNepali(loanAmountData, true);
            this.udhyamsilKarja.get('loanAmountFigureTrans').patchValue(changeNumber);
        }

        const loanAmountFigData = this.udhyamsilKarja.get('loanAmountFigureWords').value;
        if (!ObjectUtil.isEmpty(loanAmountFigData)) {
            this.udhyamsilKarja.get('loanAmountFigureWordsTrans').patchValue(loanAmountFigData);
        }

        const marginNum = this.udhyamsilKarja.get('marginInPercentage').value;
        if (!ObjectUtil.isEmpty(marginNum)) {
            const convertedMarginNum = this.convertNumbersToNepali(marginNum, false);
            this.udhyamsilKarja.get('marginInPercentageTrans').patchValue(convertedMarginNum);
        }

        const serviceChargeNum = this.udhyamsilKarja.get('serviceCharge').value;
        if (!ObjectUtil.isEmpty(serviceChargeNum)) {
            const convertServiceCharge = this.convertNumbersToNepali(serviceChargeNum, false);
            this.udhyamsilKarja.get('serviceChargeTrans').patchValue(convertServiceCharge);
        }

        const tenureData = this.udhyamsilKarja.get('totalTenureOfLoan').value;
        if (!ObjectUtil.isEmpty(tenureData)) {
            const convertTenureData = this.convertNumbersToNepali(tenureData, false);
            this.udhyamsilKarja.get('totalTenureOfLoanTrans').patchValue(convertTenureData);
        }

        const commitmentData = this.udhyamsilKarja.get('commitmentFee').value;
        if (!ObjectUtil.isEmpty(commitmentData)) {
            const convertCommitment = this.convertNumbersToNepali(commitmentData, false);
            this.udhyamsilKarja.get('commitmentFeeTrans').patchValue(convertCommitment);
        }

        const circularRateData = this.udhyamsilKarja.get('circularRate').value;
        if (!ObjectUtil.isEmpty(circularRateData)) {
            const convertCircular = this.convertNumbersToNepali(circularRateData, false);
            this.udhyamsilKarja.get('circularRateTrans').patchValue(convertCircular);
        }

        // For Required Translation Data:
        this.translateFormGroup = this.formBuilder.group({
            purposeOfLoan: this.udhyamsilKarja.get('purposeOfLoan').value,
            nameOfStaff: this.udhyamsilKarja.get('nameOfStaff').value,
            nameOfBranchManager: this.udhyamsilKarja.get('nameOfBranchManager').value,
            interestSubsidy: this.udhyamsilKarja.get('interestSubsidy').value,
            dateOfApprovalType: this.udhyamsilKarja.get('dateOfApprovalType').value,
            dateOfApplicationType: this.udhyamsilKarja.get('dateOfApplicationType').value,
            previousSanctionType: this.udhyamsilKarja.get('previousSanctionType').value,
        });
        this.translatedValues = await this.translate(this.translateFormGroup);
        this.setTranslatedData(this.translatedValues);
        this.setCTValuesAfterTranslation();
        this.mappedData();
        this.spinner = false;
        this.saveEnable = true;
    }

    async translate(form) {
        this.spinner = true;
        const translatedData = await this.translatedService.translateForm(form);
        this.spinner = false;
        return translatedData;
    }

    async onChangeTranslateSecurity(arrName, source, index, target) {
        this.oneForm = this.formBuilder.group({
            securityOwnersName: this.udhyamsilKarja.get([String(arrName), index, String(source)]).value
        });
        const sourceResponse = await this.translatedService.translateForm(this.oneForm);
        this.udhyamsilKarja.get([String(arrName), index, String(target)]).patchValue(sourceResponse.securityOwnersName);
        this.udhyamsilKarja.get([String(arrName), index, String(source + 'CT')]).patchValue(sourceResponse.securityOwnersName);
    }

    translateSecurityDetailsNumberFields(arrName, source, index, target) {
        const translatedNepaliNum = this.engToNepaliNumberPipe.transform(
            String(this.udhyamsilKarja.get([String(arrName), index, String(source)]).value));
        this.udhyamsilKarja.get([String(arrName), index, String(target)]).patchValue(translatedNepaliNum);
        this.udhyamsilKarja.get([String(arrName), index, String(source + 'CT')]).patchValue(translatedNepaliNum);
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
        this.udhyamsilKarja.get('purposeOfLoanTrans').patchValue(this.translatedValues.purposeOfLoan);
        this.udhyamsilKarja.get('nameOfStaffTrans').patchValue(this.translatedValues.nameOfStaff);
        this.udhyamsilKarja.get('nameOfBranchManagerTrans').patchValue(this.translatedValues.nameOfBranchManager);
        this.udhyamsilKarja.get('interestSubsidyTrans').patchValue(this.translatedValues.interestSubsidy);
        this.udhyamsilKarja.get('dateOfApprovalTypeTrans').patchValue(this.translatedValues.dateOfApprovalType);
        this.udhyamsilKarja.get('dateOfApplicationTypeTrans').patchValue(this.translatedValues.dateOfApplicationType);
        this.udhyamsilKarja.get('previousSanctionTypeTrans').patchValue(this.translatedValues.previousSanctionType);
    }

    setCTValuesAfterTranslation() {
        // Set CT Value for every fields:
        this.udhyamsilKarja.get('loanOptionCT').patchValue(this.udhyamsilKarja.get('loanOption').value);
        this.udhyamsilKarja.get('repaymentTypeCT').patchValue(this.udhyamsilKarja.get('repaymentType').value);
        this.udhyamsilKarja.get('dateOfApprovalTypeCT').patchValue(this.udhyamsilKarja.get('dateOfApprovalType').value);
        if (this.ADApproval) {
            const transDate = this.udhyamsilKarja.get('dateOfApprovalTrans').value;
            this.udhyamsilKarja.get('dateOfApprovalCT').patchValue(transDate);
        }
        if (this.BSApproval) {
            this.udhyamsilKarja.get('dateOfApprovalNepaliCT').patchValue(this.udhyamsilKarja.get('dateOfApprovalNepaliTrans').value);
        }

        // SET CT VALUE OF DATE OF APPLICATION
        this.udhyamsilKarja.get('dateOfApplicationTypeCT').patchValue(this.udhyamsilKarja.get('dateOfApplicationType').value);
        if (this.ADApplication) {
            const transDate = this.udhyamsilKarja.get('dateOfApplicationTrans').value;
            this.udhyamsilKarja.get('dateOfApplicationCT').patchValue(transDate);
        }
        if (this.BSApplication) {
            this.udhyamsilKarja.get('dateOfApplicationNepaliCT').patchValue(this.udhyamsilKarja.get('dateOfApplicationNepaliTrans').value);
        }

        // SET PREVIOUS SANCTION LETTER DATE
        this.udhyamsilKarja.get('previousSanctionTypeCT').patchValue(this.udhyamsilKarja.get('previousSanctionType').value);
        if (this.ADPrevious) {
            const transPreviousDate = this.udhyamsilKarja.get('previousSanctionDateTrans').value;
            this.udhyamsilKarja.get('previousSanctionDateCT').patchValue(transPreviousDate);
        }
        if (this.BSPrevious) {
            this.udhyamsilKarja.get('previousSanctionDateNepaliCT').patchValue(
                this.udhyamsilKarja.get('previousSanctionDateNepaliTrans').value);
        }
        this.udhyamsilKarja.get('purposeOfLoanCT').patchValue(this.udhyamsilKarja.get('purposeOfLoanTrans').value);
        this.udhyamsilKarja.get('loanAmountFigureCT').patchValue(this.udhyamsilKarja.get('loanAmountFigureTrans').value);
        this.udhyamsilKarja.get('loanAmountFigureWordsCT').patchValue(this.udhyamsilKarja.get('loanAmountFigureWordsTrans').value);
        this.udhyamsilKarja.get('marginInPercentageCT').patchValue(this.udhyamsilKarja.get('marginInPercentageTrans').value);
        this.udhyamsilKarja.get('baseRateCT').patchValue(this.udhyamsilKarja.get('baseRateTrans').value);
        this.udhyamsilKarja.get('premiumRateCT').patchValue(this.udhyamsilKarja.get('premiumRateTrans').value);
        this.udhyamsilKarja.get('interestRateCT').patchValue(this.udhyamsilKarja.get('interestRateTrans').value);
        this.udhyamsilKarja.get('serviceChargeCT').patchValue(this.udhyamsilKarja.get('serviceChargeTrans').value);
        this.udhyamsilKarja.get('totalTenureOfLoanCT').patchValue(this.udhyamsilKarja.get('totalTenureOfLoanTrans').value);
        this.udhyamsilKarja.get('commitmentFeeCT').patchValue(this.udhyamsilKarja.get('commitmentFeeTrans').value);
        this.udhyamsilKarja.get('circularRateCT').patchValue(this.udhyamsilKarja.get('circularRateTrans').value);
        this.udhyamsilKarja.get('nameOfStaffCT').patchValue(this.udhyamsilKarja.get('nameOfStaffTrans').value);
        this.udhyamsilKarja.get('nameOfBranchManagerCT').patchValue(this.udhyamsilKarja.get('nameOfBranchManagerTrans').value);
        this.udhyamsilKarja.get('interestSubsidyCT').patchValue(this.udhyamsilKarja.get('interestSubsidy').value);
    }

    clearConditionalValidation() {
        // Clear Validation for Approval Date:
        if (this.BSApproval) {
            this.udhyamsilKarja.get('dateOfApprovalCT').clearValidators();
            this.udhyamsilKarja.get('dateOfApprovalCT').updateValueAndValidity();
        } else {
            this.udhyamsilKarja.get('dateOfApprovalNepaliCT').clearValidators();
            this.udhyamsilKarja.get('dateOfApprovalNepaliCT').updateValueAndValidity();
        }
        // Clear Validation for Application Date:
        if (this.BSApplication) {
            this.udhyamsilKarja.get('dateOfApplicationCT').clearValidators();
            this.udhyamsilKarja.get('dateOfApplicationCT').updateValueAndValidity();
        } else {
            this.udhyamsilKarja.get('dateOfApplicationNepaliCT').clearValidators();
            this.udhyamsilKarja.get('dateOfApplicationNepaliCT').updateValueAndValidity();
        }
        const tempSelectedOption = this.udhyamsilKarja.get('loanOption').value;
        // Clear Validation for previous Sanction Date:
        if (tempSelectedOption === this.loanOptions.EXISTING) {
            if (this.BSPrevious) {
                this.udhyamsilKarja.get('previousSanctionDateCT').clearValidators();
                this.udhyamsilKarja.get('previousSanctionDateCT').updateValueAndValidity();
            } else {
                this.udhyamsilKarja.get('previousSanctionDateNepaliCT').clearValidators();
                this.udhyamsilKarja.get('previousSanctionDateNepaliCT').updateValueAndValidity();
            }
        } else {
            this.udhyamsilKarja.get('previousSanctionDateNepaliCT').clearValidators();
            this.udhyamsilKarja.get('previousSanctionDateNepaliCT').updateValueAndValidity();
            this.udhyamsilKarja.get('previousSanctionDateCT').clearValidators();
            this.udhyamsilKarja.get('previousSanctionDateCT').updateValueAndValidity();
        }
        // Clear Validation for other optional fields.
        if (this.isInterestSubsidy) {
            this.udhyamsilKarja.get('serviceChargeCT').clearValidators();
            this.udhyamsilKarja.get('serviceChargeCT').updateValueAndValidity();
        } else {
            this.udhyamsilKarja.get('circularRateCT').clearValidators();
            this.udhyamsilKarja.get('circularRateCT').updateValueAndValidity();
        }
    }

    submit() {
        this.submitted = true;
        // const securityDetails = [{
        //     securities: this.udhyamsilKarja.get('securities').value,
        // }];
        this.tdVal['securities'] = this.udhyamsilKarja.get('securities').value;
        const tempRequiredDocuments = this.setRequiredDocuments();
        this.tdVal['requiredDocuments'] = tempRequiredDocuments;
        // For Clearing validation of optional and conditional Fields.
        this.clearConditionalValidation();
        const invalidControls = [];
        const controls = this.udhyamsilKarja.controls;
        for (const name in controls) {
            if (controls[name].invalid) {
                invalidControls.push(this.titleCasePipe.transform(name).replace('CT', '').replace('Trans', ''));
            }
        }
        if (this.udhyamsilKarja.invalid) {
            this.toastService.show(new Alert(AlertType.DANGER, 'Please Check validation For :\n' + invalidControls.filter((
                value, index, self) => self.indexOf(value) === index).join(', ')));
            this.spinner = false;
            return;
        }

        this.spinner = true;
        this.customerApprovedDoc.docStatus = this.cadDocStatus[0];

        if (this.customerApprovedDoc.offerDocumentList.length > 0) {
            this.offerLetterDocument = this.customerApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
                === this.offerLetterConst.value(this.offerLetterConst.UDYAMSIL_KARJA_SUBSIDY).toString())[0];
            if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
                this.customerApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
                   if (offerLetterPath.docName.toString() ===
                        this.offerLetterConst.value(this.offerLetterConst.UDYAMSIL_KARJA_SUBSIDY).toString()) {
                       offerLetterPath.initialInformation = JSON.stringify(this.tdVal);
                   }
                });
            }
        } else {
            const offerDocument = new OfferDocument();
            offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.UDYAMSIL_KARJA_SUBSIDY);
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

    // TODO Need to pass context based on the template design
    openModal() {
        this.dialogService.open(UdyamsilKarjaSubsidyComponent, {
            closeOnBackdropClick: false,
            hasBackdrop: false,
            hasScroll: true,
            dialogClass: 'modal-full',
            context: {
                cadOfferLetterApprovedDoc: this.customerApprovedDoc,
                preview: true,
            }
        });
    }

    clearSecurityMunType(controlName, index, formArrayName) {
        const tempVal = this.udhyamsilKarja.get([formArrayName, index, 'securityOwnersMunicipalityOrVdc']).value;
        if (tempVal === 'VDC') {
            this.udhyamsilKarja.get([formArrayName, index, controlName]).setValue(null);
        }
    }

    private setRequiredDocuments() {
        const requiredLegalDocument = this.requiredLegalDocumentSectionComponent.requireDocumentForm.value;
        const requiredData = {
            requiredLegalDocument: requiredLegalDocument,
        };
        return (requiredData);
    }


}
