import {Component, Input, OnInit} from '@angular/core';

import {Router} from '@angular/router';

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
    provinceList: Province[] = [];
    districtList: District[] = [];
    municipalitiesList: MunicipalityVdc[] = [];
    province: Province = new Province();
    district: District = new District();
    municipality: MunicipalityVdc = new MunicipalityVdc();

    constructor(
        private commonService: CommonService,
        private router: Router,
        private formBuilder: FormBuilder,
        private commonLocation: AddressService,
        private loanDataService: LoanDataService
    ) {

    }

    ngOnInit() {
        this.commonLocation.getProvince().subscribe(
            (response: any) => {
                console.log(response.detail);
                this.provinceList = response.detail;
            }
        );
        this.entityInfo = this.loanDataService.getEntityInfo();
        console.log(this.entityInfo);
        if (this.entityInfo.legalStatus === null || this.entityInfo.legalStatus === undefined) {
            this.entityInfo.legalStatus = new LegalStatus();
            this.entityInfo.capital = new Capital();
            this.entityInfo.swot = new Swot();
            this.entityInfo.managementTeamList = new Array<ManagementTeam>();
            this.entityInfo.proprietorsList = new Array<Proprietors>();
        }
        this.companyInfo = this.formBuilder.group({
            companyName: [this.entityInfo.legalStatus.companyName === undefined ? '' :
                this.entityInfo.legalStatus.companyName, Validators.required],
            corporateStructure: [this.entityInfo.legalStatus.corporateStructure === undefined ? '' :
                this.entityInfo.legalStatus.corporateStructure, Validators.required],
            registeredOffice: [this.entityInfo.legalStatus.registeredOffice === undefined ? '' :
                this.entityInfo.legalStatus.registeredOffice, Validators.required],
            registeredUnderAct: [this.entityInfo.legalStatus.registeredUnderAct === undefined ? '' :
                this.entityInfo.legalStatus.registeredUnderAct, Validators.required],
            registrationNo: [this.entityInfo.legalStatus.registrationNo === undefined ? '' :
                this.entityInfo.legalStatus.registrationNo, Validators.required],
            registrationDate: [this.entityInfo.legalStatus.registrationDate === undefined ? '' :
                this.entityInfo.legalStatus.registrationDate, Validators.required],
            panRegistrationOffice: [this.entityInfo.legalStatus.panRegistrationOffice === undefined ? '' :
                this.entityInfo.legalStatus.panRegistrationOffice, Validators.required],
            panNumber: [this.entityInfo.legalStatus.panNumber === undefined ? '' :
                this.entityInfo.legalStatus.panNumber, Validators.required],
            panRegistrationDate: [this.entityInfo.legalStatus.panRegistrationDate === undefined ? '' :
                this.entityInfo.legalStatus.panRegistrationDate, Validators.required],
            authorizedCapital: [this.entityInfo.capital.authorizedCapital === undefined ? '' :
                this.entityInfo.capital.authorizedCapital, Validators.required],
            paidUpCapital: [this.entityInfo.capital.paidUpCapital === undefined ? '' :
                this.entityInfo.capital.paidUpCapital, Validators.required],
            issuedCapital: [this.entityInfo.capital.issuedCapital === undefined ? '' :
                this.entityInfo.capital.issuedCapital, Validators.required],
            totalCapital: [this.entityInfo.capital.totalCapital === undefined ? '' :
                this.entityInfo.capital.totalCapital, Validators.required],
            fixedCapital: [this.entityInfo.capital.fixedCapital === undefined ? '' :
                this.entityInfo.capital.fixedCapital, Validators.required],
            workingCapital: [this.entityInfo.capital.workingCapital === undefined ? '' :
                this.entityInfo.capital.workingCapital, Validators.required],
            numberOfShareholder: [this.entityInfo.capital.numberOfShareholder === undefined ? '' :
                this.entityInfo.capital.numberOfShareholder, Validators.required],
            managementTeams: this.formBuilder.array([
                this.managementTeamFormGroup()
            ]),
            proprietors: this.formBuilder.array([
                this.proprietorsFormGroup()
            ]),
            strength: [this.entityInfo.swot.strength === undefined ? '' : this.entityInfo.swot.strength, Validators.required],
            weakness: [this.entityInfo.swot.weakness === undefined ? '' : this.entityInfo.swot.weakness, Validators.required],
            opportunity: [this.entityInfo.swot.opportunity === undefined ? '' : this.entityInfo.swot.opportunity, Validators.required],
            threats: [this.entityInfo.swot.threats === undefined ? '' : this.entityInfo.swot.threats, Validators.required],
        });
        this.managementTeamList = this.entityInfo.managementTeamList;
        this.proprietorsList = this.entityInfo.proprietorsList;
        this.companyInfo.setControl('managementTeams', this.setManagementTeams(this.managementTeamList));
        this.companyInfo.setControl('proprietors', this.setProprietors(this.proprietorsList));
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
        return this.formBuilder.group({
            name: [undefined],
            contactNo: [undefined],
            share: [undefined],
            province: [null],
            district: [null],
            municipalityOrVdc: [null]
        });
    }

    setProprietors(proprietorsList: Proprietors[]): FormArray {
        const managementTeamFormArray = new FormArray([]);
        proprietorsList.forEach(proprietors => {
            managementTeamFormArray.push(this.formBuilder.group({
                name: proprietors.name,
                contactNo: proprietors.contactNo,
                province: proprietors.province,
                district: proprietors.district,
                municipalityOrVdc: proprietors.municipalitiesOrVDC,
                share: proprietors.share
            }));
        });
        return managementTeamFormArray;
    }

    removeProprietor(index: number) {
        (<FormArray>this.companyInfo.get('proprietors')).removeAt(index);

    }

    addProprietor() {
        (<FormArray>this.companyInfo.get('proprietors')).push(this.proprietorsFormGroup());
    }

    getDistricts(province: Province) {
        this.commonLocation.getDistrictByProvince(province).subscribe(
            (response: any) => {
                console.log(response.detail);
                this.districtList = response.detail;
            }
        );
    }

    getMunicipalities(district: District) {
        this.commonLocation.getMunicipalityVDCByDistrict(district).subscribe(
            (response: any) => {
                this.municipalitiesList = response.detail;
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
        this.entityInfo.proprietorsList = this.companyInfo.get('proprietors').value;
        this.swot.strength = this.companyInfo.get('strength').value;
        this.swot.weakness = this.companyInfo.get('weakness').value;
        this.swot.opportunity = this.companyInfo.get('opportunity').value;
        this.swot.threats = this.companyInfo.get('threats').value;
        this.entityInfo.swot = this.swot;
        this.loanDataService.setEntityInfo(this.entityInfo);
        console.log(this.entityInfo);
        // this.commonService.saveOrEdit(this.entityInfo, 'v1/companyInfo').subscribe((response: any) => {
        //     console.log(response.detail);
        // });

    }

}
