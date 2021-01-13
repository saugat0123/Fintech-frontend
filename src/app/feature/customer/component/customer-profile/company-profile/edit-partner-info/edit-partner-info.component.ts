import {Component, Input, OnInit} from '@angular/core';
import {CompanyInfo} from '../../../../../admin/modal/company-info';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Customer} from '../../../../../admin/modal/customer';
import {LegalStatus} from '../../../../../admin/modal/legal-status';
import {Capital} from '../../../../../admin/modal/capital';
import {Swot} from '../../../../../admin/modal/swot';
import {CompanyLocations} from '../../../../../admin/modal/companyLocations';
import {ManagementTeam} from '../../../../../admin/modal/management-team';
import {Proprietors} from '../../../../../admin/modal/proprietors';
import {Province} from '../../../../../admin/modal/province';
import {District} from '../../../../../admin/modal/district';
import {MunicipalityVdc} from '../../../../../admin/modal/municipality_VDC';
import {Address} from '../../../../../loan/model/address';
import {BusinessType} from '../../../../../admin/modal/businessType';
import {ContactPerson} from '../../../../../admin/modal/contact-person';
import {AddressService} from '../../../../../../@core/service/baseservice/address.service';
import {LoanDataService} from '../../../../../loan/service/loan-data.service';
import {ActivatedRoute} from '@angular/router';
import {LoanFormService} from '../../../../../loan/component/loan-form/service/loan-form.service';
import {ModalResponse, ToastService} from '../../../../../../@core/utils';
import {CompanyInfoService} from '../../../../../admin/service/company-info.service';
import {BlacklistService} from '../../../../../admin/component/blacklist/blacklist.service';
import {NbDialogRef} from '@nebular/theme';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {CompanyFormComponent} from '../../../customer-form/company-form/company-form.component';
import {DateValidator} from '../../../../../../@core/validator/date-validator';
import {DesignationList} from '../../../../../loan/model/designationList';

@Component({
  selector: 'app-edit-partner-info',
  templateUrl: './edit-partner-info.component.html',
  styleUrls: ['./edit-partner-info.component.scss']
})
export class EditPartnerInfoComponent implements OnInit {

  @Input() formValue: CompanyInfo;

  calendarType = 'AD';
  companyInfoFormGroup: FormGroup;
  englishDateSelected = true;
  customerId;
  submitted = false;
  spinner = false;
  add = false;

  companyFormField = {
    showFormField: false,
    isOldCustomer: false
  };

  companySearch = {
    registrationNumber: undefined
  };
  customer: Customer = new Customer();
  customerInfo: Customer;
  companyInfo: CompanyInfo;
  legalStatus: LegalStatus = new LegalStatus();
  capital: Capital = new Capital();
  swot: Swot = new Swot();
  locations: CompanyLocations = new CompanyLocations();
  managementTeamList: Array<ManagementTeam> = new Array<ManagementTeam>();
  proprietors: Proprietors = new Proprietors();
  proprietorsList: Array<Proprietors> = new Array<Proprietors>();
  provinceList: Array<Province> = new Array<Province>();
  districtList: Array<District> = new Array<District>();
  municipalityVdcList: Array<MunicipalityVdc> = new Array<MunicipalityVdc>();
  addressList: Array<Address> = new Array<Address>();
  businessTypes = BusinessType.enumObject();
  contactPerson: ContactPerson = new ContactPerson();
  private isBlackListed: boolean;
  designationList: DesignationList = new DesignationList();
  designation;

  constructor(
      private formBuilder: FormBuilder,
      private commonLocation: AddressService,
      private loanDataService: LoanDataService,
      private activatedRoute: ActivatedRoute,
      private loanFormService: LoanFormService,
      private toastService: ToastService,
      private companyInfoService: CompanyInfoService,
      private blackListService: BlacklistService,
      protected ref: NbDialogRef<CompanyFormComponent>,
      protected dialogRef: NbDialogRef<EditPartnerInfoComponent>
  ) {

  }

  get form() {
    return this.companyInfoFormGroup.controls;
  }

  ngOnInit() {
    this.buildForm();
    this.designation = this.designationList.designation;
    this.commonLocation.getProvince().subscribe(
        (response: any) => {
          this.provinceList = response.detail;
          this.provinceList.forEach((province: Province) => {
            if (this.customerInfo !== undefined) {
              if (!ObjectUtil.isEmpty(this.customerInfo.province)) {
                if (province.id === this.customerInfo.province.id) {
                  this.companyInfoFormGroup.controls.contactProvince.setValue(province);
                  this.getDistricts(province.id, null);
                }
              }
            }
          });
        }
    );


    if (ObjectUtil.isEmpty(this.companyInfo.proprietorsList)) {
      this.customerId = Number(this.activatedRoute.snapshot.queryParamMap.get('customerId'));
      if (this.customerId !== 0) {
        this.loanFormService.detail(this.customerId).subscribe(
            (response: any) => {
              this.commonLocation.getProvince().subscribe(
                  (responseProvince: any) => {
                    this.provinceList = responseProvince.detail;
                    this.provinceList.forEach((province: Province) => {
                      if (this.customerInfo !== undefined) {
                        if (!ObjectUtil.isEmpty(this.customerInfo.province)) {
                          if (province.id === this.customerInfo.province.id) {
                            this.companyInfoFormGroup.controls.contactProvince.setValue(province);
                            this.getDistricts(province.id, null);
                          }
                        }
                      }
                    });
                  }
              );
              this.companyInfo = response.detail.companyInfo;
              this.buildForm();
            }
        );
      }
    } else {
      this.setCompanyInfo(this.companyInfo.proprietorsList);
    }
  }

  buildForm() {
    this.companyInfoFormGroup = this.formBuilder.group({

      companyInfoVersion:
          [(ObjectUtil.isEmpty(this.companyInfo)
              || ObjectUtil.isEmpty(this.companyInfo.version)) ? undefined :
              this.companyInfo.version],
      // proprietors
      proprietors: this.formBuilder.array([
        this.proprietorsFormGroup()
      ]),




    });
  }

  setCompanyInfo(data) {
    // proprietors data
    this.companyInfoFormGroup.setControl('proprietors', this.setProprietors(data));
  }




  proprietorsFormGroup(): FormGroup {
    this.addressList.push(new Address());
    return this.formBuilder.group({
      name: [undefined, Validators.required],
      contactNo: [undefined],
      share: [undefined, Validators.required],
      province: [null],
      district: [null],
      municipalityVdc: [null],
      type: [null, Validators.required]
    });
  }

  setProprietors(proprietorsList: Array<Proprietors>): FormArray {
    const managementTeamFormArray = new FormArray([]);
    this.addressList = new Array<Address>(proprietorsList.length);
    let proprietorIndex = 0;
    proprietorsList.forEach(proprietors => {
      this.addressList[proprietorIndex] = new Address();
      if (!ObjectUtil.isEmpty(proprietors.province) && proprietors.province.id !== null) {
        this.getDistricts(proprietors.province.id, proprietorIndex);
        if (!ObjectUtil.isEmpty(proprietors.district) && proprietors.district.id !== null) {
          this.getMunicipalities(proprietors.district.id, proprietorIndex);
        }
      }
      proprietorIndex++;
      managementTeamFormArray.push(this.formBuilder.group({
        name: [proprietors.name === undefined ? '' : proprietors.name, Validators.required],
        contactNo: [proprietors.contactNo === undefined ? '' : proprietors.contactNo],
        share: [proprietors.share === undefined ? '' : proprietors.share, Validators.required],
        province: [ObjectUtil.isEmpty(proprietors.province) ? undefined :
            proprietors.province.id === undefined ? '' : proprietors.province.id],
        district: [ObjectUtil.isEmpty(proprietors.district) ? undefined :
            proprietors.district.id === undefined ? '' : proprietors.district.id],
        municipalityVdc: [ObjectUtil.isEmpty(proprietors.municipalityVdc) ? undefined :
            proprietors.municipalityVdc.id === undefined ? '' : proprietors.municipalityVdc.id],
        type: [proprietors.type === undefined ? '' : proprietors.type, Validators.required]
      }));
    });
    return managementTeamFormArray;
  }

  // return proprietors formArray
  getProprietor() {
    return (this.companyInfoFormGroup.value.proprietors as FormArray);
  }

  removeProprietor(index: number) {
    (<FormArray>this.companyInfoFormGroup.get('proprietors')).removeAt(index);
    this.addressList.splice(index, 1);
  }

  addProprietor() {
    if (this.companyInfoFormGroup.invalid) {
      this.add = true;
      return;
    }
    this.addressList.push(new Address());
    (<FormArray>this.companyInfoFormGroup.get('proprietors')).push(this.proprietorsFormGroup());
  }

  // get district list based on province
  getDistricts(provinceId: number, proprietorIndex: number) {
    const province = new Province();
    province.id = provinceId;
    this.commonLocation.getDistrictByProvince(province).subscribe(
        (response: any) => {
          this.districtList = response.detail;
          if (proprietorIndex == null) {
            if (!ObjectUtil.isEmpty(this.customerInfo)) {
              this.districtList.forEach(district => {
                if (!ObjectUtil.isEmpty(this.customerInfo['district']) && district.id === this.customerInfo.district.id) {
                  this.companyInfoFormGroup.controls.contactDistrict.setValue(district);
                  this.getMunicipalities(district.id, null);
                }
              });
            }

          }
          if (!ObjectUtil.isEmpty(proprietorIndex)) {
            this.addressList[proprietorIndex].districtList = this.districtList;
          }

        }
    );
  }

  // get municipalityVdc list based on district
  getMunicipalities(districtId: number, proprietorIndex: number) {
    const district = new District();
    district.id = districtId;
    this.commonLocation.getMunicipalityVDCByDistrict(district).subscribe(
        (response: any) => {
          this.municipalityVdcList = response.detail;
          if (proprietorIndex == null) {
            if (!ObjectUtil.isEmpty(this.customerInfo)) {
              this.municipalityVdcList.forEach(municipality => {
                if (!ObjectUtil.isEmpty(this.customerInfo.municipalities) &&
                    municipality.id === this.customerInfo.municipalities.id) {
                  this.companyInfoFormGroup.controls.contactMunicipalities.setValue(municipality);
                }
              });
            }
          }
          if (!ObjectUtil.isEmpty(proprietorIndex)) {
            this.addressList[proprietorIndex].municipalityVdcList = this.municipalityVdcList;
          }
        }
    );
  }

  onSubmit() {
    this.submitted = true;
    if (this.companyInfoFormGroup.invalid) {
      return;
    }
    this.spinner = true;


    // proprietorsList
    this.companyInfo.proprietorsList = new Array<Proprietors>();
    let proprietorsIndex = 0;
    while (proprietorsIndex < this.getProprietor().length) {
      const proprietors = new Proprietors();
      proprietors.name = this.getProprietor()[proprietorsIndex].name;
      proprietors.contactNo = this.getProprietor()[proprietorsIndex].contactNo;
      proprietors.share = this.getProprietor()[proprietorsIndex].share;
      proprietors.type = this.getProprietor()[proprietorsIndex].type;
      const province = new Province();
      province.id = this.getProprietor()[proprietorsIndex].province;
      proprietors.province = (!ObjectUtil.isEmpty(this.getProprietor()[proprietorsIndex].province)) ?  province : undefined;
      const district = new District();
      district.id = this.getProprietor()[proprietorsIndex].district;
      proprietors.district = (!ObjectUtil.isEmpty(this.getProprietor()[proprietorsIndex].district)) ?  district : undefined;
      const municipalityVdc = new MunicipalityVdc();
      municipalityVdc.id = this.getProprietor()[proprietorsIndex].municipalityVdc;
      proprietors.municipalityVdc = (!ObjectUtil.isEmpty(this.getProprietor()[proprietorsIndex].municipalityVdc))
          ? municipalityVdc : undefined;
      proprietorsIndex++;
      this.companyInfo.proprietorsList.push(proprietors);
    }
    this.companyInfoService.save(this.companyInfo).subscribe((response: any) => {
      this.toastService.show(new Alert(AlertType.SUCCESS, `Company Saved Successfully`));
      this.dialogRef.close(ModalResponse.SUCCESS);
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, `Error saving Company: ${error.error.message}`));
    });
  }

  selectDate(value) {
    this.englishDateSelected = !value;
  }

  close() {
    this.ref.close();
  }



}
