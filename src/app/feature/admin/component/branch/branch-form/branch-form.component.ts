import {Component, DoCheck, Input, OnInit} from '@angular/core';
import {Branch} from '../../../modal/branch';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {AddressService} from '../../../../../@core/service/baseservice/address.service';
import {Province} from '../../../modal/province';
import {District} from '../../../modal/district';
import {MunicipalityVdc} from '../../../modal/municipality_VDC';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {AlertService} from '../../../../../@theme/components/alert/alert.service';
import {ModalResponse, ToastService} from '../../../../../@core/utils';
import {BranchService} from '../branch.service';
import {FormBuilder, FormControl} from '@angular/forms';


declare let google: any;


@Component({
    selector: 'app-branch-form',
    templateUrl: './branch-form.component.html'

})
export class BranchFormComponent implements OnInit, DoCheck {

    @Input()
    model: Branch;

    task: string;
    submitted = false;
    spinner = false;

    provinces: Province[];
    districts: District[];
    municipalities: MunicipalityVdc[];
    district: District = new District();
    province: Province = new Province();
    municipality: MunicipalityVdc = new MunicipalityVdc();
    latLng: string[];
    latitude = 27.732453;
    longitude = 85.291547;
    markerLatitude = null;
    markerLongitude = null;
    infoWindowOpen = new FormControl(false);
    addressLabel = new FormControl('');
    zoom = 10;
    locationPreview: string;

    constructor(
        private service: BranchService,
        private location: AddressService,
        private activeModal: NgbActiveModal,
        private alertService: AlertService,
        private toastService: ToastService,
        private formBuilder: FormBuilder


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

    getMunicipalities() {
        this.model.district = this.district;
        this.location.getMunicipalityVDCByDistrict(this.district).subscribe(
            (response: any) => {
                this.municipalities = response.detail;
            }
        );
    }


    getDistricts(provinceId: number) {
        this.model.province = this.province;
        this.province.id = provinceId;

        this.location.getDistrictByProvince(this.province).subscribe(
            (response: any) => {
                this.districts = response.detail;
            }
        );

        this.municipalities = new Array();

    }

    ngDoCheck(): void {
        if (this.model.id == null) {
            this.task = 'Add';
            this.province = new Province();
            this.district = new District();
            this.municipality = new MunicipalityVdc();
        } else {
            this.task = 'Edit';
            this.district = this.model.district;
            this.province = this.model.province;
            this.municipality = this.model.municipalityVdc;

        }
    }

    onSubmit() {
        this.submitted = true;
        this.service.save(this.model).subscribe(() => {

                this.activeModal.close(ModalResponse.SUCCESS);

                if (this.model.id == null) {
                    this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Branch'));
                } else {
                    this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Updated Branch'));
                }

                this.model = new Branch();

            }, error => {

                console.log(error);

                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Save Branch'));

                this.activeModal.dismiss(ModalResponse.ERROR);
            }
        );
    }

    onClose() {
        this.activeModal.dismiss(ModalResponse.CANCEL);
    }

    getMunicipality() {
        this.model.municipalityVdc = this.municipality;
    }

    findLocation(coordinate) {

        this.latLng = coordinate.split(',', 2);
        this.placeMaker(+this.latLng[0], +this.latLng[1]);

    }
    placeMaker(latitude, longitude) {
        this.infoWindowOpen.setValue('false');
        this.zoom = 10;
        this.latitude = latitude;
        this.longitude = longitude;
        this.markerLatitude = this.latitude;
        this.markerLongitude = this.longitude;
        this.locationPreview = `${this.latitude},${this.longitude}`;
        this.getAddress(this.latitude, this.longitude);
    }


    getAddress(latitude: number, longitude: number) {
        if (navigator.geolocation) {
            const geocoder = new google.maps.Geocoder();
            const latlng = new google.maps.LatLng(latitude, longitude);
            const request = {latLng: latlng};
            geocoder.geocode(request, (results, status) => {
                if (status === google.maps.GeocoderStatus.OK) {
                    const result = results[0];
                    const rsltAdrComponent = result.formatted_address;
                    if (rsltAdrComponent != null) {
                        this.addressLabel.setValue(rsltAdrComponent);

                        this.infoWindowOpen.setValue('true');
                    } else {
                        this.addressLabel.setValue(null);
                        this.toastService.show(new Alert(AlertType.INFO, 'No address available!' ));
                    }
                } else {
                    this.addressLabel.setValue(null);
                    this.toastService.show(new Alert(AlertType.INFO, 'Error in GeoCoder!' ));
                }
            });
        }
    }


}
