import {Component, OnInit} from '@angular/core';
import {CommonService} from '../../../../../../@core/service/baseservice/common-baseservice';
import {Router} from '@angular/router';
import {EntityInfo} from '../../../../modal/entity-info';
import {LegalStatus} from '../../../../modal/legal-status';
import {Capital} from '../../../../modal/capital';
import {Swot} from '../../../../modal/swot';
import {Proprietors} from '../../../../modal/proprietors';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {CommonLocation} from '../../../../../../@core/service/baseservice/common-location';
import {Province} from '../../../../modal/province';
import {District} from '../../../../modal/district';
import {MunicipalityVdc} from '../../../../modal/municipality_VDC';

@Component({
    selector: 'app-company-info',
    templateUrl: './company-info.component.html',
    styleUrls: ['./company-info.component.css']
})
export class CompanyInfoComponent implements OnInit {
    entityInfo: EntityInfo = new EntityInfo();
    legalStatus: LegalStatus = new LegalStatus();
    capital: Capital = new Capital();
    swot: Swot = new Swot();
    proprietors: Proprietors = new Proprietors();
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
        private commonLocation: CommonLocation
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
            companyName: [''],
            corporateStructure: [''],
            registeredOffice: [''],
            registeredUnderAct: [''],
            registrationNo: [''],
            registrationDate: [''],
            panRegistrationOffice: [''],
            panNumber: [''],
            panRegistrationDate: [''],
            authorizedCapital: [''],
            paidUpCapital: [''],
            issuedCapital: [''],
            totalCapital: [''],
            fixedCapital: [''],
            workingCapital: [''],
            numberOfShareholder: [''],
            managementTeams: this.formBuilder.array([
                this.managementTeamFormGroup()
            ]),
            proprietors: this.formBuilder.array([
                this.proprietorsFormGroup()
            ]),
            strength: [''],
            weakness: [''],
            opportunity: [''],
            threats: [''],

        });
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
        this.commonService.saveOrEdit(this.entityInfo, 'v1/companyInfo').subscribe();

    }

    managementTeamFormGroup(): FormGroup {
        return this.formBuilder.group({
            name: [''],
            designation: ['']
        });
    }

    proprietorsFormGroup(): FormGroup {
        return this.formBuilder.group({
            name: [''],
            contactNo: [''],
            address: [''],
            share: [''],
        });
    }


    removeManagementTeam(index: number) {
        (<FormArray>this.companyInfo.get('managementTeams')).removeAt(index);
    }

    removeProprietor(index: number) {
        (<FormArray>this.companyInfo.get('proprietors')).removeAt(index);

    }

    addProprietor() {
        (<FormArray>this.companyInfo.get('proprietors')).push(this.proprietorsFormGroup());
    }

    addManagementTeam() {
        (<FormArray>this.companyInfo.get('managementTeams')).push(this.managementTeamFormGroup());
    }


    previousPage() {
        this.router.navigate(['home/loan/kyc-info']);
    }

}
