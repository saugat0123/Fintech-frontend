import { Injectable } from '@angular/core';
import { CommonService } from "./common-baseservice";
import { Province } from "../../modal/province";
import { District } from "../../modal/district";
import { MunicipalityVDC } from "../../modal/municipality_VDC";
@Injectable({
    providedIn: 'root'
})
export class Location{
    provinceList: Array<Province>  = new Array<Province>();
    districtList: Array<District> = new Array<District>();
    municipality_Vdc: Array<MunicipalityVDC> = new Array<MunicipalityVDC>(); 
    constructor(private commonService: CommonService) {
    }
    getProvinece(){
        this.commonService.getByAll("v1/address/province").subscribe((response: any) => {
            console.log(response.detail)
            return  this.provinceList = response.detail;
          })
    }
    getDistrictByProvince(province:Province){
        this.commonService.getByPost("/v1/address/districtByProvince",province).subscribe((response: any) => {
            return this.districtList = response.detail;
          })
    }
    getMunicipalityVDCByDistrict(district:District){
        this.commonService.getByPost("/v1/address/districtByProvince",district).subscribe((response: any) => {
            return this.municipality_Vdc = response.detail;
          })
    }

}