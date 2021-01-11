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
import {DateValidator} from '../../../../../../@core/validator/date-validator';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {CompanyFormComponent} from '../../../customer-form/company-form/company-form.component';

@Component({
  selector: 'app-edit-swot',
  templateUrl: './edit-swot.component.html',
  styleUrls: ['./edit-swot.component.scss']
})
export class EditSwotComponent implements OnInit {

  @Input() formValue: CompanyInfo;

  calendarType = 'AD';
  companyInfoFormGroup: FormGroup;
  englishDateSelected = true;
  customerId;
  submitted = false;
  spinner = false;

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

  constructor(
      private formBuilder: FormBuilder,
      private commonLocation: AddressService,
      private loanDataService: LoanDataService,
      private activatedRoute: ActivatedRoute,
      private loanFormService: LoanFormService,
      private toastService: ToastService,
      private companyInfoService: CompanyInfoService,
      private blackListService: BlacklistService,
      protected ref: NbDialogRef<EditSwotComponent>,
      protected dialogRef: NbDialogRef<EditSwotComponent>
  ) {

  }

  get form() {
    return this.companyInfoFormGroup.controls;
  }

  ngOnInit() {
    this.buildForm();

    }

  buildForm() {
    this.companyInfoFormGroup = this.formBuilder.group({

      // swot

      strength: [(ObjectUtil.isEmpty(this.companyInfo)
          || ObjectUtil.isEmpty(this.companyInfo.swot)) ? undefined : this.companyInfo.swot.strength, Validators.required],

      weakness: [(ObjectUtil.isEmpty(this.companyInfo)
          || ObjectUtil.isEmpty(this.companyInfo.swot)) ? undefined : this.companyInfo.swot.weakness, Validators.required],

      opportunity: [(ObjectUtil.isEmpty(this.companyInfo)
          || ObjectUtil.isEmpty(this.companyInfo.swot)) ? undefined : this.companyInfo.swot.opportunity, Validators.required],

      threats: [(ObjectUtil.isEmpty(this.companyInfo)
          || ObjectUtil.isEmpty(this.companyInfo.swot)) ? undefined : this.companyInfo.swot.threats, Validators.required],

    });
  }
  getCompanyInfo(companyInfoId) {
    this.spinner = true;
    this.companyInfoService.detail(companyInfoId).subscribe((res: any) => {
      this.companyInfo = res.detail;
      this.spinner = false;
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to load company information!'));
      this.spinner = false;
    });
  }
  public refreshCompanyInfo(): void {
    this.customerInfo = undefined;
    this.getCompanyInfo(this.companyInfo.id);
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

    // swot

    this.swot.strength = this.companyInfoFormGroup.get('strength').value;
    this.swot.weakness = this.companyInfoFormGroup.get('weakness').value;
    this.swot.opportunity = this.companyInfoFormGroup.get('opportunity').value;
    this.swot.threats = this.companyInfoFormGroup.get('threats').value;
    this.companyInfo.swot = this.swot;

    this.companyInfoService.save(this.companyInfo).subscribe((response: any) => {
      this.companyInfo = response.detail;
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
