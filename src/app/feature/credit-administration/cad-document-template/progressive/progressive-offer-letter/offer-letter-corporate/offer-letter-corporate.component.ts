import {Component, Input, OnInit} from '@angular/core';
import {Form, FormArray, FormBuilder, FormGroup} from '@angular/forms';
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
import {NepDataPersonal} from '../../../../model/nepDataPersonal';

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
    isHP = false;
    isLandAndBuilding = false;
    offerLetterDocument: OfferDocument;
    nepaliData;
    nepDataPersonal = new NepDataPersonal();
    primaryCollaterals = new Array<any>();
    secondaryCollaterals = new Array<any>();
    additionalGuarantor = new Array<any>();

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
        this.nepaliData = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
        this.nepDataPersonal = JSON.parse(this.cadOfferLetterApprovedDoc.nepDataPersonal);

        (this.nepaliData.collateralDetails).forEach(value => {
            if (value.securityDetails === 'HP') {
                this.primaryCollaterals.push(value);
                this.isHP = true;
            }
        });
        (this.nepaliData.collateralDetails).forEach(value => {
            if (value.securityDetails === 'Land_And_Building') {
                this.secondaryCollaterals.push(value);
                this.isLandAndBuilding = true;
            }
        });
        this.buildForm();
        this.checkOfferLetter();
        this.fillForm();
        if (ObjectUtil.isEmpty(this.initialInfoPrint)) {
            this.addLoan();
        }
        if (!ObjectUtil.isEmpty(this.initialInfoPrint) && ObjectUtil.isEmpty(this.initialInfoPrint.loan)) {
            this.addLoan();
        }
        this.setSecondarySecurityDetails(this.secondaryCollaterals);
        this.setPrimaryCollaterals(this.primaryCollaterals);
        this.setAdditionalGuarantor(this.nepaliData.guarantorDetails);
    }

    fillForm() {
        let guarantorName = '';
        if (this.nepaliData.guarantorDetails.length > 0) {
            if (this.nepaliData.guarantorDetails.length === 1) {
                guarantorName = !ObjectUtil.isEmpty(this.nepaliData.guarantorDetails[0].guarantorName) ?
                    this.nepaliData.guarantorDetails[0].guarantorName :
                    (!ObjectUtil.isEmpty(this.nepaliData.guarantorDetails[0].companyNameGuarantor) ?
                        this.nepaliData.guarantorDetails[0].companyNameGuarantor : '');
            }
            if (this.nepaliData.guarantorDetails.length === 2) {
                guarantorName = !ObjectUtil.isEmpty(this.nepaliData.guarantorDetails[0].guarantorName) ?
                    this.nepaliData.guarantorDetails[0].guarantorName :
                    (!ObjectUtil.isEmpty(this.nepaliData.guarantorDetails[0].companyNameGuarantor) ?
                        this.nepaliData.guarantorDetails[0].companyNameGuarantor : '') + ' र ' +
                    !ObjectUtil.isEmpty(this.nepaliData.guarantorDetails[1].guarantorName) ?
                        this.nepaliData.guarantorDetails[1].guarantorName :
                        (!ObjectUtil.isEmpty(this.nepaliData.guarantorDetails[1].companyNameGuarantor) ?
                            this.nepaliData.guarantorDetails[1].companyNameGuarantor : '');
            }
            if (this.nepaliData.guarantorDetails.length > 2) {
                guarantorName = !ObjectUtil.isEmpty(this.nepaliData.guarantorDetails[0].guarantorName) ?
                    this.nepaliData.guarantorDetails[0].guarantorName :
                    (!ObjectUtil.isEmpty(this.nepaliData.guarantorDetails[0].companyNameGuarantor) ?
                        this.nepaliData.guarantorDetails[0].companyNameGuarantor : '') + ' , ' +
                    !ObjectUtil.isEmpty(this.nepaliData.guarantorDetails[1].guarantorName) ?
                        this.nepaliData.guarantorDetails[1].guarantorName :
                        (!ObjectUtil.isEmpty(this.nepaliData.guarantorDetails[1].companyNameGuarantor) ?
                            this.nepaliData.guarantorDetails[1].companyNameGuarantor : '') + ' र ' +
                        !ObjectUtil.isEmpty(this.nepaliData.guarantorDetails[2].guarantorName) ?
                        this.nepaliData.guarantorDetails[2].guarantorName :
                        (!ObjectUtil.isEmpty(this.nepaliData.guarantorDetails[2].companyNameGuarantor) ?
                            this.nepaliData.guarantorDetails[2].companyNameGuarantor : '');
            }
        }
        const customerAddress =
            this.nepaliData.companyDistrict + ', ' +
            this.nepaliData.companyVdcMun + ', ' +
            this.nepaliData.companyWardNo;

        this.form.patchValue({
            amount: [!ObjectUtil.isEmpty(this.nepDataPersonal.numberNepali) ? this.nepDataPersonal.numberNepali : ''],
            amountInWords: [!ObjectUtil.isEmpty(this.nepDataPersonal.nepaliWords) ? this.nepDataPersonal.nepaliWords : ''],
            customerName: !ObjectUtil.isEmpty(this.nepaliData.companyName) ? this.nepaliData.companyName : '',
            customerAddress: customerAddress ? customerAddress : '',
            shreeName: !ObjectUtil.isEmpty(this.nepaliData.representativeName) ? this.nepaliData.representativeName : '',
            dhitoLekhi: [!ObjectUtil.isEmpty(this.nepDataPersonal.numberNepali) ? this.nepDataPersonal.numberNepali : ''],
            dhitoDate : [!ObjectUtil.isEmpty(this.nepaliData.valuationDate) ? this.nepaliData.valuationDate : ''],
            dhitoAuditor : [!ObjectUtil.isEmpty(this.nepaliData.valuatorName) ? this.nepaliData.valuatorName : ''],
            dhitoAmount : [!ObjectUtil.isEmpty(this.nepaliData.fairMarketValue) ? this.nepaliData.fairMarketValue : ''],
            dhitoDistress : [!ObjectUtil.isEmpty(this.nepaliData.distressValue) ? this.nepaliData.distressValue : ''],
            shreeName1 : [guarantorName ? guarantorName : ''],
            financeBranch: [!ObjectUtil.isEmpty(this.nepaliData.branchName) ? this.nepaliData.branchName : ''],
            financeMunicipality: [!ObjectUtil.isEmpty(this.nepaliData.branchMunVdc) ? this.nepaliData.branchMunVdc : ''],
            employeeFinanceBranch: [!ObjectUtil.isEmpty(this.nepaliData.branchName) ? this.nepaliData.branchName : ''],
            employeeFinanceDistrict: [!ObjectUtil.isEmpty(this.nepaliData.branchDistrict) ? this.nepaliData.branchDistrict : ''],
            employeeFinanceBranch2: [!ObjectUtil.isEmpty(this.nepaliData.branchName) ? this.nepaliData.branchName : ''],
            employeeFinanceDistrict2: [!ObjectUtil.isEmpty(this.nepaliData.branchDistrict) ? this.nepaliData.branchDistrict : ''],
            financeWardNum: [!ObjectUtil.isEmpty(this.nepaliData.branchWardNo) ? this.nepaliData.branchWardNo : ''],
            financeDistrict: [!ObjectUtil.isEmpty(this.nepaliData.branchDistrict) ? this.nepaliData.branchDistrict : ''],
            financeTelephoneNum: [!ObjectUtil.isEmpty(this.nepaliData.branchTelNo) ? this.nepaliData.branchTelNo : ''],
            financeFaxNum: [!ObjectUtil.isEmpty(this.nepaliData.branchFaxNo) ? this.nepaliData.branchFaxNo : ''],
            financeEmail: [!ObjectUtil.isEmpty(this.nepaliData.branchEmail) ? this.nepaliData.branchEmail : ''],
            customerMunicipality: [!ObjectUtil.isEmpty(this.nepaliData.companyVdcMun) ? this.nepaliData.companyVdcMun : ''],
            customerWardNum: [!ObjectUtil.isEmpty(this.nepaliData.companyWardNo) ? this.nepaliData.companyWardNo : ''],
            customerDistrict: [!ObjectUtil.isEmpty(this.nepaliData.companyDistrict) ? this.nepaliData.companyDistrict : ''],
            akhtiyarName: [!ObjectUtil.isEmpty(this.nepaliData.representativeName) ? this.nepaliData.representativeName : ''],
            signatoryName: [!ObjectUtil.isEmpty(this.nepaliData.representativeName) ? this.nepaliData.representativeName : ''],
            signatoryCitizenshipNum: [!ObjectUtil.isEmpty(this.nepaliData.representativeCitizenshipNo) ?
                this.nepaliData.representativeCitizenshipNo : ''],
            signatoryCitizenshipIssueDate: [!ObjectUtil.isEmpty(this.nepaliData.representativeCitizenshipIssueDate) ?
                this.nepaliData.representativeCitizenshipIssueDate : ''],
            signatoryCitizenshipIssuePlace: [!ObjectUtil.isEmpty(this.nepaliData.representativeCitizenshipIssuingAuthority) ?
                this.nepaliData.representativeCitizenshipIssuingAuthority : ''],
            akhtiyarName2: [!ObjectUtil.isEmpty(this.nepaliData.representativePermanentDistrict) ?
                this.nepaliData.representativePermanentDistrict : ''],
            akhtiyarMunicipality2: [!ObjectUtil.isEmpty(this.nepaliData.representativePermanentVdc) ?
                this.nepaliData.representativePermanentVdc : ''],
            akhtiyarWardNum2: [!ObjectUtil.isEmpty(this.nepaliData.representativePermanentVdcWard) ?
                this.nepaliData.representativePermanentVdcWard : ''],
            signatoryGrandParentName: [!ObjectUtil.isEmpty(this.nepaliData.representativeGrandFatherName) ?
                this.nepaliData.representativeGrandFatherName : ''],
            signatoryParentName: [!ObjectUtil.isEmpty(this.nepaliData.representativeFatherName) ?
                this.nepaliData.representativeFatherName : ''],
            bottomDate: !ObjectUtil.isEmpty(this.initialInfoPrint) ?
                !ObjectUtil.isEmpty(this.initialInfoPrint.bottomDate) ? this.initialInfoPrint.bottomDate : '' : '',
            bottomPatraNum: !ObjectUtil.isEmpty(this.initialInfoPrint) ?
                !ObjectUtil.isEmpty(this.initialInfoPrint.bottomPatraNum) ?  this.initialInfoPrint.bottomPatraNum : '' : '',
            isLandAndBuilding: this.isLandAndBuilding,
            isHP: this.isHP
        });

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
            if (!ObjectUtil.isEmpty(this.initialInfoPrint) && !ObjectUtil.isEmpty(this.initialInfoPrint.loan)) {
                this.setLoan(initialInfo.loan);
            }
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

    setSecondarySecurityDetails(data) {
        const formArray = this.form.get('securityDetails') as FormArray;
        (this.form.get('securityDetails') as FormArray).clear();
        if (data.length === 0) {
            this.addEmptySecurityDetail();
            return;
        }
        data.forEach(value => {
            if (value.securityDetails === 'Land_And_Building') {
                const tempExistingAddress = value.collateralMunVdcOriginal + ', ' + value.collateralWardNoOld;
                formArray.push(this.formBuilder.group({
                    name: [!ObjectUtil.isEmpty(value.collateralName) ? value.collateralName : ''],
                    parentName: [!ObjectUtil.isEmpty(value.collateralFatherName) ? value.collateralFatherName : ''],
                    grandParentName: [!ObjectUtil.isEmpty(value.collateralGrandFatherName) ? value.collateralGrandFatherName : ''],
                    address: [!ObjectUtil.isEmpty(value.collateralPermanentMunVdc) ? value.collateralPermanentMunVdc.nepaliName : ''],
                    addressVDC: [!ObjectUtil.isEmpty(value.collateralPermanentVdc) ? value.collateralPermanentVdc : ''],
                    addressWard: [!ObjectUtil.isEmpty(value.collateralPermanentVdcWard) ? value.collateralPermanentVdcWard : ''],
                    jaggaDistrict: [!ObjectUtil.isEmpty(value.collateralDistrict) ? value.collateralDistrict : ''],
                    jaggaWard: [tempExistingAddress ? tempExistingAddress : ''],
                    jaggaKittaNum: [!ObjectUtil.isEmpty(value.plotNo) ? value.plotNo : ''],
                    jaggaArea: [!ObjectUtil.isEmpty(value.areaOfCollateral) ? value.areaOfCollateral : ''],
                    jaggaSiNum: [!ObjectUtil.isEmpty(value.seatNo) ? value.seatNo : ''],
                }));
            }
        });
    }

    setAdditionalGuarantor(data) {
        const formArray = this.form.get('additionalGuarantor') as FormArray;
        (this.form.get('additionalGuarantor') as FormArray).clear();
        data.forEach((value, i) => {
            if (value.guarantorType === 'Personal_Guarantor') {
                formArray.push(this.formBuilder.group({
                    guarantorType: [!ObjectUtil.isEmpty(value.guarantorType) ? value.guarantorType : ''],
                    tapsilGuarantorName: [!ObjectUtil.isEmpty(value.guarantorName) ? value.guarantorName : ''],
                    tapsilGuarantorCitizenshipNum: [!ObjectUtil.isEmpty(value.citizenNumber) ? value.citizenNumber : ''],
                    tapsilGuarantorCitizenshipIssueDate: [!ObjectUtil.isEmpty(value.issuedYear) ? value.issuedYear : ''],
                    tapsilGuarantorCitizenshipIssuePlace: [!ObjectUtil.isEmpty(value.issuedPlace) ? value.issuedPlace : ''],
                    tapsilGuarantorDistrict: [!ObjectUtil.isEmpty(value.guarantorPermanentDistrict) ?
                        value.guarantorPermanentDistrict.nepaliName : ''],
                    tapsilGuarantorMunicipality: [!ObjectUtil.isEmpty(value.guarantorPermanentVdc) ? value.guarantorPermanentVdc : ''],
                    tapsilGuarantorWardNum: [!ObjectUtil.isEmpty(value.guarantorPermanentVdcWard) ? value.guarantorPermanentVdcWard : ''],
                    tapsilGuarantorRelation: [!ObjectUtil.isEmpty(value.relationship) ? value.relationship : ''],
                    tapsilGuarantorInLawName: [!ObjectUtil.isEmpty(value.guarantorFatherInLawName) ? value.guarantorFatherInLawName : ''],
                    tapsilGuarantorSpouseName: [!ObjectUtil.isEmpty(value.guarantorSpouseName) ? value.guarantorSpouseName : ''],
                    tapsilGuarantorFatherName: [!ObjectUtil.isEmpty(value.guarantorFatherName) ? value.guarantorFatherName : ''],
                    tapsilGuarantorGrandFatherName: [!ObjectUtil.isEmpty(value.guarantorGrandfatherName) ?
                        value.guarantorGrandfatherName : ''],
                    tapsilGuarantorContactNum: [!ObjectUtil.isEmpty(value.guarantorMobileNumber) ? value.guarantorMobileNumber : ''],
                    tapsilGuarantorEmail: [!ObjectUtil.isEmpty(value.guarantorEmailAddress) ? value.guarantorEmailAddress : ''],
                    tapsilGuarantorDate: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
                        !ObjectUtil.isEmpty(this.initialInfoPrint.additionalGuarantor) ?
                            !ObjectUtil.isEmpty(this.initialInfoPrint.additionalGuarantor[i]) ?
                        this.initialInfoPrint.additionalGuarantor[i].tapsilGuarantorDate : '' : '' : ''],
                }));
            }
            if (value.guarantorType === 'Corporate_Guarantor') {
                formArray.push(this.formBuilder.group({
                    guarantorType: [!ObjectUtil.isEmpty(value.guarantorType) ? value.guarantorType : ''],
                    tapsilGuarantorName: [!ObjectUtil.isEmpty(value.companyNameGuarantor) ? value.companyNameGuarantor : ''],
                    companyPraName: [!ObjectUtil.isEmpty(value.representativeNameGuarantor) ? value.representativeNameGuarantor : ''],
                    tapsilGuarantorCitizenshipNum: [!ObjectUtil.isEmpty(value.representativeCitizenshipNoGuarantor) ?
                        value.representativeCitizenshipNoGuarantor : ''],
                    tapsilGuarantorCitizenshipIssueDate: [!ObjectUtil.isEmpty(value.representativeCitizenshipIssueDateGuarantor) ?
                        value.representativeCitizenshipIssueDateGuarantor : ''],
                    tapsilGuarantorCitizenshipIssuePlace:  [!ObjectUtil.isEmpty(value.representativeCitizenshipIssuingAuthorityGuarantor) ?
                        value.representativeCitizenshipIssuingAuthorityGuarantor : ''],
                    jamanatRegNo: [!ObjectUtil.isEmpty(value.companyRegistrationNoGuarantor) ? value.companyRegistrationNoGuarantor : ''],
                    jamanatRegDate: [!ObjectUtil.isEmpty(value.registrationDateGuarantor) ? value.registrationDateGuarantor : ''],
                    jamanatRegCDO: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
                        !ObjectUtil.isEmpty(this.initialInfoPrint.additionalGuarantor) ?
                            !ObjectUtil.isEmpty(this.initialInfoPrint.additionalGuarantor[i]) ?
                        this.initialInfoPrint.additionalGuarantor[i].jamanatRegCDO : '' : '' : ''],
                    tapsilGuarantorDistrict: [!ObjectUtil.isEmpty(value.representativePermanentDistrictGuarantor) ?
                        value.representativePermanentDistrictGuarantor : ''],
                    tapsilGuarantorMunicipality: [!ObjectUtil.isEmpty(value.representativePermanentMunicipalityGuarantor) ?
                        value.representativePermanentMunicipalityGuarantor : ''],
                    tapsilGuarantorWardNum: [!ObjectUtil.isEmpty(value.representativePermanentWardGuarantor) ?
                        value.representativePermanentWardGuarantor : ''],
                    tapsilGuarantorSpouseName: [!ObjectUtil.isEmpty(value.representativeHusbandWifeNameGuarantor) ?
                        value.representativeHusbandWifeNameGuarantor : ''],
                    tapsilGuarantorFatherName: [!ObjectUtil.isEmpty(value.representativeFatherNameGuarantor) ?
                        value.representativeFatherNameGuarantor : ''],
                    tapsilGuarantorGrandFatherName: [!ObjectUtil.isEmpty(value.representativeGrandFatherNameGuarantor) ?
                        value.representativeGrandFatherNameGuarantor : ''],
                    tapsilGuarantorContactNum: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
                        !ObjectUtil.isEmpty(this.initialInfoPrint.additionalGuarantor) ?
                            !ObjectUtil.isEmpty(this.initialInfoPrint.additionalGuarantor[i]) ?
                        this.initialInfoPrint.additionalGuarantor[i].tapsilGuarantorContactNum : '' : '' : ''],
                    tapsilGuarantorEmail: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
                        !ObjectUtil.isEmpty(this.initialInfoPrint.additionalGuarantor) ?
                            !ObjectUtil.isEmpty(this.initialInfoPrint.additionalGuarantor[i]) ?
                        this.initialInfoPrint.additionalGuarantor[i].tapsilGuarantorEmail : '' : '' : ''],
                    tapsilGuarantorDate: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
                        !ObjectUtil.isEmpty(this.initialInfoPrint.additionalGuarantor) ?
                            !ObjectUtil.isEmpty(this.initialInfoPrint.additionalGuarantor[i]) ?
                        this.initialInfoPrint.additionalGuarantor[i].tapsilGuarantorDate : '' : '' : ''],
                }));
            }
        });
    }

    setPrimaryCollaterals(data) {
        const formArray = this.form.get('primaryCollaterals') as FormArray;
        data.forEach((value, i) => {
            if (value.securityDetails === 'HP') {
                formArray.push(this.formBuilder.group({
                    vehicleType: [!ObjectUtil.isEmpty(value.vehicleType) ? value.vehicleType : ''],
                    vehicleNumber: [!ObjectUtil.isEmpty(value.vehicleNumber) ? value.vehicleNumber : ''],
                    vehicleModelNum: [!ObjectUtil.isEmpty(value.vehicleModelNum) ? value.vehicleModelNum : ''],
                    engineNumber: [!ObjectUtil.isEmpty(value.engineNumber) ? value.engineNumber : ''],
                    chassisNumber: [!ObjectUtil.isEmpty(value.chassisNumber) ? value.chassisNumber : ''],
                    vehicleQuotationPrice: [!ObjectUtil.isEmpty(value.vehicleQuotationPrice) ? value.vehicleQuotationPrice : ''],
                    marginPercentageOne: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
                        !ObjectUtil.isEmpty(this.initialInfoPrint.primaryCollaterals) ?
                            !ObjectUtil.isEmpty(this.initialInfoPrint.primaryCollaterals[i]) ?
                                this.initialInfoPrint.primaryCollaterals[i].marginPercentageOne : '' : '' : ''],
                    marginPercentageTwo: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
                        !ObjectUtil.isEmpty(this.initialInfoPrint.primaryCollaterals) ?
                            !ObjectUtil.isEmpty(this.initialInfoPrint.primaryCollaterals[i]) ?
                                this.initialInfoPrint.primaryCollaterals[i].marginPercentageTwo : '' : '' : ''],
                }));
            }
        });
    }

    buildSecurityDetail() {
        return this.formBuilder.group({
            name: [undefined],
            parentName: [undefined],
            grandParentName: [undefined],
            address: [undefined],
            jaggaDistrict: [undefined],
            jaggaWard: [undefined],
            jaggaKittaNum: [undefined],
            jaggaArea: [undefined],
            jaggaSiNum: [undefined],
        });
    }

    addEmptySecurityDetail() {
        (this.form.get('securityDetails') as FormArray).push(this.buildSecurityDetail());
    }

    removeSecurityDetail(index) {
        (this.form.get('securityDetails') as FormArray).removeAt(index);
    }

    removePrimaryCollateral(i: number) {
        (this.form.get('primaryCollaterals') as FormArray).removeAt(i);
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
            primaryCollaterals: this.formBuilder.array([]),
            additionalGuarantor: this.formBuilder.array([]),
            dhitoDate: [undefined],
            dhitoAuditor: [undefined],
            dhitoAmount: [undefined],
            dhitoDistress: [undefined],
            dhitoLekhi: [undefined],
            shreeName1: [undefined],
            shreeAmount: [undefined],
            shreeAmountInWord: [undefined],
            amount: [undefined],
            amountInWords: [undefined],
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
            freeText: [undefined],
            isLandAndBuilding: [false],
            isHP: [false]
        });
    }

    getNumAmountWord(numLabel, wordLabel) {
        const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
        const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
        this.form.get(wordLabel).patchValue(returnVal);
    }

    getLoanNumAmountWord(numLabel, wordLabel, i) {
        const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(['loan', i, numLabel]).value);
        const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
        this.form.get(['loan', i, wordLabel]).patchValue(returnVal);
    }

    calcYearlyRate(base, premium, discount, target, i) {
        const baseRate = this.nepToEngNumberPipe.transform(this.form.get(['loan', i, base]).value);
        const premiumRate = this.nepToEngNumberPipe.transform(this.form.get(['loan', i, premium]).value);
        const discountRate = this.nepToEngNumberPipe.transform(this.form.get(['loan', i, discount]).value);
        const addRate = parseFloat(baseRate) + parseFloat(premiumRate) - parseFloat(discountRate);
        const finalValue = this.engToNepaliNumberPipe.transform(this.currencyFormatPipe.transform(addRate));
        this.form.get(['loan', i, target]).patchValue(finalValue);
    }

    addLoan() {
        const formArray = this.form.get('loan') as FormArray;
        formArray.push(this.LoanFormGroup());
    }
    removeLoan(i) {
        const formArray = this.form.get('loan') as FormArray;
        formArray.removeAt(i);
    }


    LoanFormGroup(): FormGroup {
        return this.formBuilder.group({
            // loan Details
            loanTypeNepali: [!ObjectUtil.isEmpty(this.nepDataPersonal.loanType) ? this.nepDataPersonal.loanType : ''],
            loanTypeEnglish: [!ObjectUtil.isEmpty(this.nepDataPersonal.typeOfLoanInEnglish) ?
                this.nepDataPersonal.typeOfLoanInEnglish : ''],
            amount1: [!ObjectUtil.isEmpty(this.nepDataPersonal.numberNepali) ? this.nepDataPersonal.numberNepali : ''],
            amountInWords1: [!ObjectUtil.isEmpty(this.nepDataPersonal.nepaliWords) ? this.nepDataPersonal.nepaliWords : ''],
            loanPurpose: [!ObjectUtil.isEmpty(this.nepDataPersonal.purposeOfLoan) ? this.nepDataPersonal.purposeOfLoan : ''],
            interestRate: [!ObjectUtil.isEmpty(this.nepDataPersonal.interestRate) ? this.nepDataPersonal.interestRate : ''],
            interestRepayPlan: [!ObjectUtil.isEmpty(this.nepDataPersonal.interestInstallmentPaymentFrequency) ?
                this.nepDataPersonal.interestInstallmentPaymentFrequency : ''],
            loanLimitYearAD: [!ObjectUtil.isEmpty(this.nepDataPersonal.loanMaturityDateAD) ? this.nepDataPersonal.loanMaturityDateAD : ''],
            loanLimitYearBS: [!ObjectUtil.isEmpty(this.nepDataPersonal.loanMaturityDateBS) ? this.nepDataPersonal.loanMaturityDateBS : ''],
            loanLimitMonths: [!ObjectUtil.isEmpty(this.nepDataPersonal.tenureOfLoanInMonths) ?
                this.nepDataPersonal.tenureOfLoanInMonths : ''],
            // loan free text
            interestFinalRate: !ObjectUtil.isEmpty(this.nepDataPersonal.interestRate) ? this.nepDataPersonal.interestRate : '',
            interestBaseRate: !ObjectUtil.isEmpty(this.nepDataPersonal.baseRate) ? this.nepDataPersonal.baseRate : '',
            interestPremiumRate: !ObjectUtil.isEmpty(this.nepDataPersonal.premium) ? this.nepDataPersonal.premium : '',
            interestTempDiscountRate: !ObjectUtil.isEmpty(this.nepDataPersonal.discount) ? this.nepDataPersonal.discount : '',
            interestRepayMonths: [undefined],
            pratibadhataAdditionalAmount: [undefined],
            pratibadhataRate: [undefined],
            pratibadhataYearlyRate: [undefined],
            sthantarandRate: [undefined],
        });
    }

    setLoan(data) {
        const formArray = this.form.get('loan') as FormArray;
        data.forEach((val, i) => {
            formArray.push(this.formBuilder.group({
                // loan Details
                loanTypeNepali: [!ObjectUtil.isEmpty(val.loanTypeNepali) ? val.loanTypeNepali : ''],
                loanTypeEnglish: [!ObjectUtil.isEmpty(val.loanTypeEnglish) ? val.loanTypeEnglish : ''],
                amount1: [!ObjectUtil.isEmpty(val.amount1) ? val.amount1 : ''],
                amountInWords1: [!ObjectUtil.isEmpty(val.amountInWords1) ? val.amountInWords1 : ''],
                loanPurpose: [!ObjectUtil.isEmpty(val.loanPurpose) ? val.loanPurpose : ''],
                interestRate: [!ObjectUtil.isEmpty(val.interestRate) ? val.interestRate : ''],
                interestRepayPlan: [!ObjectUtil.isEmpty(val.interestRepayPlan) ? val.interestRepayPlan : ''],
                loanLimitYearAD: [!ObjectUtil.isEmpty(val.loanLimitYearAD) ? val.loanLimitYearAD : ''],
                loanLimitYearBS: [!ObjectUtil.isEmpty(val.loanLimitYearBS) ? val.loanLimitYearBS : ''],
                loanLimitMonths: [!ObjectUtil.isEmpty(val.loanLimitMonths) ?
                    val.loanLimitMonths : ''],
                // loan free text
             interestRepayMonths: [!ObjectUtil.isEmpty(val.interestRepayMonths) ? val.interestRepayMonths : ''],
             interestBaseRate: [!ObjectUtil.isEmpty(val.interestBaseRate) ? val.interestBaseRate : ''],
             interestPremiumRate: [!ObjectUtil.isEmpty(val.interestPremiumRate) ? val.interestPremiumRate : ''],
             interestTempDiscountRate: [!ObjectUtil.isEmpty(val.interestTempDiscountRate) ?
                 val.interestTempDiscountRate : ''],
             interestFinalRate: [!ObjectUtil.isEmpty(val.interestFinalRate) ? val.interestFinalRate : ''],
             pratibadhataAdditionalAmount: [!ObjectUtil.isEmpty(val.pratibadhataAdditionalAmount) ?
                 val.pratibadhataAdditionalAmount : ''],
             pratibadhataRate: [!ObjectUtil.isEmpty(val.pratibadhataRate) ? val.pratibadhataRate : ''],
             pratibadhataYearlyRate: [!ObjectUtil.isEmpty(val.pratibadhataYearlyRate) ?
                 val.pratibadhataYearlyRate : ''],
             sthantarandRate: [!ObjectUtil.isEmpty(val.sthantarandRate) ? val.sthantarandRate : ''],
            }));
        });
    }
}
