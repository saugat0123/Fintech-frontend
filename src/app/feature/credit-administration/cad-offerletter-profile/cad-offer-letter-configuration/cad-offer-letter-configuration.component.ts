import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CustomerInfoData} from '../../../loan/model/customerInfoData';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomerInfoService} from '../../../customer/service/customer-info.service';
import {ToastService} from '../../../../@core/utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {NbDialogRef} from '@nebular/theme';
import {EngToNepaliNumberPipe} from '../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CustomerService} from '../../../customer/service/customer.service';
import {Customer} from '../../../admin/modal/customer';
import {CustomerType} from '../../../customer/model/customerType';
import {DatePipe} from '@angular/common';
import {RelationshipNepali} from '../../../loan/model/relationshipListNepali';
import {Guarantor} from '../../../loan/model/guarantor';
import {GuarantorDetail} from '../../../loan/model/guarantor-detail';
import {CustomerApprovedLoanCadDocumentation} from '../../model/customerApprovedLoanCadDocumentation';
import {NepaliToEngNumberPipe} from '../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../@core/pipe/nepali-currency-word.pipe';
import {BranchService} from '../../../admin/component/branch/branch.service';

@Component({
    selector: 'app-cad-offer-letter-configuration',
    templateUrl: './cad-offer-letter-configuration.component.html',
    styleUrls: ['./cad-offer-letter-configuration.component.scss']
})
export class CadOfferLetterConfigurationComponent implements OnInit {

    @Input() customerInfo: CustomerInfoData;
    @Input() cadData: CustomerApprovedLoanCadDocumentation;
    @Input() guarantorDetail: GuarantorDetail;
    @Input() customer: Customer;
    @Output()
    customerInfoData: EventEmitter<CustomerInfoData> = new EventEmitter<CustomerInfoData>();
    guarantorList: Array<Guarantor>;
    userConfigForm: FormGroup;
    spinner = false;
    submitted = false;
    relationshipList = RelationshipNepali.enumObject();
    hideSaveBtn = false;
    guarantorTypeEnum = [
        {key: 'Personal_Guarantor', value: 'Personal Guarantor'},
        {key: 'Corporate_Guarantor', value: 'Corporate Guarantor'},
    ];
    collateralOwnerTypeEnum = [
        {key: 'INDIVIDUAL', value: 'INDIVIDUAL'},
        {key: 'INSTITUTION', value: 'INSTITUTION'},
    ];
    collateralTypeInstitutionEnum = [
        {key: 'land_and_building', value: 'Land and Building'},
        {key: 'stocks_receivables', value: 'Stocks/Receivables'},
        {key: 'plant_machinery_equipment', value: 'Plant/Machinery/Equipment'},
        {key: 'fixed_deposit', value: 'Fixed Deposit'},
        {key: 'vehicle', value: 'Vehicle'},
        {key: 'shares', value: 'Shares'},
    ];
    collateralTypeIndividualEnum = [
        {key: 'land_and_building', value: 'Land and Building'},
        {key: 'fixed_deposit', value: 'Fixed Deposit'},
        {key: 'vehicle', value: 'Vehicle'},
        {key: 'shares', value: 'Shares'},
    ];
    branchList;
    tempCustomer;

    constructor(private formBuilder: FormBuilder,
                private customerInfoService: CustomerInfoService,
                private customerService: CustomerService,
                private toastService: ToastService,
                private engToNepNumber: EngToNepaliNumberPipe,
                public datepipe: DatePipe,
                protected dialogRef: NbDialogRef<CadOfferLetterConfigurationComponent>,
                private nepToEngNumberPipe: NepaliToEngNumberPipe,
                private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
                private branchService: BranchService) {
    }

    get configForm() {
        return this.userConfigForm.controls;
    }

    ngOnInit() {
        this.buildForm();
        this.branchService.getAll().subscribe((res: any) => {
            this.branchList = res.detail;
        });
        if (!ObjectUtil.isEmpty(this.customer) && !ObjectUtil.isEmpty(this.customerInfo.isJointCustomer)) {
            this.tempCustomer = JSON.parse(this.customer.jointInfo);
            if (!ObjectUtil.isEmpty(this.tempCustomer.jointCustomerInfo)) {
                this.tempCustomer.jointCustomerInfo.forEach(val => {
                    this.addJointCustomerDetails();
                });
            }
        }
        if (!ObjectUtil.isEmpty(this.customerInfo.nepData)) {
            const data = JSON.parse(this.customerInfo.nepData);
            this.userConfigForm.patchValue(data);
            this.setGuarantors(data.guarantorDetails);
            if (!ObjectUtil.isEmpty(data.collateralDetails)) {
                this.setCollaterals(data.collateralDetails);
            } else {
                this.addCollateral();
            }
            if (!ObjectUtil.isEmpty(this.tempCustomer)) {
                this.setJointCustomer(data.jointCustomerDetails);
            }
        } else {
            this.addGuarantor();
            this.addCollateral();
        }
    }

    buildForm() {
        this.userConfigForm = this.formBuilder.group({
            name: [undefined],
            nepaliName: [undefined],
            gender: [undefined],
            grandFatherName: [undefined],
            fatherName: [undefined],
            // relationMedium: [undefined],
            husbandName: [undefined],
            fatherInLawName: [undefined],
            citizenshipNo: [undefined],
            citizenshipIssueDistrict: [undefined],
            citizenshipIssueDate: [undefined],
            dateOfBirth: [undefined],
            panNo: [undefined],
            panIssueOffice: [undefined],
            panIssueDate: [undefined],
            contactNo: [undefined],
            // Institution
            registrationNo: [undefined],
            companyRegOffice: [undefined],
            regIssueDate: [undefined],
            // Customer Address
            customerPermanentAddress: this.formBuilder.group({
                district: [undefined],
                municipality: [undefined],
                munType: [0],
                wardNo: [undefined],
                tole: [undefined]
            }),
            customerTemporaryAddress: this.formBuilder.group({
                district: [undefined],
                municipality: [undefined],
                munType: [0],
                wardNo: [undefined],
                tole: [undefined]
            }),
            // Institution Registered Address
            institutionRegisteredAddress: this.formBuilder.group({
                district: [undefined],
                municipality: [undefined],
                munType: [0],
                wardNo: [undefined],
                tole: [undefined]
            }),
            // Institution Current Address
            institutionCurrentAddress: this.formBuilder.group({
                district: [undefined],
                municipality: [undefined],
                munType: [0],
                wardNo: [undefined],
                tole: [undefined]
            }),
            // Authorized Person Address
            authorizedPersonDetail: this.formBuilder.group({
                name: [undefined],
                gender: [undefined],
                grandFatherName: [undefined],
                fatherName: [undefined],
                husbandName: [undefined],
                fatherInLawName: [undefined],
                citizenshipNo: [undefined],
                citizenshipIssueDistrict: [undefined],
                citizenshipIssueDate: [undefined]
            }),
            // Authorized Person Address
            authorizedPersonAddress: this.formBuilder.group({
                district: [undefined],
                municipality: [undefined],
                munType: [0],
                wardNo: [undefined]
            }),

            guarantorDetails: this.formBuilder.array([]),
            collateralDetails: this.formBuilder.array([]),
            jointCustomerDetails: this.formBuilder.array([]),

            // Miscellaneous Details
            miscellaneousDetail: this.formBuilder.group({
                offerReferenceNo: [undefined],
                offerIssueDate: [undefined],
                loanAmountInFig: [undefined],
                loanAmountInWord: [undefined],
                loanFacilityTypeInNep: [undefined],
                loanFacilityTypeInEng: [undefined],
                drawdownPer: [undefined],
                fmvPer: [undefined]
            }),
            // Branch Details
            branchDetail: this.formBuilder.group({
                branchName: [undefined],
                branchDistrict: [undefined],
                branchMunVdc: [undefined],
                branchWardNo: [undefined],
                branchTelNo: [undefined],
                branchFaxNo: [undefined],
                branchEmail: [undefined],
                branchNameInNepali: [undefined]
            })
        });
    }

    getNumAmountWord(formGroup, numLabel, wordLabel) {
        const wordLabelVar = this.nepToEngNumberPipe.transform(this.userConfigForm.get(formGroup).get(numLabel).value);
        const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
        this.userConfigForm.get(formGroup).get(wordLabel).patchValue(returnVal);
    }

    getBranchDetails(event) {
        this.branchList.forEach(singleData => {
                if (event === singleData.name) {
                    const branchWardNo = this.engToNepNumber.transform(singleData.wardNumber);
                    this.userConfigForm.get('branchDetail').get('branchWardNo').patchValue(branchWardNo);
                    const branchDistrictName = singleData.district.nepaliName;
                    this.userConfigForm.get('branchDetail').get('branchDistrict').patchValue(branchDistrictName);
                    const branchMunVdcName = singleData.municipalityVdc.nepaliName;
                    this.userConfigForm.get('branchDetail').get('branchMunVdc').patchValue(branchMunVdcName);
                    const branchNameInNepali = singleData.nepaliName;
                    this.userConfigForm.get('branchDetail').get('branchNameInNepali').patchValue(branchNameInNepali);
                    const branchTelNo = this.engToNepNumber.transform(singleData.landlineNumber);
                    this.userConfigForm.get('branchDetail').get('branchTelNo').patchValue(branchTelNo);
                    const branchEmail = singleData.email;
                    this.userConfigForm.get('branchDetail').get('branchEmail').patchValue(branchEmail);
                }
            }
        );
    }

    /*ageCalculation(startDate) {
        startDate = this.datepipe.transform(startDate, 'MMMM d, y, h:mm:ss a z');
        const stDate = new Date(startDate);
        const endDate = new Date();
        let diff = (endDate.getTime() - stDate.getTime()) / 1000;
        diff = diff / (60 * 60 * 24);
        const yr = Math.abs(Math.round(diff / 365.25));
        return this.engToNepNumber.transform(yr.toString());
    }*/

    gender(val) {
        if (val === 'MALE') {
            return 1;
        } else {
            return 0;
        }
    }

    checkIsIndividual() {
        if (CustomerType.INDIVIDUAL === CustomerType[this.customerInfo.customerType]) {
            return true;
        }
        return false;
    }

    save() {
        this.submitted = true;
        if (this.userConfigForm.invalid) {
            return;
        }
        this.spinner = true;
        const data = JSON.stringify(this.userConfigForm.value);
        this.customerInfoService.updateNepaliConfigData(data, this.customerInfo.id).subscribe(res => {
            this.customerInfoData = res.detail;
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Updated!!!'));
            this.spinner = false;
            this.dialogRef.close(this.customerInfoData);
        }, error => {
            this.toastService.show(new Alert(AlertType.ERROR, 'Error while Updating data!!!'));
            console.log(error);
            this.spinner = false;
            this.dialogRef.close();
        });

    }

    closeModal() {
        this.dialogRef.close();
    }

    controlValidation(controlNames, addValidation) {
        controlNames.forEach(s => {
            if (addValidation) {
                this.userConfigForm.get(s).setValidators(Validators.required);
            } else {
                this.userConfigForm.get(s).clearValidators();
            }
            this.userConfigForm.get(s).updateValueAndValidity();
        });
    }

    addGuarantor() {
        (this.userConfigForm.get('guarantorDetails') as FormArray).push(this.addGuarantorField());
    }

    addCollateral() {
        (this.userConfigForm.get('collateralDetails') as FormArray).push(this.addCollateralField());
    }

    addJointCustomerDetails() {
        (this.userConfigForm.get('jointCustomerDetails') as FormArray).push(this.addJointCustomerField());
    }

    addGuarantorField() {
        return this.formBuilder.group({
            guarantorType: [undefined],
            name: [undefined],
            gender: [undefined],
            grandFatherName: [undefined],
            fatherName: [undefined],
            husbandName: [undefined],
            fatherInLawName: [undefined],
            citizenshipNo: [undefined],
            citizenshipIssueDistrict: [undefined],
            citizenshipIssueDate: [undefined],
            dateOfBirth: [undefined],
            panNo: [undefined],
            panIssueOffice: [undefined],
            panIssueDate: [undefined],
            contactNo: [undefined],
            // Institution
            registrationNo: [undefined],
            companyRegOffice: [undefined],
            regIssueDate: [undefined],
            // Customer Address
            guarantorPermanentAddress: this.formBuilder.group({
                district: [undefined],
                municipality: [undefined],
                munType: [0],
                wardNo: [undefined],
                tole: [undefined]
            }),
            guarantorTemporaryAddress: this.formBuilder.group({
                district: [undefined],
                municipality: [undefined],
                munType: [0],
                wardNo: [undefined],
                tole: [undefined]
            }),
            // Institution Registered Address
            guarantorInstitutionRegisteredAddress: this.formBuilder.group({
                district: [undefined],
                municipality: [undefined],
                munType: [0],
                wardNo: [undefined],
                tole: [undefined]
            }),
            // Institution Current Address
            guarantorInstitutionCurrentAddress: this.formBuilder.group({
                district: [undefined],
                municipality: [undefined],
                munType: [0],
                wardNo: [undefined],
                tole: [undefined]
            }),
            // Authorized Person Address
            guarantorAuthorizedPersonDetail: this.formBuilder.group({
                name: [undefined],
                gender: [undefined],
                grandFatherName: [undefined],
                fatherName: [undefined],
                husbandName: [undefined],
                fatherInLawName: [undefined],
                citizenshipNo: [undefined],
                citizenshipIssueDistrict: [undefined],
                citizenshipIssueDate: [undefined]
            }),
            // Authorized Person Address
            guarantorAuthorizedPersonAddress: this.formBuilder.group({
                district: [undefined],
                municipality: [undefined],
                munType: [0],
                wardNo: [undefined]
            })
        });
    }

    addCollateralField() {
        return this.formBuilder.group({
            collateralOwnerType: [undefined],
            collateralType: [undefined],
            nameInNepali: [undefined],
            name: [undefined],
            sellerName: [undefined],
            gender: [undefined],
            dateOfBirth: [undefined],
            facAddress: [undefined],
            citizenshipNo: [undefined],
            citizenshipIssueDistrict: [undefined],
            citizenshipIssueDate: [undefined],
            contactNo: [undefined],
            relationMedium: [undefined],
            grandFatherName: [undefined],
            fatherName: [undefined],
            husbandName: [undefined],
            fatherInLawName: [undefined],
            // Institution
            registrationNo: [undefined],
            regIssueDate: [undefined],
            companyRegOffice: [undefined],
            panNo: [undefined],
            // Collateral Authorized Person Detail
            collateralAuthorizedPersonDetail: this.formBuilder.group({
                name: [undefined],
                address: [undefined],
                citizenshipNo: [undefined],
                citizenshipIssueDate: [undefined],
                citizenshipIssueDistrict: [undefined]
            }),
            // Land and Building Address
            landAndBuildingDetail: this.formBuilder.array([this.landAndBuildingFields()]),
            // Stocks Receivables Value
            stocksReceivablesValue: this.formBuilder.array([this.stocksAndReceivableFields()]),
            // Plant/Machinery/Equipment Detail
            plantMachineryDetail: this.formBuilder.array([this.plantMachineryFields()]),
            // Vehicle Detail
            vehicleDetail: this.formBuilder.array([this.vehicleFields()]),
            // Fixed Deposit Holder Detail
            fdHolderDetail: this.formBuilder.array([this.fdHolderFields()]),
            // share Detail
            shareDetail: this.formBuilder.array([this.shareFields()]),
        });
    }

    addLandAndBuilding(i) {
        (this.userConfigForm.get(['collateralDetails', i, 'landAndBuildingDetail']) as FormArray).push(this.landAndBuildingFields());
    }

    landAndBuildingFields() {
        return this.formBuilder.group({
            province: [undefined],
            district: [undefined],
            municipality: [undefined],
            munType: [0],
            wardNo: [undefined],
            plotNo: [undefined],
            tole: [undefined],
            blockStorey: [undefined],
            area: [undefined],
            nakshaSeatNo: [undefined]
        });
    }

    addStocksReceivables(i) {
        (this.userConfigForm.get(['collateralDetails', i, 'stocksReceivablesValue']) as FormArray).push(this.stocksAndReceivableFields());
    }

    stocksAndReceivableFields() {
        return this.formBuilder.group({
            stockValue: [undefined],
            receivableValue: [undefined],
        });
    }

    addPlantMachinery(i) {
        (this.userConfigForm.get(['collateralDetails', i, 'plantMachineryDetail']) as FormArray).push(this.plantMachineryFields());
    }

    plantMachineryFields() {
        return this.formBuilder.group({
            equipmentDetail: [undefined],
            equipmentValue: [undefined],
        });
    }

    addVehicle(i) {
        (this.userConfigForm.get(['collateralDetails', i, 'vehicleDetail']) as FormArray).push(this.vehicleFields());
    }

    vehicleFields() {
        return this.formBuilder.group({
            vehicleRegNo: [undefined],
            vehicleModelNo: [undefined]
        });
    }

    addFDHolder(i) {
        (this.userConfigForm.get(['collateralDetails', i, 'fdHolderDetail']) as FormArray).push(this.fdHolderFields());
    }

    fdHolderFields() {
        return this.formBuilder.group({
            name: [undefined],
            fdReceiptNo: [undefined],
            fdAmount: [undefined],
            fatherName: [undefined],
            grandFatherName: [undefined]
        });
    }

    addShare(i) {
        (this.userConfigForm.get(['collateralDetails', i, 'shareDetail']) as FormArray).push(this.shareFields());
    }

    shareFields() {
        return this.formBuilder.group({
            name: [undefined],
            companyName: [undefined],
            noOfShares: [undefined],
            shareType: [undefined]
        });
    }

    removeCollateralType(i: number, ii: number, securityType) {
        (this.userConfigForm.get(['collateralDetails', i, securityType]) as FormArray).removeAt(ii);
    }

    addJointCustomerField() {
        return this.formBuilder.group({
            name: [undefined],
            nepaliName: [undefined],
            gender: [undefined],
            grandFatherName: [undefined],
            fatherName: [undefined],
            husbandName: [undefined],
            fatherInLawName: [undefined],
            citizenshipNo: [undefined],
            citizenshipIssueDistrict: [undefined],
            citizenshipIssueDate: [undefined],
            dateOfBirth: [undefined],
            panNo: [undefined],
            panIssueOffice: [undefined],
            panIssueDate: [undefined],
            contactNo: [undefined],
            // Customer Permanent Address
            customerPermanentAddress: this.formBuilder.group({
                district: [undefined],
                municipality: [undefined],
                munType: [0],
                wardNo: [undefined],
                tole: [undefined]
            }),
            // Customer Temporary Address
            customerTemporaryAddress: this.formBuilder.group({
                district: [undefined],
                municipality: [undefined],
                munType: [0],
                wardNo: [undefined],
                tole: [undefined]
            })
        });
    }

    removeAtIndex(i: any) {
        (this.userConfigForm.get('guarantorDetails') as FormArray).removeAt(i);
    }

    removeCollateral(i: any) {
        (this.userConfigForm.get('collateralDetails') as FormArray).removeAt(i);
    }

    onChangeTab(event) {
        this.hideSaveBtn = false;
    }

    setGuarantors(guarantorDetails: any) {
        const formArray = this.userConfigForm.get('guarantorDetails') as FormArray;
        if (guarantorDetails.length === 0) {
            this.addGuarantor();
            return;
        }
        if (!ObjectUtil.isEmpty(this.customerInfo.guarantors)) {
            if (!ObjectUtil.isEmpty(this.customerInfo.guarantors.guarantorList)) {
                const guarantorList = this.customerInfo.guarantors.guarantorList;
                this.guarantorList = guarantorList;
            }
        }
        guarantorDetails.forEach(value => {
            formArray.push(this.formBuilder.group({
                guarantorType: [value.guarantorType],
                name: [value.name ? value.name : ''],
                gender: [value.gender ? value.gender : ''],
                grandFatherName: [value.grandFatherName ? value.grandFatherName : ''],
                fatherName: [value.fatherName ? value.fatherName : ''],
                husbandName: [value.husbandName ? value.husbandName : ''],
                fatherInLawName: [value.fatherInLawName ? value.fatherInLawName : ''],
                citizenshipNo: [value.citizenshipNo ? value.citizenshipNo : ''],
                citizenshipIssueDistrict: [value.citizenshipIssueDistrict ? value.citizenshipIssueDistrict : ''],
                citizenshipIssueDate: [value.citizenshipIssueDate ? value.citizenshipIssueDate : ''],
                panNo: [value.panNo ? value.panNo : ''],
                panIssueOffice: [value.panIssueOffice ? value.panIssueOffice : ''],
                panIssueDate: [value.panIssueDate ? value.panIssueDate : ''],
                contactNo: [value.contactNo ? value.contactNo : ''],
                // Institution
                registrationNo: [value.registrationNo ? value.registrationNo : ''],
                companyRegOffice: [value.companyRegOffice ? value.companyRegOffice : ''],
                regIssueDate: [value.regIssueDate ? value.regIssueDate : ''],
                // Customer Address
                guarantorPermanentAddress: this.formBuilder.group({
                    district: [value.guarantorPermanentAddress.district ? value.guarantorPermanentAddress.district : ''],
                    municipality: [value.guarantorPermanentAddress.municipality ? value.guarantorPermanentAddress.municipality : ''],
                    munType: [value.guarantorPermanentAddress.munType ? value.guarantorPermanentAddress.munType : ''],
                    wardNo: [value.guarantorPermanentAddress.wardNo ? value.guarantorPermanentAddress.wardNo : ''],
                    tole: [value.guarantorPermanentAddress.tole ? value.guarantorPermanentAddress.tole : ''],
                }),
                guarantorTemporaryAddress: this.formBuilder.group({
                    district: [value.guarantorTemporaryAddress.district ? value.guarantorTemporaryAddress.district : ''],
                    municipality: [value.guarantorTemporaryAddress.municipality ? value.guarantorTemporaryAddress.municipality : ''],
                    munType: [value.guarantorTemporaryAddress.munType ? value.guarantorTemporaryAddress.munType : ''],
                    wardNo: [value.guarantorTemporaryAddress.wardNo ? value.guarantorTemporaryAddress.wardNo : ''],
                    tole: [value.guarantorTemporaryAddress.tole ? value.guarantorTemporaryAddress.tole : ''],
                }),
                // Institution Registered Address
                guarantorInstitutionRegisteredAddress: this.formBuilder.group({
                    district: [value.guarantorInstitutionRegisteredAddress.district ? value.guarantorInstitutionRegisteredAddress.district : ''],
                    municipality: [value.guarantorInstitutionRegisteredAddress.municipality ?
                        value.guarantorInstitutionRegisteredAddress.municipality : ''],
                    munType: [value.guarantorInstitutionRegisteredAddress.munType ?
                        value.guarantorInstitutionRegisteredAddress.munType : ''],
                    wardNo: [value.guarantorInstitutionRegisteredAddress.wardNo ? value.guarantorInstitutionRegisteredAddress.wardNo : ''],
                    tole: [value.guarantorInstitutionRegisteredAddress.tole ? value.guarantorInstitutionRegisteredAddress.tole : ''],
                }),
                // Institution Current Address
                guarantorInstitutionCurrentAddress: this.formBuilder.group({
                    district: [value.guarantorInstitutionCurrentAddress.district ? value.guarantorInstitutionCurrentAddress.district : ''],
                    municipality: [value.guarantorInstitutionCurrentAddress.municipality ?
                        value.guarantorInstitutionCurrentAddress.municipality : ''],
                    munType: [value.guarantorInstitutionCurrentAddress.munType ? value.guarantorInstitutionCurrentAddress.munType : ''],
                    wardNo: [value.guarantorInstitutionCurrentAddress.wardNo ? value.guarantorInstitutionCurrentAddress.wardNo : ''],
                    tole: [value.guarantorInstitutionCurrentAddress.tole ? value.guarantorInstitutionCurrentAddress.tole : ''],
                }),
                // Authorized Person Address
                guarantorAuthorizedPersonDetail: this.formBuilder.group({
                    name: [value.guarantorAuthorizedPersonDetail.name ? value.guarantorAuthorizedPersonDetail.name : ''],
                    gender: [value.guarantorAuthorizedPersonDetail.gender ? value.guarantorAuthorizedPersonDetail.gender : ''],
                    grandFatherName: [value.guarantorAuthorizedPersonDetail.grandFatherName ?
                        value.guarantorAuthorizedPersonDetail.grandFatherName : ''],
                    fatherName: [value.guarantorAuthorizedPersonDetail.fatherName ?
                        value.guarantorAuthorizedPersonDetail.fatherName : ''],
                    husbandName: [value.guarantorAuthorizedPersonDetail.husbandName ?
                        value.guarantorAuthorizedPersonDetail.husbandName : ''],
                    fatherInLawName: [value.guarantorAuthorizedPersonDetail.fatherInLawName ?
                        value.guarantorAuthorizedPersonDetail.fatherInLawName : ''],
                    citizenshipNo: [value.guarantorAuthorizedPersonDetail.citizenshipNo ?
                        value.guarantorAuthorizedPersonDetail.citizenshipNo : ''],
                    citizenshipIssueDistrict: [value.guarantorAuthorizedPersonDetail.citizenshipIssueDistrict ?
                        value.guarantorAuthorizedPersonDetail.citizenshipIssueDistrict : ''],
                    citizenshipIssueDate: [value.guarantorAuthorizedPersonDetail.citizenshipIssueDate ?
                        value.guarantorAuthorizedPersonDetail.citizenshipIssueDate : ''],
                }),
                // Authorized Person Address
                guarantorAuthorizedPersonAddress: this.formBuilder.group({
                    district: [value.guarantorAuthorizedPersonAddress.district ? value.guarantorAuthorizedPersonAddress.district : ''],
                    municipality: [value.guarantorAuthorizedPersonAddress.municipality ?
                        value.guarantorAuthorizedPersonAddress.municipality : ''],
                    munType: [value.guarantorAuthorizedPersonAddress.munType ? value.guarantorAuthorizedPersonAddress.munType : ''],
                    wardNo: [value.guarantorAuthorizedPersonAddress.wardNo ? value.guarantorAuthorizedPersonAddress.wardNo : '']
                })
            }));
        });
    }

    setCollaterals(collateralDetails: any) {
        const formArray = this.userConfigForm.get('collateralDetails') as FormArray;
        if (collateralDetails.length === 0) {
            this.addCollateral();
            return;
        }
        collateralDetails.forEach((value, i) => {
            formArray.push(this.formBuilder.group({
                collateralOwnerType: [value.collateralOwnerType ? value.collateralOwnerType : ''],
                collateralType: [value.collateralType ? value.collateralType : ''],
                nameInNepali: [value.nameInNepali ? value.nameInNepali : ''],
                name: [value.name ? value.name : ''],
                sellerName: [value.sellerName ? value.sellerName : ''],
                gender: [value.gender ? value.gender : ''],
                dateOfBirth: [value.dateOfBirth ? value.dateOfBirth : ''],
                facAddress: [value.facAddress ? value.facAddress : ''],
                citizenshipNo: [value.citizenshipNo ? value.citizenshipNo : ''],
                citizenshipIssueDistrict: [value.citizenshipIssueDistrict ? value.citizenshipIssueDistrict : ''],
                citizenshipIssueDate: [value.citizenshipIssueDate ? value.citizenshipIssueDate : ''],
                contactNo: [value.contactNo ? value.contactNo : ''],
                relationMedium: [value.relationMedium ? value.relationMedium : ''],
                grandFatherName: [value.grandFatherName ? value.grandFatherName : ''],
                fatherName: [value.fatherName ? value.fatherName : ''],
                husbandName: [value.husbandName ? value.husbandName : ''],
                fatherInLawName: [value.fatherInLawName ? value.fatherInLawName : ''],
                // Institution
                registrationNo: [value.registrationNo ? value.registrationNo : ''],
                regIssueDate: [value.regIssueDate ? value.regIssueDate : ''],
                companyRegOffice: [value.companyRegOffice ? value.companyRegOffice : ''],
                panNo: [value.panNo ? value.panNo : ''],
                // Collateral Authorized Person Detail
                collateralAuthorizedPersonDetail: this.formBuilder.group({
                    name: [value.collateralAuthorizedPersonDetail.name ? value.collateralAuthorizedPersonDetail.name : ''],
                    address: [value.collateralAuthorizedPersonDetail.address ? value.collateralAuthorizedPersonDetail.address : ''],
                    citizenshipNo: [value.collateralAuthorizedPersonDetail.citizenshipNo ?
                        value.collateralAuthorizedPersonDetail.citizenshipNo : ''],
                    citizenshipIssueDate: [value.collateralAuthorizedPersonDetail.citizenshipIssueDate ?
                        value.collateralAuthorizedPersonDetail.citizenshipIssueDate : ''],
                    citizenshipIssueDistrict: [value.collateralAuthorizedPersonDetail.citizenshipIssueDistrict ?
                        value.collateralAuthorizedPersonDetail.citizenshipIssueDistrict : '']
                }),
                // Land and Building Address
                landAndBuildingDetail: this.formBuilder.array([]),
                // Stocks Receivables Value
                stocksReceivablesValue: this.formBuilder.array([]),
                // Plant/Machinery/Equipment Detail
                plantMachineryDetail: this.formBuilder.array([]),
                // Vehicle Detail
                vehicleDetail: this.formBuilder.array([]),
                // Fixed Deposit Holder Detail
                fdHolderDetail: this.formBuilder.array([]),
                // share Detail
                shareDetail: this.formBuilder.array([]),
            }));
            if (value.landAndBuildingDetail.length > 0) {
                this.setLandAndBuilding(value.landAndBuildingDetail, i);
            } else {
                this.addLandAndBuilding(i);
            }
            if (value.stocksReceivablesValue.length > 0) {
                this.setStocksReceivables(value.stocksReceivablesValue, i);
            } else {
                this.addStocksReceivables(i);
            }
            if (value.plantMachineryDetail.length > 0) {
                this.setPlantMachinery(value.plantMachineryDetail, i);
            } else {
                this.addPlantMachinery(i);
            }
            if (value.vehicleDetail.length > 0) {
                this.setVehicle(value.vehicleDetail, i);
            } else {
                this.addVehicle(i);
            }
            if (value.fdHolderDetail.length > 0) {
                this.setFDHolder(value.fdHolderDetail, i);
            } else {
                this.addFDHolder(i);
            }
            if (value.shareDetail.length > 0) {
                this.setShare(value.shareDetail, i);
            } else {
                this.addShare(i);
            }
        });
    }

    setLandAndBuilding(data?: any, i?: number) {
        const formArray = this.userConfigForm.get(['collateralDetails', i, 'landAndBuildingDetail']) as FormArray;
        data.forEach(value => {
            formArray.push(this.formBuilder.group({
                province: [!ObjectUtil.isEmpty(value.province) ? value.province : ''],
                district: [!ObjectUtil.isEmpty(value.district) ? value.district : ''],
                municipality: [!ObjectUtil.isEmpty(value.municipality) ? value.municipality : ''],
                munType: [!ObjectUtil.isEmpty(value.munType) ? value.munType : ''],
                wardNo: [!ObjectUtil.isEmpty(value.wardNo) ? value.wardNo : ''],
                plotNo: [!ObjectUtil.isEmpty(value.plotNo) ? value.plotNo : ''],
                tole: [!ObjectUtil.isEmpty(value.tole) ? value.tole : ''],
                blockStorey: [!ObjectUtil.isEmpty(value.blockStorey) ? value.blockStorey : ''],
                area: [!ObjectUtil.isEmpty(value.area) ? value.area : ''],
                nakshaSeatNo: [!ObjectUtil.isEmpty(value.nakshaSeatNo) ? value.nakshaSeatNo : ''],
            }));
        });
    }

    setStocksReceivables(data?: any, i?: number) {
        const formArray = this.userConfigForm.get(['collateralDetails', i, 'stocksReceivablesValue']) as FormArray;
        data.forEach(value => {
            formArray.push(this.formBuilder.group({
                stockValue: [!ObjectUtil.isEmpty(value.stockValue) ? value.stockValue : ''],
                receivableValue: [!ObjectUtil.isEmpty(value.receivableValue) ? value.receivableValue : '']
            }));
        });
    }

    setPlantMachinery(data?: any, i?: number) {
        const formArray = this.userConfigForm.get(['collateralDetails', i, 'plantMachineryDetail']) as FormArray;
        data.forEach(value => {
            formArray.push(this.formBuilder.group({
                equipmentDetail: [!ObjectUtil.isEmpty(value.equipmentDetail) ? value.equipmentDetail : ''],
                equipmentValue: [!ObjectUtil.isEmpty(value.equipmentValue) ? value.equipmentValue : '']
            }));
        });
    }

    setVehicle(data?: any, i?: number) {
        const formArray = this.userConfigForm.get(['collateralDetails', i, 'vehicleDetail']) as FormArray;
        data.forEach(value => {
            formArray.push(this.formBuilder.group({
                vehicleRegNo: [!ObjectUtil.isEmpty(value.vehicleRegNo) ? value.vehicleRegNo : ''],
                vehicleModelNo: [!ObjectUtil.isEmpty(value.vehicleModelNo) ? value.vehicleModelNo : '']
            }));
        });
    }

    setFDHolder(data?: any, i?: number) {
        const formArray = this.userConfigForm.get(['collateralDetails', i, 'fdHolderDetail']) as FormArray;
        data.forEach(value => {
            formArray.push(this.formBuilder.group({
                name: [!ObjectUtil.isEmpty(value.name) ? value.name : ''],
                fdReceiptNo: [!ObjectUtil.isEmpty(value.fdReceiptNo) ? value.fdReceiptNo : ''],
                fdAmount: [!ObjectUtil.isEmpty(value.fdAmount) ? value.fdAmount : ''],
                fatherName: [!ObjectUtil.isEmpty(value.fatherName) ? value.fatherName : ''],
                grandFatherName: [!ObjectUtil.isEmpty(value.grandFatherName) ? value.grandFatherName : '']
            }));
        });
    }

    setShare(data?: any, i?: number) {
        const formArray = this.userConfigForm.get(['collateralDetails', i, 'shareDetail']) as FormArray;
        data.forEach(value => {
            formArray.push(this.formBuilder.group({
                name: [!ObjectUtil.isEmpty(value.name) ? value.name : ''],
                companyName: [!ObjectUtil.isEmpty(value.companyName) ? value.companyName : ''],
                noOfShares: [!ObjectUtil.isEmpty(value.noOfShares) ? value.noOfShares : ''],
                shareType: [!ObjectUtil.isEmpty(value.shareType) ? value.shareType : '']
            }));
        });
    }

    setJointCustomer(jointCustomer: any) {
        const formArray = this.userConfigForm.get('jointCustomerDetails') as FormArray;
        jointCustomer.forEach(value => {
            formArray.push(this.formBuilder.group({
                name: [value.name ? value.name : ''],
                nepaliName: [value.nepaliName ? value.nepaliName : ''],
                gender: [value.gender ? value.gender : ''],
                grandFatherName: [value.grandFatherName ? value.grandFatherName : ''],
                fatherName: [value.fatherName ? value.fatherName : ''],
                husbandName: [value.husbandName ? value.husbandName : ''],
                fatherInLawName: [value.fatherInLawName ? value.fatherInLawName : ''],
                citizenshipNo: [value.citizenshipNo ? value.citizenshipNo : ''],
                citizenshipIssueDistrict: [value.citizenshipIssueDistrict ? value.citizenshipIssueDistrict : ''],
                citizenshipIssueDate: [value.citizenshipIssueDate ? value.citizenshipIssueDate : ''],
                dateOfBirth: [value.dateOfBirth ? value.dateOfBirth : ''],
                panNo: [value.panNo ? value.panNo : ''],
                panIssueOffice: [value.panIssueOffice ? value.panIssueOffice : ''],
                panIssueDate: [value.panIssueDate ? value.panIssueDate : ''],
                contactNo: [value.contactNo ? value.contactNo : ''],
                // Customer Permanent Address
                customerPermanentAddress: this.formBuilder.group({
                    district: [value.customerPermanentAddress.district ? value.customerPermanentAddress.district : ''],
                    municipality: [value.customerPermanentAddress.municipality ? value.customerPermanentAddress.municipality : ''],
                    munType: [value.customerPermanentAddress.munType ? value.customerPermanentAddress.munType : ''],
                    wardNo: [value.customerPermanentAddress.wardNo ? value.customerPermanentAddress.wardNo : ''],
                    tole: [value.customerPermanentAddress.tole ? value.customerPermanentAddress.tole : '']
                }),
                // Customer Temporary Address
                customerTemporaryAddress: this.formBuilder.group({
                    district: [value.customerTemporaryAddress.district ? value.customerTemporaryAddress.district : ''],
                    municipality: [value.customerTemporaryAddress.municipality ? value.customerTemporaryAddress.municipality : ''],
                    munType: [value.customerTemporaryAddress.munType ? value.customerTemporaryAddress.munType : ''],
                    wardNo: [value.customerTemporaryAddress.wardNo ? value.customerTemporaryAddress.wardNo : ''],
                    tole: [value.customerTemporaryAddress.tole ? value.customerTemporaryAddress.tole : '']
                })
            }));
        });
    }
}
