import {Component, DoCheck, Input, OnInit} from '@angular/core';

import {Router} from '@angular/router';

import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
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
export class CompanyInfoComponent implements OnInit, DoCheck {
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
        this.companyInfo = this.formBuilder.group({
            companyName: [undefined],
            corporateStructure: [undefined],
            registeredOffice: [undefined],
            registeredUnderAct: [undefined],
            registrationNo: [undefined],
            registrationDate: [undefined],
            panRegistrationOffice: [undefined],
            panNumber: [undefined],
            panRegistrationDate: [undefined],
            authorizedCapital: [undefined],
            paidUpCapital: [undefined],
            issuedCapital: [undefined],
            totalCapital: [undefined],
            fixedCapital: [undefined],
            workingCapital: [undefined],
            numberOfShareholder: [undefined],
            managementTeams: this.formBuilder.array([
                this.managementTeamFormGroup()
            ]),
            proprietors: this.formBuilder.array([
                this.proprietorsFormGroup()
            ]),
            strength: [undefined],
            weakness: [undefined],
            opportunity: [undefined],
            threats: [undefined]
        });
        if (this.loanDataService.getEntityInfo().legalStatus !== undefined) {
            this.entityInfo = this.loanDataService.getEntityInfo();
            this.legalStatus = this.entityInfo.legalStatus;
            this.capital = this.entityInfo.capital;
            this.swot = this.entityInfo.swot;
            this.companyInfo = this.formBuilder.group({
                // legal status
                companyName: [this.legalStatus.companyName],
                corporateStructure: [this.legalStatus.corporateStructure],
                registeredOffice: [this.legalStatus.registeredOffice],
                registeredUnderAct: [this.legalStatus.registeredUnderAct],
                registrationNo: [this.legalStatus.registrationNo],
                registrationDate: [this.legalStatus.registrationDate],
                panRegistrationOffice: [this.legalStatus.registeredOffice],
                panNumber: [this.legalStatus.panNumber],
                panRegistrationDate: [this.legalStatus.panRegistrationDate],
                // company information
                authorizedCapital: [this.capital.authorizedCapital],
                paidUpCapital: [this.capital.paidUpCapital],
                issuedCapital: [this.capital.issuedCapital],
                totalCapital: [this.capital.totalCapital],
                fixedCapital: [this.capital.fixedCapital],
                workingCapital: [this.capital.workingCapital],
                numberOfShareholder: [this.capital.numberOfShareholder],
                managementTeams: this.formBuilder.array([
                    this.managementTeamFormGroup()
                ]),
                proprietors: this.formBuilder.array([
                    this.proprietorsFormGroup()
                ]),
                // swot
                strength: [this.swot.strength],
                weakness: [this.swot.weakness],
                opportunity: [this.swot.opportunity],
                threats: [this.swot.threats]
            });
            this.managementTeamList = this.entityInfo.managementTeamList;
            this.proprietorsList = this.entityInfo.proprietorsList;
            this.companyInfo.setControl('managementTeams', this.setManagementTeams(this.managementTeamList));
            this.companyInfo.setControl('proprietors', this.setProprietors(this.proprietorsList));
        }
    }

    ngDoCheck(): void {
        this.onSubmit();
    }

    setManagementTeams(managementTeamList: ManagementTeam[]): FormArray {
        const managementTeamFormArray = new FormArray([]);
        managementTeamList.forEach(managementTeam => {
            console.log(managementTeam);
            console.log(managementTeam.name);
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
            address: [undefined],
            share: [undefined],
        });
    }

    setProprietors(proprietorsList: Proprietors[]): FormArray {
        const managementTeamFormArray = new FormArray([]);
        proprietorsList.forEach(proprietors => {
            managementTeamFormArray.push(this.formBuilder.group({
                name: proprietors.name,
                contactNo: proprietors.contactNo,
                address: proprietors.address,
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

    getDistricts() {
        console.log(this.province);
        this.commonLocation.getDistrictByProvince(this.province).subscribe(
            (response: any) => {
                console.log(response.detail);
                this.districtList = response.detail;
            }
        );
    }

    getMunicipalities() {
        console.log(this.district);
        this.commonLocation.getMunicipalityVDCByDistrict(this.district).subscribe(
            (response: any) => {
                this.municipalitiesList = response.detail;
            }
        );
    }

    onSubmit() {
        console.log(this.companyInfo.get('companyName').value);
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
        // this.commonService.saveOrEdit(this.entityInfo, 'v1/companyInfo').subscribe();

    }


    previousPage() {
        this.router.navigate(['home/loan/kyc-info']);
    }

}
