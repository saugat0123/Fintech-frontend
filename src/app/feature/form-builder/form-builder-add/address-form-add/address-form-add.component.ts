import {Component, Input, OnInit} from '@angular/core';
import {Province} from '../../../admin/modal/province';
import {District} from '../../../admin/modal/district';
import {MunicipalityVdc} from '../../../admin/modal/municipality_VDC';
import {CoreAddressService} from '../../../../@core/service/core-address.service';

@Component({
    selector: 'app-address-form-add',
    templateUrl: './address-form-add.component.html',
    styleUrls: ['./address-form-add.component.scss']
})
export class AddressFormAddComponent implements OnInit {
    @Input() required: boolean;
    @Input() isSelected: boolean;
    province: Province = new Province();
    provinceList: Array<Province> = Array<Province>();
    district: District = new District();
    districtList: Array<District> = Array<District>();
    municipality: MunicipalityVdc = new MunicipalityVdc();
    municipalitiesList: Array<MunicipalityVdc> = Array<MunicipalityVdc>();

    constructor(private addService: CoreAddressService) {
    }

    async ngOnInit() {
        this.provinceList = await this.addService.getProvince();
    }

    async getDistrictList(provinceId: any) {
        const id: Province = this.provinceList.filter(p => p.name === provinceId.target.value)[0];
        this.districtList = await this.addService.getDistrict(id.id);
        this.municipalitiesList = [];
    }

    async getMunicipalities(districtId: any) {
        const district1: District = this.districtList.filter(p => p.name === districtId.target.value)[0];
        this.municipalitiesList = await this.addService.getMunicipalities(district1.id);
    }

}
