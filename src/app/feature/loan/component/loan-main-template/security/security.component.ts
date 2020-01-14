import {Component , Input , OnInit , ViewChild} from '@angular/core';
import {FormArray , FormBuilder , FormGroup , Validators} from '@angular/forms';
import {SecurityInitialFormComponent} from './security-initial-form/security-initial-form.component';
import {Security} from '../../../model/security';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {AddressService} from '../../../../../@core/service/baseservice/address.service';
import {Province} from '../../../../admin/modal/province';
import {District} from '../../../../admin/modal/district';
import {MunicipalityVdc} from '../../../../admin/modal/municipality_VDC';
import {ValuatorService} from '../../../../admin/component/valuator/valuator.service';
import {Proposal} from '../../../../admin/modal/proposal';
import {Address} from '../../../model/address';
import {Guarantors} from '../../../model/guarantors';
import {LocalStorageUtil} from '../../../../../@core/utils/local-storage-util';


@Component({
    selector: 'app-security' ,
    templateUrl: './security.component.html' ,
    styleUrls: ['./security.component.css']
})
export class SecurityComponent implements OnInit {
    @Input() securityValue: Security;
    @Input() proposalDataHolder: Proposal;
    @ViewChild('initialSecurity' , {static: false})
    initialSecurity: SecurityInitialFormComponent;
    securityData: Security = new Security();
    guarantorsForm: FormGroup;
    initialSecurityValue: Object;
    securityValueForEdit;
    province: Province = new Province();
    provinceList: Array<Province> = new Array<Province>();
    district: District = new District();
    districtList: Array<District> = Array<District>();
    municipality: MunicipalityVdc = new MunicipalityVdc();
    municipalitiesList: Array<MunicipalityVdc> = Array<MunicipalityVdc>();
    addressList: Array<Address> = new Array<Address>();
    valuatorByBranch = [];
    valuatorName = [];
    limit: number;
    proposalAllData;
    submitted: false;
    guarantorsDetails: Guarantors = new Guarantors();

    constructor(
        private formBuilder: FormBuilder ,
        private addressServices: AddressService ,
        private valuatorService: ValuatorService ,
    ) {
    }

    ngOnInit() {
        this.buildForm();
        this.getProvince();
        if (!ObjectUtil.isEmpty(this.securityValue)) {
            this.securityValueForEdit = JSON.parse(this.securityValue.data);
            this.initialSecurityValue = this.securityValueForEdit;
            this.setGuarantorsDetails(this.securityValue.guarantor);
        } else {
            this.addGuarantorsDetails();
            this.initialSecurityValue = undefined;
        }
        if (!ObjectUtil.isEmpty(this.proposalDataHolder)) {
            this.proposalAllData = JSON.parse(this.proposalDataHolder.data);
        }
        const valuatorSearch = {
            'branchIds': LocalStorageUtil.getStorage().branch
        };
        this.valuatorService.getListWithSearchObject(valuatorSearch).subscribe((res: any) => {
            this.valuatorByBranch = res.detail;
            if (this.proposalAllData !== undefined) {
                this.limit = this.proposalAllData.proposedLimit;
                this.valuatorByBranch.forEach((value) => {
                    if ((Number(value.minAmount) <= Number(this.limit)) && (Number(value.maxAmount) >= Number(this.limit))) {
                        const valuatorList = {id: value.id , name: value.name};
                        this.valuatorName.push(valuatorList);
                    } else {
                        console.log('enter proposal limit');
                    }
                });
            }
        });
    }

    buildForm() {
        this.guarantorsForm = this.formBuilder.group({
            guarantorsDetails: this.formBuilder.array([])
        });
    }

    setGuarantorsDetails(guarantorList: Array<Guarantors>): FormArray {
        const details = this.guarantorsForm.get('guarantorsDetails') as FormArray;
        this.addressList = new Array<Address>(guarantorList.length);
        let guarantorIndex = 0;
        guarantorList.forEach(guarantor => {
            this.addressList[guarantorIndex] = new Address();
            if (guarantor.province.id !== null) {
                this.getDistrict(guarantor.province.id , guarantorIndex);
                if (guarantor.district.id !== null) {
                    this.getMunicipalities(guarantor.district.id , guarantorIndex);
                }
            }
            guarantorIndex++;
            details.push(this.formBuilder.group({
                name: [guarantor.name === undefined ? '' : guarantor.name , Validators.required] ,
                citizenNumber: [guarantor.citizenNumber === undefined ? '' : guarantor.citizenNumber , Validators.required] ,
                issuedYear: [guarantor.issuedYear === undefined ? '' : guarantor.issuedYear , Validators.required] ,
                issuedPlace: [guarantor.issuedPlace === undefined ? '' : guarantor.issuedPlace , Validators.required] ,
                contactNumber: [guarantor.contactNumber === undefined ? '' : guarantor.contactNumber , Validators.required] ,
                fatherName: [guarantor.fatherName === undefined ? '' : guarantor.fatherName , Validators.required] ,
                grandFatherName: [guarantor.grandFatherName === undefined ? '' : guarantor.grandFatherName , Validators.required] ,
                relationship: [guarantor.relationship === undefined ? '' : guarantor.relationship , Validators.required] ,
                province: [guarantor.province.id === undefined ? '' : guarantor.province.id , Validators.required] ,
                district: [guarantor.district.id === undefined ? '' : guarantor.district.id , Validators.required] ,
                municipalities: [guarantor.municipalities.id === undefined ? '' : guarantor.municipalities.id , Validators.required]
            }));
        });
        return details;
    }

    addGuarantorsDetails() {
        const addDetails = this.guarantorsForm.get('guarantorsDetails') as FormArray;
        this.addressList.push(new Address());
        addDetails.push(
            this.formBuilder.group({
                name: [undefined] ,
                province: [undefined] ,
                district: [undefined] ,
                municipalities: [undefined] ,
                citizenNumber: [undefined] ,
                issuedYear: [undefined] ,
                issuedPlace: [undefined] ,
                contactNumber: [undefined] ,
                fatherName: [undefined] ,
                grandFatherName: [undefined] ,
                relationship: [undefined]
            })
        );
    }

    removeGuarantorsDetails(index: number) {
        (this.guarantorsForm.get('guarantorsDetails') as FormArray).removeAt(index);
    }

    getProvince() {
        this.addressServices.getProvince().subscribe(
            (response: any) => {
                this.provinceList = response.detail;
            });
    }

    getDistrict(provinceId: number , i: number) {
        const province = new Province();
        province.id = provinceId;
        this.addressServices.getDistrictByProvince(province).subscribe((response: any) => {
            this.districtList = response.detail;
            this.addressList[i].districtList = this.districtList;
        });
    }

    getMunicipalities(districtId: number , i: number) {
        const district = new District();
        district.id = districtId;
        this.addressServices.getMunicipalityVDCByDistrict(district).subscribe((response: any) => {
            this.municipalitiesList = response.detail;
            this.addressList[i].municipalityVdcList = this.municipalitiesList;
        });
    }

    getGuarantor() {
        return this.guarantorsForm.value.guarantorsDetails as FormArray;
    }

    onSubmit() {
        if (!ObjectUtil.isEmpty(this.securityValue)) {
            this.securityData = this.securityValue;
        }
        const mergedForm = {
            initialForm: this.initialSecurity.securityForm.value ,
            selectedArray: this.initialSecurity.selectedArray ,
            underConstructionChecked: this.initialSecurity.underConstructionChecked ,
            guarantorsForm: this.guarantorsForm.value
        };
        this.securityData.data = JSON.stringify(mergedForm);
        this.securityData.guarantor = new Array<Guarantors>();
        let guarantorIndex = 0;
        while (guarantorIndex < this.getGuarantor().length) {
            const guarantor = new Guarantors();
            guarantor.name = this.getGuarantor()[guarantorIndex].name;
            guarantor.citizenNumber = this.getGuarantor()[guarantorIndex].citizenNumber;
            guarantor.issuedYear = this.getGuarantor()[guarantorIndex].issuedYear;
            guarantor.issuedPlace = this.getGuarantor()[guarantorIndex].issuedPlace;
            guarantor.fatherName = this.getGuarantor()[guarantorIndex].fatherName;
            guarantor.grandFatherName = this.getGuarantor()[guarantorIndex].grandFatherName;
            guarantor.relationship = this.getGuarantor()[guarantorIndex].relationship;
            guarantor.contactNumber = this.getGuarantor()[guarantorIndex].contactNumber;
            const province = new Province();
            province.id = this.getGuarantor()[guarantorIndex].province;
            guarantor.province = province;
            const district = new District();
            district.id = this.getGuarantor()[guarantorIndex].district;
            guarantor.district = district;
            const municipalityVdc = new MunicipalityVdc();
            municipalityVdc.id = this.getGuarantor()[guarantorIndex].municipalities;
            guarantor.municipalities = municipalityVdc;
            guarantorIndex++;
            this.securityData.guarantor.push(guarantor);
        }
    }
}
