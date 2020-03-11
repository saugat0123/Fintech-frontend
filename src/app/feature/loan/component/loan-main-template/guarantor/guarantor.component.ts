import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Province} from '../../../../admin/modal/province';
import {District} from '../../../../admin/modal/district';
import {MunicipalityVdc} from '../../../../admin/modal/municipality_VDC';
import {Guarantor} from '../../../model/guarantor';
import {Address} from '../../../model/address';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {AddressService} from '../../../../../@core/service/baseservice/address.service';
import {GuarantorDetail} from '../../../model/guarantor-detail';
import {ToastService} from '../../../../../@core/utils';
import {BlacklistService} from '../../../../admin/component/blacklist/blacklist.service';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';

@Component({
  selector: 'app-guarantor',
  templateUrl: './guarantor.component.html',
  styleUrls: ['./guarantor.component.scss']
})
export class GuarantorComponent implements OnInit {
  @Input() guarantorDetailValue: GuarantorDetail;
  @Output() blackListStatusEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  form: FormGroup;
  submitted = false;
  guarantorDetail: GuarantorDetail = new GuarantorDetail();
  displayEngDate = true;

  province: Province = new Province();
  provinceList: Array<Province> = new Array<Province>();
  district: District = new District();
  districtList: Array<District> = Array<District>();
  municipality: MunicipalityVdc = new MunicipalityVdc();
  municipalitiesList: Array<MunicipalityVdc> = Array<MunicipalityVdc>();
  addressList: Array<Address> = new Array<Address>();
  private isBlackListed: boolean;

  constructor(
      private formBuilder: FormBuilder,
      private addressServices: AddressService,
      private toastService: ToastService,
      private blackListService: BlacklistService
  ) {
  }

  ngOnInit() {
    this.buildForm();
    this.getProvince();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      guarantorDetails: this.formBuilder.array([])
    });

    if (ObjectUtil.isEmpty(this.guarantorDetailValue)) {
      this.addEmptyGroup();
    } else {
      const formArray = this.form.get('guarantorDetails') as FormArray;
      if (this.guarantorDetailValue.guarantorList.length === 0) {
        this.addEmptyGroup();
        return;
      }
      this.guarantorDetailValue.guarantorList.forEach((v, index) => {
        this.addressList.push(new Address());
        if (!ObjectUtil.isEmpty(v.province) && !ObjectUtil.isEmpty(v.province.id)) {
          this.getDistrict(v.province.id, index);
          if (!ObjectUtil.isEmpty(v.district.id)) {
            this.getMunicipalities(v.district.id, index);
          }
        }
        formArray.push(this.addGuarantorDetails(v));
      });
    }
  }

  addEmptyGroup(): void {
    this.addressList.push(new Address());
    const formArray = this.form.get('guarantorDetails') as FormArray;
    formArray.push(this.addGuarantorDetails(new Guarantor()));
  }

  addGuarantorDetails(data: Guarantor) {
    return this.formBuilder.group({
      id: [
        ObjectUtil.setUndefinedIfNull(data.id)
      ],
      version: [
        ObjectUtil.setUndefinedIfNull(data.version)
      ],
      name: [
        ObjectUtil.setUndefinedIfNull(data.name),
        Validators.required
      ],
      province: [
        ObjectUtil.isEmpty(data.province) ? undefined : data.province.id,
        Validators.required
      ],
      district: [
        ObjectUtil.isEmpty(data.district) ? undefined : data.district.id,
        Validators.required
      ],
      municipalities: [
        ObjectUtil.isEmpty(data.municipalities) ? undefined : data.municipalities.id,
        Validators.required
      ],
      citizenNumber: [
        ObjectUtil.setUndefinedIfNull(data.citizenNumber),
        Validators.required
      ],
      issuedYear: [
        ObjectUtil.setUndefinedIfNull(data.issuedYear),
        Validators.required
      ],
      issuedPlace: [
        ObjectUtil.setUndefinedIfNull(data.issuedPlace),
        Validators.required
      ],
      contactNumber: [
        ObjectUtil.setUndefinedIfNull(data.contactNumber),
        Validators.required
      ],
      fatherName: [
        ObjectUtil.setUndefinedIfNull(data.fatherName),
        Validators.required
      ],
      grandFatherName: [
        ObjectUtil.setUndefinedIfNull(data.grandFatherName),
        Validators.required
      ],
      relationship: [
        ObjectUtil.setUndefinedIfNull(data.relationship),
        Validators.required
      ]
    });
  }

  removeGuarantorDetails(index: number) {
    (this.form.get('guarantorDetails') as FormArray).removeAt(index);
  }

  getProvince() {
    this.addressServices.getProvince().subscribe((response: any) => {
      this.provinceList = response.detail;
    });
  }

  getDistrict(provinceId: number, i: number) {
    const province = new Province();
    province.id = provinceId;
    this.addressServices.getDistrictByProvince(province).subscribe((response: any) => {
      this.districtList = response.detail;
      this.addressList[i].districtList = this.districtList;
    });
  }

  getMunicipalities(districtId: number, i: number) {
    const district = new District();
    district.id = districtId;
    this.addressServices.getMunicipalityVDCByDistrict(district).subscribe((response: any) => {
      this.municipalitiesList = response.detail;
      this.addressList[i].municipalityVdcList = this.municipalitiesList;
    });
  }

  onSubmit() {
    if (!ObjectUtil.isEmpty(this.guarantorDetailValue)) {
      this.guarantorDetail = this.guarantorDetailValue;
    }
    this.guarantorDetail.guarantorList = new Array<Guarantor>();
    const formArray = this.form.get('guarantorDetails') as FormArray;
    formArray['controls'].forEach(c => {
      const guarantor: Guarantor = c.value;
      if (!ObjectUtil.isEmpty(c.get('province').value)) {
        const province = new Province();
        province.id = c.get('province').value;
        guarantor.province = province;
        const district = new District();
        district.id = c.get('district').value;
        guarantor.district = district;
        const municipalityVdc = new MunicipalityVdc();
        municipalityVdc.id = c.get('municipalities').value;
        guarantor.municipalities = municipalityVdc;
      }
      this.guarantorDetail.guarantorList.push(guarantor);
    });
  }

  checkBlackListByCitizenshipNo(citizenshipNum, index) {
    this.blackListService.checkBlacklistByRef(citizenshipNum).subscribe((response: any) => {
      this.isBlackListed = response.detail;
      this.blackListStatusEmitter.emit(this.isBlackListed);

      if (this.isBlackListed) {
        this.toastService.show(new Alert(AlertType.ERROR, 'Blacklisted Guarantor'));
        (this.form.get('guarantorDetails') as FormArray).controls[index].reset();
      }
    });
  }

  showHideNep(value) {
    this.displayEngDate = value !== 0;
  }
}
