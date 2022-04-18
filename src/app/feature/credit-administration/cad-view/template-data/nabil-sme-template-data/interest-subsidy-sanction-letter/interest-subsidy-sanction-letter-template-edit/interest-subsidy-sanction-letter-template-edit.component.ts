import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../model/customerApprovedLoanCadDocumentation';
import {OfferDocument} from '../../../../../model/OfferDocument';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NabilOfferLetterConst} from '../../../../../nabil-offer-letter-const';
import {CustomerLoanOptions} from '../../../../cad-constant/customer-loan-options';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {NepaliCurrencyWordPipe} from '../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {CurrencyFormatterPipe} from '../../../../../../../@core/pipe/currency-formatter.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {DatePipe, TitleCasePipe} from '@angular/common';
import {EngNepDatePipe} from 'nepali-patro';
import {SbTranslateService} from '../../../../../../../@core/service/sbtranslate.service';
import {AddressService} from '../../../../../../../@core/service/baseservice/address.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CreditAdministrationService} from '../../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../../@core/utils';
import {CadDocStatus} from '../../../../../model/CadDocStatus';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';
import {District} from '../../../../../../admin/modal/district';
import {Attributes} from '../../../../../../../@core/model/attributes';
import {Alert, AlertType} from '../../../../../../../@theme/model/Alert';
import {InterestSubsidySanctionLetterComponent} from '../../../../../cad-document-template/nabil/nabil-sme/interest-subsidy-sanction-letter/interest-subsidy-sanction-letter.component';
import {CommonSecuritySectionPrimaryComponent} from '../../common-security-section/common-security-section-primary/common-security-section-primary.component';
import {CommonSecuritySectionSecondaryComponent} from '../../common-security-section/common-security-section-secondary/common-security-section-secondary.component';
import {EnglishDateTransformPipe} from '../../../../../../../@core/pipe/english-date-transform.pipe';
import {RequiredLegalDocumentSectionComponent} from '../../sme-template-data/sme-master-template/required-legal-document-section/required-legal-document-section.component';

@Component({
    selector: 'app-interest-subsidy-sanction-letter-template-edit',
    templateUrl: './interest-subsidy-sanction-letter-template-edit.component.html',
    styleUrls: ['./interest-subsidy-sanction-letter-template-edit.component.scss']
})
export class InterestSubsidySanctionLetterTemplateEditComponent implements OnInit {
    @Input() customerApprovedDoc: CustomerApprovedLoanCadDocumentation;
    @Input() offerDocumentList: Array<OfferDocument>;
    @Input() initialInformation: any;
    @ViewChild('primarySecurity', {static: false})
    commonSecuritySectionPrimaryComponent: CommonSecuritySectionPrimaryComponent;
    @ViewChild('secondarySecurity', {static: false})
    commonSecuritySectionSecondaryComponent: CommonSecuritySectionSecondaryComponent;
    @ViewChild('requiredLegalDocument', {static: false})
    requiredLegalDocumentSectionComponent: RequiredLegalDocumentSectionComponent;
    loanOptions: Array<String> = new Array<String>();
    spinner = false;
    dateType = [{key: 'AD', value: 'AD', checked: true}, {key: 'BS', value: 'BS'}];
    isLoanOptionSelected = false;
    securityType = [{value: 'LAND'},
        {value: 'LAND & BUILDING'}, {value: 'FIXED ASSETS'},
        {value: 'STOCK'}, {value: 'ASSETS PLANTS MACHINERY & OTHER EQUIPMENTS'},
        {value: 'LIVE STOCKS ANIMALS'}];
    loanSubTypeList = [
        {nData: 'ब्यापारिक कृषि तथा पशुपंछी कर्जा', eData: 'Commercial Agro and Livestock Loan'},
        {nData: 'शिक्षित युवा स्वरोजगार कर्जा', eData: 'Educated Youth and Self Employeed Loan '},
        {nData: 'उच्च र/वा प्राविधिक तथा व्यवसायिक शिक्षा कर्जा', eData: 'Higher and Techno-Vocational Education Loan'},
        {
            nData: 'विपन्न, दलित तथा पिछडिएको वर्ग / समुदाय व्यवसाय विकाश कर्र्जा',
            eData: 'Loan to under-priviledged Caste/Community/Marginalized Communities'
        },
        {nData: 'भुकम्प पीडितहरुको निजी आवास निर्माण कर्जा', eData: 'Personal Home Construction loan for Earthquake Affected People'},
        {nData: 'महिलाद्वारा प्रबर्तित लघु उद्यमशीलता कर्जा', eData: 'Women Run Micro enterprise Loan'},
        {nData: 'बैदेशिक रोजगारीबाट फर्केका युवा परियोजना कर्जा ', eData: 'Project loan for Youths returning from Foreign Employment'},
    ];
    isCustomerNew = false;
    interestSubsidy: FormGroup;
    isInterestSubsidy = false;
    ADApproval = false;
    BSApproval = false;
    ADApplication = false;
    BSApplication = false;
    ADPrevious = false;
    BSPrevious = false;
    translateFormGroup: FormGroup;
    translatedValues: any = {};
    oneForm: FormGroup;
    cadDocStatus;
    municipalityListForSecurities = [];
    provinceList = [];
    allDistrictList = [];
    attributes;
    tdVal: any = {};
    isPreview = false;
    saveEnable = false;
    closeEnable = false;
    submitted = false;
    offerLetterDocument: OfferDocument;
    offerLetterConst = NabilOfferLetterConst;
    cusLoanType = CustomerLoanOptions;
    showSecurity = false;
    securities;
    tempLoanSubType;

    constructor(private formBuilder: FormBuilder,
                private dialogService: NbDialogService,
                private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
                private currencyFormatterPipe: CurrencyFormatterPipe,
                private engToNepaliNumberPipe: EngToNepaliNumberPipe,
                private datePipe: DatePipe,
                private engNepDatePipe: EngNepDatePipe,
                private translatedService: SbTranslateService,
                private addressService: AddressService,
                private modalService: NgbModal,
                private dialogRef: NbDialogRef<InterestSubsidySanctionLetterTemplateEditComponent>,
                private titleCasePipe: TitleCasePipe,
                private administrationService: CreditAdministrationService,
                private toastService: ToastService,
                private englishCalenderPipe: EnglishDateTransformPipe) {
    }

    ngOnInit() {
        // Retrieving Loan Options:
        this.getLoanTypeData();
        this.buildForm();
        this.getAllProvince();
        this.getAllDistrict();
        this.cadDocStatus = CadDocStatus.key();
        if (!ObjectUtil.isEmpty(this.initialInformation)) {
            this.isLoanOptionSelected = true;
            const loanSelectedType = this.initialInformation.loanOption ?
                this.initialInformation.loanOption.en : '';
            if (loanSelectedType === this.cusLoanType.NEW) {
                this.isCustomerNew = true;
            }
            // FOR DATE FLAG:
            const tempApprovalFlag = this.initialInformation.dateOfApprovalType ?
                this.initialInformation.dateOfApprovalType.en : '';
            if (tempApprovalFlag === 'AD') {
                this.ADApproval = true;
            }
            if (tempApprovalFlag === 'BS') {
                this.BSApproval = true;
            }

            const tempApplicationFlag = this.initialInformation.dateOfApplicationType ?
                this.initialInformation.dateOfApplicationType.en : '';
            if (tempApplicationFlag === 'AD') {
                this.ADApplication = true;
            }
            if (tempApplicationFlag === 'BS') {
                this.BSApplication = true;
            }

            const tempPreviousFlag = this.initialInformation.previousSanctionType ?
                this.initialInformation.previousSanctionType.en : '';
            if (tempPreviousFlag === 'AD') {
                this.ADPrevious = true;
            }
            if (tempPreviousFlag === 'BS') {
                this.BSPrevious = true;
            }
            // SET TEMPLATE DATA:
            this.setInterestSubsidyTemplateData();
        }
    }

    buildForm() {
        this.interestSubsidy = this.formBuilder.group({
            loanOption: [undefined],
            repaymentType: [undefined],
            interestSubsidy: [undefined],
            securityType: [undefined],
            dateOfApprovalType: [undefined],
            dateOfApproval: [undefined],
            dateOfApprovalNepali: [undefined],
            dateOfApplicationType: [undefined],
            dateOfApplication: [undefined],
            dateOfApplicationNepali: [undefined],
            previousSanctionType: [undefined],
            previousSanctionDate: [undefined],
            previousSanctionDateNepali: [undefined],
            purposeOfLoan: [undefined],
            marginInPercentage: [undefined],
            marginInPercentageMotor: [undefined],
            marginInPercentageFoot: [undefined],
            baseRate: [undefined],
            premiumRate: [undefined],
            interestRate: [undefined],
            totalTenureOfLoan: [undefined],
            totalLimitFigure: [undefined],
            totalLimitWords: [undefined],
            // circularRate: [undefined],
            nameOfStaff: [undefined],
            nameOfBranchManager: [undefined],
            loanSubType: [undefined],
            // FOR TRANSLATION FIELDS:
            loanOptionTrans: [undefined],
            repaymentTypeTrans: [undefined],
            interestSubsidyTrans: [undefined],
            securityTypeTrans: [undefined],
            dateOfApprovalNepaliTrans: [undefined],
            dateOfApprovalTypeTrans: [undefined],
            dateOfApprovalTrans: [undefined],
            dateOfApplicationTypeTrans: [undefined],
            dateOfApplicationTrans: [undefined],
            dateOfApplicationNepaliTrans: [undefined],
            previousSanctionTypeTrans: [undefined],
            previousSanctionDateTrans: [undefined],
            previousSanctionDateNepaliTrans: [undefined],
            purposeOfLoanTrans: [undefined],
            marginInPercentageTrans: [undefined],
            marginInPercentageMotorTrans: [undefined],
            marginInPercentageFootTrans: [undefined],
            baseRateTrans: [undefined],
            premiumRateTrans: [undefined],
            interestRateTrans: [undefined],
            totalTenureOfLoanTrans: [undefined],
            totalLimitFigureTrans: [undefined],
            totalLimitWordsTrans: [undefined],
            // circularRateTrans: [undefined],
            nameOfStaffTrans: [undefined],
            nameOfBranchManagerTrans: [undefined],
            loanSubTypeTrans: [undefined],
            // FOR CORRECTION TRANSLATION:
            loanOptionCT: [undefined],
            repaymentTypeCT: [undefined],
            interestSubsidyCT: [undefined],
            securityTypeCT: [undefined],
            dateOfApprovalTypeCT: [undefined],
            dateOfApprovalCT: [undefined, Validators.required],
            dateOfApprovalNepaliCT: [undefined, Validators.required],
            dateOfApplicationTypeCT: [undefined],
            dateOfApplicationCT: [undefined, Validators.required],
            dateOfApplicationNepaliCT: [undefined, Validators.required],
            previousSanctionTypeCT: [undefined],
            previousSanctionDateCT: [undefined, Validators.required],
            previousSanctionDateNepaliCT: [undefined, Validators.required],
            purposeOfLoanCT: [undefined, Validators.required],
            marginInPercentageCT: [undefined, Validators.required],
            marginInPercentageMotorCT: [undefined, Validators.required],
            marginInPercentageFootCT: [undefined, Validators.required],
            baseRateCT: [undefined, Validators.required],
            premiumRateCT: [undefined, Validators.required],
            interestRateCT: [undefined, Validators.required],
            totalTenureOfLoanCT: [undefined, Validators.required],
            totalLimitFigureCT: [undefined, Validators.required],
            totalLimitWordsCT: [undefined, Validators.required],
            // circularRateCT: [undefined/*, Validators.required*/],
            nameOfStaffCT: [undefined, Validators.required],
            nameOfBranchManagerCT: [undefined, Validators.required],
            loanSubTypeCT: [undefined],
            securities: this.formBuilder.array([]),
        });
    }

    transferValue(val) {
        this.isCustomerNew = val === 'NEW';
    }

    interestSubsidyCheck(data) {
        this.isInterestSubsidy = data;
        this.interestSubsidy.get('interestSubsidy').patchValue(this.isInterestSubsidy);
    }

    getLoanTypeData() {
        CustomerLoanOptions.enumObject().forEach(data => {
            this.loanOptions.push(data);
        });
    }

    checkSelectedValue() {
        const tempLoanOption = this.interestSubsidy.get('loanOption').value;
        const securityOptions = this.interestSubsidy.get('securityType').value;
        const selectedLoanSubType = this.interestSubsidy.get('loanSubType').value;
        this.isLoanOptionSelected = !ObjectUtil.isEmpty(tempLoanOption) &&
            !ObjectUtil.isEmpty(securityOptions) && !ObjectUtil.isEmpty(selectedLoanSubType);
        if (securityOptions === 'LAND' || securityOptions === 'LAND & BUILDING') {
            this.showSecurity = true;
        } else {
            this.showSecurity = false;
        }
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
        const baseRate = this.interestSubsidy.get('baseRate').value;
        const premiumRate = this.interestSubsidy.get('premiumRate').value;
        const sum = parseFloat(baseRate) + parseFloat(premiumRate);
        this.interestSubsidy.get('interestRate').patchValue(sum);
        // Converting value from existed pipe:
        // this.translateNumber('baseRate', 'baseRateTrans');
        // this.translateNumber('premiumRate', 'premiumRateTrans');
        // this.translateNumber('interestRate', 'interestRateTrans');
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
                    this.interestSubsidy.get(['securities', index, 'securityOwnersMunicipalityOrVdc']).patchValue(null);
                }
            }
        );
    }

    setDefaultNepaliResponse(arrName, source, index, target) {
        this.interestSubsidy.get([String(arrName), index, String(target)]).patchValue(
            this.interestSubsidy.get([String(arrName), index, String(source)]).value.nepaliName);
        this.interestSubsidy.get([String(arrName), index, String(source + 'CT')]).patchValue(
            this.interestSubsidy.get([String(arrName), index, String(source)]).value.nepaliName);
    }

    addDefaultSecurity() {
        (this.interestSubsidy.get('securities') as FormArray).push(
            this.buildSecurityForm()
        );
    }

    removeSecurityDetails(index) {
        (this.interestSubsidy.get('securities') as FormArray).removeAt(index);
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

    translateNumber(source, target, currencyFormat?: boolean) {
        const formVal = this.interestSubsidy.get(source).value;
        if (!ObjectUtil.isEmpty(formVal)) {
            // tslint:disable-next-line:max-line-length
            let formattedVal;
            if (!ObjectUtil.isEmpty(currencyFormat)) {
                formattedVal = this.currencyFormatterPipe.transform(this.interestSubsidy.get(source).value.toString());
            } else {
                formattedVal = this.interestSubsidy.get(source).value.toString();
            }
            const wordLabelVar = this.engToNepaliNumberPipe.transform(formattedVal);
            this.interestSubsidy.get(target).patchValue(wordLabelVar);
        }
    }

    public getNumAmountWord(numLabel, wordLabel): void {
        const transformValue = this.nepaliCurrencyWordPipe.transform(this.interestSubsidy.get(numLabel).value);
        this.interestSubsidy.get(wordLabel).patchValue(transformValue);
    }

    mapTranslatedData() {
        Object.keys(this.interestSubsidy.controls).forEach(key => {
            if (key.indexOf('Trans') > -1 || key === 'municipalityOrVdc' || key === 'securities' || key.indexOf('CT') > -1) {
                return;
            }
            this.attributes = new Attributes();
            this.attributes.en = this.interestSubsidy.get(key).value;
            this.attributes.np = this.interestSubsidy.get(key + 'Trans').value;
            this.attributes.ct = this.interestSubsidy.get(key + 'CT').value;
            this.tdVal[key] = this.attributes;
        });
        console.log('This is Attributes', this.tdVal);
    }

    async translateAndSetVal() {
        this.spinner = true;
        // Set Translated Value
        this.interestSubsidy.get('loanOptionTrans').patchValue(this.interestSubsidy.get('loanOption').value);
        this.interestSubsidy.get('repaymentTypeTrans').patchValue(this.interestSubsidy.get('repaymentType').value);
        this.interestSubsidy.get('securityTypeTrans').patchValue(this.interestSubsidy.get('securityType').value);
        this.interestSubsidy.get('interestSubsidy').patchValue(this.isInterestSubsidy);
        this.interestSubsidy.get('interestSubsidyTrans').patchValue(this.isInterestSubsidy);
        // SET TRANSLATED DATE FOR DATE OF APPROVAL:
        const approvalType = this.interestSubsidy.get('dateOfApprovalType').value;
        let transApprovalDate;
        if (approvalType === 'AD') {
            const approvalDateVal = this.datePipe.transform(this.interestSubsidy.get('dateOfApproval').value);
            transApprovalDate = !ObjectUtil.isEmpty(approvalDateVal) ?
                this.datePipe.transform(approvalDateVal) : '';
            const finalAppDate = !ObjectUtil.isEmpty(transApprovalDate) ? this.engNepDatePipe.transform(transApprovalDate, true) : '';
            if (!ObjectUtil.isEmpty(approvalDateVal)) {
                this.interestSubsidy.get('dateOfApprovalTrans').patchValue(finalAppDate);
            }
        } else {
            const approvalNepaliDate = this.interestSubsidy.get('dateOfApprovalNepali').value;
            transApprovalDate = !ObjectUtil.isEmpty(approvalNepaliDate) ?
                approvalNepaliDate.nDate : '';
            this.interestSubsidy.get('dateOfApprovalNepaliTrans').patchValue(transApprovalDate);
        }

        // SET TRANSLATED DATE FOR DATE OF APPLICATION:
        const applicationType = this.interestSubsidy.get('dateOfApplicationType').value;
        let transApplicationDate;
        if (applicationType === 'AD') {
            const applicationDateVal = this.datePipe.transform(this.interestSubsidy.get('dateOfApplication').value);
            transApplicationDate = !ObjectUtil.isEmpty(applicationDateVal) ?
                this.datePipe.transform(applicationDateVal) : '';
            const finalAppDate = this.englishCalenderPipe.transform(transApplicationDate);
            if (!ObjectUtil.isEmpty(applicationDateVal)) {
                this.interestSubsidy.get('dateOfApplicationTrans').patchValue(finalAppDate);
            }
        } else {
            const applicationDateNep = this.interestSubsidy.get('dateOfApplicationNepali').value;
            transApplicationDate = !ObjectUtil.isEmpty(applicationDateNep) ?
                applicationDateNep.nDate : '';
            this.interestSubsidy.get('dateOfApplicationNepaliTrans').patchValue(transApplicationDate);
        }

        // SET TRANSLATED DATE FOR PREVIOUS SANCTION DATE:
        const previousLetterType = this.interestSubsidy.get('previousSanctionType').value;
        let transPrevSancDate;
        if (previousLetterType === 'AD') {
            const prevDateEng = this.datePipe.transform(this.interestSubsidy.get('previousSanctionDate').value);
            transPrevSancDate = !ObjectUtil.isEmpty(prevDateEng) ?
                this.datePipe.transform(prevDateEng) : '';
            const finalAppDate = this.englishCalenderPipe.transform(transPrevSancDate);
            if (!ObjectUtil.isEmpty(prevDateEng)) {
                this.interestSubsidy.get('previousSanctionDateTrans').patchValue(finalAppDate);
            }
        } else {
            const transPrevSancNepali = this.interestSubsidy.get('previousSanctionDateNepali').value;
            transPrevSancDate = !ObjectUtil.isEmpty(transPrevSancNepali) ?
                transPrevSancNepali.nDate : null;
            this.interestSubsidy.get('previousSanctionDateNepaliTrans').patchValue(transPrevSancDate);
        }
        // TRANSLATE VALUES OF NUMBERS:
        this.translateNumber('marginInPercentage', 'marginInPercentageTrans');
        this.translateNumber('marginInPercentageMotor', 'marginInPercentageMotorTrans');
        this.translateNumber('marginInPercentageFoot', 'marginInPercentageFootTrans');
        this.translateNumber('premiumRate', 'premiumRateTrans');
        this.translateNumber('interestRate', 'interestRateTrans');
        this.translateNumber('totalTenureOfLoan', 'totalTenureOfLoanTrans');
        this.translateNumber('totalLimitFigure', 'totalLimitFigureTrans', true);
        const tempTotalLimitWords = this.interestSubsidy.get('totalLimitWords').value;
        if (!ObjectUtil.isEmpty(tempTotalLimitWords)) {
            this.interestSubsidy.get('totalLimitWordsTrans').patchValue(tempTotalLimitWords);
        }
        // this.translateNumber('circularRate', 'circularRateTrans');

        // Set Translated Data of Loan sub type:
        const tempSubTypeVal = this.interestSubsidy.get('loanSubType').value;
        if (!ObjectUtil.isEmpty(tempSubTypeVal)) {
            this.interestSubsidy.get('loanSubTypeTrans').patchValue(tempSubTypeVal.nData);
        }

        // TRANSLATING THE VALUES:
        this.translateFormGroup = this.formBuilder.group({
            purposeOfLoan: this.interestSubsidy.get('purposeOfLoan').value ? this.interestSubsidy.get('purposeOfLoan').value : '',
            nameOfStaff: this.interestSubsidy.get('nameOfStaff').value ? this.interestSubsidy.get('nameOfStaff').value : '',
            nameOfBranchManager: this.interestSubsidy.get('nameOfBranchManager').value ?
                this.interestSubsidy.get('nameOfBranchManager').value : '',
            dateOfApprovalType: this.interestSubsidy.get('dateOfApprovalType').value ?
                this.interestSubsidy.get('dateOfApprovalType').value : '',
            dateOfApplicationType: this.interestSubsidy.get('dateOfApplicationType').value ? this.interestSubsidy.get('dateOfApplicationType').value : '',
            previousSanctionType: this.interestSubsidy.get('previousSanctionType').value ?
                this.interestSubsidy.get('previousSanctionType').value : '',
            securityType: this.interestSubsidy.get('securityType').value ? this.interestSubsidy.get('securityType').value : '',
        });
        this.translatedValues = await this.translate(this.translateFormGroup);
        this.setGoogleTranslatedValues(this.translatedValues);
        this.setCtValue();
        this.mapTranslatedData();
        // For Loan Sub type values in Edit Condition:
        const tempSelectedSubType = !ObjectUtil.isEmpty(this.tdVal.loanSubType) ?
            this.tdVal.loanSubType.en : '';
        if (!ObjectUtil.isEmpty(tempSelectedSubType)) {
            if (ObjectUtil.isEmpty(tempSelectedSubType.eData)) {
                this.tdVal.loanSubType.en = this.tempLoanSubType;
                this.tdVal.loanSubType.np = this.tempLoanSubType.nData;
                this.tdVal.loanSubType.ct = this.tempLoanSubType.nData;
            }
        }
        this.spinner = false;
        this.saveEnable = true;
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

    async translate(form) {
        this.spinner = true;
        const translatedData = await this.translatedService.translateForm(form);
        this.spinner = false;
        return translatedData;
    }

    get formControls() {
        return this.interestSubsidy.controls;
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

    public close(): void {
        this.dialogRef.close();
    }

    async onChangeTranslateSecurity(arrName, source, index, target) {
        this.oneForm = this.formBuilder.group({
            securityOwnersName: this.interestSubsidy.get([String(arrName), index, String(source)]).value
        });
        const sourceResponse = await this.translatedService.translateForm(this.oneForm);
        this.interestSubsidy.get([String(arrName), index, String(target)]).patchValue(sourceResponse.securityOwnersName);
        this.interestSubsidy.get([String(arrName), index, String(source + 'CT')]).patchValue(sourceResponse.securityOwnersName);
    }

    translateSecurityDetailsNumberFields(arrName, source, index, target) {
        const translatedNepaliNum = this.engToNepaliNumberPipe.transform(
            String(this.interestSubsidy.get([String(arrName), index, String(source)]).value));
        this.interestSubsidy.get([String(arrName), index, String(target)]).patchValue(translatedNepaliNum);
        this.interestSubsidy.get([String(arrName), index, String(source + 'CT')]).patchValue(translatedNepaliNum);
    }

    setGoogleTranslatedValues(translatedData) {
        this.interestSubsidy.get('purposeOfLoanTrans').patchValue(this.translatedValues.purposeOfLoan);
        this.interestSubsidy.get('nameOfStaffTrans').patchValue(this.translatedValues.nameOfStaff);
        this.interestSubsidy.get('nameOfBranchManagerTrans').patchValue(this.translatedValues.nameOfBranchManager);
        this.interestSubsidy.get('dateOfApprovalTypeTrans').patchValue(this.translatedValues.dateOfApprovalType);
        this.interestSubsidy.get('dateOfApplicationTypeTrans').patchValue(this.translatedValues.dateOfApplicationType);
        this.interestSubsidy.get('previousSanctionTypeTrans').patchValue(this.translatedValues.previousSanctionType);
    }

    setCtValue(): void {
        // SET CT values for fields:
        this.interestSubsidy.get('loanOptionCT').patchValue(this.interestSubsidy.get('loanOption').value);
        this.interestSubsidy.get('repaymentTypeCT').patchValue(this.interestSubsidy.get('repaymentType').value);
        this.interestSubsidy.get('interestSubsidyCT').patchValue(this.isInterestSubsidy);
        this.interestSubsidy.get('securityTypeCT').patchValue(this.interestSubsidy.get('securityType').value);
        // SET CT VALUE FOR DATE OF APPROVAL:
        this.interestSubsidy.get('dateOfApprovalTypeCT').patchValue(this.interestSubsidy.get('dateOfApprovalTypeTrans').value);
        if (this.ADApproval) {
            const tranApprovalDate = this.interestSubsidy.get('dateOfApprovalTrans').value;
            this.interestSubsidy.get('dateOfApprovalCT').patchValue(tranApprovalDate);
        }
        if (this.BSApproval) {
            this.interestSubsidy.get('dateOfApprovalNepaliCT').patchValue(
                this.interestSubsidy.get('dateOfApprovalNepaliTrans').value
            );
        }
        // SET CT VALUE FOR DATE OF APPLICATION:
        this.interestSubsidy.get('dateOfApplicationTypeCT').patchValue(this.interestSubsidy.get('dateOfApplicationTypeTrans').value);
        if (this.ADApplication) {
            const tranApplicationDate = this.interestSubsidy.get('dateOfApplicationTrans').value;
            // const convertApplicationDate = !ObjectUtil.isEmpty(tranApplicationDate) ?
            //     this.englishCalenderPipe.transform(tranApplicationDate, true) : '';
            this.interestSubsidy.get('dateOfApplicationCT').patchValue(tranApplicationDate);
        }
        if (this.BSApplication) {
            this.interestSubsidy.get('dateOfApplicationNepaliCT').patchValue(
                this.interestSubsidy.get('dateOfApplicationNepaliTrans').value
            );
        }

        // SET CT VALUE FOR PREVIOUS SANCTION LETTER DATE:
        this.interestSubsidy.get('previousSanctionTypeCT').patchValue(this.interestSubsidy.get('previousSanctionTypeTrans').value);
        if (this.ADPrevious) {
            const transPreviousSanction = this.interestSubsidy.get('previousSanctionDateTrans').value;
            // const convertPreviousSanction = !ObjectUtil.isEmpty(transPreviousSanction) ?
            //     this.englishCalenderPipe.transform(transPreviousSanction, true) : '';
            this.interestSubsidy.get('previousSanctionDateCT').patchValue(transPreviousSanction);
        }
        if (this.BSPrevious) {
            this.interestSubsidy.get('previousSanctionDateNepaliCT').patchValue(
                this.interestSubsidy.get('previousSanctionDateNepaliTrans').value
            );
        }
        this.interestSubsidy.get('purposeOfLoanCT').patchValue(this.interestSubsidy.get('purposeOfLoanTrans').value);
        this.interestSubsidy.get('marginInPercentageCT').patchValue(this.interestSubsidy.get('marginInPercentageTrans').value);
        this.interestSubsidy.get('marginInPercentageMotorCT').patchValue(this.interestSubsidy.get('marginInPercentageMotorTrans').value);
        this.interestSubsidy.get('marginInPercentageFootCT').patchValue(this.interestSubsidy.get('marginInPercentageFootTrans').value);
        this.interestSubsidy.get('baseRateCT').patchValue(this.interestSubsidy.get('baseRateTrans').value);
        this.interestSubsidy.get('premiumRateCT').patchValue(this.interestSubsidy.get('premiumRateTrans').value);
        this.interestSubsidy.get('interestRateCT').patchValue(this.interestSubsidy.get('interestRateTrans').value);
        this.interestSubsidy.get('totalTenureOfLoanCT').patchValue(this.interestSubsidy.get('totalTenureOfLoanTrans').value);
        this.interestSubsidy.get('totalLimitFigureCT').patchValue(this.interestSubsidy.get('totalLimitFigureTrans').value);
        this.interestSubsidy.get('totalLimitWordsCT').patchValue(this.interestSubsidy.get('totalLimitWordsTrans').value);
        // this.interestSubsidy.get('circularRateCT').patchValue(this.interestSubsidy.get('circularRateTrans').value);
        this.interestSubsidy.get('nameOfStaffCT').patchValue(this.interestSubsidy.get('nameOfStaffTrans').value);
        this.interestSubsidy.get('nameOfBranchManagerCT').patchValue(this.interestSubsidy.get('nameOfBranchManagerTrans').value);
        this.interestSubsidy.get('loanSubTypeCT').patchValue(this.interestSubsidy.get('loanSubTypeTrans').value);
    }

    clearSecurityMunType(controlName, index, formArrayName) {
        const tempVal = this.interestSubsidy.get([formArrayName, index, 'securityOwnersMunicipalityOrVdc']).value;
        if (tempVal === 'VDC') {
            this.interestSubsidy.get([formArrayName, index, controlName]).setValue(null);
        }
    }

    clearConditionalValidation() {
        // Clear validation of date of approval:
        if (this.BSApproval) {
            this.interestSubsidy.get('dateOfApprovalCT').clearValidators();
            this.interestSubsidy.get('dateOfApprovalCT').updateValueAndValidity();
        } else {
            this.interestSubsidy.get('dateOfApprovalNepaliCT').clearValidators();
            this.interestSubsidy.get('dateOfApprovalNepaliCT').updateValueAndValidity();
        }

        // Clear Validation for Date of Application:
        if (this.BSApplication) {
            this.interestSubsidy.get('dateOfApplicationCT').clearValidators();
            this.interestSubsidy.get('dateOfApplicationCT').updateValueAndValidity();
        } else {
            this.interestSubsidy.get('dateOfApplicationNepaliCT').clearValidators();
            this.interestSubsidy.get('dateOfApplicationNepaliCT').updateValueAndValidity();
        }

        // Clear validation of Previous Sanction letter date:
        const tempSelOption = this.interestSubsidy.get('loanOption').value;
        if (tempSelOption === this.cusLoanType.EXISTING) {
            if (this.BSPrevious) {
                this.interestSubsidy.get('previousSanctionDateCT').clearValidators();
                this.interestSubsidy.get('previousSanctionDateCT').updateValueAndValidity();
            } else {
                this.interestSubsidy.get('previousSanctionDateNepaliCT').clearValidators();
                this.interestSubsidy.get('previousSanctionDateNepaliCT').updateValueAndValidity();
            }
        } else {
            this.interestSubsidy.get('previousSanctionDateCT').clearValidators();
            this.interestSubsidy.get('previousSanctionDateCT').updateValueAndValidity();
            this.interestSubsidy.get('previousSanctionDateNepaliCT').clearValidators();
            this.interestSubsidy.get('previousSanctionDateNepaliCT').updateValueAndValidity();
        }
    }

    submit() {
        this.submitted = true;
        const tempSecurityDetails = this.getSecurityData();
        this.tdVal['securities'] = tempSecurityDetails;
        const tempRequiredDocuments = this.setRequiredDocuments();
        this.tdVal['requiredDocuments'] = tempRequiredDocuments;
        // Setting securityDetails in securities key:
        // this.tdVal['securities'] = this.interestSubsidy.get('securities').value;
        this.spinner = true;
        // Clearing validation from optional fields:
        this.clearConditionalValidation();
        const invalidControls = [];
        const controls = this.interestSubsidy.controls;
        for (const name in controls) {
            if (controls[name].invalid) {
                invalidControls.push(this.titleCasePipe.transform(name).replace('CT', '').replace('Trans', ''));
            }
        }
        if (this.interestSubsidy.invalid) {
            this.toastService.show(new Alert(AlertType.DANGER, 'Please Check validation For : \n' + invalidControls.filter((
                value, index, self) => self.indexOf(value) === index).join(', ')));
            this.spinner = false;
            return;
        }
        this.customerApprovedDoc.docStatus = this.cadDocStatus[0];

        if (this.customerApprovedDoc.offerDocumentList.length > 0) {
            this.offerLetterDocument = this.customerApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
                === this.offerLetterConst.value(this.offerLetterConst.INTEREST_SUBSIDY_SANCTION_LETTER).toString())[0];
            if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
                this.customerApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
                    if (offerLetterPath.docName.toString() ===
                        this.offerLetterConst.value(this.offerLetterConst.INTEREST_SUBSIDY_SANCTION_LETTER).toString()) {
                        offerLetterPath.initialInformation = JSON.stringify(this.tdVal);
                    }
                });
            }
        } else {
            const offerDocument = new OfferDocument();
            offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.INTEREST_SUBSIDY_SANCTION_LETTER);
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

    openPreviewModal() {
        this.dialogService.open(InterestSubsidySanctionLetterComponent, {
            closeOnBackdropClick: false,
            hasBackdrop: false,
            hasScroll: true,
            dialogClass: 'modal-full',
            context: {
                cadOfferLetterApprovedDoc: this.customerApprovedDoc
            }
        });
    }

    public municipalityByDistrictIdForEdit(data, index?): void {
        const district = new District();
        district.id = data;
        this.addressService.getMunicipalityVDCByDistrict(district).subscribe(
            (response: any) => {
                this.municipalityListForSecurities[index] = response.detail;
                this.municipalityListForSecurities[index].sort((a, b) => a.name.localeCompare(b.name));

            }
        );
    }

    /* SET INTEREST SUBSIDY OFFER LETTER DATA */
    setInterestSubsidyTemplateData() {
        // SET EN VALUE OF OFFER LETTER:
        this.interestSubsidy.get('loanOption').patchValue(this.initialInformation.loanOption.en);
        this.interestSubsidy.get('repaymentType').patchValue(this.initialInformation.repaymentType.en);
        const tempInterestSubsidy = this.initialInformation.interestSubsidy ?
            this.initialInformation.interestSubsidy.en : '';
        if (!ObjectUtil.isEmpty(tempInterestSubsidy)) {
            this.isInterestSubsidy = true;
            this.interestSubsidy.get('interestSubsidy').patchValue(tempInterestSubsidy);
        }
        // Set Security Type
        const tempSecurityType = this.initialInformation.securityType ?
            this.initialInformation.securityType.en : '';
        if (tempSecurityType === 'LAND' || tempSecurityType === 'LAND & BUILDING') {
            this.showSecurity = true;
        } else {
            this.showSecurity = false;
        }
        this.interestSubsidy.get('securityType').patchValue(tempSecurityType);
        // SET DATE OF APPROVAL IN FORM:
        this.interestSubsidy.get('dateOfApprovalType').patchValue(this.initialInformation.dateOfApprovalType.en);
        const approvalType = this.initialInformation.dateOfApprovalType ?
            this.initialInformation.dateOfApprovalType.en : '';
        if (approvalType === 'AD') {
            const tempEngApprovalDate = this.initialInformation.dateOfApproval ?
                this.initialInformation.dateOfApproval.en : '';
            this.interestSubsidy.get('dateOfApproval').patchValue(new Date(tempEngApprovalDate));
        } else {
            const tempNepApprovalDate = this.initialInformation.dateOfApprovalNepali ?
                this.initialInformation.dateOfApprovalNepali.en : '';
            this.interestSubsidy.get('dateOfApprovalNepali').patchValue(tempNepApprovalDate);
        }

        // SET DATE OF APPLICATION IN FORM:
        const applicationDateType = this.initialInformation.dateOfApplicationType ?
            this.initialInformation.dateOfApplicationType.en : '';
        this.interestSubsidy.get('dateOfApplicationType').patchValue(applicationDateType);
        if (applicationDateType === 'AD') {
            const tempEngAppDate = this.initialInformation.dateOfApplication ?
                this.initialInformation.dateOfApplication.en : '';
            this.interestSubsidy.get('dateOfApplication').patchValue(new Date(tempEngAppDate));
        } else {
            const tempNepAppDate = this.initialInformation.dateOfApplicationNepali ?
                this.initialInformation.dateOfApplicationNepali.en : '';
            this.interestSubsidy.get('dateOfApplicationNepali').patchValue(tempNepAppDate);
        }

        // SET DATE OF APPLICATION IN FORM:
        const previousSancType = this.initialInformation.previousSanctionType ?
            this.initialInformation.previousSanctionType.en : '';
        this.interestSubsidy.get('previousSanctionType').patchValue(previousSancType);
        if (previousSancType === 'AD') {
            const tempPrevSancDate = this.initialInformation.previousSanctionDate ?
                this.initialInformation.previousSanctionDate.en : '';
            this.interestSubsidy.get('previousSanctionDate').patchValue(new Date(tempPrevSancDate));
        } else {
            const tempNepPrevSancDate = this.initialInformation.previousSanctionDateNepali ?
                this.initialInformation.previousSanctionDateNepali.en : '';
            this.interestSubsidy.get('previousSanctionDateNepali').patchValue(tempNepPrevSancDate);
        }
        // SET VALUES FOR THE REST OF THE FIELDS
        // this.interestSubsidy.get('dateOfApproval').patchValue(this.initialInformation.dateOfApproval.en);
        // this.interestSubsidy.get('dateOfApprovalNepali').patchValue(this.initialInformation.dateOfApprovalNepali.en);
        // this.interestSubsidy.get('dateOfApplicationType').patchValue(this.initialInformation.dateOfApplicationType.en);
        // this.interestSubsidy.get('dateOfApplication').patchValue(this.initialInformation.dateOfApplication.en);
        // this.interestSubsidy.get('dateOfApplicationNepali').patchValue(this.initialInformation.dateOfApplicationNepali.en);
        // this.interestSubsidy.get('previousSanctionType').patchValue(this.initialInformation.previousSanctionType.en);
        // this.interestSubsidy.get('previousSanctionDate').patchValue(this.initialInformation.previousSanctionDate.en);
        // this.interestSubsidy.get('previousSanctionDateNepali').patchValue(this.initialInformation.previousSanctionDateNepali.en);
        this.interestSubsidy.get('purposeOfLoan').patchValue(this.initialInformation.purposeOfLoan.en);
        this.interestSubsidy.get('marginInPercentage').patchValue(this.initialInformation.marginInPercentage.en);
        this.interestSubsidy.get('marginInPercentageMotor').patchValue(this.initialInformation.marginInPercentageMotor.en);
        this.interestSubsidy.get('marginInPercentageFoot').patchValue(this.initialInformation.marginInPercentageFoot.en);
        this.interestSubsidy.get('baseRate').patchValue(this.initialInformation.baseRate.en);
        this.interestSubsidy.get('premiumRate').patchValue(this.initialInformation.premiumRate.en);
        this.interestSubsidy.get('interestRate').patchValue(this.initialInformation.interestRate.en);
        this.interestSubsidy.get('totalTenureOfLoan').patchValue(this.initialInformation.totalTenureOfLoan.en);
        this.interestSubsidy.get('totalLimitFigure').patchValue(this.initialInformation.totalLimitFigure.en);
        this.interestSubsidy.get('totalLimitWords').patchValue(this.initialInformation.totalLimitWords.en);
        // this.interestSubsidy.get('circularRate').patchValue(this.initialInformation.circularRate.en);
        this.interestSubsidy.get('nameOfStaff').patchValue(this.initialInformation.nameOfStaff.en);
        this.interestSubsidy.get('nameOfBranchManager').patchValue(this.initialInformation.nameOfBranchManager.en);
        this.tempLoanSubType = this.initialInformation.loanSubType ?
            this.initialInformation.loanSubType.en : '';
        this.interestSubsidy.get('loanSubType').patchValue(
            this.initialInformation.loanSubType.en.eData
            + ' || ' + this.initialInformation.loanSubType.en.nData
        );

        // SET TRANSLATED VALUE OF OFFER LETTER:
        this.interestSubsidy.get('loanOptionTrans').patchValue(this.initialInformation.loanOption.np);
        this.interestSubsidy.get('repaymentTypeTrans').patchValue(this.initialInformation.repaymentType.np);
        this.interestSubsidy.get('interestSubsidyTrans').patchValue(this.initialInformation.interestSubsidy.np);
        this.interestSubsidy.get('securityTypeTrans').patchValue(this.initialInformation.securityType.np);
        this.interestSubsidy.get('dateOfApprovalTypeTrans').patchValue(this.initialInformation.dateOfApprovalType.np);
        this.interestSubsidy.get('dateOfApprovalTrans').patchValue(this.initialInformation.dateOfApproval.np);
        this.interestSubsidy.get('dateOfApprovalNepaliTrans').patchValue(this.initialInformation.dateOfApprovalNepali.np);
        this.interestSubsidy.get('dateOfApplicationTypeTrans').patchValue(this.initialInformation.dateOfApplicationType.np);
        this.interestSubsidy.get('dateOfApplicationTrans').patchValue(this.initialInformation.dateOfApplication.np);
        this.interestSubsidy.get('dateOfApplicationNepaliTrans').patchValue(this.initialInformation.dateOfApplicationNepali.np);
        this.interestSubsidy.get('previousSanctionTypeTrans').patchValue(this.initialInformation.previousSanctionType.np);
        this.interestSubsidy.get('previousSanctionDateTrans').patchValue(this.initialInformation.previousSanctionDate.np);
        this.interestSubsidy.get('previousSanctionDateNepaliTrans').patchValue(this.initialInformation.previousSanctionDateNepali.np);
        this.interestSubsidy.get('purposeOfLoanTrans').patchValue(this.initialInformation.purposeOfLoan.np);
        this.interestSubsidy.get('marginInPercentageTrans').patchValue(this.initialInformation.marginInPercentage.np);
        this.interestSubsidy.get('marginInPercentageMotorTrans').patchValue(this.initialInformation.marginInPercentageMotor.np);
        this.interestSubsidy.get('marginInPercentageFootTrans').patchValue(this.initialInformation.marginInPercentageFoot.np);
        this.interestSubsidy.get('baseRateTrans').patchValue(this.initialInformation.baseRate.np);
        this.interestSubsidy.get('premiumRateTrans').patchValue(this.initialInformation.premiumRate.np);
        this.interestSubsidy.get('interestRateTrans').patchValue(this.initialInformation.interestRate.np);
        this.interestSubsidy.get('totalTenureOfLoanTrans').patchValue(this.initialInformation.totalTenureOfLoan.np);
        this.interestSubsidy.get('totalLimitFigureTrans').patchValue(this.initialInformation.totalLimitFigure.np);
        this.interestSubsidy.get('totalLimitWordsTrans').patchValue(this.initialInformation.totalLimitWords.np);
        // this.interestSubsidy.get('circularRateTrans').patchValue(this.initialInformation.circularRate.np);
        this.interestSubsidy.get('nameOfStaffTrans').patchValue(this.initialInformation.nameOfStaff.np);
        this.interestSubsidy.get('nameOfBranchManagerTrans').patchValue(this.initialInformation.nameOfBranchManager.np);
        this.interestSubsidy.get('loanSubTypeTrans').patchValue(this.initialInformation.loanSubType.np);

        // SET CT VALUE OF OFFER LETTER:
        this.interestSubsidy.get('loanOptionCT').patchValue(this.initialInformation.loanOption.ct);
        this.interestSubsidy.get('repaymentTypeCT').patchValue(this.initialInformation.repaymentType.ct);
        this.interestSubsidy.get('interestSubsidyCT').patchValue(this.initialInformation.interestSubsidy.ct);
        this.interestSubsidy.get('securityTypeCT').patchValue(this.initialInformation.securityType.ct);
        this.interestSubsidy.get('dateOfApprovalTypeCT').patchValue(this.initialInformation.dateOfApprovalType.ct);
        this.interestSubsidy.get('dateOfApprovalCT').patchValue(this.initialInformation.dateOfApproval.ct);
        this.interestSubsidy.get('dateOfApprovalNepaliCT').patchValue(this.initialInformation.dateOfApprovalNepali.ct);
        this.interestSubsidy.get('dateOfApplicationTypeCT').patchValue(this.initialInformation.dateOfApplicationType.ct);
        this.interestSubsidy.get('dateOfApplicationCT').patchValue(this.initialInformation.dateOfApplication.ct);
        this.interestSubsidy.get('dateOfApplicationNepaliCT').patchValue(this.initialInformation.dateOfApplicationNepali.ct);
        this.interestSubsidy.get('previousSanctionTypeCT').patchValue(this.initialInformation.previousSanctionType.ct);
        this.interestSubsidy.get('previousSanctionDateCT').patchValue(this.initialInformation.previousSanctionDate.ct);
        this.interestSubsidy.get('previousSanctionDateNepaliCT').patchValue(this.initialInformation.previousSanctionDateNepali.ct);
        this.interestSubsidy.get('purposeOfLoanCT').patchValue(this.initialInformation.purposeOfLoan.ct);
        this.interestSubsidy.get('marginInPercentageCT').patchValue(this.initialInformation.marginInPercentage.ct);
        this.interestSubsidy.get('marginInPercentageMotorCT').patchValue(this.initialInformation.marginInPercentageMotor.ct);
        this.interestSubsidy.get('marginInPercentageFootCT').patchValue(this.initialInformation.marginInPercentageFoot.ct);
        this.interestSubsidy.get('baseRateCT').patchValue(this.initialInformation.baseRate.ct);
        this.interestSubsidy.get('premiumRateCT').patchValue(this.initialInformation.premiumRate.ct);
        this.interestSubsidy.get('interestRateCT').patchValue(this.initialInformation.interestRate.ct);
        this.interestSubsidy.get('totalTenureOfLoanCT').patchValue(this.initialInformation.totalTenureOfLoan.ct);
        this.interestSubsidy.get('totalLimitFigureCT').patchValue(this.initialInformation.totalLimitFigure.ct);
        this.interestSubsidy.get('totalLimitWordsCT').patchValue(this.initialInformation.totalLimitWords.ct);
        // this.interestSubsidy.get('circularRateCT').patchValue(this.initialInformation.circularRate.ct);
        this.interestSubsidy.get('nameOfStaffCT').patchValue(this.initialInformation.nameOfStaff.ct);
        this.interestSubsidy.get('nameOfBranchManagerCT').patchValue(this.initialInformation.nameOfBranchManager.ct);
        this.interestSubsidy.get('loanSubTypeCT').patchValue(this.initialInformation.loanSubType.ct);

       /* // SETTING SECURITY DETAILS:
        if (!ObjectUtil.isEmpty(this.initialInformation.securities)) {
            this.securities = this.initialInformation.securities;
            this.setSecurityData();
        }*/
    }

    /*setSecurityData(): void {
        const securityFormArr = this.interestSubsidy.get('securities') as FormArray;
        this.securities.forEach((val, index) => {
            if (!ObjectUtil.isEmpty(val.securityOwnersDistrict)) {
                this.municipalityByDistrictIdForEdit(val.securityOwnersDistrict.id, index);
            }
            securityFormArr.push(
                this.formBuilder.group({
                    securityOwnersName: [val.securityOwnersName],
                    securityOwnersMunicipalityOrVdc: [val.securityOwnersMunicipalityOrVdc],
                    securityOwnersMunicipality: [val.securityOwnersMunicipality],
                    securityOwnersDistrict: [val.securityOwnersDistrict],
                    securityOwnersWardNo: [val.securityOwnersWardNo],
                    securityOwnersPlotNo: [val.securityOwnersPlotNo],
                    securityOwnersLandArea: [val.securityOwnersLandArea],
                    securityOwnersSheetNo: [val.securityOwnersSheetNo],
                    // TRANSLATION FIELD OF SECURITY:
                    securityOwnersNameTrans: [val.securityOwnersNameTrans],
                    securityOwnersDistrictTrans: [val.securityOwnersDistrictTrans],
                    securityOwnersMunicipalityTrans: [val.securityOwnersMunicipalityTrans],
                    securityOwnersWardNoTrans: [val.securityOwnersWardNoTrans],
                    securityOwnersPlotNoTrans: [val.securityOwnersPlotNoTrans],
                    securityOwnersLandAreaTrans: [val.securityOwnersLandAreaTrans],
                    securityOwnersSheetNoTrans: [val.securityOwnersSheetNoTrans],
                    // CT FIELDS OF SECURITY
                    securityOwnersNameCT: [val.securityOwnersNameCT],
                    securityOwnersDistrictCT: [val.securityOwnersDistrictCT],
                    securityOwnersMunicipalityCT: [val.securityOwnersMunicipalityCT],
                    securityOwnersWardNoCT: [val.securityOwnersWardNoCT],
                    securityOwnersPlotNoCT: [val.securityOwnersPlotNoCT],
                    securityOwnersLandAreaCT: [val.securityOwnersLandAreaCT],
                    securityOwnersSheetNoCT: [val.securityOwnersSheetNoCT],
                })
            );
        });
    }*/

    getSecurityData() {
        const primarySecurity = this.commonSecuritySectionPrimaryComponent.commonPrimarySecurity.value.securityDetails;
        const secondarySecurity = this.commonSecuritySectionSecondaryComponent.commonSecondarySecurity.value.securityDetails;
        const allData = {
            primarySecurity: primarySecurity,
            secondarySecurity: secondarySecurity
        };
        return (allData);
    }
    private setRequiredDocuments() {
        const requiredLegalDocument = this.requiredLegalDocumentSectionComponent.requireDocumentForm.value;
        const requiredData = {
            requiredLegalDocument: requiredLegalDocument,
        };
        return (requiredData);
    }
    compareFn(c1: any, c2: any): boolean {
        return c1 && c2 ? c1.id === c2.id : c1 === c2;
    }
}
