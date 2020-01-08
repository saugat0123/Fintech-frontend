import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {SecurityInitialFormComponent} from './security-initial-form/security-initial-form.component';
import {Security} from '../../../model/security';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {AddressService} from '../../../../../@core/service/baseservice/address.service';
import {Province} from '../../../../admin/modal/province';
import {District} from '../../../../admin/modal/district';
import {MunicipalityVdc} from '../../../../admin/modal/municipality_VDC';


@Component({
    selector: 'app-security',
    templateUrl: './security.component.html',
    styleUrls: ['./security.component.css']
})
export class SecurityComponent implements OnInit {
    @Input () securityValue: Security;
    @ViewChild ('initialSecurity', { static: false })
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

    constructor(
        private formBuilder: FormBuilder ,
        private addressServices: AddressService ,
    ) {
    }

    ngOnInit() {
        this.buildForm();
        this.getProvince();
        console.log(this.securityValue , 'this is security');
        if (!ObjectUtil.isEmpty(this.securityValue)) {
            this.securityValueForEdit = JSON.parse(this.securityValue.data);

            this.initialSecurityValue = this.securityValueForEdit;
            this.setGuarantorsDetails(this.securityValueForEdit['guarantorsForm'].guarantorsDetails);

        } else {
            this.addGuarantorsDetails();
            this.initialSecurityValue = undefined;
        }
    }
    buildForm() {
        this.guarantorsForm = this.formBuilder.group({
            guarantorsDetails: this.formBuilder.array([])
        });
    }
    setGuarantorsDetails(currentData) {
        const details = this.guarantorsForm.get('guarantorsDetails') as FormArray;
        currentData.forEach(singleData => {
            details.push(
                this.formBuilder.group({
                    name: [singleData.name] ,
                    // address: [singleData.address],
                    province:[singleData.province],
                    district:[singleData.district],
                    municipalities:[singleData.municipalities],
                    citizenNumber: [singleData.citizenNumber] ,
                    issuedYear: [singleData.issuedYear] ,
                    issuedPlace: [singleData.issuedPlace] ,
                    contactNumber: [singleData.contactNumber] ,
                    fatherName: [singleData.fatherName] ,
                    grandFatherName: [singleData.grandFatherName] ,
                    relationship: [singleData.relationship]
                    })
            );
        });
    }

    addGuarantorsDetails() {
        const addDetails = this.guarantorsForm.get('guarantorsDetails') as FormArray;
        addDetails.push(
            this.formBuilder.group({
                name: [undefined] ,
                // address: [undefined],
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

    getDistrict(province: Province) {
        this.addressServices.getDistrictByProvince(province).subscribe((response: any) => {
            this.districtList = response.detail;
        });
    }

    getMunicipalities(district: District) {
        this.addressServices.getMunicipalityVDCByDistrict(district).subscribe((response: any) => {
            this.municipalitiesList = response.detail;
        });
    }


    onSubmit() {
      if (!ObjectUtil.isEmpty(this.securityValue)) {
        this.securityData = this.securityValue;
      }
      const mergedForm = {
            initialForm: this.initialSecurity.securityForm.value,
            selectedArray: this.initialSecurity.selectedArray,
            underConstructionChecked: this.initialSecurity.underConstructionChecked,
            guarantorsForm: this.guarantorsForm.value
      };
      this.securityData.data = JSON.stringify(mergedForm);
    }
}
