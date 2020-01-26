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
import {BranchService} from '../branch.service';
import {Branch} from '../../../modal/branch';
import {Action} from '../../../../../@core/Action';

declare let google: any;


@Component({
  selector: 'app-branch-form',
  templateUrl: './branch-form.component.html'
})
export class BranchFormComponent implements OnInit {

  @Input() model: Branch;
  @Input() action: Action;

  submitted = false;
  spinner = false;
  provinces: Province[];
  districts: District[];
  municipalities: MunicipalityVdc[];
  branchForm: FormGroup;
  latitude = 27.732454;
  longitude = 85.291543;
  markerLatitude = null;
  markerLongitude = null;
  infoWindowOpen = new FormControl(false);
  addressLabel = new FormControl('');
  zoom = 8;
  latLng: string[];


  constructor(
      private service: BranchService,
      private location: AddressService,
      private activeModal: NgbActiveModal,
      private toastService: ToastService,
      private formBuilder: FormBuilder
  ) {

  }

  get branchFormControl() {
    return this.branchForm.controls;
  }

  get locationPreview() {
    return this.branchForm.get('locationPreview');
  }

  ngOnInit() {
    this.buildForm();
    if (this.action === Action.UPDATE) {
      this.findLocation(this.locationPreview.value);
    }
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
      id: [ObjectUtil.setUndefinedIfNull(this.model.id)],
      name: [ObjectUtil.setUndefinedIfNull(this.model.name), [Validators.required]],
      landlineNumber: [ObjectUtil.setUndefinedIfNull(this.model.landlineNumber), [Validators.required]],
      email: [ObjectUtil.setUndefinedIfNull(this.model.email), [Validators.required, Validators.email]],
      province: [ObjectUtil.setUndefinedIfNull(this.model.province), [Validators.required]],
      district: [ObjectUtil.setUndefinedIfNull(this.model.district), [Validators.required]],
      municipalityVdc: [ObjectUtil.setUndefinedIfNull(this.model.municipalityVdc), [Validators.required]],
      streetName: [ObjectUtil.setUndefinedIfNull(this.model.streetName), [Validators.required]],
      wardNumber: [ObjectUtil.setUndefinedIfNull(this.model.wardNumber), [Validators.required]],
      branchCode: [ObjectUtil.setUndefinedIfNull(this.model.branchCode), [Validators.required]],
      status: [ObjectUtil.setUndefinedIfNull(this.model.status)],
      locationPreview: [ObjectUtil.setUndefinedIfNull(this.model.locationPreview)],
      version: [ObjectUtil.setUndefinedIfNull(this.model.version)]
    });
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
    (<FormGroup>this.branchForm)
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

            this.infoWindowOpen.setValue('true');
          } else {
            this.addressLabel.setValue(null);
            this.toastService.show(new Alert(AlertType.INFO, 'No address available!'));
          }
        } else {
          this.addressLabel.setValue(null);
          this.toastService.show(new Alert(AlertType.ERROR, 'Error in GeoCoder'));
        }
      });
    }
  }

  findLocation(coordinate) {
    this.latLng = coordinate.split(',', 2);
    this.placeMaker(+this.latLng[0], +this.latLng[1]);
  }

  onSubmit() {
    this.submitted = true;
    if (this.branchForm.invalid) {
      return;
    }
    this.spinner = true;
    this.model = this.branchForm.value;
    this.service.save(this.model).subscribe(() => {

          this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Branch!'));
          this.model = new Branch();
          this.activeModal.close(ModalResponse.SUCCESS);

        }, error => {
          console.error(error);
          this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Save Branch!'));
          this.activeModal.dismiss(error);
        }
    );
  }

  onClose() {
    this.activeModal.dismiss('Dismiss');
  }
}
