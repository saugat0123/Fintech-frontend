import {Component, DoCheck, Input, OnInit} from '@angular/core';
import {Valuator} from '../../../modal/valuator';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {AddressService} from '../../../../../@core/service/baseservice/address.service';

import {Province} from '../../../modal/province';
import {District} from '../../../modal/district';
import {MunicipalityVdc} from '../../../modal/municipality_VDC';
import {ModalResponse, ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ValuatorService} from '../valuator.service';


@Component({
    selector: 'app-valuator-form',
    templateUrl: './add-valuator.component.html'
})
export class ValuatorFormComponent implements OnInit, DoCheck {

    @Input()
    model: Valuator = new Valuator();

    task: string;
    submitted = false;
    spinner = false;
    globalMsg: string;
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
        private service: ValuatorService,
        private location: AddressService,
        private activeModal: NgbActiveModal,
        private toastService: ToastService
    ) {

    }

    ngOnInit() {
        this.location.getProvince().subscribe((response: any) => {
            this.provinces = response.detail;
            this.province = this.model.province;
            if (this.province !== undefined) {
                this.getSelectedProvinceDistrict();
            }
            this.district = this.model.district;
            if (this.district !== undefined) {
                this.getSelectedDistrictMunicipality();
            }
            this.siteProvince = this.model.siteProvince;
            if (this.siteProvince !== undefined) {
                this.getSelectedProvinceSiteDistrict();
            }
            this.siteDistrict = this.model.siteDistrict;
            if (this.siteDistrict !== undefined) {
                this.getSelectedDistrictSiteMunicipality();
            }
        });
    }

    getSelectedProvinceDistrict() {
        this.location.getDistrictByProvince(this.model.province).subscribe(
            (response: any) => {
                this.districts = response.detail;
            }
        );
    }

    getSelectedDistrictMunicipality() {
        this.location.getMunicipalityVDCByDistrict(this.model.district).subscribe(
            (response: any) => {
                this.municipalities = response.detail;
            }
        );
    }

    getSelectedProvinceSiteDistrict() {
        this.location.getDistrictByProvince(this.model.siteProvince).subscribe(
            (response: any) => {
                this.siteDistricts = response.detail;
            }
        );
    }

    getSelectedDistrictSiteMunicipality() {
        this.location.getMunicipalityVDCByDistrict(this.model.siteDistrict).subscribe(
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
        if (this.model.id == null) {
            this.task = 'Add';
            this.district = new District();
            this.province = new Province();
            this.municipality = new MunicipalityVdc();
            this.siteDistrict = new District();
            this.siteProvince = new Province();
            this.siteMunicipality = new MunicipalityVdc();
        } else {
            this.district = this.model.district;
            this.province = this.model.province;
            this.municipality = this.model.municipalityVdc;
            this.siteDistrict = this.model.siteDistrict;
            this.siteProvince = this.model.siteProvince;
            this.siteMunicipality = this.model.siteMunicipalityVdc;
            this.task = 'Edit';
        }

    }

    onSubmit() {

        this.submitted = true;
        this.service.save(this.model).subscribe(() => {

                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Valuator!'));

                this.model = new Valuator();

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
        this.model.province = province;
    }

    setDistrict(district: District) {
        this.model.district = district;
    }

    setMunicipality(municipalityVdc: MunicipalityVdc) {
        this.model.municipalityVdc = municipalityVdc;
    }

    setSiteProvince(province: Province) {
        this.model.siteProvince = province;
    }

    setSiteDistrict(district: District) {
        this.model.siteDistrict = district;
    }

    setSiteMunicipality(municipalityVdc: MunicipalityVdc) {
        this.model.siteMunicipalityVdc = municipalityVdc;
    }
}
