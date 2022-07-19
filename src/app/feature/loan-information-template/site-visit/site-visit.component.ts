import {Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {SiteVisit} from '../../admin/modal/siteVisit';
import {NbDateService, patch} from '@nebular/theme';
import {ToastService} from '../../../@core/utils';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {FormUtils} from '../../../@core/utils/form.utils';
import {Pattern} from '../../../@core/utils/constants/pattern';
import {InsuranceList} from '../../loan/model/insuranceList';
import {CommonAddressComponent} from '../../common-address/common-address.component';
import {RoleService} from '../../admin/component/role-permission/role.service';
import {CalendarType} from '../../../@core/model/calendar-type';
import {environment} from '../../../../environments/environment';
import {Clients} from '../../../../environments/Clients';
import {DateValidator} from '../../../@core/validator/date-validator';
import {NgxSpinnerService} from 'ngx-spinner';


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
    @Input() customerInfo;
    calendarType = CalendarType.AD;

    @ViewChild('currentResidentAddress', {static: true}) currentResidentAddress: CommonAddressComponent;
    @ViewChild('fixedAssetsAddress', {static: true}) fixedAssetsAddress: CommonAddressComponent;
    @ViewChild('businessOfficeAddress', {static: true}) businessOfficeAddress: CommonAddressComponent;

    @ViewChildren('businessOfficeAddress1')
    businessOfficeAddress1: QueryList<CommonAddressComponent>;

    siteVisitData: SiteVisit = new SiteVisit();
    siteVisitFormGroup: FormGroup;
    submitted = false;
    business = false;
    fixed = false;
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
    client = environment.client;
    clientName = Clients;
    breakException: any;
    currentTitle = 'Current Site Visit';
    businessTitle = 'Business Site Visit';
    docFolderName = 'Current_Resident_Document';
    businessDocName = 'Business_Document';

    constructor(private formBuilder: FormBuilder,
                dateService: NbDateService<Date>,
                private toastService: ToastService,
                private overlay: NgxSpinnerService,
                private roleService: RoleService) {
        this.date = dateService.today();
    }

    get inspectingStaffsDetailsForm() {
        return (<FormArray>(<FormGroup>(<FormGroup>this.siteVisitFormGroup.get('currentAssetsInspectionDetails'))
            .get('insuranceVerification'))
            .get('inspectingStaffsDetails')).controls;
    }

    get partyForm() {
        return (<FormArray>(<FormGroup>(<FormGroup>this.siteVisitFormGroup.get('currentAssetsInspectionDetails'))
            .get('receivablesAndPayables'))
            .get('parties')).controls;
    }

    get payablePartyForm() {
        return (<FormArray>(<FormGroup>(<FormGroup>this.siteVisitFormGroup.get('currentAssetsInspectionDetails'))
            .get('payable'))
            .get('parties')).controls;
    }

    get receivableAssetsForm() {
        return (<FormArray>(<FormGroup>(<FormGroup>this.siteVisitFormGroup.get('currentAssetsInspectionDetails'))
            .get('otherCurrentAssets'))
            .get('receivableAssets')).controls;
    }

    get payableAssetsForm() {
        return (<FormArray>(<FormGroup>(<FormGroup>this.siteVisitFormGroup.get('currentAssetsInspectionDetails'))
            .get('otherCurrentAssets'))
            .get('payableAssets')).controls;
    }

    get inspectingStaffsForm() {
        return (<FormArray>(<FormGroup>(<FormGroup>this.siteVisitFormGroup.get('currentAssetsInspectionDetails'))
            .get('otherCurrentAssets'))
            .get('inspectingStaffs')).controls;
    }

    get bankExposureForm() {
        return (<FormArray>(<FormGroup>(<FormGroup>this.siteVisitFormGroup.get('currentAssetsInspectionDetails'))
            .get('otherCurrentAssets'))
            .get('bankExposures')).controls;
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
        if (!ObjectUtil.isEmpty(this.formDataForEdit) && !ObjectUtil.isEmpty(this.formDataForEdit.currentResidentDetails) &&
            !ObjectUtil.isEmpty(this.formDataForEdit.currentResidentDetails.currentResidentStaffRepresentative)) {
            this.formDataForEdit.currentResidentDetails.currentResidentStaffRepresentative.forEach((val: any) => {
                this.addStaff(val);
            });
        }
        // if(!ObjectUtil.isEmpty(this.formDataForEdit) && !ObjectUtil.isEmpty(this.formDataForEdit.currentBusinessDetaila) &&
        // !ObjectUtil.isEmpty(this.formDataForEdit.currentBusinessStaffRepresentative.forEach((val: any) => {
        //     this.addBusinessStaff();
        // })))
        this.previousData();
        if (this.formDataForEdit !== undefined) {
            if (ObjectUtil.isEmpty(this.formDataForEdit.businessDetails)) {
                this.addMoreBusinessSiteVisit();
            }
            if (ObjectUtil.isEmpty(this.formDataForEdit.currentAssetsDetails)) {
                this.addMoreCurrentAssets();
            }
            this.populateData();
        } else {
            this.addMoreBusinessSiteVisit();
            this.addMoreCurrentAssets();
        }
    }

    buildForm() {
        this.siteVisitFormGroup = this.formBuilder.group({
            currentResidentFormChecked: [false],
            businessSiteVisitFormChecked: [false],
            fixedAssetCollateralFormChecked: [false],
            currentAssetsInspectionFormChecked: [false],
            currentResidentDetails: this.formBuilder.group({
                currentResidentStaffRepresentative: this.formBuilder.array([]),
                /*staffRepresentativeNameDesignation: [this.formDataForEdit === undefined ? undefined :
                    (this.formDataForEdit.currentResidentDetails === undefined ? undefined
                        : this.formDataForEdit.currentResidentDetails.staffRepresentativeNameDesignation)],
                staffRepresentativeName: [this.formDataForEdit === undefined ? undefined :
                    (this.formDataForEdit.currentResidentDetails === undefined ? undefined
                        : this.formDataForEdit.currentResidentDetails.staffRepresentativeName)],*/
                address: [undefined],
                nearBy: [this.formDataForEdit === undefined ? '' : (this.formDataForEdit.currentResidentDetails === undefined ? ''
                    : this.formDataForEdit.currentResidentDetails.nearBy), Validators.required],
                ownerName: [this.formDataForEdit === undefined ? '' : (this.formDataForEdit.currentResidentDetails === undefined ? ''
                    : this.formDataForEdit.currentResidentDetails.ownerName), [Validators.pattern(Pattern.ALPHABET_ONLY)]],
                findingComment: [this.formDataForEdit === undefined ? '' : (this.formDataForEdit.currentResidentDetails === undefined
                    ? undefined : this.formDataForEdit.currentResidentDetails.findingComment)],
                locationPreview: [this.formDataForEdit === undefined ? '' : (this.formDataForEdit.currentResidentDetails === undefined ? ''
                    : this.formDataForEdit.currentResidentDetails.locationPreview)],
                currentSiteVisitLongitude: [this.formDataForEdit === undefined ? '' : (this.formDataForEdit.currentResidentDetails
                    === undefined ? '' : this.formDataForEdit.currentResidentDetails.currentSiteVisitLongitude)],
                currentSiteVisiLatitude: [this.formDataForEdit === undefined ? '' : (this.formDataForEdit.currentResidentDetails
                    === undefined ? '' : this.formDataForEdit.currentResidentDetails.currentSiteVisiLatitude)],
                documentPath: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.currentResidentDetails === undefined ? '' :
                    this.formDataForEdit.currentResidentDetails.documentPath]
            }),
            businessDetails: this.formBuilder.array([]),
            currentAssetsDetails: this.formBuilder.array([])
        });
        if (ObjectUtil.isEmpty(this.formDataForEdit)) {
            this.addStaff();
        }
    }

    addStaff(val?: any) {
        const controls = (this.siteVisitFormGroup
            .get('currentResidentDetails') as FormGroup)
            .get('currentResidentStaffRepresentative') as FormArray;
        if (FormUtils.checkEmptyProperties(controls)) {
            this.toastService.show(new Alert(AlertType.INFO, 'Please Fill All Data To Add More'));
            return;
        }
        (this.siteVisitFormGroup.get('currentResidentDetails').get('currentResidentStaffRepresentative') as FormArray).push(
            this.formBuilder.group({
                staffRepresentativeNameDesignation: [(!ObjectUtil.isEmpty(val) &&
                    !ObjectUtil.isEmpty(val.staffRepresentativeNameDesignation)) ? val.staffRepresentativeNameDesignation : undefined],
                staffRepresentativeName: [(!ObjectUtil.isEmpty(val) && !ObjectUtil.isEmpty(val.staffRepresentativeName)) ?
                    val.staffRepresentativeName : undefined]
            })
        );
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
        if (!ObjectUtil.isEmpty(this.formDataForEdit.businessDetails)) {
            this.setBusinessDetails(this.formDataForEdit.businessDetails);
            this.formDataForEdit.businessDetails.forEach((b, i) => {
                this.setBusinessStaffsDetails(b.staffDetail, i);
            });
        }
        if (!ObjectUtil.isEmpty(this.formDataForEdit.currentAssetsDetails)) {
            const currentDetail = this.formDataForEdit.currentAssetsDetails;
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
        });
    }

    addInspectingStaffsDetails(i) {
        const controls = (this.siteVisitFormGroup
            .get(['currentAssetsDetails', i, 'insuranceVerification']) as FormGroup)
            .get('inspectingStaffsDetails') as FormArray;
        if (FormUtils.checkEmptyProperties(controls)) {
          this.toastService.show(new Alert(AlertType.INFO, 'Please Fill All Data To Add More'));
          return;
        }
        controls.push(this.staffsFormGroup());
    }

    deleteInspectingStaffsDetails(i, index) {
        ((this.siteVisitFormGroup
            .get(['currentAssetsDetails', i, 'insuranceVerification']) as FormGroup)
            .get('inspectingStaffsDetails') as FormArray).removeAt(index);
    }
    deleteCurrentResidentStaffsDetails(index) {
        ((this.siteVisitFormGroup
            .get('currentResidentDetails') as FormGroup)
            .get('currentResidentStaffRepresentative') as FormArray).removeAt(index);
    }
    deleteBusinessStaffsDetails(mainIndex, index) {
        (this.siteVisitFormGroup.get(['businessDetails', mainIndex, 'staffDetail']) as FormArray).removeAt(index);
    }

    inspectingStaffsDetailsLength() {
        return (<FormArray>(<FormGroup>(<FormArray>this.siteVisitFormGroup.get('currentAssetsDetails'))
            .get('insuranceVerification'))
            .get('inspectingStaffsDetails')).length;
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
            .get(['currentAssetsDetails', i, 'receivablesAndPayables']) as FormGroup)
            .get('parties') as FormArray;
        if (FormUtils.checkEmptyProperties(controls)) {
          this.toastService.show(new Alert(AlertType.INFO, 'Please Fil All Data To Add More'));
          return;
        }
        controls.push(this.partyFormGroup());
    }

    addPayablePartyForm(i) {
        const controls = (this.siteVisitFormGroup
            .get(['currentAssetsDetails', i, 'payable']) as FormGroup).get('parties') as FormArray;
        if (FormUtils.checkEmptyProperties(controls)) {
            this.toastService.show(new Alert(AlertType.INFO, 'Please Fil All Data To Add More'));
            return;
        }
        controls.push(this.partyFormGroup());
    }

    deletePartyForm(i, ii) {
        ((this.siteVisitFormGroup
            .get(['currentAssetsDetails', i, 'receivablesAndPayables']) as FormGroup)
            .get('parties') as FormArray).removeAt(ii);
    }

    deletePayablePartyForm(i, iii) {
        ((this.siteVisitFormGroup
            .get(['currentAssetsDetails', i, 'payable']) as FormGroup)
            .get('parties') as FormArray).removeAt(iii);
    }

    partyLength() {
        return (<FormArray>(<FormGroup>(<FormGroup>this.siteVisitFormGroup.get('currentAssetsInspectionDetails'))
            .get('receivablesAndPayables'))
            .get('parties')).length;
    }

    payablePartyLength() {
        return (<FormArray>(<FormGroup>(<FormGroup>this.siteVisitFormGroup.get('currentAssetsInspectionDetails'))
            .get('payable'))
            .get('parties')).length;
    }

    assetsFormGroup() {
        return this.formBuilder.group({
            particulars: [undefined],
            amount: [undefined]
        });
    }

    addReceivableAssets(i) {
        const controls = (this.siteVisitFormGroup
            .get(['currentAssetsDetails', i, 'otherCurrentAssets']) as FormGroup)
            .get('receivableAssets') as FormArray;
        if (FormUtils.checkEmptyProperties(controls)) {
            this.toastService.show(new Alert(AlertType.INFO, 'Please Fil All Data To Add More'));
            return;
        }
        controls.push(this.assetsFormGroup());
    }

    deleteReceivableAssets(i, i3) {
        ((this.siteVisitFormGroup
            .get(['currentAssetsDetails', i, 'otherCurrentAssets']) as FormGroup)
            .get('receivableAssets') as FormArray).removeAt(i3);
    }

    receivableAssetsLength() {
        return (<FormArray>(<FormGroup>(<FormGroup>this.siteVisitFormGroup.get('currentAssetsInspectionDetails'))
            .get('otherCurrentAssets'))
            .get('receivableAssets')).length;
    }

    addPayableAssets(i) {
        const controls = (this.siteVisitFormGroup
            .get(['currentAssetsDetails', i, 'otherCurrentAssets']) as FormGroup)
            .get('payableAssets') as FormArray;
        if (FormUtils.checkEmptyProperties(controls)) {
            this.toastService.show(new Alert(AlertType.INFO, 'Please Fil All Data To Add More'));
            return;
        }
        controls.push(this.assetsFormGroup());
    }

    deletePayableAssets(i, i5) {
        ((this.siteVisitFormGroup
            .get(['currentAssetsDetails', i, 'otherCurrentAssets']) as FormGroup)
            .get('payableAssets') as FormArray).removeAt(i5);
    }

    payableAssetsLength() {
        return (<FormArray>(<FormGroup>(<FormGroup>this.siteVisitFormGroup.get('currentAssetsInspectionDetails'))
            .get('otherCurrentAssets'))
            .get('payableAssets')).length;
    }

    addInspectingStaffs() {
        const controls =
            (<FormArray>(<FormGroup>(<FormGroup>this.siteVisitFormGroup.get('currentAssetsInspectionDetails'))
                .get('otherCurrentAssets'))
                .get('inspectingStaffs'));
        if (FormUtils.checkEmptyProperties(controls)) {
            this.toastService.show(new Alert(AlertType.INFO, 'Please Fil All Staff Detail To Add More'));
            return;
        }
    }

    deleteInspectingStaffs(i, i4) {
        ((this.siteVisitFormGroup
            .get(['currentAssetsDetails', i, 'otherCurrentAssets']) as FormGroup)
            .get('inspectingStaffs') as FormArray).removeAt(i4);
    }

    inspectingStaffsLength() {
        return (<FormArray>(<FormGroup>(<FormGroup>this.siteVisitFormGroup.get('currentAssetsInspectionDetails'))
            .get('otherCurrentAssets'))
            .get('inspectingStaffs')).length;
    }

    bankExposureFormGroup() {
        return this.formBuilder.group({
            bankName: [undefined],
            amount: [undefined]
        });
    }

    addBankExposure(i) {
        const controls = (this.siteVisitFormGroup
            .get(['currentAssetsDetails', i, 'otherCurrentAssets']) as FormGroup)
            .get('bankExposures') as FormArray;
        if (FormUtils.checkEmptyProperties(controls)) {
            this.toastService.show(new Alert(AlertType.INFO, 'Please Fil All Data To Add More'));
            return;
        }
        controls.push(this.bankExposureFormGroup());
    }

    deleteBankExposure(i, i6) {
        ((this.siteVisitFormGroup
            .get(['currentAssetsDetails', i, 'otherCurrentAssets']) as FormGroup)
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
            this.toastService.show(new Alert(AlertType.INFO, 'Please Select At least One SiteVisit!'));
            return;
        }
        if (this.currentResidentForm) {
            // current residential details
            this.currentResidentAddress.onSubmit();
            if (this.siteVisitFormGroup.get('currentResidentDetails').invalid || this.currentResidentAddress.addressForm.invalid) {
                this.submitted = true;
                return;
            } else {
                this.siteVisitFormGroup.get('currentResidentDetails').get('address').patchValue(this.currentResidentAddress.submitData);
            }
        }
        if (this.businessSiteVisitForm) {
            const dataArray = this.siteVisitFormGroup.get('businessDetails') as FormArray;
            try {
                dataArray.controls.forEach((data, index) => {
                    this.businessOfficeAddress1.forEach((value, i) => {
                        if (value.addressForm.invalid || data.invalid) {
                            this.business = true;
                            value.submitted = true;
                            throw this.breakException;
                        }
                        if (i === index) {
                            data.get('officeAddress').setValue(value.addressForm.value);
                        }
                    });
                });
            } catch (ex) {
                this.toastService.show(new Alert(AlertType.ERROR, 'Please check Business validation'));
                return;
            }
        }
        if (this.currentAssetsInspectionForm) {
            const currentAssetsData = this.siteVisitFormGroup.get('currentAssetsDetails') as FormArray;
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
        this.overlay.show();
        this.siteVisitData.data = JSON.stringify(this.siteVisitFormGroup.value);
        this.siteVisitDataEmitter.emit(this.siteVisitData.data);
    }

    onChangeValue(childFormControlName: string, totalFormControlName: string, i: number) {
        let total = 0;
        const receiveData = (this.siteVisitFormGroup.get(['currentAssetsDetails', i, 'receivablesAndPayables']) as FormGroup)
            .get('parties') as FormArray;
        receiveData.controls.forEach(party => {
            total += Number(party.get(`${childFormControlName}`).value);
        });
        this.siteVisitFormGroup.get(['currentAssetsDetails', i, 'receivablesAndPayables'])
            .get(`${totalFormControlName}`).patchValue(total);
    }

    onChangePayableValue(childFormControlName: string, totalFormControlName, i: number) {
        let total = 0;
        const payData = (this.siteVisitFormGroup.get(['currentAssetsDetails', i, 'payable']) as FormGroup)
            .get('parties') as FormArray;
        payData.controls.forEach(party => {
            total += Number(party.get(`${childFormControlName}`).value);
        });
        this.siteVisitFormGroup.get(['currentAssetsDetails', i, 'payable'])
            .get(`${totalFormControlName}`).patchValue(total);
    }


    onReceivableAssetValueChange(childFormControlName: string, totalFormControlName: string, i: number) {
        let total = 0;
        const receviable = (this.siteVisitFormGroup.get(['currentAssetsDetails', i, 'otherCurrentAssets']) as FormGroup)
            .get('receivableAssets') as FormArray;
        receviable.controls.forEach(receivableAssets => {
            total += Number(receivableAssets.get(`${childFormControlName}`).value);
        });
        this.siteVisitFormGroup.get(['currentAssetsDetails', i, 'otherCurrentAssets'])
            .get(`${totalFormControlName}`).patchValue(total);
    }

    onPayableAssetsValueChange(childFormControlName: string, totalFormControlName: string, i: number) {
        let total = 0;
        const payable = (this.siteVisitFormGroup.get(['currentAssetsDetails', i, 'otherCurrentAssets']) as FormGroup)
            .get('payableAssets') as FormArray;
        payable.controls.forEach(payableAssets => {
            total += Number(payableAssets.get(`${childFormControlName}`).value);
        });
        this.siteVisitFormGroup.get(['currentAssetsDetails', i, 'otherCurrentAssets'])
            .get(`${totalFormControlName}`).patchValue(total);
    }

    addStaffOfInsurance(i) {
        const controls = ((this.siteVisitFormGroup.get('currentAssetsDetails') as FormArray)
            .get('insuranceVerification') as FormGroup)
            .get('inspectingStaffsDetails') as FormArray;
        controls.push(
            this.formBuilder.group({
                staffRepresentativeNameDesignation: undefined,
                staffRepresentativeName: undefined,
                staffRepresentativeNameDesignation2: undefined,
                staffRepresentativeName2: undefined,
            })
        );
    }

    addStaffOfOtherAssets(i) {
        const controls = (this.siteVisitFormGroup
            .get(['currentAssetsDetails', i, 'otherCurrentAssets']) as FormGroup)
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

    addDetailsOfParties(formcontrol) {
        const controls = ((this.siteVisitFormGroup.get('currentAssetsInspectionDetails') as FormGroup)
            .get(formcontrol) as FormGroup)
            .get('parties') as FormArray;
        controls.push(
            this.formBuilder.group({
                party: [undefined],
                withinThreeMonths: [undefined],
                sixMonth: [undefined],
                oneYear: [undefined],
                oneYearPlus: [undefined]
            })
        );
    }

    addDetailsOfReceivableAssets() {
        const controls = ((this.siteVisitFormGroup.get('currentAssetsInspectionDetails') as FormGroup)
            .get('otherCurrentAssets') as FormGroup)
            .get('receivableAssets') as FormArray;
        controls.push(
            this.formBuilder.group({
                particulars: [undefined],
                amount: [undefined]
            })
        );
    }

    addDetailsOfPayableAssets() {
        const controls = ((this.siteVisitFormGroup.get('currentAssetsInspectionDetails') as FormGroup)
            .get('otherCurrentAssets') as FormGroup)
            .get('payableAssets') as FormArray;
        controls.push(
            this.formBuilder.group({
                particulars: [undefined],
                amount: [undefined]
            })
        );
    }

    addDetailsOfBankExposure() {
        const controls = ((this.siteVisitFormGroup.get('currentAssetsInspectionDetails') as FormGroup)
            .get('otherCurrentAssets') as FormGroup)
            .get('bankExposures') as FormArray;

        controls.push(
            this.formBuilder.group({
                bankName: [undefined],
                amount: [undefined]
            })
        );
    }

    setStaffDetails(currentData) {
        const controls = ((this.siteVisitFormGroup.get('fixedAssetCollateralDetails') as FormGroup)
            .get('vicinityToTheBasicAmenities') as FormGroup)
            .get('staffs') as FormArray;
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
    setInspectingStaffsDetails(currentData, i) {
        const controls = (this.siteVisitFormGroup
            .get(['currentAssetsDetails', i, 'insuranceVerification']) as FormGroup)
            .get('inspectingStaffsDetails') as FormArray;
        if (currentData !== undefined) {
            currentData.forEach(data => {
                controls.push(
                    this.formBuilder.group({
                        staffRepresentativeNameDesignation: [data.staffRepresentativeNameDesignation],
                        staffRepresentativeName: [data.staffRepresentativeName],
                    })
                );
                if (!ObjectUtil.isEmpty(data.staffRepresentativeName2) || !ObjectUtil.isEmpty(data.staffRepresentativeNameDesignation2)) {
                    controls.push(
                        this.formBuilder.group({
                            staffRepresentativeNameDesignation: [data.staffRepresentativeNameDesignation2],
                            staffRepresentativeName: [data.staffRepresentativeName2 ],
                        })
                    );
                }
            });
        }
    }

    setPartyFormDetails(currentData, i) {
        const controls = (this.siteVisitFormGroup
            .get(['currentAssetsDetails', i, 'receivablesAndPayables']) as FormGroup)
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
            .get(['currentAssetsDetails', i, 'payable']) as FormGroup)
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
            .get(['currentAssetsDetails', i, 'otherCurrentAssets']) as FormGroup)
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
            .get(['currentAssetsDetails', i, 'otherCurrentAssets']) as FormGroup)
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
            .get(['currentAssetsDetails', i, 'otherCurrentAssets']) as FormGroup)
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
            .get(['currentAssetsDetails', i, 'otherCurrentAssets']) as FormGroup)
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

    calculateGrandTotal(formControl, i: number) {
        let grandTotal = 0;
        grandTotal = this.siteVisitFormGroup.get(['currentAssetsDetails', i, formControl, 'threeMonthTotal']).value
            + this.siteVisitFormGroup.get(['currentAssetsDetails', i, formControl, 'sixMonthTotal']).value
            + this.siteVisitFormGroup.get(['currentAssetsDetails', i, formControl, 'oneYearTotal']).value
            + this.siteVisitFormGroup.get(['currentAssetsDetails', i, formControl, 'moreThanOneYearTotal']).value;
        this.siteVisitFormGroup.get(['currentAssetsDetails', i, formControl, 'grandTotal'])
            .patchValue(grandTotal.toFixed(2));
    }

    getRoleList() {
        this.spinner = true;
        this.roleService.getAll().subscribe(res => {
            this.designationList = res.detail;
            this.spinner = false;
        }, error => {
            console.log('error', error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Error While Fetching List'));
            this.spinner = false;
        });
    }

    addMoreBusinessSiteVisit() {
        (this.siteVisitFormGroup.get('businessDetails') as FormArray).push(this.businessDetailsFormGroup());
    }

    addMoreCurrentAssets() {
        (this.siteVisitFormGroup.get('currentAssetsDetails') as FormArray).push(this.currentAssetsFormGroup());
    }

    removeBusinessSiteVisit(index: number) {
        (<FormArray>this.siteVisitFormGroup.get('businessDetails')).removeAt(index);
    }

    removeCurrentAssets(index: number) {
        (<FormArray>this.siteVisitFormGroup.get('currentAssetsDetails')).removeAt(index);
    }

    businessDetailsFormGroup(): FormGroup {
        return this.formBuilder.group({
            officeAddress: [undefined],
            nameOfThePersonContacted: [undefined, [Validators.required, Validators.pattern(Pattern.ALPHABET_ONLY)]],
            dateOfVisit: [undefined],
            objectiveOfVisit: [undefined, Validators.required],
            findingsAndComments: [undefined],
            businessSiteVisitLongitude: [undefined],
            businessSiteVisitLatitude: [undefined],
            documentPath: [undefined],
            staffDetail: this.formBuilder.array([this.staffsFormGroup()])
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

    setBusinessDetails(currentData) {
        const businessDetails = this.siteVisitFormGroup.get('businessDetails') as FormArray;
        currentData.forEach((singleData, index) => {
            businessDetails.push(
                this.formBuilder.group({
                    officeAddress: [singleData.officeAddress],
                    nameOfThePersonContacted: [singleData.nameOfThePersonContacted, Validators.required],
                    dateOfVisit: [new Date(singleData.dateOfVisit)],
                    objectiveOfVisit: [singleData.objectiveOfVisit, Validators.required],
                    /*staffRepresentativeNameDesignation: [singleData.staffRepresentativeNameDesignation],
                    staffRepresentativeName: [singleData.staffRepresentativeName],
                    staffRepresentativeNameDesignation2: [singleData.staffRepresentativeNameDesignation2],
                    staffRepresentativeName2: [singleData.staffRepresentativeName2],*/
                    businessSiteVisitLongitude: [singleData.businessSiteVisitLongitude],
                    businessSiteVisitLatitude: [singleData.businessSiteVisitLatitude],
                    findingsAndComments: [singleData.findingsAndComments],
                    locationPreview: [singleData.findingsAndComments],
                    mapAddress: [singleData.findingsAndComments],
                    documentPath: [singleData.documentPath],
                    staffDetail: this.formBuilder.array([])
                })
            );
        });
    }

    setCurrentAssetsDetails(currentData) {
        const currentAssetsDetails = this.siteVisitFormGroup.get('currentAssetsDetails') as FormArray;
        currentData.forEach((singleData) => {
            currentAssetsDetails.push(
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

    previousData() {
        if (!ObjectUtil.isEmpty(this.formValue)) {
            this.formDataForEdit = JSON.parse(this.formValue.data);
            // set Old Business Site Visit Data
            const businessData = [];
            if ((this.formDataForEdit.businessDetails === undefined || this.formDataForEdit.businessDetails === null)
                && this.formDataForEdit.businessSiteVisitFormChecked) {
                businessData.push(this.formDataForEdit.businessSiteVisitDetails);
                this.setBusinessDetails(businessData);
            }
            // Set Old Current Assets Inspection data
            const currentAssetsData = [];
            if ((this.formDataForEdit.currentAssetsDetails === undefined || this.formDataForEdit.currentAssetsDetails === null)
                && this.formDataForEdit.currentAssetsInspectionFormChecked) {
                const formData = this.formDataForEdit.currentAssetsInspectionDetails;
                currentAssetsData.push(formData);
                this.setCurrentAssetsDetails(currentAssetsData);
                this.setInspectingStaffsDetails(formData.insuranceVerification.inspectingStaffsDetails ?
                    formData.insuranceVerification.inspectingStaffsDetails : undefined, 0);
                this.setPartyFormDetails(formData.receivablesAndPayables.parties ?
                    formData.receivablesAndPayables.parties : undefined, 0);
                this.setPayablePartyFormDetails(formData.payable ?
                    formData.payable.parties : undefined, 0);
                this.setReceivableAssetsDetails(formData.otherCurrentAssets.receivableAssets ?
                    formData.otherCurrentAssets.receivableAssets : undefined, 0);
                this.setPayableAssetsDetails(formData.otherCurrentAssets.payableAssets ?
                    formData.otherCurrentAssets.payableAssets : undefined, 0);
                this.setOtherCurrentInspectingStaffs(formData.otherCurrentAssets.inspectingStaffs ?
                    formData.otherCurrentAssets.inspectingStaffs : undefined, 0);
                this.setBankExposures(formData.otherCurrentAssets.bankExposures ?
                    formData.otherCurrentAssets.bankExposures : undefined, 0);
            }
        }
    }

    documentPath(path) {
        this.siteVisitFormGroup.get('currentResidentDetails').get('documentPath').patchValue(path);
    }

    businessDocPath(path, i) {
        this.siteVisitFormGroup.get(['businessDetails', i, 'documentPath']).patchValue(path);
    }

    addBusinessStaffsDetails(i) {
        const controls = (this.siteVisitFormGroup
            .get(['businessDetails', i]) as FormArray)
            .get('staffDetail') as FormArray;
        if (FormUtils.checkEmptyProperties(controls)) {
            this.toastService.show(new Alert(AlertType.INFO, 'Please Fil All Data To Add More'));
            return;
        }
        controls.push(this.staffsFormGroup());
    }
    setBusinessStaffsDetails(data, i: number) {
        const controls = this.siteVisitFormGroup
            .get(['businessDetails', i, 'staffDetail']) as FormArray;
        if (!ObjectUtil.isEmpty(data)) {
            data.forEach(d => {
                controls.push(this.formBuilder.group({
                    staffRepresentativeName: [d.staffRepresentativeName],
                    staffRepresentativeNameDesignation: [d.staffRepresentativeNameDesignation],
                }));
            });
        }
    }

    removeBusinessStaff(parentInd: number, childInd: number) {
        ((this.siteVisitFormGroup.get(['businessDetails', parentInd]) as FormArray).get('staffDetail') as FormArray).removeAt(childInd);
    }
}
