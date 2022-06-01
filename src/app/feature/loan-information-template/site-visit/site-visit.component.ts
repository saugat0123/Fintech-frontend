import {Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {SiteVisit} from '../../admin/modal/siteVisit';
import {NbDateService} from '@nebular/theme';
import {ToastService} from '../../../@core/utils';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {FormUtils} from '../../../@core/utils/form.utils';
import {Pattern} from '../../../@core/utils/constants/pattern';
import {InsuranceList} from '../../loan/model/insuranceList';
import {CommonAddressComponent} from '../../common-address/common-address.component';
import {RoleService} from '../../admin/component/role-permission/role.service';
import {CalendarType} from '../../../@core/model/calendar-type';
import {DateValidator} from '../../../@core/validator/date-validator';
import {NgxSpinnerService} from 'ngx-spinner';
import {CustomerInfoData} from '../../loan/model/customerInfoData';

declare let google: any;

@Component({
  selector: 'app-site-visit',
  templateUrl: './site-visit.component.html',
  styleUrls: ['./site-visit.component.css']
})
export class SiteVisitComponent implements OnInit {
  @Input() formValue: SiteVisit;
  @Input() fromProfile: boolean;
  @Output() siteVisitDataEmitter = new EventEmitter();
  calendarType = CalendarType.AD;
  @Input() customerInfo: CustomerInfoData;

  @ViewChildren('currentResidentAddress') currentResidentAddress: QueryList<CommonAddressComponent>;
  @ViewChild('fixedAssetsAddress', {static: true}) fixedAssetsAddress: CommonAddressComponent;
  @ViewChildren('businessOfficeAddress') businessOfficeAddress:  QueryList<CommonAddressComponent>;

  siteVisitData: SiteVisit = new SiteVisit();
  siteVisitFormGroup: FormGroup;
  submitted = false;
  business = false;
  resident = false;
  current = false;
  currentResidentForm = false;
  businessSiteVisitForm = false;
  currentAssetsInspectionForm = false;
  latitude = 27.732454;
  longitude = 85.291543;
  markerLatitude = null;
  markerLongitude = null;
  infoWindowOpen = new FormControl(false);
  addressLabel = new FormControl('');
  zoom = 8;
  latLng: string[];
  formDataForEdit;
  currentResident = false;
  yesNo = ['Yes', 'No'];
  date: Date;
  designationList = [];
  insuranceList = InsuranceList.insuranceCompanyList;
  spinner = false;
  breakException: any;
  operatingStatusList = ['Regular', 'Partial', 'Closed'];

  constructor(private formBuilder: FormBuilder,
              dateService: NbDateService<Date>,
              private toastService: ToastService,
              private overlay: NgxSpinnerService,
              private roleService: RoleService) {
    this.date = dateService.today();
  }

  get currentResidentDetailsForm() {
    return (<FormArray>this.siteVisitFormGroup.get('currentResidentDetails')).controls;
  }

  get businessSiteVisitDetailsForm() {
    return (<FormArray>this.siteVisitFormGroup.get('businessSiteVisitDetails')).controls;
  }

  get formControls() {
    return this.siteVisitFormGroup.controls;
  }

  ngOnInit() {
    this.getRoleList();
    if (!ObjectUtil.isEmpty(this.formValue)) {
      const stringFormData = this.formValue.data;
      this.formDataForEdit = JSON.parse(stringFormData);
    }

    this.buildForm();
    if (this.formDataForEdit !== undefined) {
      if (ObjectUtil.isEmpty(this.formDataForEdit.businessSiteVisitDetails)) {
        this.addBusinessSiteVisitDetails();
      }
      if (ObjectUtil.isEmpty(this.formDataForEdit.currentResidentDetails)) {
        this.addCurrentResidentDetails();
      }
      if (ObjectUtil.isEmpty(this.formDataForEdit.currentAssetsInspectionDetails)) {
        this.addMoreCurrentAssets();
      }
      this.populateData();
    } else {
      this.addCurrentResidentDetails();
      this.addBusinessSiteVisitDetails();
      this.addMoreCurrentAssets();
    }
  }

  buildForm() {
    this.siteVisitFormGroup = this.formBuilder.group({
      currentResidentFormChecked: [false],
      businessSiteVisitFormChecked: [false],
      fixedAssetCollateralFormChecked: [false],
      currentAssetsInspectionFormChecked: [false],
      currentResidentDetails: this.formBuilder.array([]),
      businessSiteVisitDetails: this.formBuilder.array([]),
      currentAssetsInspectionDetails: this.formBuilder.array([])
    });
  }

  checkboxSelected(label: String, isChecked: boolean) {
    if (label === 'currentResident') {
      this.currentResidentForm = isChecked;
      this.siteVisitFormGroup.get('currentResidentFormChecked').patchValue(isChecked);
    } else if (label === 'businessSiteVisit') {
      this.businessSiteVisitForm = isChecked;
      this.siteVisitFormGroup.get('businessSiteVisitFormChecked').patchValue(isChecked);

    } else if (label === 'currentAssetsInspection') {
      this.currentAssetsInspectionForm = isChecked;
      this.siteVisitFormGroup.get('currentAssetsInspectionFormChecked').patchValue(isChecked);
    }
  }

  populateData() {
    this.checkboxSelected('currentResident', this.formDataForEdit['currentResidentFormChecked']);
    this.checkboxSelected('businessSiteVisit', this.formDataForEdit['businessSiteVisitFormChecked']);
    this.checkboxSelected('currentAssetsInspection', this.formDataForEdit['currentAssetsInspectionFormChecked']);
    if (!ObjectUtil.isEmpty(this.formDataForEdit) && !ObjectUtil.isEmpty(this.formDataForEdit.currentResidentDetails)) {
      this.setCurrentResident(this.formDataForEdit.currentResidentDetails);
    }
    if (!ObjectUtil.isEmpty(this.formDataForEdit) && !ObjectUtil.isEmpty(this.formDataForEdit.businessSiteVisitDetails)) {
      this.setBusinessSiteVisit(this.formDataForEdit.businessSiteVisitDetails);
    }
    if (!ObjectUtil.isEmpty(this.formDataForEdit.currentAssetsInspectionDetails)) {
      const currentDetail = this.formDataForEdit.currentAssetsInspectionDetails;
      this.setCurrentAssetsDetails(currentDetail);
      currentDetail.forEach((data, i) => {
        this.setInspectingStaffsDetails(data.insuranceVerification.inspectingStaffsDetails, i);
        this.setPartyFormDetails(data.receivablesAndPayables.parties, i);
        this.setPayablePartyFormDetails(data.payable ? data.payable.parties : undefined, i);
        this.setReceivableAssetsDetails(data.otherCurrentAssets.receivableAssets, i);
        this.setPayableAssetsDetails(data.otherCurrentAssets.payableAssets, i);
        this.setOtherCurrentInspectingStaffs(data.otherCurrentAssets.inspectingStaffs, i);
        this.setBankExposures(data.otherCurrentAssets.bankExposures, i);
      });
    }
  }

  staffsFormGroup(): FormGroup {
    return this.formBuilder.group({
      staffRepresentativeNameDesignation: undefined,
      staffRepresentativeName: undefined,
      staffRepresentativeNameDesignation2: undefined,
      staffRepresentativeName2: undefined,
    });
  }

  addInspectingStaffsDetails(i) {
    const controls = (this.siteVisitFormGroup
        .get(['currentAssetsInspectionDetails', i, 'insuranceVerification']) as FormGroup)
        .get('inspectingStaffsDetails') as FormArray;
    if (FormUtils.checkEmptyProperties(controls)) {
      this.toastService.show(new Alert(AlertType.INFO, 'Please Fil All Data To Add More'));
      return;
    }
    controls.push(this.staffsFormGroup());
  }

  deleteInspectingStaffsDetails(i, index) {
    ((this.siteVisitFormGroup
        .get(['currentAssetsInspectionDetails', i, 'insuranceVerification']) as FormGroup)
        .get('inspectingStaffsDetails') as FormArray).removeAt(index);
  }

  currentResidentFormGroup(): FormGroup {
    return this.formBuilder.group({
      address: [undefined],
      nearBy: [undefined, Validators.required],
      ownerName: [undefined, [Validators.required, Validators.pattern(Pattern.ALPHABET_ONLY)]],
      dateOfVisit: [undefined, Validators.required],
      staffRepresentativeNameDesignation: [undefined],
      staffRepresentativeName: [undefined],
      staffRepresentativeNameDesignation2: [undefined],
      staffRepresentativeName2: [undefined],
      findingComment: [undefined],
      locationPreview: [undefined],
      currentSiteVisitLongitude: [undefined],
      currentSiteVisiLatitude: [undefined],
    });
  }

  businessSiteVisitFormGroup(): FormGroup {
    return this.formBuilder.group({
      officeAddress: [undefined],
      operatingStatus: [undefined],
      nameOfThePersonContacted: [undefined, [Validators.required, Validators.pattern(Pattern.ALPHABET_ONLY)]],
      dateOfVisit: [undefined],
      objectiveOfVisit: [undefined, Validators.required],
      staffRepresentativeNameDesignation: [undefined],
      staffRepresentativeName: [undefined],
      staffRepresentativeNameDesignation2: [undefined],
      staffRepresentativeName2: [undefined],
      locationPreview: [undefined],
      mapAddress: [undefined],
      findingsAndComments: [undefined, Validators.required],
      businessSiteVisitLongitude: [undefined],
      businessSiteVisitLatitude: [undefined]
    });
  }

  currentAssetsFormGroup() {
    return this.formBuilder.group({
      dateOfInspection: [undefined, [Validators.required, DateValidator.isValidBefore]],
      particularsOfGoodInspected: [undefined],
      stockValueReported: [undefined],
      rents: [undefined],
      rentLeased: [undefined],
      isRentPmtUpToDate: [undefined],
      isRentReceiptShown: [undefined],
      insuranceVerification: this.formBuilder.group({
        assetsMortgaged: [undefined],
        insuredAmount: [undefined],
        insuranceCompany: [undefined],
        expiryDate: [undefined],
        clientsOverallRating: [undefined],
        comments: [undefined],
        stockValueConfirmed: [undefined],
        insuranceVerificationPosition: [undefined],
        inspectingStaffsDetails: this.formBuilder.array([
          this.formBuilder.group({
            staffRepresentativeNameDesignation: undefined,
            staffRepresentativeName: undefined,
            staffRepresentativeNameDesignation2: undefined,
            staffRepresentativeName2: undefined,
          })]),
      }),
      majorInquiriesAndObservations: this.formBuilder.group({
        businessNature: [undefined],
        businessActivities: [undefined],
        businessProgress: [undefined],
        businessChallenges: [undefined],
        normalElectricityLine: [undefined],
        invertorOrGenerator: [undefined],
        ledgerBook: [undefined],
        electronic: [undefined],
      }),
      stockCheckListQuestionaire: this.formBuilder.group({
        uptoDateWithCharges: [undefined],
        borrowersPossession: [undefined],
        notUnderTR: [undefined],
        otherBankNotInterested: [undefined],
        securityOrder: [undefined],
        goodsSaleable: [undefined],
        stocksUptoDate: [undefined],
        matchWithTheStockList: [undefined],
        storageConditionSatisfactory: [undefined],
        fireFightingEvidence: [undefined],
        buildingStoreCondition: [undefined],
        warrantiesUptoDate: [undefined],
        noHazardousNature: [undefined],
        nameBoardProperlyDisplayed: [undefined],
        padlocksUse: [undefined],
        certificate: [undefined],
        ncaReport: [undefined],
        stocksAreLarge: [undefined],
        otherEntitiesInTheAssets: [undefined],
        findingAndComments: [undefined],
        remarksForNoOption: [undefined],
      }),
      receivablesAndPayables: this.formBuilder.group({
        parties: this.formBuilder.array([
          this.formBuilder.group({
            party: [undefined],
            withinThreeMonths: [undefined],
            sixMonth: [undefined],
            oneYear: [undefined],
            oneYearPlus: [undefined]
          })
        ]),
        threeMonthTotal: [undefined],
        sixMonthTotal: [undefined],
        oneYearTotal: [undefined],
        moreThanOneYearTotal: [undefined],
        findingsAndCommentsForCurrentAssetsInspection: [undefined],
        grandTotal: [undefined],
      }),
      payable: this.formBuilder.group({
        parties: this.formBuilder.array([
          this.formBuilder.group({
            party: [undefined],
            withinThreeMonths: [undefined],
            sixMonth: [undefined],
            oneYear: [undefined],
            oneYearPlus: [undefined]
          })
        ]),
        threeMonthTotal: [undefined],
        sixMonthTotal: [undefined],
        oneYearTotal: [undefined],
        moreThanOneYearTotal: [undefined],
        findingsAndCommentsForCurrentAssetsInspection: [undefined],
        grandTotal: [undefined],
      }),
      otherCurrentAssets: this.formBuilder.group({
        receivableAssets: this.formBuilder.array([
          this.formBuilder.group({
            particulars: [undefined],
            amount: [undefined],
          })
        ]),
        receivableCurrentAssetsTotal: [undefined],
        payableAssets: this.formBuilder.array([
          this.formBuilder.group({
            particulars: [undefined],
            amount: [undefined]
          })
        ]),
        payableCurrentAssetsTotal: [undefined],
        inspectingStaffs: this.formBuilder.array([
          this.formBuilder.group({
            name: [undefined],
            position: [undefined]
          })
        ]),
        bankExposures: this.formBuilder.array([
          this.formBuilder.group({
            bankName: [undefined],
            amount: [undefined]
          })
        ]),
        overAllFindings: [undefined],
      }),
    });
  }

  addBusinessSiteVisitDetails() {
    const controls = (<FormArray>this.siteVisitFormGroup.get('businessSiteVisitDetails'));
    /*if (FormUtils.checkEmptyProperties(controls)) {
      this.toastService.show(new Alert(AlertType.INFO, 'Please Fil All Detail To Add More'));
      return;
    }*/
    controls.push(this.businessSiteVisitFormGroup());
  }

  deleteBusinessSiteVisitDetails(i) {
    (<FormArray>this.siteVisitFormGroup.get('businessSiteVisitDetails'))
    .removeAt(i);
  }

  businessSiteVisitDetailsLength() {
    return (<FormArray>this.siteVisitFormGroup.get('businessSiteVisitDetails'))
        .length;
  }

  addCurrentResidentDetails() {
    const controls = (<FormArray>this.siteVisitFormGroup.get('currentResidentDetails'));
    /*if (FormUtils.checkEmptyProperties(controls)) {
      this.toastService.show(new Alert(AlertType.INFO, 'Please Fil All Detail To Add More'));
      return;
    }*/
    controls.push(this.currentResidentFormGroup());
  }

  deleteCurrentResidentDetails(i) {
    (<FormArray>this.siteVisitFormGroup.get('currentResidentDetails'))
    .removeAt(i);
  }

  CurrentResidentDetailsLength() {
    return (<FormArray>this.siteVisitFormGroup.get('currentResidentDetails'))
        .length;
  }

  addMoreCurrentAssets() {
    (this.siteVisitFormGroup.get('currentAssetsInspectionDetails') as FormArray).push(this.currentAssetsFormGroup());
  }

  removeCurrentAssets(index: number) {
    (<FormArray>this.siteVisitFormGroup.get('currentAssetsInspectionDetails')).removeAt(index);
  }

  partyFormGroup() {
    return this.formBuilder.group({
      party: [undefined],
      withinThreeMonths: [undefined],
      sixMonth: [undefined],
      oneYear: [undefined],
      oneYearPlus: [undefined]
    });
  }

  addPartyForm(i) {
    const controls = (this.siteVisitFormGroup
        .get(['currentAssetsInspectionDetails', i, 'receivablesAndPayables']) as FormGroup)
        .get('parties') as FormArray;
    if (FormUtils.checkEmptyProperties(controls)) {
      this.toastService.show(new Alert(AlertType.INFO, 'Please Fil All Data To Add More'));
      return;
    }
    controls.push(this.partyFormGroup());
  }

  addPayablePartyForm(i) {
    const controls = (this.siteVisitFormGroup
        .get(['currentAssetsInspectionDetails', i, 'payable']) as FormGroup).get('parties') as FormArray;
    if (FormUtils.checkEmptyProperties(controls)) {
      this.toastService.show(new Alert(AlertType.INFO, 'Please Fil All Data To Add More'));
      return;
    }
    controls.push(this.partyFormGroup());
  }

  deletePartyForm(i, ii) {
    ((this.siteVisitFormGroup
        .get(['currentAssetsInspectionDetails', i, 'receivablesAndPayables']) as FormGroup)
        .get('parties') as FormArray).removeAt(ii);
  }

  deletePayablePartyForm(i, iii) {
    ((this.siteVisitFormGroup
        .get(['currentAssetsInspectionDetails', i, 'payable']) as FormGroup)
        .get('parties') as FormArray).removeAt(iii);
  }

  assetsFormGroup() {
    return this.formBuilder.group({
      particulars: [undefined],
      amount: [undefined]
    });
  }

  addReceivableAssets(i) {
    const controls = (this.siteVisitFormGroup
        .get(['currentAssetsInspectionDetails', i, 'otherCurrentAssets']) as FormGroup)
        .get('receivableAssets') as FormArray;
    if (FormUtils.checkEmptyProperties(controls)) {
      this.toastService.show(new Alert(AlertType.INFO, 'Please Fil All Data To Add More'));
      return;
    }
    controls.push(this.assetsFormGroup());
  }

  deleteReceivableAssets(i, i3) {
    ((this.siteVisitFormGroup
        .get(['currentAssetsInspectionDetails', i, 'otherCurrentAssets']) as FormGroup)
        .get('receivableAssets') as FormArray).removeAt(i3);
  }

  addPayableAssets(i) {
    const controls = (this.siteVisitFormGroup
        .get(['currentAssetsInspectionDetails', i, 'otherCurrentAssets']) as FormGroup)
        .get('payableAssets') as FormArray;
    if (FormUtils.checkEmptyProperties(controls)) {
      this.toastService.show(new Alert(AlertType.INFO, 'Please Fil All Data To Add More'));
      return;
    }
    controls.push(this.assetsFormGroup());
  }

  deletePayableAssets(i, i5) {
    ((this.siteVisitFormGroup
        .get(['currentAssetsInspectionDetails', i, 'otherCurrentAssets']) as FormGroup)
        .get('payableAssets') as FormArray).removeAt(i5);
  }

  deleteInspectingStaffs(i, i4) {
    ((this.siteVisitFormGroup
        .get(['currentAssetsInspectionDetails', i, 'otherCurrentAssets']) as FormGroup)
        .get('inspectingStaffs') as FormArray).removeAt(i4);
  }

  bankExposureFormGroup() {
    return this.formBuilder.group({
      bankName: [undefined],
      amount: [undefined]
    });
  }

  addBankExposure(i) {
    const controls = (this.siteVisitFormGroup
        .get(['currentAssetsInspectionDetails', i, 'otherCurrentAssets']) as FormGroup)
        .get('bankExposures') as FormArray;
    if (FormUtils.checkEmptyProperties(controls)) {
      this.toastService.show(new Alert(AlertType.INFO, 'Please Fil All Data To Add More'));
      return;
    }
    controls.push(this.bankExposureFormGroup());
  }

  deleteBankExposure(i, i6) {
    ((this.siteVisitFormGroup
        .get(['currentAssetsInspectionDetails', i, 'otherCurrentAssets']) as FormGroup)
        .get('bankExposures') as FormArray).removeAt(i6);
  }

  placeMaker(latitude, longitude) {
    this.infoWindowOpen.setValue('false');
    this.zoom = 10;
    this.latitude = latitude;
    this.longitude = longitude;
    this.markerLatitude = this.latitude;
    this.markerLongitude = this.longitude;
    (<FormGroup>this.siteVisitFormGroup
    .get('businessSiteVisitDetails'))
    .get('locationPreview')
    .setValue(this.latitude + ',' + this.longitude);
    this.getAddress(this.latitude, this.longitude);
  }

  placeMaker1(latitude, longitude) {
    this.infoWindowOpen.setValue('false');
    this.zoom = 10;
    this.latitude = latitude;
    this.longitude = longitude;
    this.markerLatitude = this.latitude;
    this.markerLongitude = this.longitude;
    (<FormGroup>this.siteVisitFormGroup
    .get('currentResidentDetails'))
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
            (<FormGroup>this.siteVisitFormGroup
            .get('businessSiteVisitDetails'))
            .get('mapAddress')
            .setValue(rsltAdrComponent);
            this.infoWindowOpen.setValue('true');
          } else {
            this.addressLabel.setValue(null);
            (<FormGroup>this.siteVisitFormGroup
            .get('businessSiteVisitDetails'))
            .get('mapAddress')
            .setValue(null);
            alert('No address available!');
          }
        } else {
          this.addressLabel.setValue(null);
          (<FormGroup>this.siteVisitFormGroup
          .get('businessSiteVisitDetails'))
          .get('mapAddress')
          .setValue(null);
          alert('Error in GeoCoder');
        }
      });
    }
  }

  findLocation() {
    const coordinate = (<FormGroup>this.siteVisitFormGroup
    .get('businessSiteVisitDetails'))
    .get('locationPreview').value;
    this.latLng = coordinate.split(',', 2);
    this.placeMaker(+this.latLng[0], +this.latLng[1]);
  }

  findLocation1() {
    const coordinate = (<FormGroup>this.siteVisitFormGroup
    .get('currentResidentDetails'))
    .get('locationPreview').value;
    this.latLng = coordinate.split(',', 2);
    this.placeMaker(+this.latLng[0], +this.latLng[1]);
  }


  onSubmit() {
    if (!this.currentResidentForm && !this.businessSiteVisitForm && !this.currentAssetsInspectionForm) {
      this.toastService.show(new Alert(AlertType.INFO, 'Please Select Atleast One SiteVisit!'));
      return;
    }
    if (this.currentResidentForm) {
      // current residential details
      const currentResidentArray = (this.siteVisitFormGroup.get('currentResidentDetails') as FormArray);
      try {
        currentResidentArray.controls.forEach((data, index) => {
          this.currentResidentAddress.forEach((value, i) => {
            if (value.addressForm.invalid || data.invalid) {
              value.submitted = true;
              this.resident = true;
              throw new this.breakException;
            }
            if (i === index) {
              data.get('address').setValue(value.addressForm.value);
            }
          });
        });
      } catch (ex) {
        this.toastService.show(new Alert(AlertType.ERROR, 'Please check Current Resident validation'));
        return;
      }
    }
    if (this.businessSiteVisitForm) {
      const businessSiteArray = (this.siteVisitFormGroup.get('businessSiteVisitDetails') as FormArray);
      try {
        businessSiteArray.controls.forEach((data, index) => {
          this.businessOfficeAddress.forEach((value, i) => {
            if (value.addressForm.invalid || data.invalid) {
              value.submitted = true;
              this.business = true;
              throw new this.breakException;
            }
            if (i === index) {
              data.get('officeAddress').setValue(value.addressForm.value);
            }
          });
        });
      } catch (ex) {
        this.toastService.show(new Alert(AlertType.ERROR, 'Please check Business Site Visit validation'));
        return;
      }
    }
    if (this.currentAssetsInspectionForm) {
      const currentAssetsData = this.siteVisitFormGroup.get('currentAssetsInspectionDetails') as FormArray;
      try {
        currentAssetsData.controls.forEach(data => {
          if (data.invalid) {
            this.current = true;
            throw this.breakException;
          }
        });
      } catch (e) {
        this.toastService.show(new Alert(AlertType.ERROR, 'Please check current Assets validation'));
        return;
      }
    }

    if (!ObjectUtil.isEmpty(this.formValue)) {
      this.siteVisitData = this.formValue;
    }
    this.siteVisitData.data = JSON.stringify(this.siteVisitFormGroup.value);
    this.overlay.show();
    this.siteVisitDataEmitter.emit(this.siteVisitData.data);
  }

  onChangeValue(childFormControlName: string, totalFormControlName: string, i: number) {
    let total = 0;
    const receiveData = (this.siteVisitFormGroup.get(['currentAssetsInspectionDetails', i, 'receivablesAndPayables']) as FormGroup)
        .get('parties') as FormArray;
    receiveData.controls.forEach(party => {
      total += Number(party.get(`${childFormControlName}`).value);
    });
    this.siteVisitFormGroup.get(['currentAssetsInspectionDetails', i, 'receivablesAndPayables'])
        .get(`${totalFormControlName}`).patchValue(total);
  }

  onChangePayableValue(childFormControlName: string, totalFormControlName, i: number) {
    let total = 0;
    const payData = (this.siteVisitFormGroup.get(['currentAssetsInspectionDetails', i, 'payable']) as FormGroup)
        .get('parties') as FormArray;
    payData.controls.forEach(party => {
      total += Number(party.get(`${childFormControlName}`).value);
    });
    this.siteVisitFormGroup.get(['currentAssetsInspectionDetails', i, 'payable'])
        .get(`${totalFormControlName}`).patchValue(total);
  }

  onReceivableAssetValueChange(childFormControlName: string, totalFormControlName: string, i: number) {
    let total = 0;
    const receviable = (this.siteVisitFormGroup.get(['currentAssetsInspectionDetails', i, 'otherCurrentAssets']) as FormGroup)
        .get('receivableAssets') as FormArray;
    receviable.controls.forEach(receivableAssets => {
      total += Number(receivableAssets.get(`${childFormControlName}`).value);
    });
    this.siteVisitFormGroup.get(['currentAssetsInspectionDetails', i, 'otherCurrentAssets'])
        .get(`${totalFormControlName}`).patchValue(total);
  }

  onPayableAssetsValueChange(childFormControlName: string, totalFormControlName: string, i: number) {
    let total = 0;
    const payable = (this.siteVisitFormGroup.get(['currentAssetsInspectionDetails', i, 'otherCurrentAssets']) as FormGroup)
        .get('payableAssets') as FormArray;
    payable.controls.forEach(payableAssets => {
      total += Number(payableAssets.get(`${childFormControlName}`).value);
    });
    this.siteVisitFormGroup.get(['currentAssetsInspectionDetails', i, 'otherCurrentAssets'])
        .get(`${totalFormControlName}`).patchValue(total);
  }

  addStaffOfOtherAssets(i) {
    const controls = (this.siteVisitFormGroup
        .get(['currentAssetsInspectionDetails', i, 'otherCurrentAssets']) as FormGroup)
        .get('inspectingStaffs') as FormArray;
    if (FormUtils.checkEmptyProperties(controls)) {
      this.toastService.show(new Alert(AlertType.INFO, 'Please Fill All Staffs Data To Add More'));
      return;
    }
    controls.push(
        this.formBuilder.group({
          name: [undefined],
          position: [undefined]
        })
    );
  }

  setInspectingStaffsDetails(currentData, i) {
    const controls = (this.siteVisitFormGroup
        .get(['currentAssetsInspectionDetails', i, 'insuranceVerification']) as FormGroup)
        .get('inspectingStaffsDetails') as FormArray;
    if (currentData !== undefined) {
      currentData.forEach(data => {
        controls.push(
            this.formBuilder.group({
              staffRepresentativeNameDesignation: [data.staffRepresentativeNameDesignation],
              staffRepresentativeName: [data.staffRepresentativeName],
              staffRepresentativeNameDesignation2: [data.staffRepresentativeNameDesignation2],
              staffRepresentativeName2: [data.staffRepresentativeName2],
            })
        );
      });
    }
  }

  setPartyFormDetails(currentData, i) {
    const controls = (this.siteVisitFormGroup
        .get(['currentAssetsInspectionDetails', i, 'receivablesAndPayables']) as FormGroup)
        .get('parties') as FormArray;
    if (currentData !== undefined) {
      currentData.forEach(data => {
        controls.push(
            this.formBuilder.group({
              party: [data.party],
              withinThreeMonths: [data.withinThreeMonths],
              sixMonth: [data.sixMonth],
              oneYear: [data.oneYear],
              oneYearPlus: [data.oneYearPlus]
            })
        );
      });
    }
  }

  setPayablePartyFormDetails(currentData, i) {
    const controls = (this.siteVisitFormGroup
        .get(['currentAssetsInspectionDetails', i, 'payable']) as FormGroup)
        .get('parties') as FormArray;
    if (ObjectUtil.isEmpty(currentData)) {
      // this.addPayablePartyForm();
      return;
    }
    currentData.forEach(data => {
      controls.push(
          this.formBuilder.group({
            party: [data.party],
            withinThreeMonths: [data.withinThreeMonths],
            sixMonth: [data.sixMonth],
            oneYear: [data.oneYear],
            oneYearPlus: [data.oneYearPlus]
          })
      );
    });
  }

  setReceivableAssetsDetails(currentData, i) {
    const controls = (this.siteVisitFormGroup
        .get(['currentAssetsInspectionDetails', i, 'otherCurrentAssets']) as FormGroup)
        .get('receivableAssets') as FormArray;
    currentData.forEach(data => {
      controls.push(
          this.formBuilder.group({
            particulars: [data.particulars],
            amount: [data.amount]
          })
      );
    });
  }

  setPayableAssetsDetails(currentData, i) {
    const controls = (this.siteVisitFormGroup
        .get(['currentAssetsInspectionDetails', i, 'otherCurrentAssets']) as FormGroup)
        .get('payableAssets') as FormArray;
    currentData.forEach(data => {
      controls.push(
          this.formBuilder.group({
            particulars: [data.particulars],
            amount: [data.amount]
          })
      );
    });
  }

  setOtherCurrentInspectingStaffs(currentData, i) {
    const controls = (this.siteVisitFormGroup
        .get(['currentAssetsInspectionDetails', i, 'otherCurrentAssets']) as FormGroup)
        .get('inspectingStaffs') as FormArray;
    currentData.forEach(data => {
      controls.push(
          this.formBuilder.group({
            name: [data.name],
            position: [data.position]
          })
      );
    });
  }

  setBankExposures(currentData, i) {
    const controls = (this.siteVisitFormGroup
        .get(['currentAssetsInspectionDetails', i, 'otherCurrentAssets']) as FormGroup)
        .get('bankExposures') as FormArray;
    currentData.forEach(data => {
      controls.push(
          this.formBuilder.group({
            bankName: [data.bankName],
            amount: [data.amount]
          })
      );
    });
  }

  setCurrentResident(currentData) {
    const controls = (this.siteVisitFormGroup.get('currentResidentDetails') as FormArray);
    currentData.forEach(data => {
      controls.push(
          this.formBuilder.group({
            address: [data.address],
            nearBy: [data.nearBy, Validators.required],
            ownerName: [data.ownerName, [Validators.required, Validators.pattern(Pattern.ALPHABET_ONLY)]],
            dateOfVisit: [data.dateOfVisit, Validators.required],
            staffRepresentativeNameDesignation: [data.staffRepresentativeNameDesignation],
            staffRepresentativeName: [data.staffRepresentativeName],
            staffRepresentativeNameDesignation2: [data.staffRepresentativeNameDesignation2],
            staffRepresentativeName2: [data.staffRepresentativeName2],
            findingComment: [data.findingComment],
            locationPreview: [data.locationPreview],
            currentSiteVisitLongitude: [data.currentSiteVisitLongitude],
            currentSiteVisiLatitude: [data.currentSiteVisiLatitude],
          })
      );
    });
  }

  setBusinessSiteVisit(currentData) {
    const controls = (this.siteVisitFormGroup.get('businessSiteVisitDetails') as FormArray);
    currentData.forEach(data => {
      controls.push(
          this.formBuilder.group({
            officeAddress: [data.officeAddress],
            operatingStatus: [data.operatingStatus],
            nameOfThePersonContacted: [data.nameOfThePersonContacted, [Validators.required, Validators.pattern(Pattern.ALPHABET_ONLY)]],
            dateOfVisit: [data.dateOfVisit],
            objectiveOfVisit: [data.objectiveOfVisit, Validators.required],
            staffRepresentativeNameDesignation: [data.staffRepresentativeNameDesignation],
            staffRepresentativeName: [data.staffRepresentativeName],
            staffRepresentativeNameDesignation2: [data.staffRepresentativeNameDesignation2],
            staffRepresentativeName2: [data.staffRepresentativeName2],
            locationPreview: [data.locationPreview],
            mapAddress: [data.mapAddress],
            findingsAndComments: [data.findingsAndComments, Validators.required],
            businessSiteVisitLongitude: [data.businessSiteVisitLongitude],
            businessSiteVisitLatitude: [data.businessSiteVisitLatitude]
          })
      );
    });
  }

  setCurrentAssetsDetails(currentData) {
    const currentAssetsInspectionDetails = this.siteVisitFormGroup.get('currentAssetsInspectionDetails') as FormArray;
    currentData.forEach((singleData) => {
      currentAssetsInspectionDetails.push(
          this.formBuilder.group({
            dateOfInspection: [new Date(singleData.dateOfInspection), [Validators.required, DateValidator.isValidBefore]],
            particularsOfGoodInspected: [singleData.particularsOfGoodInspected],
            stockValueReported: [singleData.stockValueReported],
            rents: [singleData.rents],
            rentLeased: [singleData.rentLeased],
            isRentPmtUpToDate: [singleData.isRentPmtUpToDate],
            isRentReceiptShown: [singleData.isRentReceiptShown],
            insuranceVerification: this.formBuilder.group({
              assetsMortgaged: [singleData.insuranceVerification.assetsMortgaged],
              insuredAmount: [singleData.insuranceVerification.insuredAmount],
              insuranceCompany: [singleData.insuranceVerification.insuranceCompany],
              expiryDate: [new Date(singleData.insuranceVerification.expiryDate)],
              clientsOverallRating: [singleData.insuranceVerification.clientsOverallRating],
              comments: [singleData.insuranceVerification.comments],
              stockValueConfirmed: [singleData.insuranceVerification.stockValueConfirmed],
              insuranceVerificationPosition: [singleData.insuranceVerification.insuranceVerificationPosition],
              inspectingStaffsDetails: this.formBuilder.array([])
            }),
            majorInquiriesAndObservations: this.formBuilder.group({
              businessNature: [singleData.majorInquiriesAndObservations.businessNature],
              businessActivities: [singleData.majorInquiriesAndObservations.businessActivities],
              businessProgress: [singleData.majorInquiriesAndObservations.businessProgress],
              businessChallenges: [singleData.majorInquiriesAndObservations.businessChallenges],
              normalElectricityLine: [singleData.majorInquiriesAndObservations.normalElectricityLine],
              invertorOrGenerator: [singleData.majorInquiriesAndObservations.invertorOrGenerator],
              ledgerBook: [singleData.majorInquiriesAndObservations.ledgerBook],
              electronic: [singleData.majorInquiriesAndObservations.electronic],
            }),
            stockCheckListQuestionaire: this.formBuilder.group({
              uptoDateWithCharges: [singleData.stockCheckListQuestionaire.uptoDateWithCharges],
              borrowersPossession: [singleData.stockCheckListQuestionaire.borrowersPossession],
              notUnderTR: [singleData.stockCheckListQuestionaire.notUnderTR],
              otherBankNotInterested: [singleData.stockCheckListQuestionaire.otherBankNotInterested],
              securityOrder: [singleData.stockCheckListQuestionaire.securityOrder],
              goodsSaleable: [singleData.stockCheckListQuestionaire.goodsSaleable],
              stocksUptoDate: [singleData.stockCheckListQuestionaire.stocksUptoDate],
              matchWithTheStockList: [singleData.stockCheckListQuestionaire.matchWithTheStockList],
              storageConditionSatisfactory: [singleData.stockCheckListQuestionaire.storageConditionSatisfactory],
              fireFightingEvidence: [singleData.stockCheckListQuestionaire.fireFightingEvidence],
              buildingStoreCondition: [singleData.stockCheckListQuestionaire.buildingStoreCondition],
              warrantiesUptoDate: [singleData.stockCheckListQuestionaire.warrantiesUptoDate],
              noHazardousNature: [singleData.stockCheckListQuestionaire.noHazardousNature],
              nameBoardProperlyDisplayed: [singleData.stockCheckListQuestionaire.nameBoardProperlyDisplayed],
              padlocksUse: [singleData.stockCheckListQuestionaire.padlocksUse],
              certificate: [singleData.stockCheckListQuestionaire.certificate],
              ncaReport: [singleData.stockCheckListQuestionaire.ncaReport],
              stocksAreLarge: [singleData.stockCheckListQuestionaire.stocksAreLarge],
              otherEntitiesInTheAssets: [singleData.stockCheckListQuestionaire.otherEntitiesInTheAssets],
              findingAndComments: [singleData.stockCheckListQuestionaire.findingAndComments],
              remarksForNoOption: [singleData.stockCheckListQuestionaire.remarksForNoOption],
            }),
            receivablesAndPayables: this.formBuilder.group({
              parties: this.formBuilder.array([]),
              threeMonthTotal: [singleData.receivablesAndPayables.threeMonthTotal],
              sixMonthTotal: [singleData.receivablesAndPayables.sixMonthTotal],
              oneYearTotal: [singleData.receivablesAndPayables.oneYearTotal],
              moreThanOneYearTotal: [singleData.receivablesAndPayables.moreThanOneYearTotal],
              findingsAndCommentsForCurrentAssetsInspection:
                  [singleData.receivablesAndPayables.findingsAndCommentsForCurrentAssetsInspection],
              grandTotal: [singleData.receivablesAndPayables.grandTotal],
            }),
            payable: this.formBuilder.group({
              parties: this.formBuilder.array([]),
              threeMonthTotal: [singleData.payable.threeMonthTotal],
              sixMonthTotal: [singleData.payable.sixMonthTotal],
              oneYearTotal: [singleData.payable.oneYearTotal],
              moreThanOneYearTotal: [singleData.payable.moreThanOneYearTotal],
              findingsAndCommentsForCurrentAssetsInspection: [singleData.payable.findingsAndCommentsForCurrentAssetsInspection],
              grandTotal: [singleData.payable.grandTotal],
            }),
            otherCurrentAssets: this.formBuilder.group({
              receivableAssets: this.formBuilder.array([]),
              receivableCurrentAssetsTotal: [singleData.otherCurrentAssets.receivableCurrentAssetsTotal],
              payableAssets: this.formBuilder.array([]),
              payableCurrentAssetsTotal: [singleData.otherCurrentAssets.payableCurrentAssetsTotal],
              inspectingStaffs: this.formBuilder.array([]),
              bankExposures: this.formBuilder.array([]),
              overAllFindings: [singleData.otherCurrentAssets.overAllFindings],
            }),
          })
      );
    });
  }

  calculateGrandTotal(formControl, i: number) {
    let grandTotal = 0;
    grandTotal = this.siteVisitFormGroup.get(['currentAssetsInspectionDetails', i, formControl, 'threeMonthTotal']).value
        + this.siteVisitFormGroup.get(['currentAssetsInspectionDetails', i, formControl, 'sixMonthTotal']).value
        + this.siteVisitFormGroup.get(['currentAssetsInspectionDetails', i, formControl, 'oneYearTotal']).value
        + this.siteVisitFormGroup.get(['currentAssetsInspectionDetails', i, formControl, 'moreThanOneYearTotal']).value;
    this.siteVisitFormGroup.get(['currentAssetsInspectionDetails', i, formControl, 'grandTotal'])
        .patchValue(grandTotal.toFixed(8));
  }

  getRoleList() {
    this.spinner = true;
    this.roleService.getAll().subscribe(res => {
      this.designationList = res.detail;
      this.spinner = false;
    } , error => {
      console.log('error' , error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Error While Fetching List'));
      this.spinner = false;
    });
  }
}


