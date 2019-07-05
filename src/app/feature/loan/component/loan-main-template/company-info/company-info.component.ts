import {Component, Input, OnInit} from '@angular/core';

import {ActivatedRoute, Params, Router} from '@angular/router';

import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {EntityInfo} from '../../../../admin/modal/entity-info';
import {LegalStatus} from '../../../../admin/modal/legal-status';
import {Swot} from '../../../../admin/modal/swot';
import {Capital} from '../../../../admin/modal/capital';
import {Proprietors} from '../../../../admin/modal/proprietors';
import {Province} from '../../../../admin/modal/province';
import {District} from '../../../../admin/modal/district';
import {MunicipalityVdc} from '../../../../admin/modal/municipality_VDC';
import {LoanDataService} from '../../../service/loan-data.service';
import {ManagementTeam} from '../../../../admin/modal/management-team';
import {CommonService} from '../../../../../@core/service/baseservice/common-baseservice';
import {AddressService} from '../../../../../@core/service/baseservice/address.service';
import {Address} from '../../../model/address';
import {LoanDataHolder} from '../../../model/loanData';
import {LoanFormService} from '../../loan-form/service/loan-form.service';


@Component({
    selector: 'app-company-info',
    templateUrl: './company-info.component.html',
    styleUrls: ['./company-info.component.css']
})
export class CompanyInfoComponent implements OnInit {
    @Input() formValue: EntityInfo;
    entityInfo: EntityInfo = new EntityInfo();
    legalStatus: LegalStatus = new LegalStatus();
    capital: Capital = new Capital();
    swot: Swot = new Swot();
    managementTeamList: Array<ManagementTeam> = new Array<ManagementTeam>();
    proprietors: Proprietors = new Proprietors();
    proprietorsList: Array<Proprietors> = new Array<Proprietors>();
    companyInfo: FormGroup;
    provinceList: Array<Province> = new Array<Province>();
    districtList: Array<District> = new Array<District>();
    municipalityVdcList: Array<MunicipalityVdc> = new Array<MunicipalityVdc>();
    province: Province = new Province();
    district: District = new District();
    municipality: MunicipalityVdc = new MunicipalityVdc();
    addressList: Array<Address> = new Array<Address>();
    customerId;
    loanDocument: LoanDataHolder;

    constructor(
        private commonService: CommonService,
        private router: Router,
        private formBuilder: FormBuilder,
        private commonLocation: AddressService,
        private loanDataService: LoanDataService,
        private activatedRoute: ActivatedRoute,
        private loanFormService: LoanFormService
    ) {

    }

    ngOnInit() {
        this.companyInfo = this.formBuilder.group({
            companyName: [undefined, Validators.required],
            corporateStructure: [undefined, Validators.required],
            registeredOffice: [undefined, Validators.required],
            registeredUnderAct: [undefined, Validators.required],
            registrationNo: [undefined, Validators.required],
            registrationDate: [undefined, Validators.required],
            panRegistrationOffice: [undefined, Validators.required],
            panNumber: [undefined, Validators.required],
            panRegistrationDate: [undefined, Validators.required],
            authorizedCapital: [undefined, Validators.required],
            paidUpCapital: [undefined, Validators.required],
            issuedCapital: [undefined, Validators.required],
            totalCapital: [undefined, Validators.required],
            fixedCapital: [undefined, Validators.required],
            workingCapital: [undefined, Validators.required],
            numberOfShareholder: [undefined, Validators.required],
            managementTeams: this.formBuilder.array([
                this.managementTeamFormGroup()
            ]),
            proprietors: this.formBuilder.array([
                this.proprietorsFormGroup()
            ]),
            strength: [undefined, Validators.required],
            weakness: [undefined, Validators.required],
            opportunity: [undefined, Validators.required],
            threats: [undefined, Validators.required],
        });

        this.commonLocation.getProvince().subscribe(
            (response: any) => {
                console.log(response.detail);
                this.provinceList = response.detail;
            }
        );
        this.customerId = Number(this.activatedRoute.snapshot.queryParamMap.get('customerId'));
        this.loanFormService.detail(this.customerId).subscribe(
            (response: any) => {
                this.commonLocation.getProvince().subscribe(
                    (responseProvince: any) => {
                        this.provinceList = responseProvince.detail;
                    }
                );
                this.loanDocument = response.detail;
                this.loanDocument.id = response.detail.id;
                this.entityInfo = response.detail.entityInfo;
                this.setCompanyInfo(this.entityInfo);
            }
        );
    }

    setCompanyInfo(entityInfo: EntityInfo) {
        this.companyInfo = this.formBuilder.group({
            companyName: [entityInfo.legalStatus.companyName === undefined ? '' :
                entityInfo.legalStatus.companyName, Validators.required],
            corporateStructure: [entityInfo.legalStatus.corporateStructure === undefined ? '' :
                entityInfo.legalStatus.corporateStructure, Validators.required],
            registeredOffice: [entityInfo.legalStatus.registeredOffice === undefined ? '' :
                entityInfo.legalStatus.registeredOffice, Validators.required],
            registeredUnderAct: [entityInfo.legalStatus.registeredUnderAct === undefined ? '' :
                entityInfo.legalStatus.registeredUnderAct, Validators.required],
            registrationNo: [entityInfo.legalStatus.registrationNo === undefined ? '' :
                entityInfo.legalStatus.registrationNo, Validators.required],
            registrationDate: [entityInfo.legalStatus.registrationDate === undefined ? '' :
                entityInfo.legalStatus.registrationDate, Validators.required],
            panRegistrationOffice: [entityInfo.legalStatus.panRegistrationOffice === undefined ? '' :
                entityInfo.legalStatus.panRegistrationOffice, Validators.required],
            panNumber: [entityInfo.legalStatus.panNumber === undefined ? '' :
                entityInfo.legalStatus.panNumber, Validators.required],
            panRegistrationDate: [entityInfo.legalStatus.panRegistrationDate === undefined ? '' :
                entityInfo.legalStatus.panRegistrationDate, Validators.required],
            authorizedCapital: [entityInfo.capital.authorizedCapital === undefined ? '' :
                entityInfo.capital.authorizedCapital, Validators.required],
            paidUpCapital: [entityInfo.capital.paidUpCapital === undefined ? '' :
                entityInfo.capital.paidUpCapital, Validators.required],
            issuedCapital: [entityInfo.capital.issuedCapital === undefined ? '' :
                entityInfo.capital.issuedCapital, Validators.required],
            totalCapital: [entityInfo.capital.totalCapital === undefined ? '' :
                entityInfo.capital.totalCapital, Validators.required],
            fixedCapital: [entityInfo.capital.fixedCapital === undefined ? '' :
                entityInfo.capital.fixedCapital, Validators.required],
            workingCapital: [entityInfo.capital.workingCapital === undefined ? '' :
                entityInfo.capital.workingCapital, Validators.required],
            numberOfShareholder: [entityInfo.capital.numberOfShareholder === undefined ? '' :
                entityInfo.capital.numberOfShareholder, Validators.required],
            managementTeams: this.formBuilder.array([
                this.managementTeamFormGroup()
            ]),
            proprietors: this.formBuilder.array([
                this.proprietorsFormGroup()
            ]),
            strength: [entityInfo.swot.strength === undefined ? '' : entityInfo.swot.strength, Validators.required],
            weakness: [entityInfo.swot.weakness === undefined ? '' : entityInfo.swot.weakness, Validators.required],
            opportunity: [entityInfo.swot.opportunity === undefined ? '' : entityInfo.swot.opportunity, Validators.required],
            threats: [entityInfo.swot.threats === undefined ? '' : entityInfo.swot.threats, Validators.required],
        });
        this.companyInfo.setControl('managementTeams', this.setManagementTeams(entityInfo.managementTeamList));
        this.companyInfo.setControl('proprietors', this.setProprietors(entityInfo.proprietorsList));
    }

    setManagementTeams(managementTeamList: ManagementTeam[]): FormArray {
        const managementTeamFormArray = new FormArray([]);
        managementTeamList.forEach(managementTeam => {
            managementTeamFormArray.push(this.formBuilder.group({
                name: managementTeam.name,
                designation: managementTeam.designation
            }));
        });
        return managementTeamFormArray;
    }

    managementTeamFormGroup(): FormGroup {
        return this.formBuilder.group({
            name: [undefined],
            designation: [undefined]
        });
    }

    removeManagementTeam(index: number) {
        (<FormArray>this.companyInfo.get('managementTeams')).removeAt(index);
    }

    addManagementTeam() {
        (<FormArray>this.companyInfo.get('managementTeams')).push(this.managementTeamFormGroup());
    }

    proprietorsFormGroup(): FormGroup {
        this.addressList.push(new Address());
        return this.formBuilder.group({
            name: [undefined],
            contactNo: [undefined],
            share: [undefined],
            province: [null],
            district: [null],
            municipalityVdc: [null]
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
                name: proprietors.name,
                contactNo: proprietors.contactNo,
                province: proprietors.province.id,
                district: proprietors.district.id,
                municipalityVdc: proprietors.municipalityVdc.id,
                share: proprietors.share
            }));
        });
        return managementTeamFormArray;
    }

    getProprietor() {
        return (this.companyInfo.value.proprietors as FormArray);
    }

    removeProprietor(index: number) {
        (<FormArray>this.companyInfo.get('proprietors')).removeAt(index);
        this.addressList.splice(index, 1);
    }

    addProprietor() {
        this.addressList.push(new Address());
        (<FormArray>this.companyInfo.get('proprietors')).push(this.proprietorsFormGroup());
    }

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
        this.legalStatus.companyName = this.companyInfo.get('companyName').value;
        this.legalStatus.corporateStructure = this.companyInfo.get('corporateStructure').value;
        this.legalStatus.registeredOffice = this.companyInfo.get('registeredOffice').value;
        this.legalStatus.registeredUnderAct = this.companyInfo.get('registeredUnderAct').value;
        this.legalStatus.registrationNo = this.companyInfo.get('registrationNo').value;
        this.legalStatus.registrationDate = this.companyInfo.get('registrationDate').value;
        this.legalStatus.panRegistrationOffice = this.companyInfo.get('panRegistrationOffice').value;
        this.legalStatus.panNumber = this.companyInfo.get('panNumber').value;
        this.legalStatus.panRegistrationDate = this.companyInfo.get('panRegistrationDate').value;
        this.entityInfo.legalStatus = this.legalStatus;
        this.capital.authorizedCapital = this.companyInfo.get('authorizedCapital').value;
        this.capital.paidUpCapital = this.companyInfo.get('paidUpCapital').value;
        this.capital.issuedCapital = this.companyInfo.get('issuedCapital').value;
        this.capital.totalCapital = this.companyInfo.get('totalCapital').value;
        this.capital.fixedCapital = this.companyInfo.get('fixedCapital').value;
        this.capital.workingCapital = this.companyInfo.get('workingCapital').value;
        this.capital.numberOfShareholder = this.companyInfo.get('numberOfShareholder').value;
        this.entityInfo.capital = this.capital;
        this.entityInfo.managementTeamList = this.companyInfo.get('managementTeams').value;
        this.swot.strength = this.companyInfo.get('strength').value;
        this.swot.weakness = this.companyInfo.get('weakness').value;
        this.swot.opportunity = this.companyInfo.get('opportunity').value;
        this.swot.threats = this.companyInfo.get('threats').value;
        this.entityInfo.swot = this.swot;
        this.entityInfo.proprietorsList = new Array<Proprietors>();
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
            this.entityInfo.proprietorsList.push(proprietors);
        }
        this.loanDataService.setEntityInfo(this.entityInfo);
        console.log(this.entityInfo);
        // this.commonService.saveOrEdit(this.entityInfo, 'v1/companyInfo').subscribe((response: any) => {
        //     console.log('result', response.detail);
        // });

    }

}
