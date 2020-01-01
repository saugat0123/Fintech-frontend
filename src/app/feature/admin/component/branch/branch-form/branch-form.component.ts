import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {AddressService} from '../../../../../@core/service/baseservice/address.service';
import {Province} from '../../../modal/province';
import {District} from '../../../modal/district';
import {MunicipalityVdc} from '../../../modal/municipality_VDC';
import {ModalResponse, ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {BranchService} from '../../branch/branch.service';
import {Branch} from '../../../modal/branch';
import {branchFormValue} from "../../../modal/branchFormValue";

declare let google: any;



@Component({
    selector: 'app-branch-form',
    templateUrl: './branch-form.component.html'
})
export class BranchFormComponent implements OnInit {

    @Input()
    model: Branch = new Branch();

    @Input() formValue: branchFormValue;


    submitted = false;
    spinner = false;
    provinces: Province[];
    districts: District[];
    municipalities: MunicipalityVdc[];
    branchForm: FormGroup;
    task: string;
    latitude = 27.732454;
    longitude = 85.291543;
    markerLatitude = null;
    markerLongitude = null;
    googleMapForm = false;
    infoWindowOpen = new FormControl(false);
    addressLabel = new FormControl('');
    zoom = 8;
    latLng: string[];
    formDataForEdit ;


    constructor(
        private service: BranchService,
        private location: AddressService,
        private activeModal: NgbActiveModal,
        private toastService: ToastService,
        private formBuilder: FormBuilder
    ) {

    }

    ngOnInit() {
        if (!ObjectUtil.isEmpty(this.formValue)) {
            const stringFormData = this.formValue.data;
            this.formDataForEdit = JSON.parse(stringFormData);
        }

        this.buildForm();
        this.location.getProvince().subscribe((response: any) => {
            this.provinces = response.detail;
        });


        if (!ObjectUtil.isEmpty(this.model.province)) {
            this.getDistrictsById(this.model.province.id, null);
            this.getMunicipalitiesById(this.model.district.id, null);
        }
    }

    buildForm() {
        this.branchForm = this.formBuilder.group({
            id: [(ObjectUtil.isEmpty(this.model)
                || ObjectUtil.isEmpty(this.model.id)) ? undefined :
                this.model.id],
            name: [(ObjectUtil.isEmpty(this.model)
                || ObjectUtil.isEmpty(this.model.name)) ? undefined :
                this.model.name, [Validators.required]],
            landlineNumber: [(ObjectUtil.isEmpty(this.model)
                || ObjectUtil.isEmpty(this.model.landlineNumber)) ? undefined :
                this.model.landlineNumber, [Validators.required]],
            email: [(ObjectUtil.isEmpty(this.model)
                || ObjectUtil.isEmpty(this.model.email)) ? undefined :
                this.model.email, [Validators.required, Validators.email]],
            province: [(ObjectUtil.isEmpty(this.model)
                || ObjectUtil.isEmpty(this.model.province)) ? undefined :
                this.model.province, [Validators.required]],
            district: [(ObjectUtil.isEmpty(this.model)
                || ObjectUtil.isEmpty(this.model.district)) ? undefined :
                this.model.district, [Validators.required]],
            municipalityVdc: [(ObjectUtil.isEmpty(this.model)
                || ObjectUtil.isEmpty(this.model.municipalityVdc)) ? undefined :
                this.model.municipalityVdc, [Validators.required]],
            streetName: [(ObjectUtil.isEmpty(this.model)
                || ObjectUtil.isEmpty(this.model.streetName)) ? undefined :
                this.model.streetName, [Validators.required]],
            wardNumber: [(ObjectUtil.isEmpty(this.model)
                || ObjectUtil.isEmpty(this.model.wardNumber)) ? undefined :
                this.model.wardNumber, [Validators.required]],
            branchCode: [(ObjectUtil.isEmpty(this.model)
                || ObjectUtil.isEmpty(this.model.branchCode)) ? undefined :
                this.model.branchCode, [Validators.required]],
            status: [(ObjectUtil.isEmpty(this.model)
                || ObjectUtil.isEmpty(this.model.status)) ? undefined :
                this.model.status],

            googleMapDetails: this.formBuilder.group({
                locationPreview: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.googleMapDetails === undefined ? ''
                    : this.formDataForEdit.googleMapDetails.locationPreview],
                mapAddress: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.googleMapDetails === undefined ? ''
                    : this.formDataForEdit.googleMapDetails.mapAddress],
            })
    });
    }

    get branchFormControl() {
        return this.branchForm.controls;
    }

    compareFn(c1: any, c2: any): boolean {
        return c1 && c2 ? c1.id === c2.id : c1 === c2;
    }

    getDistrictsById(provinceId: number, event) {
        const province = new Province();
        province.id = provinceId;
        this.location.getDistrictByProvince(province).subscribe(
            (response: any) => {
                this.districts = response.detail;
                if (event !== null) {
                    this.branchForm.get('district').patchValue(null);
                    this.branchForm.get('municipalityVdc').patchValue(null);
                    this.municipalities = null;
                }
            }
        );
    }

    getMunicipalitiesById(districtId: number, event) {
        const district = new District();
        district.id = districtId;
        this.location.getMunicipalityVDCByDistrict(district).subscribe(
            (response: any) => {
                this.municipalities = response.detail;
                if (event !== null) {
                    this.branchForm.get('municipalityVdc').patchValue(null);
                }
            }
        );
    }

    placeMaker(latitude, longitude) {
        this.infoWindowOpen.setValue('false');
        this.zoom = 10;
        this.latitude = latitude;
        this.longitude = longitude;
        this.markerLatitude = this.latitude;
        this.markerLongitude = this.longitude;
        (<FormGroup>this.branchForm
            .get('googleMapDetails'))
            .get('locationPreview')
            .setValue(this.latitude + ',' + this.longitude);
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
                        (<FormGroup>this.branchForm
                            .get('googleMapDetails'))
                            .get('mapAddress')
                            .setValue(rsltAdrComponent);
                        this.infoWindowOpen.setValue('true');
                    } else {
                        this.addressLabel.setValue(null);
                        (<FormGroup>this.branchForm
                            .get('googleMapDetails'))
                            .get('mapAddress')
                            .setValue(null);
                        alert('No address available!');
                    }
                } else {
                    this.addressLabel.setValue(null);
                    (<FormGroup>this.branchForm
                        .get('googleMapDetails'))
                        .get('mapAddress')
                        .setValue(null);
                    alert('Error in GeoCoder');
                }
            });
        }
    }

    findLocation() {
        const coordinate = (<FormGroup>this.branchForm
            .get('googleMapDetails'))
            .get('locationPreview').value;
        this.latLng = coordinate.split(',', 2);
        this.placeMaker(+this.latLng[0], +this.latLng[1]);

    }
    onSubmit() {
        this.submitted = true;
        if (this.branchForm.invalid) { return; }
        this.spinner = true;
        this.model = this.branchForm.value;
        this.service.save(this.model).subscribe(() => {

                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Branch!'));
                this.model = new Branch();
                this.activeModal.close(ModalResponse.SUCCESS);

            }, error => {

                console.log(error);

                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Save Branch!'));
                this.activeModal.dismiss(error);
            }
        );
    }

    onClose() {
        this.activeModal.dismiss(BranchFormComponent);
    }
}

