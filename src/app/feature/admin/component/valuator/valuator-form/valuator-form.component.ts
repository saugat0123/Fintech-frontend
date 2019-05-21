import {Component, DoCheck, OnInit} from '@angular/core';

import {Router} from '@angular/router';
import {CommonDataService} from '../../../../../@core/service/baseservice/common-dataService';
import {CommonService} from '../../../../../@core/service/baseservice/common-baseservice';
import {Valuator} from '../../../modal/valuator';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {CommonLocation} from '../../../../../@core/service/baseservice/common-location';

import {Province} from '../../../modal/province';
import {District} from '../../../modal/district';
import {MunicipalityVdc} from '../../../modal/municipality_VDC';
import {ModalResponse, ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';


@Component({
    selector: 'app-valuator-form',
    templateUrl: './add-valuator.component.html'
})
export class ValuatorFormComponent implements OnInit, DoCheck {
    task: string;
    submitted = false;
    spinner = false;
    globalMsg: string;
    valuator: Valuator = new Valuator();
    provinces: Province[];
    districts: District[];
    municipalities: MunicipalityVdc[];
    siteDistricts: District[];
    siteMunicipalities: MunicipalityVdc[];
    district: District = new District();
    province: Province = new Province();
    municipality: MunicipalityVdc = new MunicipalityVdc();
    siteDistrict: District = new District();
    siteProvince: Province = new Province();
    siteMunicipality: MunicipalityVdc = new MunicipalityVdc();

    constructor(
        private commonService: CommonService,
        private router: Router,
        private dataService: CommonDataService,
        private activeModal: NgbActiveModal,
        private location: CommonLocation,
        private toastService: ToastService
    ) {

    }

    ngOnInit() {
        this.location.getProvince().subscribe((response: any) => {
            this.provinces = response.detail;
            this.province = this.valuator.province;
            if (this.province !== undefined) {
                this.getSelectedProvinceDistrict();
            }
            this.district = this.valuator.district;
            if (this.district !== undefined) {
                this.getSelectedDistrictMunicipality();
            }
            this.siteProvince = this.valuator.siteProvince;
            if (this.siteProvince !== undefined) {
                this.getSelectedProvinceSiteDistrict();
            }
            this.siteDistrict = this.valuator.siteDistrict;
            if (this.siteDistrict !== undefined) {
                this.getSelectedDistrictSiteMunicipality();
            }
        });
    }

    getSelectedProvinceDistrict() {
        this.location.getDistrictByProvince(this.valuator.province).subscribe(
            (response: any) => {
                this.districts = response.detail;
            }
        );
    }

    getSelectedDistrictMunicipality() {
        this.location.getMunicipalityVDCByDistrict(this.valuator.district).subscribe(
            (response: any) => {
                this.municipalities = response.detail;
            }
        );
    }

    getSelectedProvinceSiteDistrict() {
        this.location.getDistrictByProvince(this.valuator.siteProvince).subscribe(
            (response: any) => {
                this.siteDistricts = response.detail;
            }
        );
    }

    getSelectedDistrictSiteMunicipality() {
        this.location.getMunicipalityVDCByDistrict(this.valuator.siteDistrict).subscribe(
            (response: any) => {
                this.siteMunicipalities = response.detail;
            }
        );
    }

    getDistricts(province: Province, place: number) {
        if (place === 0) {
            this.location.getDistrictByProvince(province).subscribe(
                (response: any) => {
                    this.siteDistricts = response.detail;
                    this.siteMunicipalities = new Array();
                });
        } else {
            this.location.getDistrictByProvince(province).subscribe(
                (response: any) => {
                    this.districts = response.detail;
                    this.municipalities = new Array();
                });
        }
    }

    getMunicipalities(district: District, place: number) {
        if (place === 0) {
            this.location.getMunicipalityVDCByDistrict(district).subscribe(
                (response: any) => {
                    this.siteMunicipalities = response.detail;
                });
        } else {
            this.location.getMunicipalityVDCByDistrict(this.district).subscribe(
                (response: any) => {
                    this.municipalities = response.detail;
                });
        }

    }

    ngDoCheck(): void {
        this.valuator = this.dataService.getValuator();
        if (this.valuator.id == null) {
            this.task = 'Add';
            this.district = new District();
            this.province = new Province();
            this.municipality = new MunicipalityVdc();
            this.siteDistrict = new District();
            this.siteProvince = new Province();
            this.siteMunicipality = new MunicipalityVdc();
        } else {
            this.district = this.valuator.district;
            this.province = this.valuator.province;
            this.municipality = this.valuator.municipalityVdc;
            this.siteDistrict = this.valuator.siteDistrict;
            this.siteProvince = this.valuator.siteProvince;
            this.siteMunicipality = this.valuator.siteMunicipalityVdc;
            this.task = 'Edit';
        }

    }

    onSubmit() {
        console.log(this.valuator);
        this.submitted = true;
        this.commonService.saveOrEdit(this.valuator, 'v1/valuator').subscribe(result => {

                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Valuator!'));

                this.valuator = new Valuator();

                this.activeModal.close(ModalResponse.SUCCESS);
            }, error => {

                console.log(error);

                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Save Valuator!'));

                this.activeModal.dismiss(error);
            }
        );
    }

    onClose() {
        this.activeModal.dismiss(ValuatorFormComponent);
    }


    setProvince(province: Province) {
        this.valuator.province = province;
    }

    setDistrict(district: District) {
        this.valuator.district = district;
    }

    setMunicipality(municipalityVdc: MunicipalityVdc) {
        this.valuator.municipalityVdc = municipalityVdc;
    }

    setSiteProvince(province: Province) {
        this.valuator.siteProvince = province;
    }

    setSiteDistrict(district: District) {
        this.valuator.siteDistrict = district;
    }

    setSiteMunicipality(municipalityVdc: MunicipalityVdc) {
        this.valuator.siteMunicipalityVdc = municipalityVdc;
    }
}
