import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {Clients} from '../../../../../environments/Clients';
import {CalendarType} from '../../../../@core/model/calendar-type';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {CommonAddressComponent} from '../../../common-address/common-address.component';
import {FixedAssetsCollateral} from '../../../admin/modal/fixedAssetsCollateral';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {RoleService} from '../../../admin/component/role-permission/role.service';
import {ModalResponse, ToastService} from '../../../../@core/utils';
import {FormUtils} from '../../../../@core/utils/form.utils';
import {Branch} from '../../../admin/modal/branch';
import {CustomerInfoService} from '../../../customer/service/customer-info.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {TemplateName} from '../../../customer/model/templateName';
import {SiteVisit} from '../../../admin/modal/siteVisit';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {CustomerInfoData} from '../../../loan/model/customerInfoData';

@Component({
  selector: 'app-fixed-assets-collateral-form',
  templateUrl: './fixed-assets-collateral-form.component.html',
  styleUrls: ['./fixed-assets-collateral-form.component.scss']
})
export class FixedAssetsCollateralFormComponent implements OnInit {

  @Input() formValue: SiteVisit;
  @Input() model: FixedAssetsCollateral;
  @Input() customerInfoId;

  client = environment.client;
  clientName = Clients;
  date: Date;
  calendarType = CalendarType.AD;
  fixedAssetsForm: FormGroup;
  submitted = false;
  @ViewChild('fixedAssetsAddress', {static: true}) fixedAssetsAddress: CommonAddressComponent;
  submitData;
  formDataForEdit;
  majorMarketPlaceDistance = ['less than 500M', '500M to 1KM', '1KM to 2KM', 'More than 2KM'];
  designationList: [];
  fixed = false;
  siteVisit: SiteVisit;
  customerInfo: CustomerInfoData;
  fixedData;

  constructor(private formBuilder: FormBuilder,
              private roleService: RoleService,
              private toastService: ToastService,
              private customerInfoService: CustomerInfoService,
              private activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.getRoleList();
    if (!ObjectUtil.isEmpty(this.formValue)) {
      const stringFormData = this.formValue.data;
      this.formDataForEdit = JSON.parse(stringFormData);
    }
    this.buildForm();
    this.addStaffOfVicinity();
    this.customerInfoService.detail(this.customerInfoId).subscribe((res: any) => {
      this.customerInfo = res.detail;
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to load customer information'));
    });
    console.log(this.formDataForEdit, 'Site visit data');
    console.log(this.formValue.data, 'FormValue Data');
    console.log(this.customerInfoId, 'cusotmerInforId');
  }
  buildForm() {
    this.fixedAssetsForm = this.formBuilder.group({
      date : [this.formDataForEdit === undefined ? '' : new Date(this.formDataForEdit.date)],
      address : [undefined],
      personContacted : [undefined],
      phoneNoOfContact : [undefined],
      typeOfProperty: [undefined],
      shapeOfLand: [undefined],
      locationAndShapeOfLand: [undefined],
      facilities: this.formBuilder.group({
        roadApproach: [this.formDataForEdit === undefined ? '' : (this.formDataForEdit.facilities === undefined ? ''
            : this.formDataForEdit.facilities.roadApproach)],
        roadWidth: [this.formDataForEdit === undefined ? '' : (this.formDataForEdit.facilities === undefined ? ''
            : this.formDataForEdit.facilities.roadWidth)],
        prominentPlace: [this.formDataForEdit === undefined ? '' : (this.formDataForEdit.facilities === undefined ? ''
            : this.formDataForEdit.facilities.prominentPlace)],
        approachDistance: [this.formDataForEdit === undefined ? '' : (this.formDataForEdit.facilities === undefined ? ''
            : this.formDataForEdit.facilities.approachDistance)],
        roadAccessFrom: [this.formDataForEdit === undefined ? '' : (this.formDataForEdit.facilities === undefined ? ''
            : this.formDataForEdit.facilities.roadAccessFrom)],
      }),

      otherFacilities: this.formBuilder.group({
        waterSupply: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.otherFacilities === undefined ? ''
            : this.formDataForEdit.otherFacilities.waterSupply],
        electricity: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.otherFacilities === undefined ? ''
            : this.formDataForEdit.otherFacilities.electricity],
        boundaryWallConstruction: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.otherFacilities === undefined ? ''
            : this.formDataForEdit.otherFacilities.boundaryWallConstruction],
        boundaryFencing: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.otherFacilities === undefined ? ''
            : this.formDataForEdit.otherFacilities.boundaryFencing],
        drainage: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.otherFacilities === undefined ? ''
            : this.formDataForEdit.otherFacilities.drainage],
        open: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.otherFacilities === undefined ? ''
            : this.formDataForEdit.otherFacilities.open],
        telephoneLine: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.otherFacilities === undefined ? ''
            : this.formDataForEdit.otherFacilities.telephoneLine],
        remarksForOtherFacility: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.otherFacilities === undefined ? ''
            : this.formDataForEdit.otherFacilities.remarksForOtherFacility],
        building: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.otherFacilities === undefined ? ''
            : this.formDataForEdit.otherFacilities.building],
        buildingArea: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.otherFacilities === undefined ? ''
            : this.formDataForEdit.otherFacilities.buildingArea],
        constructionYear: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.otherFacilities === undefined ? ''
            : this.formDataForEdit.otherFacilities.constructionYear],
        buildingType: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.otherFacilities === undefined ? ''
            : this.formDataForEdit.otherFacilities.buildingType],
        builtUpArea: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.otherFacilities === undefined ? ''
            : this.formDataForEdit.otherFacilities.builtUpArea],
        noOfStorey: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.otherFacilities === undefined ? ''
            : this.formDataForEdit.otherFacilities.noOfStorey],
        loadBearingWall: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.otherFacilities === undefined ? ''
            : this.formDataForEdit.otherFacilities.loadBearingWall],
        mortarCement: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.otherFacilities === undefined ? ''
            : this.formDataForEdit.otherFacilities.mortarCement],
        otherRoofing: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.otherFacilities === undefined ? ''
            : this.formDataForEdit.otherFacilities.otherRoofing],
        insideFurniture: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.otherFacilities === undefined ? ''
            : this.formDataForEdit.otherFacilities.insideFurniture],
        frameStructure: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.otherFacilities === undefined ? ''
            : this.formDataForEdit.otherFacilities.frameStructure],
        rccRoofing: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.otherFacilities === undefined ? ''
            : this.formDataForEdit.otherFacilities.rccRoofing],
        bathroomAndToilet: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.otherFacilities === undefined ? ''
            : this.formDataForEdit.otherFacilities.bathroomAndToilet],
        naksaPassObtained: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.otherFacilities === undefined ? ''
            : this.formDataForEdit.otherFacilities.naksaPassObtained],
        buildingCompCertificate: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.otherFacilities === undefined ? ''
            : this.formDataForEdit.otherFacilities.buildingCompCertificate],
        constructionAsPerNaksa: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.otherFacilities === undefined ? ''
            : this.formDataForEdit.otherFacilities.constructionAsPerNaksa],
        roadSetbacks: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.otherFacilities === undefined ? ''
            : this.formDataForEdit.otherFacilities.roadSetbacks],
        riverOrCanalSetbacks: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.otherFacilities === undefined ? ''
            : this.formDataForEdit.otherFacilities.riverOrCanalSetbacks],
        highTensionSetbacks: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.otherFacilities === undefined ? ''
            : this.formDataForEdit.otherFacilities.highTensionSetbacks],
      }),

      vicinityToTheBasicAmenities: this.formBuilder.group({
        majorMarketPlaces: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.vicinityToTheBasicAmenities === undefined ? ''
            : this.formDataForEdit.vicinityToTheBasicAmenities.majorMarketPlaces],
        schoolOrCollege: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.vicinityToTheBasicAmenities === undefined ? ''
            : this.formDataForEdit.vicinityToTheBasicAmenities.schoolOrCollege],
        hospitalOrNursingHome: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.vicinityToTheBasicAmenities === undefined ? ''
            : this.formDataForEdit.vicinityToTheBasicAmenities.hospitalOrNursingHome],
        staffs: this.formBuilder.array([]),
        commentAboutFAC: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.vicinityToTheBasicAmenities === undefined ? ''
            : this.formDataForEdit.vicinityToTheBasicAmenities.commentAboutFAC],
        fixedAssetsLongitude: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.vicinityToTheBasicAmenities === undefined ? ''
            : this.formDataForEdit.vicinityToTheBasicAmenities.fixedAssetsLongitude],
        fixedAssetsLatitude: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.vicinityToTheBasicAmenities === undefined ? ''
            : this.formDataForEdit.vicinityToTheBasicAmenities.fixedAssetsLatitude],
      }),
    });
  }

  get form() {
    return this.fixedAssetsForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.submitData = this.fixedAssetsForm.value;
    this.model.data = JSON.stringify(this.submitData);
    // console.log(this.submitData, 'Submmit data');
    // console.log(this.model.data, 'Json Data');
    this.fixedData = this.formValue.data.concat(this.model.data);
    console.log(this.fixedData, 'Data');

    // this.customerInfoService.saveCollateral(this.model, this.index).subscribe(() => {
    //         this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Branch!'));
    //         this.model = new FixedAssetsCollateral();
    //         this.activeModal.close(ModalResponse.SUCCESS);
    //     }, error => {
    //       console.error(error);
    //       this.toastService.show(new Alert(AlertType.ERROR, error.error.message));
    //       this.activeModal.dismiss(error);
    //     }
    // );
    this.customerInfoService.saveLoanInfo(this.fixedData, this.customerInfoId, TemplateName.SITE_VISIT)
        .subscribe(() => {
          this.toastService.show(new Alert(AlertType.SUCCESS, ' Successfully collateral form!'));
        }, error => {
          console.error(error);
          this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save collateral form!'));
        });
    // console.log(JSON.stringify(this.submitData), 'Json Data');
    this.fixedAssetsAddress.onSubmit();
    if (this.fixedAssetsForm.invalid || this.fixedAssetsAddress.addressForm.invalid) {
      this.fixed = true;
      return;
    } else {
      this.fixedAssetsForm.get('address').patchValue(this.fixedAssetsAddress.submitData);
    }
  }

  get staffsForm() {
    return (<FormArray>(<FormGroup>this.fixedAssetsForm.get('vicinityToTheBasicAmenities')).get('staffs')).controls;
  }

  getRoleList() {
    this.roleService.getAll().subscribe(res => {
      this.designationList = res.detail;
    } , error => {
      console.log('error' , error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Error While Fetching List'));
    });
  }

  addStaffs() {
    const controls =  (<FormArray>(<FormGroup>this.fixedAssetsForm.get('vicinityToTheBasicAmenities')).get('staffs'));
    if (FormUtils.checkEmptyProperties(controls)) {
      this.toastService.show(new Alert(AlertType.INFO, 'Please Fil All Staffs Data To Add More'));
      return;
    }
    controls.push(this.staffsFormGroup());
  }

  staffsFormGroup(): FormGroup {
    return this.formBuilder.group({
      staffRepresentativeNameDesignation: undefined,
      staffRepresentativeName: undefined,
      staffRepresentativeNameDesignation2: undefined,
      staffRepresentativeName2: undefined,
    });
  }

  staffLength() {
    return (<FormArray>(<FormGroup> this.fixedAssetsForm.get('vicinityToTheBasicAmenities'))
        .get('staffs')).length;
  }

  deleteStaff(i) {
    (<FormArray>(<FormGroup>this.fixedAssetsForm.get('vicinityToTheBasicAmenities')).get('staffs')).removeAt(i);
  }

  addStaffOfVicinity() {
    const controls = (this.fixedAssetsForm.get('vicinityToTheBasicAmenities') as FormGroup).get('staffs') as FormArray;
    controls.push(
        this.formBuilder.group({
          staffRepresentativeNameDesignation: undefined,
          staffRepresentativeName: undefined,
          staffRepresentativeNameDesignation2: undefined,
          staffRepresentativeName2: undefined,
        })
    );
  }
}
