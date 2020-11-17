import {Injectable} from '@angular/core';
import {Province} from '../../feature/admin/modal/province';
import {District} from '../../feature/admin/modal/district';
import {MunicipalityVdc} from '../../feature/admin/modal/municipality_VDC';
import {AddressService} from './baseservice/address.service';

@Injectable({
    providedIn: 'root'
})
export class CoreAddressService {

    province: Province = new Province();
    provinceList: Array<Province> = Array<Province>();
    district: District = new District();
    districtList: Array<District> = Array<District>();
    municipality: MunicipalityVdc = new MunicipalityVdc();
    municipalitiesList: Array<MunicipalityVdc> = Array<MunicipalityVdc>();


    constructor(private addressServices: AddressService) {
    }


    async getProvince() {
        await this.addressServices.getProvince().toPromise().then((res: any) => {
            this.provinceList = res.detail;
        });
        return this.provinceList;

    }

    async getDistrict(provinceId: number) {
        const province = new Province();
        province.id = provinceId;
        await this.addressServices.getDistrictByProvince(province).toPromise().then((response: any) => {
            this.districtList = response.detail;
        });
        return this.districtList;
    }

    async getMunicipalities(districtId: number) {
        const district = new District();
        district.id = districtId;
        await this.addressServices.getMunicipalityVDCByDistrict(district).toPromise().then((response: any) => {
            this.municipalitiesList = response.detail;
        });
        return this.municipalitiesList;
    }
}
