import {Component, Input, OnInit} from '@angular/core';

import {ActivatedRoute} from '@angular/router';

import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CompanyInfo} from '../../../../admin/modal/company-info';
import {LegalStatus} from '../../../../admin/modal/legal-status';
import {Swot} from '../../../../admin/modal/swot';
import {Capital} from '../../../../admin/modal/capital';
import {Proprietors} from '../../../../admin/modal/proprietors';
import {Province} from '../../../../admin/modal/province';
import {District} from '../../../../admin/modal/district';
import {MunicipalityVdc} from '../../../../admin/modal/municipality_VDC';
import {LoanDataService} from '../../../service/loan-data.service';
import {ManagementTeam} from '../../../../admin/modal/management-team';
import {AddressService} from '../../../../../@core/service/baseservice/address.service';
import {Address} from '../../../model/address';
import {LoanFormService} from '../../loan-form/service/loan-form.service';
import {DateValidator} from '../../../../../@core/validator/date-validator';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {CompanyInfoService} from '../../../../admin/service/company-info.service';
import {ToastService} from '../../../../../@core/utils';
import {BusinessType} from '../../../../admin/modal/businessType';


@Component({
    selector: 'app-company-info',
    templateUrl: './company-info.component.html',
    styleUrls: ['./company-info.component.css']
})
export class CompanyInfoComponent implements OnInit {
    @Input() formValue: CompanyInfo;

    companyInfoFormGroup: FormGroup;
    customerId;
    submitted = false;

    companyFormField = {
        showFormField: false,
        isOldCustomer: false
    };

    companySearch = {
        registrationNumber: undefined
    };

    companyInfo: CompanyInfo;
    legalStatus: LegalStatus = new LegalStatus();
    capital: Capital = new Capital();
    swot: Swot = new Swot();
    managementTeamList: Array<ManagementTeam> = new Array<ManagementTeam>();
    proprietors: Proprietors = new Proprietors();
    proprietorsList: Array<Proprietors> = new Array<Proprietors>();
    provinceList: Array<Province> = new Array<Province>();
    districtList: Array<District> = new Array<District>();
    municipalityVdcList: Array<MunicipalityVdc> = new Array<MunicipalityVdc>();
    addressList: Array<Address> = new Array<Address>();
    businessTypes = BusinessType.enumObject();

    constructor(
        private formBuilder: FormBuilder,
        private commonLocation: AddressService,
        private loanDataService: LoanDataService,
        private activatedRoute: ActivatedRoute,
        private loanFormService: LoanFormService,
        private toastService: ToastService,
        private companyInfoService: CompanyInfoService
    ) {

    }

    ngOnInit() {
        this.companyInfo = this.formValue;
        this.buildForm();

        this.commonLocation.getProvince().subscribe(
            (response: any) => {
                this.provinceList = response.detail;
            }
        );

        if (this.formValue === undefined) {
            this.customerId = Number(this.activatedRoute.snapshot.queryParamMap.get('customerId'));
            if (this.customerId !== 0) {
                this.loanFormService.detail(this.customerId).subscribe(
                    (response: any) => {
                        this.commonLocation.getProvince().subscribe(
                            (responseProvince: any) => {
                                this.provinceList = responseProvince.detail;
                            }
                        );
                        this.companyInfo = response.detail.companyInfo;
                        this.buildForm();
                        this.setCompanyInfo(this.companyInfo);
                    }
                );
            }
        } else {
            this.companyInfo = this.formValue;
            this.setCompanyInfo(this.companyInfo);
        }

        this.companyFormField = {
            showFormField: (!ObjectUtil.isEmpty(this.formValue)
                && !ObjectUtil.isEmpty(this.formValue.id)),
            isOldCustomer: (!ObjectUtil.isEmpty(this.formValue)
                && !ObjectUtil.isEmpty(this.formValue.id))
        };
    }

    get form() {
        return this.companyInfoFormGroup.controls;
    }

    buildForm() {
        this.companyInfoFormGroup = this.formBuilder.group({

            // Company Information
            companyId:
                [(ObjectUtil.isEmpty(this.companyInfo)
                    || ObjectUtil.isEmpty(this.companyInfo.id)) ? undefined :
                    this.companyInfo.id],
            companyInfoVersion:
                [(ObjectUtil.isEmpty(this.companyInfo)
                    || ObjectUtil.isEmpty(this.companyInfo.version)) ? undefined :
                    this.companyInfo.version],
            companyName:
                [(ObjectUtil.isEmpty(this.companyInfo)
                    || ObjectUtil.isEmpty(this.companyInfo.companyName)) ? undefined :
                    this.companyInfo.companyName, [Validators.required]],
            registrationNumber:
                [(ObjectUtil.isEmpty(this.companyInfo)
                    || ObjectUtil.isEmpty(this.companyInfo.registrationNumber)) ? undefined :
                    this.companyInfo.registrationNumber, [Validators.required]],
            companyPAN:
                [(ObjectUtil.isEmpty(this.companyInfo)
                    || ObjectUtil.isEmpty(this.companyInfo.panNumber)) ? undefined :
                    this.companyInfo.panNumber, [Validators.required]],
            companyEstablishmentDate:
                [(ObjectUtil.isEmpty(this.companyInfo)
                    || ObjectUtil.isEmpty(this.companyInfo.establishmentDate)) ? undefined :
                    new Date(this.companyInfo.establishmentDate), [Validators.required]],
            businessType:
                [(ObjectUtil.isEmpty(this.companyInfo)
                    || ObjectUtil.isEmpty(this.companyInfo.businessType)) ? undefined :
                    this.companyInfo.businessType, [Validators.required]],

            // legalStatus
            corporateStructure: [(ObjectUtil.isEmpty(this.companyInfo) || ObjectUtil.isEmpty(this.companyInfo.legalStatus)) ?
                undefined : this.companyInfo.legalStatus.corporateStructure, Validators.required],

            registeredOffice: [(ObjectUtil.isEmpty(this.companyInfo)
                || ObjectUtil.isEmpty(this.companyInfo.legalStatus)) ? undefined :
                this.companyInfo.legalStatus.registeredOffice, Validators.required],

            registeredUnderAct: [(ObjectUtil.isEmpty(this.companyInfo)
                || ObjectUtil.isEmpty(this.companyInfo.legalStatus)) ? undefined :
                this.companyInfo.legalStatus.registeredUnderAct, Validators.required],

            registrationDate: [(ObjectUtil.isEmpty(this.companyInfo)
                || ObjectUtil.isEmpty(this.companyInfo.legalStatus)) ? undefined :
                new Date(this.companyInfo.legalStatus.registrationDate), [Validators.required, DateValidator.isValidBefore]],

            panRegistrationOffice: [(ObjectUtil.isEmpty(this.companyInfo)
                || ObjectUtil.isEmpty(this.companyInfo.legalStatus)) ? undefined :
                this.companyInfo.legalStatus.panRegistrationOffice, Validators.required],

            panRegistrationDate: [(ObjectUtil.isEmpty(this.companyInfo)
                || ObjectUtil.isEmpty(this.companyInfo.legalStatus)) ? undefined :
                new Date(this.companyInfo.legalStatus.panRegistrationDate), [Validators.required, DateValidator.isValidBefore]],

            // capital
            authorizedCapital: [(ObjectUtil.isEmpty(this.companyInfo)
                || ObjectUtil.isEmpty(this.companyInfo.capital)) ? undefined :
                this.companyInfo.capital.authorizedCapital, Validators.required],

            paidUpCapital: [(ObjectUtil.isEmpty(this.companyInfo)
                || ObjectUtil.isEmpty(this.companyInfo.capital)) ? undefined :
                this.companyInfo.capital.paidUpCapital, Validators.required],

            issuedCapital: [(ObjectUtil.isEmpty(this.companyInfo)
                || ObjectUtil.isEmpty(this.companyInfo.capital)) ? undefined :
                this.companyInfo.capital.issuedCapital, Validators.required],

            totalCapital: [(ObjectUtil.isEmpty(this.companyInfo)
                || ObjectUtil.isEmpty(this.companyInfo.capital)) ? undefined :
                this.companyInfo.capital.totalCapital, Validators.required],

            fixedCapital: [(ObjectUtil.isEmpty(this.companyInfo)
                || ObjectUtil.isEmpty(this.companyInfo.capital)) ? undefined :
                this.companyInfo.capital.fixedCapital, Validators.required],

            workingCapital: [(ObjectUtil.isEmpty(this.companyInfo)
                || ObjectUtil.isEmpty(this.companyInfo.capital)) ? undefined :
                this.companyInfo.capital.workingCapital, Validators.required],

            numberOfShareholder: [(ObjectUtil.isEmpty(this.companyInfo)
                || ObjectUtil.isEmpty(this.companyInfo.capital)) ? undefined :
                this.companyInfo.capital.numberOfShareholder, Validators.required],

            // managementTeams
            managementTeams: this.formBuilder.array([
                this.managementTeamFormGroup()
            ]),
            // proprietors
            proprietors: this.formBuilder.array([
                this.proprietorsFormGroup()
            ]),
            // swot
            strength: [(ObjectUtil.isEmpty(this.companyInfo)
                || ObjectUtil.isEmpty(this.companyInfo.swot)) ? undefined : this.companyInfo.swot.strength, Validators.required],

            weakness: [(ObjectUtil.isEmpty(this.companyInfo)
                || ObjectUtil.isEmpty(this.companyInfo.swot)) ? undefined : this.companyInfo.swot.weakness, Validators.required],

            opportunity: [(ObjectUtil.isEmpty(this.companyInfo)
                || ObjectUtil.isEmpty(this.companyInfo.swot)) ? undefined : this.companyInfo.swot.opportunity, Validators.required],

            threats: [(ObjectUtil.isEmpty(this.companyInfo)
                || ObjectUtil.isEmpty(this.companyInfo.swot)) ? undefined : this.companyInfo.swot.threats, Validators.required],
        });
    }

    setCompanyInfo(info: CompanyInfo) {
        // set managementTeams data
        this.companyInfoFormGroup.setControl('managementTeams', this.setManagementTeams(info.managementTeamList));
        // proprietors data
        this.companyInfoFormGroup.setControl('proprietors', this.setProprietors(info.proprietorsList));
    }

    managementTeamFormGroup(): FormGroup {
        return this.formBuilder.group({
            name: [undefined, Validators.required],
            designation: [undefined, Validators.required]
        });
    }

    // set managementTeams data
    setManagementTeams(managementTeamList: ManagementTeam[]): FormArray {
        const managementTeamFormArray = new FormArray([]);
        managementTeamList.forEach(managementTeam => {
            managementTeamFormArray.push(this.formBuilder.group({
                name: [managementTeam.name === undefined ? '' : managementTeam.name, Validators.required],
                designation: [managementTeam.designation === undefined ? '' : managementTeam.designation, Validators.required],
            }));
        });
        return managementTeamFormArray;
    }

    removeManagementTeam(index: number) {
        (<FormArray>this.companyInfoFormGroup.get('managementTeams')).removeAt(index);
    }

    addManagementTeam() {
        (<FormArray>this.companyInfoFormGroup.get('managementTeams')).push(this.managementTeamFormGroup());
    }

    proprietorsFormGroup(): FormGroup {
        this.addressList.push(new Address());
        return this.formBuilder.group({
            name: [undefined, Validators.required],
            contactNo: [undefined, Validators.required],
            share: [undefined, Validators.required],
            province: [null, Validators.required],
            district: [null, Validators.required],
            municipalityVdc: [null, Validators.required]
        });
    }

    setProprietors(proprietorsList: Array<Proprietors>): FormArray {
        const managementTeamFormArray = new FormArray([]);
        this.addressList = new Array<Address>(proprietorsList.length);
        let proprietorIndex = 0;
        proprietorsList.forEach(proprietors => {
            this.addressList[proprietorIndex] = new Address();
            if (proprietors.province.id !== null) {
                this.getDistricts(proprietors.province.id, proprietorIndex);
                if (proprietors.district.id !== null) {
                    this.getMunicipalities(proprietors.district.id, proprietorIndex);
                }
            }
            proprietorIndex++;
            managementTeamFormArray.push(this.formBuilder.group({
                name: [proprietors.name === undefined ? '' : proprietors.name, Validators.required],
                contactNo: [proprietors.contactNo === undefined ? '' : proprietors.contactNo, Validators.required],
                share: [proprietors.share === undefined ? '' : proprietors.share, Validators.required],
                province: [proprietors.province.id === undefined ? '' : proprietors.province.id, Validators.required],
                district: [proprietors.district.id === undefined ? '' : proprietors.district.id,
                    Validators.required],
                municipalityVdc: [proprietors.municipalityVdc.id === undefined ? '' : proprietors.municipalityVdc.id,
                    Validators.required]
            }));
        });
        return managementTeamFormArray;
    }

    // return proprietors formArray
    getProprietor() {
        return (this.companyInfoFormGroup.value.proprietors as FormArray);
    }

    removeProprietor(index: number) {
        (<FormArray>this.companyInfoFormGroup.get('proprietors')).removeAt(index);
        this.addressList.splice(index, 1);
    }

    addProprietor() {
        this.addressList.push(new Address());
        (<FormArray>this.companyInfoFormGroup.get('proprietors')).push(this.proprietorsFormGroup());
    }

    // get district list based on province
    getDistricts(provinceId: number, proprietorIndex: number) {
        const province = new Province();
        province.id = provinceId;
        this.commonLocation.getDistrictByProvince(province).subscribe(
            (response: any) => {
                this.districtList = response.detail;
                this.addressList[proprietorIndex].districtList = this.districtList;
            }
        );
    }

    // get municipalityVdc list based on district
    getMunicipalities(districtId: number, proprietorIndex: number) {
        const district = new District();
        district.id = districtId;
        this.commonLocation.getMunicipalityVDCByDistrict(district).subscribe(
            (response: any) => {
                this.municipalityVdcList = response.detail;
                this.addressList[proprietorIndex].municipalityVdcList = this.municipalityVdcList;
            }
        );
    }

    searchByRegNO() {
        this.companySearch.registrationNumber = this.companyInfoFormGroup.get('registrationNumber').value;
        this.companyInfoService.getPaginationWithSearchObject(this.companySearch).subscribe((response: any) => {
            if (response.detail.content <= 0) {
                this.companyFormField.isOldCustomer = false;

                this.companyInfo = undefined;
                this.buildForm();

                this.toastService.show(new Alert(AlertType.INFO, 'No company  under given registration number.'));
            } else {
                this.companyFormField.isOldCustomer = true;
                this.companyInfo = response.detail.content[0];
                this.buildForm();
                this.setCompanyInfo(this.companyInfo);
            }
        }, error => console.error(error));
        this.companyFormField.showFormField = true;
    }

    onSubmit() {
        this.companyInfo = new CompanyInfo();
        // Company Information--
        this.companyInfo.id = this.companyInfoFormGroup.get('companyId').value;
        this.companyInfo.companyName = this.companyInfoFormGroup.get('companyName').value;
        this.companyInfo.registrationNumber = this.companyInfoFormGroup.get('registrationNumber').value;
        this.companyInfo.panNumber = this.companyInfoFormGroup.get('companyPAN').value;
        this.companyInfo.establishmentDate = this.companyInfoFormGroup.get('companyEstablishmentDate').value;
        this.companyInfo.businessType = this.companyInfoFormGroup.get('businessType').value;
        this.companyInfo.version = this.companyInfoFormGroup.get('companyInfoVersion').value;

        // legalStatus
        // this.legalStatus.companyName = this.companyInfoFormGroup.get('companyName').value;
        this.legalStatus.corporateStructure = this.companyInfoFormGroup.get('corporateStructure').value;
        this.legalStatus.registeredOffice = this.companyInfoFormGroup.get('registeredOffice').value;
        this.legalStatus.registeredUnderAct = this.companyInfoFormGroup.get('registeredUnderAct').value;
        // this.legalStatus.registrationNo = this.companyInfoFormGroup.get('registrationNo').value;
        this.legalStatus.registrationDate = this.companyInfoFormGroup.get('registrationDate').value;
        this.legalStatus.panRegistrationOffice = this.companyInfoFormGroup.get('panRegistrationOffice').value;
        // this.legalStatus.panNumber = this.companyInfoFormGroup.get('panNumber').value;
        this.legalStatus.panRegistrationDate = this.companyInfoFormGroup.get('panRegistrationDate').value;
        this.companyInfo.legalStatus = this.legalStatus;
        // capital
        this.capital.authorizedCapital = this.companyInfoFormGroup.get('authorizedCapital').value;
        this.capital.paidUpCapital = this.companyInfoFormGroup.get('paidUpCapital').value;
        this.capital.issuedCapital = this.companyInfoFormGroup.get('issuedCapital').value;
        this.capital.totalCapital = this.companyInfoFormGroup.get('totalCapital').value;
        this.capital.fixedCapital = this.companyInfoFormGroup.get('fixedCapital').value;
        this.capital.workingCapital = this.companyInfoFormGroup.get('workingCapital').value;
        this.capital.numberOfShareholder = this.companyInfoFormGroup.get('numberOfShareholder').value;
        this.companyInfo.capital = this.capital;
        // swot
        this.swot.strength = this.companyInfoFormGroup.get('strength').value;
        this.swot.weakness = this.companyInfoFormGroup.get('weakness').value;
        this.swot.opportunity = this.companyInfoFormGroup.get('opportunity').value;
        this.swot.threats = this.companyInfoFormGroup.get('threats').value;
        this.companyInfo.swot = this.swot;
        // management team list
        this.companyInfo.managementTeamList = this.companyInfoFormGroup.get('managementTeams').value;
        // proprietorsList
        this.companyInfo.proprietorsList = new Array<Proprietors>();
        let proprietorsIndex = 0;
        while (proprietorsIndex < this.getProprietor().length) {
            const proprietors = new Proprietors();
            proprietors.name = this.getProprietor()[proprietorsIndex].name;
            proprietors.contactNo = this.getProprietor()[proprietorsIndex].contactNo;
            proprietors.share = this.getProprietor()[proprietorsIndex].share;
            const province = new Province();
            province.id = this.getProprietor()[proprietorsIndex].province;
            proprietors.province = province;
            const district = new District();
            district.id = this.getProprietor()[proprietorsIndex].district;
            proprietors.district = district;
            const municipalityVdc = new MunicipalityVdc();
            municipalityVdc.id = this.getProprietor()[proprietorsIndex].municipalityVdc;
            proprietors.municipalityVdc = municipalityVdc;
            proprietorsIndex++;
            this.companyInfo.proprietorsList.push(proprietors);
        }
    }

}
