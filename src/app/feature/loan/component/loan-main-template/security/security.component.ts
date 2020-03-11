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
import {LocalStorageUtil} from '../../../../../@core/utils/local-storage-util';
import {Guarantor} from '../../../model/guarantor';
import {CalendarType} from '../../../../../@core/model/calendar-type';


@Component({
    selector: 'app-security' ,
    templateUrl: './security.component.html' ,
    styleUrls: ['./security.component.css']
})
export class SecurityComponent implements OnInit {
    @Input() securityValue: Security;
    @Input() proposalDataHolder: Proposal;
    @Input() calendarType: CalendarType;
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
    guarantorsDetails: Guarantor = new Guarantor();

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

    setGuarantorsDetails(guarantorList: Array<Guarantor>): FormArray {
        const details = this.guarantorsForm.get('guarantorsDetails') as FormArray;
        this.addressList = new Array<Address>(guarantorList.length);
        let guarantorIndex = 0;
        guarantorList.forEach(guarantor => {
            this.addressList[guarantorIndex] = new Address();
            if (!ObjectUtil.isEmpty(guarantor.province) && !ObjectUtil.isEmpty(guarantor.province.id)) {
                this.getDistrict(guarantor.province.id , guarantorIndex);
                if (guarantor.district.id !== null) {
                    this.getMunicipalities(guarantor.district.id , guarantorIndex);
                }
            }
            guarantorIndex++;
            details.push(this.formBuilder.group({
                id: [guarantor.id === undefined ? undefined : guarantor.id] ,
                version: [guarantor.version === undefined ? undefined : guarantor.version] ,
                name: [guarantor.name === undefined ? undefined : guarantor.name , Validators.required] ,
                citizenNumber: [guarantor.citizenNumber === undefined ? undefined : guarantor.citizenNumber , Validators.required] ,
                issuedYear: [guarantor.issuedYear === undefined ? undefined : guarantor.issuedYear , Validators.required] ,
                issuedPlace: [guarantor.issuedPlace === undefined ? undefined : guarantor.issuedPlace , Validators.required] ,
                contactNumber: [guarantor.contactNumber === undefined ? undefined : guarantor.contactNumber , Validators.required] ,
                fatherName: [guarantor.fatherName === undefined ? undefined : guarantor.fatherName , Validators.required] ,
                grandFatherName: [guarantor.grandFatherName === undefined ? undefined : guarantor.grandFatherName , Validators.required] ,
                relationship: [guarantor.relationship === undefined ? undefined : guarantor.relationship , Validators.required] ,
                province: [!ObjectUtil.isEmpty(guarantor.province) && !ObjectUtil.isEmpty(guarantor.province.id) ? guarantor.province.id :
                    undefined , Validators.required] ,
                district: [!ObjectUtil.isEmpty(guarantor.district) && !ObjectUtil.isEmpty(guarantor.district.id) ? guarantor.district.id :
                    undefined , Validators.required] ,
                municipalities: [!ObjectUtil.isEmpty(guarantor.municipalities) && !ObjectUtil.isEmpty(guarantor.municipalities.id) ?
                    guarantor.municipalities.id : undefined , Validators.required]
            }));

        });
        return details;
    }

    addGuarantorsDetails() {
        const addDetails = this.guarantorsForm.get('guarantorsDetails') as FormArray;
        this.addressList.push(new Address());
        addDetails.push(
            this.formBuilder.group({
                name: [undefined , Validators.required] ,
                province: [null , Validators.required] ,
                district: [null , Validators.required] ,
                municipalities: [null , Validators.required] ,
                citizenNumber: [undefined , Validators.required] ,
                issuedYear: [undefined , Validators.required] ,
                issuedPlace: [undefined , Validators.required] ,
                contactNumber: [undefined , Validators.required] ,
                fatherName: [undefined , Validators.required] ,
                grandFatherName: [undefined , Validators.required] ,
                relationship: [undefined , Validators.required]
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
        this.securityData.valuatorId = this.initialSecurity.securityForm.get('valuatorDetails').value.valuator;
        this.securityData.guarantor = [];
        let guarantorIndex = 0;
        while (guarantorIndex < this.getGuarantor().length) {
            const guarantor = new Guarantor();
            guarantor.id = this.getGuarantor()[guarantorIndex].id;
            guarantor.version = this.getGuarantor()[guarantorIndex].version;
            guarantor.name = this.getGuarantor()[guarantorIndex].name;
            guarantor.citizenNumber = this.getGuarantor()[guarantorIndex].citizenNumber;
            guarantor.issuedYear = this.getGuarantor()[guarantorIndex].issuedYear;
            guarantor.issuedPlace = this.getGuarantor()[guarantorIndex].issuedPlace;
            guarantor.fatherName = this.getGuarantor()[guarantorIndex].fatherName;
            guarantor.grandFatherName = this.getGuarantor()[guarantorIndex].grandFatherName;
            guarantor.relationship = this.getGuarantor()[guarantorIndex].relationship;
            guarantor.contactNumber = this.getGuarantor()[guarantorIndex].contactNumber;
            if (!ObjectUtil.isEmpty(this.getGuarantor()[guarantorIndex].province)) {
                const province = new Province();
                province.id = this.getGuarantor()[guarantorIndex].province;
                guarantor.province = province;
                const district = new District();
                district.id = this.getGuarantor()[guarantorIndex].district;
                guarantor.district = district;
                const municipalityVdc = new MunicipalityVdc();
                municipalityVdc.id = this.getGuarantor()[guarantorIndex].municipalities;
                guarantor.municipalities = municipalityVdc;
            }
            guarantorIndex++;
            this.securityData.guarantor.push(guarantor);
        }
    }
}
