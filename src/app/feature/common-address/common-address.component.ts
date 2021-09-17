import {Component, Input, OnInit} from '@angular/core';
import {Province} from '../admin/modal/province';
import {District} from '../admin/modal/district';
import {AddressService} from '../../@core/service/baseservice/address.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MunicipalityVdc} from '../admin/modal/municipality_VDC';
import {ObjectUtil} from '../../@core/utils/ObjectUtil';
import {SecurityIds} from '../loan-information-template/security/security-initial-form/SecurityIds';
import {NumberUtils} from '../../@core/utils/number-utils';
import {SiteVisitIds} from '../loan-information-template/site-visit/siteVisitIds';

@Component({
  selector: 'app-common-address',
  templateUrl: './common-address.component.html',
  styleUrls: ['./common-address.component.scss']
})
export class CommonAddressComponent implements OnInit {
  @Input() address;
  provinceList: Array<Province> = new Array<Province>();
  districts: Array<District> = new Array<District>();
  municipalities: Array<MunicipalityVdc> = new Array<MunicipalityVdc>();
  addressForm: FormGroup;
  submitData;
  submitted = false;
  @Input() addressId;

  constructor(private addressService: AddressService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    console.log( 'this is address', this.address);
    this.addressService.getProvince().subscribe(
        (response: any) => {
          this.provinceList = response.detail;
        });
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.address)) {
      // this.setAddressValue();
      if (!ObjectUtil.isEmpty(this.address.province)) {
        this.getDistrictsById(this.address.province.id, null);
        this.getMunicipalitiesById(this.address.district.id, null);
      }
      this.addressForm.patchValue(this.address);
    }
  }

  buildForm() {
    this.addressForm = this.formBuilder.group({
      province : [undefined , Validators.required],
      district : [undefined , Validators.required],
      municipalityVdc : [undefined , Validators.required],
      ward : [undefined , Validators.required] ,
      address1 : [undefined],
      address2 : [undefined]
    });
  }

  getDistrictsById(provinceId: number, event) {
    const province = new Province();
    province.id = provinceId;
    this.addressService.getDistrictByProvince(province).subscribe(
        (response: any) => {
          this.districts = response.detail;
          this.districts.sort((a, b) => a.name.localeCompare(b.name));
        }
    );
  }


  getMunicipalitiesById(districtId: number, event) {
    const district = new District();
    district.id = districtId;
    this.addressService.getMunicipalityVDCByDistrict(district).subscribe(
        (response: any) => {
          this.municipalities = response.detail;
          this.municipalities.sort((a, b) => a.name.localeCompare(b.name));
          if (event !== null) {
            this.addressForm.get('municipalityVdc').patchValue(null);
          }
        }
    );
  }
  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  get form() {
    return this.addressForm.controls;
  }

  onSubmit() {
    // console.log('I am here');
    this.submitted = true;
    // console.log('addressForm', this.addressForm);
    this.submitData = this.addressForm.value;
    console.log('submitData', this.submitData);
  }


  setAddressValue() {
    if (!ObjectUtil.isEmpty(this.addressForm)) {
      if (this.addressId.includes(SiteVisitIds.business, 0)) {
        this.patchAddressData('province', 'district', 'municipalityVdc', 'ward', 'address1', 'address2');
      } else if (this.addressId.includes(SiteVisitIds.current_aspect, 0)) {
        this.patchAddressData('province', 'district', 'municipalityVdc', 'ward', 'address1', 'address2');
      }
    }
  }

  patchAddressData(province, district, municipalityVdc, ward, address1, address2) {
    const i = this.addressId.replace(/[^0-9]/g, '');
    const addressData = {
      province: undefined,
      district: undefined,
      municipalityVdc: undefined,
      ward: undefined,
      address1: undefined,
      address2: undefined,
    };
    addressData.address1 = this.addressForm.get('address1')[i].value;
    addressData.address2 = this.addressForm.get('address2')[i].value;
    // calcData.changeInFmv = NumberUtils.isNumber(this.formGroup.get('revaluationDetails').value
    //         [this.formGroup.get('revaluationDetails').value.length - 1].reValuatedFmv -
    //     this.oldValuation[i][fmv]);
    // calcData.changeInDv = NumberUtils.isNumber(this.formGroup.get('revaluationDetails').value
    //         [this.formGroup.get('revaluationDetails').value.length - 1].reValuatedDv -
    //     this.oldValuation[i][dv]);
    // calcData.changeInConsideredValue = NumberUtils.isNumber(this.formGroup.get('revaluationDetails').value
    //         [this.formGroup.get('revaluationDetails').value.length - 1].reValuatedConsideredValue -
    //     this.oldValuation[i][considered]);
    this.addressForm.patchValue(addressData);
  }

}
