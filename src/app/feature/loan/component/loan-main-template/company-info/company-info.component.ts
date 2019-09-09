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

    companyInfo: CompanyInfo = new CompanyInfo();
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

    constructor(
        private formBuilder: FormBuilder,
        private commonLocation: AddressService,
        private loanDataService: LoanDataService,
        private activatedRoute: ActivatedRoute,
        private loanFormService: LoanFormService
    ) {

    }

    ngOnInit() {
        this.companyInfoFormGroup = this.formBuilder.group({
            // legalStatus
            companyName: [undefined, Validators.required],
            corporateStructure: [undefined, Validators.required],
            registeredOffice: [undefined, Validators.required],
            registeredUnderAct: [undefined, Validators.required],
            registrationNo: [undefined, Validators.required],
            registrationDate: [undefined, [Validators.required, DateValidator.isValidBefore]],
            panRegistrationOffice: [undefined, Validators.required],
            panNumber: [undefined, Validators.required],
            panRegistrationDate: [undefined, [Validators.required, DateValidator.isValidBefore]],
            // capital
            authorizedCapital: [undefined, Validators.required],
            paidUpCapital: [undefined, Validators.required],
            issuedCapital: [undefined, Validators.required],
            totalCapital: [undefined, Validators.required],
            fixedCapital: [undefined, Validators.required],
            workingCapital: [undefined, Validators.required],
            numberOfShareholder: [undefined, Validators.required],
            // managementTeams
            managementTeams: this.formBuilder.array([
                this.managementTeamFormGroup()
            ]),
            // proprietors
            proprietors: this.formBuilder.array([
                this.proprietorsFormGroup()
            ]),
            // swot
            strength: [undefined, Validators.required],
            weakness: [undefined, Validators.required],
            opportunity: [undefined, Validators.required],
            threats: [undefined, Validators.required]
        });
        this.commonLocation.getProvince().subscribe(
            (response: any) => {
                this.provinceList = response.detail;
            }
        );
        // on edit
        if (this.formValue === undefined || this.formValue === null) {
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
                        this.setCompanyInfo(this.companyInfo);
                    }
                );
            }
        } else {
            this.companyInfo = this.formValue;
            this.setCompanyInfo(this.companyInfo);
        }
    }

    get form() {
        return this.companyInfoFormGroup.controls;
    }

    // set data on edit
    setCompanyInfo(info: CompanyInfo) {
        this.companyInfoFormGroup = this.formBuilder.group({
            // legalStatus
            companyName: [info.legalStatus.companyName === undefined ? '' :
                info.legalStatus.companyName, Validators.required],
            corporateStructure: [info.legalStatus.corporateStructure === undefined ? '' :
                info.legalStatus.corporateStructure, Validators.required],
            registeredOffice: [info.legalStatus.registeredOffice === undefined ? '' :
                info.legalStatus.registeredOffice, Validators.required],
            registeredUnderAct: [info.legalStatus.registeredUnderAct === undefined ? '' :
                info.legalStatus.registeredUnderAct, Validators.required],
            registrationNo: [info.legalStatus.registrationNo === undefined ? '' :
                info.legalStatus.registrationNo, Validators.required],
            registrationDate: [info.legalStatus.registrationDate === undefined ? '' :
                info.legalStatus.registrationDate, [Validators.required, DateValidator.isValidBefore]],
            panRegistrationOffice: [info.legalStatus.panRegistrationOffice === undefined ? '' :
                info.legalStatus.panRegistrationOffice, Validators.required],
            panNumber: [info.legalStatus.panNumber === undefined ? '' :
                info.legalStatus.panNumber, Validators.required],
            panRegistrationDate: [info.legalStatus.panRegistrationDate === undefined ? '' :
                info.legalStatus.panRegistrationDate, [Validators.required, DateValidator.isValidBefore]],
            // capital
            authorizedCapital: [info.capital.authorizedCapital === undefined ? '' :
                info.capital.authorizedCapital, Validators.required],
            paidUpCapital: [info.capital.paidUpCapital === undefined ? '' :
                info.capital.paidUpCapital, Validators.required],
            issuedCapital: [info.capital.issuedCapital === undefined ? '' :
                info.capital.issuedCapital, Validators.required],
            totalCapital: [info.capital.totalCapital === undefined ? '' :
                info.capital.totalCapital, Validators.required],
            fixedCapital: [info.capital.fixedCapital === undefined ? '' :
                info.capital.fixedCapital, Validators.required],
            workingCapital: [info.capital.workingCapital === undefined ? '' :
                info.capital.workingCapital, Validators.required],
            numberOfShareholder: [info.capital.numberOfShareholder === undefined ? '' :
                info.capital.numberOfShareholder, Validators.required],
            // managementTeams
            managementTeams: this.formBuilder.array([
                this.managementTeamFormGroup()
            ]),
            // proprietors
            proprietors: this.formBuilder.array([
                this.proprietorsFormGroup()
            ]),
            // swot
            strength: [info.swot.strength === undefined ? '' : info.swot.strength, Validators.required],
            weakness: [info.swot.weakness === undefined ? '' : info.swot.weakness, Validators.required],
            opportunity: [info.swot.opportunity === undefined ? '' : info.swot.opportunity, Validators.required],
            threats: [info.swot.threats === undefined ? '' : info.swot.threats, Validators.required],
        });
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
            this.getDistricts(proprietors.province.id, proprietorIndex);
            this.getMunicipalities(proprietors.district.id, proprietorIndex);
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

    onSubmit() {
        // legalStatus
        this.legalStatus.companyName = this.companyInfoFormGroup.get('companyName').value;
        this.legalStatus.corporateStructure = this.companyInfoFormGroup.get('corporateStructure').value;
        this.legalStatus.registeredOffice = this.companyInfoFormGroup.get('registeredOffice').value;
        this.legalStatus.registeredUnderAct = this.companyInfoFormGroup.get('registeredUnderAct').value;
        this.legalStatus.registrationNo = this.companyInfoFormGroup.get('registrationNo').value;
        this.legalStatus.registrationDate = this.companyInfoFormGroup.get('registrationDate').value;
        this.legalStatus.panRegistrationOffice = this.companyInfoFormGroup.get('panRegistrationOffice').value;
        this.legalStatus.panNumber = this.companyInfoFormGroup.get('panNumber').value;
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
