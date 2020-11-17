import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {Province} from '../../../admin/modal/province';
import {District} from '../../../admin/modal/district';
import {MunicipalityVdc} from '../../../admin/modal/municipality_VDC';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CoreAddressService} from '../../../../@core/service/core-address.service';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';

@Component({
    selector: 'app-address-form',
    templateUrl: './address-form.component.html',
    styleUrls: ['./address-form.component.scss']
})
export class AddressFormComponent implements OnInit {
    @Input() field: any;
    @Input() dynamicFormGroup: FormGroup;
    @Input() submitted: boolean;
    province: Province = new Province();
    provinceList: Array<Province> = Array<Province>();
    district: District = new District();
    districtList: Array<District> = Array<District>();
    municipality: MunicipalityVdc = new MunicipalityVdc();
    municipalitiesList: Array<MunicipalityVdc> = Array<MunicipalityVdc>();

    constructor(private fb: FormBuilder, private addService: CoreAddressService, private el: ElementRef) {
    }


    async ngOnInit() {
        this.provinceList = await this.addService.getProvince();
        await this.getPrevValue();

    }

    async getDistrictList(provinceId) {
        console.log(provinceId);
        const val = this.dynamicFormGroup.get(provinceId).value;
        const selectedProv: Province = val;
        this.districtList = await this.addService.getDistrict(selectedProv.id);
        this.dynamicFormGroup.controls[this.field.id + '_district'].patchValue(null);
        this.dynamicFormGroup.controls[this.field.id + '_municipality'].patchValue(null);
        this.municipalitiesList = [];
    }

    async getMunicipalities(districtId: any) {
        const val = this.dynamicFormGroup.get(districtId).value;
        const selectedDistrict: District = val;
        this.municipalitiesList = await this.addService.getMunicipalities(selectedDistrict.id);
        this.dynamicFormGroup.controls[this.field.id + '_municipality'].patchValue(null);
    }

    dynamicFormControl(control) {
        return this.dynamicFormGroup.controls[control];
    }

    compareFn(c1: any, c2: any): boolean {
        return c1 && c2 ? c1.id === c2.id : c1 === c2;
    }

    async getPrevValue() {
        const provValue = this.dynamicFormGroup.controls[this.field.id + '_province'].value;
        this.province = provValue;
        if (!ObjectUtil.isEmpty(this.province)) {
            this.districtList = await this.addService.getDistrict(this.province.id);
            this.municipalitiesList = [];
            const disValue = this.dynamicFormGroup.controls[this.field.id + '_district'].value;
            this.district = disValue;
            this.municipalitiesList = await this.addService.getMunicipalities(this.district.id);
        }

    }

}
