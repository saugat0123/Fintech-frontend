import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {SiteVisit} from '../../admin/modal/siteVisit';
import {NbDateService} from '@nebular/theme';
import {ToastService} from '../../../@core/utils';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {FormUtils} from '../../../@core/utils/form.utils';
import {Pattern} from '../../../@core/utils/constants/pattern';
import {DesignationList} from '../../loan/model/designationList';
import {InsuranceList} from '../../loan/model/insuranceList';
import {CommonAddressComponent} from '../../common-address/common-address.component';


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

  @ViewChild('currentResidentAddress', {static: true}) currentResidentAddress: CommonAddressComponent;
  @ViewChild('fixedAssetsAddress', {static: true}) fixedAssetsAddress: CommonAddressComponent;
  @ViewChild('businessOfficeAddress', {static: true}) businessOfficeAddress: CommonAddressComponent;

  siteVisitData: SiteVisit = new SiteVisit();
  siteVisitFormGroup: FormGroup;
  submitted = false;
  business = false;
  fixed = false;
  current = false;
  currentResidentForm = false;
  businessSiteVisitForm = false;
  fixedAssetCollateralForm = false;
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
  majorMarketPlaceDistance = ['less than 500M', '500M to 1KM', '1KM to 2KM', 'More than 2KM'];
  yesNo = ['Yes', 'No'];
  date: Date;
  designationList: DesignationList = new DesignationList();
  insuranceList = InsuranceList.insuranceCompanyList;

  constructor(private formBuilder: FormBuilder,
              dateService: NbDateService<Date>,
              private toastService: ToastService) {
    this.date = dateService.today();
  }

  get staffsForm() {
    return (<FormArray>(<FormGroup>(<FormGroup>this.siteVisitFormGroup.get('fixedAssetCollateralDetails'))
    .get('vicinityToTheBasicAmenities'))
    .get('staffs')).controls;
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
    if (!ObjectUtil.isEmpty(this.formValue)) {
      const stringFormData = this.formValue.data;
      this.formDataForEdit = JSON.parse(stringFormData);
    }

    this.buildForm();
    if (this.formDataForEdit !== undefined) {
      this.populateData();
    } else {
      this.addStaffOfVicinity();
      this.addStaffOfInsurance();
      this.addStaffOfOtherAssets();
      this.addDetailsOfParties('receivablesAndPayables');
      this.addDetailsOfParties('payable');
      this.addDetailsOfReceivableAssets();
      this.addDetailsOfPayableAssets();
      this.addDetailsOfBankExposure();
    }
  }

  buildForm() {
    this.siteVisitFormGroup = this.formBuilder.group({
      currentResidentFormChecked: [false],
      businessSiteVisitFormChecked: [false],
      fixedAssetCollateralFormChecked: [false],
      currentAssetsInspectionFormChecked: [false],
      currentResidentDetails: this.formBuilder.group({
        address: [undefined],
        nearBy: [this.formDataForEdit === undefined ? '' : (this.formDataForEdit.currentResidentDetails === undefined ? ''
            : this.formDataForEdit.currentResidentDetails.nearBy), Validators.required],
        ownerName: [this.formDataForEdit === undefined ? '' : (this.formDataForEdit.currentResidentDetails === undefined ? ''
            : this.formDataForEdit.currentResidentDetails.ownerName), [Validators.pattern(Pattern.ALPHABET_ONLY)]],
        staffRepresentativeNameDesignation: [this.formDataForEdit === undefined ? undefined :
            (this.formDataForEdit.currentResidentDetails === undefined ? undefined
            : this.formDataForEdit.currentResidentDetails.staffRepresentativeNameDesignation)],
        staffRepresentativeName: [this.formDataForEdit === undefined ? undefined :
            (this.formDataForEdit.currentResidentDetails === undefined ? undefined
            : this.formDataForEdit.currentResidentDetails.staffRepresentativeName)],
        alternativeStaffRepresentativeNameDesignation: [this.formDataForEdit === undefined ? undefined :
            (this.formDataForEdit.currentResidentDetails === undefined ? undefined
            : this.formDataForEdit.currentResidentDetails.alternativeStaffRepresentativeNameDesignation)],
        alternativeStaffRepresentativeName: [this.formDataForEdit === undefined ? undefined :
            (this.formDataForEdit.currentResidentDetails === undefined ? undefined
            : this.formDataForEdit.currentResidentDetails.alternativeStaffRepresentativeName)],
        findingComment: [this.formDataForEdit === undefined ? '' : (this.formDataForEdit.currentResidentDetails === undefined ? undefined
            : this.formDataForEdit.currentResidentDetails.findingComment)],
        locationPreview: [this.formDataForEdit === undefined ? '' : (this.formDataForEdit.currentResidentDetails === undefined ? ''
            : this.formDataForEdit.currentResidentDetails.locationPreview)]
      }),
      businessSiteVisitDetails: this.formBuilder.group({
        officeAddress: [undefined],
        nameOfThePersonContacted: [this.formDataForEdit === undefined ? ''
            : this.formDataForEdit.businessSiteVisitDetails === undefined ? ''
                : this.formDataForEdit.businessSiteVisitDetails.nameOfThePersonContacted,
          [Validators.required , Validators.pattern(Pattern.ALPHABET_ONLY)]],
        dateOfVisit: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.businessSiteVisitDetails === undefined ? ''
            : this.formDataForEdit.businessSiteVisitDetails.dateOfVisit, Validators.required],
        objectiveOfVisit: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.businessSiteVisitDetails === undefined ? ''
            : this.formDataForEdit.businessSiteVisitDetails.objectiveOfVisit, Validators.required],
        staffRepresentativeNameDesignation: [this.formDataForEdit === undefined ? undefined :
            (this.formDataForEdit.businessSiteVisitDetails === undefined ? undefined
                : this.formDataForEdit.businessSiteVisitDetails.staffRepresentativeNameDesignation)],
        staffRepresentativeName: [this.formDataForEdit === undefined ? undefined :
            (this.formDataForEdit.businessSiteVisitDetails === undefined ? undefined
                : this.formDataForEdit.businessSiteVisitDetails.staffRepresentativeName)],
        alternativeStaffRepresentativeNameDesignation: [this.formDataForEdit === undefined ? undefined :
            (this.formDataForEdit.businessSiteVisitDetails === undefined ? undefined
                : this.formDataForEdit.businessSiteVisitDetails.alternativeStaffRepresentativeNameDesignation)],
        alternativeStaffRepresentativeName: [this.formDataForEdit === undefined ? undefined :
            (this.formDataForEdit.businessSiteVisitDetails === undefined ? undefined
                : this.formDataForEdit.businessSiteVisitDetails.alternativeStaffRepresentativeName)],
        locationPreview: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.businessSiteVisitDetails === undefined ? ''
            : this.formDataForEdit.businessSiteVisitDetails.locationPreview],
        mapAddress: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.businessSiteVisitDetails === undefined ? ''
            : this.formDataForEdit.businessSiteVisitDetails.mapAddress],
        findingsAndComments: [this.formDataForEdit === undefined ? ''
            : this.formDataForEdit.businessSiteVisitDetails === undefined ? ''
                : this.formDataForEdit.businessSiteVisitDetails.findingsAndComments, Validators.required]
      }),
      fixedAssetCollateralDetails: this.formBuilder.group({
        date: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.fixedAssetCollateralDetails === undefined ? ''
            : this.formDataForEdit.fixedAssetCollateralDetails.date, Validators.required],
        address: [undefined],
        personContacted: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.fixedAssetCollateralDetails === undefined ? ''
            : this.formDataForEdit.fixedAssetCollateralDetails.personContacted , Validators.pattern(Pattern.ALPHABET_ONLY)],
        phoneNoOfContact: [this.formDataForEdit === undefined ? ''
            : this.formDataForEdit.fixedAssetCollateralDetails === undefined ? ''
                : this.formDataForEdit.fixedAssetCollateralDetails.phoneNoOfContact , Validators.pattern(Pattern.NUMBER_MOBILE)],
        facilities: this.formBuilder.group({
          roadApproach: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.fixedAssetCollateralDetails === undefined ? ''
              : this.formDataForEdit.fixedAssetCollateralDetails.facilities === undefined ? ''
                  : this.formDataForEdit.fixedAssetCollateralDetails.facilities === undefined ? ''
                      : this.formDataForEdit.fixedAssetCollateralDetails.facilities.roadApproach],
          roadWidth: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.fixedAssetCollateralDetails === undefined ? ''
                  : this.formDataForEdit.fixedAssetCollateralDetails.facilities === undefined ? ''
                      : this.formDataForEdit.fixedAssetCollateralDetails.facilities.roadWidth],
          prominentPlace: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.fixedAssetCollateralDetails === undefined ? ''
                  : this.formDataForEdit.fixedAssetCollateralDetails.facilities === undefined ? ''
                      : this.formDataForEdit.fixedAssetCollateralDetails.facilities.prominentPlace],
          approachDistance: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.fixedAssetCollateralDetails === undefined ? ''
                  : this.formDataForEdit.fixedAssetCollateralDetails.facilities === undefined ? ''
                      : this.formDataForEdit.fixedAssetCollateralDetails.facilities.approachDistance]
        }),
        otherFacilities: this.formBuilder.group({
          waterSupply: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.fixedAssetCollateralDetails === undefined ? ''
                  : this.formDataForEdit.fixedAssetCollateralDetails.otherFacilities === undefined ? ''
                      : this.formDataForEdit.fixedAssetCollateralDetails.otherFacilities.waterSupply],
          electricity: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.fixedAssetCollateralDetails === undefined ? ''
                  : this.formDataForEdit.fixedAssetCollateralDetails.otherFacilities === undefined ? ''
                      : this.formDataForEdit.fixedAssetCollateralDetails.otherFacilities.electricity],
          boundaryWallConstruction: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.fixedAssetCollateralDetails === undefined ? ''
                  : this.formDataForEdit.fixedAssetCollateralDetails.otherFacilities === undefined ? ''
                      : this.formDataForEdit.fixedAssetCollateralDetails.otherFacilities.boundaryWallConstruction],
          boundaryFencing: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.fixedAssetCollateralDetails === undefined ? ''
                  : this.formDataForEdit.fixedAssetCollateralDetails.otherFacilities === undefined ? ''
                      : this.formDataForEdit.fixedAssetCollateralDetails.otherFacilities.boundaryFencing],
          drainage: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.fixedAssetCollateralDetails === undefined ? ''
                  : this.formDataForEdit.fixedAssetCollateralDetails.otherFacilities === undefined ? ''
                      : this.formDataForEdit.fixedAssetCollateralDetails.otherFacilities.drainage],
          open: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.fixedAssetCollateralDetails === undefined ? ''
                  : this.formDataForEdit.fixedAssetCollateralDetails.otherFacilities === undefined ? ''
                      : this.formDataForEdit.fixedAssetCollateralDetails.otherFacilities.open],
          telephoneLine: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.fixedAssetCollateralDetails === undefined ? ''
                  : this.formDataForEdit.fixedAssetCollateralDetails.otherFacilities === undefined ? ''
                      : this.formDataForEdit.fixedAssetCollateralDetails.otherFacilities.telephoneLine],
          remarksForOtherFacility: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.fixedAssetCollateralDetails === undefined ? ''
                  : this.formDataForEdit.fixedAssetCollateralDetails.otherFacilities === undefined ? ''
                      : this.formDataForEdit.fixedAssetCollateralDetails.otherFacilities.remarksForOtherFacility],
          building: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.fixedAssetCollateralDetails === undefined ? ''
                  : this.formDataForEdit.fixedAssetCollateralDetails.otherFacilities === undefined ? ''
                      : this.formDataForEdit.fixedAssetCollateralDetails.otherFacilities.building],
          buildingArea: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.fixedAssetCollateralDetails === undefined ? ''
                  : this.formDataForEdit.fixedAssetCollateralDetails.otherFacilities === undefined ? ''
                      : this.formDataForEdit.fixedAssetCollateralDetails.otherFacilities.buildingArea],
          constructionYear: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.fixedAssetCollateralDetails === undefined ? ''
                  : this.formDataForEdit.fixedAssetCollateralDetails.otherFacilities === undefined ? ''
                      : this.formDataForEdit.fixedAssetCollateralDetails.otherFacilities.constructionYear],
          qualityOfConstructionRemarks: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.fixedAssetCollateralDetails === undefined ? ''
                  : this.formDataForEdit.fixedAssetCollateralDetails.otherFacilities === undefined ? ''
                      : this.formDataForEdit.fixedAssetCollateralDetails.otherFacilities.qualityOfConstructionRemarks],
          loadBearingWall: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.fixedAssetCollateralDetails === undefined ? ''
                  : this.formDataForEdit.fixedAssetCollateralDetails.otherFacilities === undefined ? ''
                      : this.formDataForEdit.fixedAssetCollateralDetails.otherFacilities.loadBearingWall],
          mortarCement: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.fixedAssetCollateralDetails === undefined ? ''
                  : this.formDataForEdit.fixedAssetCollateralDetails.otherFacilities === undefined ? ''
                      : this.formDataForEdit.fixedAssetCollateralDetails.otherFacilities.mortarCement],
          otherRoofing: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.fixedAssetCollateralDetails === undefined ? ''
                  : this.formDataForEdit.fixedAssetCollateralDetails.otherFacilities === undefined ? ''
                      : this.formDataForEdit.fixedAssetCollateralDetails.otherFacilities.otherRoofing],
          insideFurniture: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.fixedAssetCollateralDetails === undefined ? ''
                  : this.formDataForEdit.fixedAssetCollateralDetails.otherFacilities === undefined ? ''
                      : this.formDataForEdit.fixedAssetCollateralDetails.otherFacilities.insideFurniture],
          frameStructure: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.fixedAssetCollateralDetails === undefined ? ''
                  : this.formDataForEdit.fixedAssetCollateralDetails.otherFacilities === undefined ? ''
                      : this.formDataForEdit.fixedAssetCollateralDetails.otherFacilities.frameStructure],
          rccRoofing: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.fixedAssetCollateralDetails === undefined ? ''
                  : this.formDataForEdit.fixedAssetCollateralDetails.otherFacilities === undefined ? ''
                      : this.formDataForEdit.fixedAssetCollateralDetails.otherFacilities.rccRoofing],
          bathroomAndToilet: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.fixedAssetCollateralDetails === undefined ? ''
                  : this.formDataForEdit.fixedAssetCollateralDetails.otherFacilities === undefined ? ''
                      : this.formDataForEdit.fixedAssetCollateralDetails.otherFacilities.bathroomAndToilet],
        }),
        vicinityToTheBasicAmenities: this.formBuilder.group({
          majorMarketPlaces: [this.formDataForEdit === undefined ? undefined
              : this.formDataForEdit.fixedAssetCollateralDetails.vicinityToTheBasicAmenities === undefined ? undefined
                  : this.formDataForEdit.fixedAssetCollateralDetails.vicinityToTheBasicAmenities.majorMarketPlaces],
          schoolOrCollege: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.fixedAssetCollateralDetails.vicinityToTheBasicAmenities === undefined ? ''
                  : this.formDataForEdit.fixedAssetCollateralDetails.vicinityToTheBasicAmenities.schoolOrCollege],
          hospitalOrNursingHome: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.fixedAssetCollateralDetails.vicinityToTheBasicAmenities === undefined ? ''
              : this.formDataForEdit.fixedAssetCollateralDetails.vicinityToTheBasicAmenities.hospitalOrNursingHome],
          staffs: this.formBuilder.array([]),
          commentAboutFAC: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.fixedAssetCollateralDetails.vicinityToTheBasicAmenities === undefined ? ''
                  : this.formDataForEdit.fixedAssetCollateralDetails.vicinityToTheBasicAmenities.commentAboutFAC],
          branchInchargeComment: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.fixedAssetCollateralDetails.vicinityToTheBasicAmenities === undefined ? ''
                  : this.formDataForEdit.fixedAssetCollateralDetails.vicinityToTheBasicAmenities.branchInchargeComment]
        })
      }),
      currentAssetsInspectionDetails: this.formBuilder.group({
        dateOfInspection: [this.formDataForEdit === undefined ? ''
            : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                : this.formDataForEdit.currentAssetsInspectionDetails.dateOfInspection, Validators.required],
        particularsOfGoodInspected: [this.formDataForEdit === undefined ? ''
            : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                : this.formDataForEdit.currentAssetsInspectionDetails.particularsOfGoodInspected],
        stockValueReported: [this.formDataForEdit === undefined ? ''
            : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                : this.formDataForEdit.currentAssetsInspectionDetails.stockValueReported],
        rents: [this.formDataForEdit === undefined ? ''
            : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                : this.formDataForEdit.currentAssetsInspectionDetails.rents],
        rentLeased: [this.formDataForEdit === undefined ? undefined
            : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? undefined
                : this.formDataForEdit.currentAssetsInspectionDetails.rentLeased],
        isRentPmtUpToDate: [this.formDataForEdit === undefined ? ''
            : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                : this.formDataForEdit.currentAssetsInspectionDetails.isRentPmtUpToDate],
        isRentReceiptShown: [this.formDataForEdit === undefined ? ''
            : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                : this.formDataForEdit.currentAssetsInspectionDetails.isRentReceiptShown],
        insuranceVerification: this.formBuilder.group({
          assetsMortgaged: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.currentAssetsInspectionDetails.insuranceVerification === undefined ? ''
                      : this.formDataForEdit.currentAssetsInspectionDetails.insuranceVerification.assetsMortgaged],
          insuredAmount: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.currentAssetsInspectionDetails.insuranceVerification === undefined ? ''
                      : this.formDataForEdit.currentAssetsInspectionDetails.insuranceVerification.insuredAmount],
          insuranceCompany: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.currentAssetsInspectionDetails.insuranceVerification === undefined ? ''
                      : this.formDataForEdit.currentAssetsInspectionDetails.insuranceVerification.insuranceCompany],
          expiryDate: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.currentAssetsInspectionDetails.insuranceVerification === undefined ? ''
                      : this.formDataForEdit.currentAssetsInspectionDetails.insuranceVerification.expiryDate],
          clientsOverallRating: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.currentAssetsInspectionDetails.insuranceVerification === undefined ? ''
                  : this.formDataForEdit.currentAssetsInspectionDetails.insuranceVerification.clientsOverallRating],
          comments: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.currentAssetsInspectionDetails.insuranceVerification === undefined ? ''
                      : this.formDataForEdit.currentAssetsInspectionDetails.insuranceVerification.comments],
          stockValueConfirmed: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.currentAssetsInspectionDetails.insuranceVerification === undefined ? ''
                      : this.formDataForEdit.currentAssetsInspectionDetails.insuranceVerification.stockValueConfirmed],
          insuranceVerificationPosition: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.currentAssetsInspectionDetails.insuranceVerification === undefined ? ''
                      : this.formDataForEdit.currentAssetsInspectionDetails.insuranceVerificationPosition],
          inspectingStaffsDetails: this.formBuilder.array([])
        }),
        stockCheckListQuestionaire: this.formBuilder.group({
          uptoDateWithCharges: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.currentAssetsInspectionDetails.stockCheckListQuestionaire === undefined ? ''
                      : this.formDataForEdit.currentAssetsInspectionDetails.stockCheckListQuestionaire.uptoDateWithCharges],
          borrowersPossession: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.currentAssetsInspectionDetails.stockCheckListQuestionaire === undefined ? ''
                      : this.formDataForEdit.currentAssetsInspectionDetails.stockCheckListQuestionaire.borrowersPossession],
          notUnderTR: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.currentAssetsInspectionDetails.stockCheckListQuestionaire === undefined ? ''
                      : this.formDataForEdit.currentAssetsInspectionDetails.stockCheckListQuestionaire.notUnderTR],
          otherBankNotInterested: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.currentAssetsInspectionDetails.stockCheckListQuestionaire === undefined ? ''
                      : this.formDataForEdit.currentAssetsInspectionDetails.stockCheckListQuestionaire.otherBankNotInterested],
          securityOrder: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.currentAssetsInspectionDetails.stockCheckListQuestionaire === undefined ? ''
                      : this.formDataForEdit.currentAssetsInspectionDetails.stockCheckListQuestionaire.securityOrder],
          goodsSaleable: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.currentAssetsInspectionDetails.stockCheckListQuestionaire === undefined ? ''
                      : this.formDataForEdit.currentAssetsInspectionDetails.stockCheckListQuestionaire.goodsSaleable],
          stocksUptoDate: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.currentAssetsInspectionDetails.stockCheckListQuestionaire === undefined ? ''
                      : this.formDataForEdit.currentAssetsInspectionDetails.stockCheckListQuestionaire.stocksUptoDate],
          matchWithTheStockList: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.currentAssetsInspectionDetails.stockCheckListQuestionaire === undefined ? ''
                      : this.formDataForEdit.currentAssetsInspectionDetails.stockCheckListQuestionaire.matchWithTheStockList],
          storageConditionSatisfactory: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.currentAssetsInspectionDetails.stockCheckListQuestionaire === undefined ? ''
                      : this.formDataForEdit.currentAssetsInspectionDetails.stockCheckListQuestionaire.storageConditionSatisfactory],
          fireFightingEvidence: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.currentAssetsInspectionDetails.stockCheckListQuestionaire === undefined ? ''
                      : this.formDataForEdit.currentAssetsInspectionDetails.stockCheckListQuestionaire.fireFightingEvidence],
          buildingStoreCondition: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.currentAssetsInspectionDetails.stockCheckListQuestionaire === undefined ? ''
                      : this.formDataForEdit.currentAssetsInspectionDetails.stockCheckListQuestionaire.buildingStoreCondition],
          warrantiesUptoDate: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.currentAssetsInspectionDetails.stockCheckListQuestionaire === undefined ? ''
                      : this.formDataForEdit.currentAssetsInspectionDetails.stockCheckListQuestionaire.warrantiesUptoDate],
          noHazardousNature: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.currentAssetsInspectionDetails.stockCheckListQuestionaire === undefined ? ''
                      : this.formDataForEdit.currentAssetsInspectionDetails.stockCheckListQuestionaire.noHazardousNature],
          nameBoardProperlyDisplayed: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.currentAssetsInspectionDetails.stockCheckListQuestionaire === undefined ? ''
                      : this.formDataForEdit.currentAssetsInspectionDetails.stockCheckListQuestionaire.nameBoardProperlyDisplayed],
          padlocksUse: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.currentAssetsInspectionDetails.stockCheckListQuestionaire === undefined ? ''
                      : this.formDataForEdit.currentAssetsInspectionDetails.stockCheckListQuestionaire.padlocksUse],
          certificate: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.currentAssetsInspectionDetails.stockCheckListQuestionaire === undefined ? ''
                      : this.formDataForEdit.currentAssetsInspectionDetails.stockCheckListQuestionaire.certificate],
          findingAndComments: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.currentAssetsInspectionDetails.stockCheckListQuestionaire === undefined ? ''
                      : this.formDataForEdit.currentAssetsInspectionDetails.stockCheckListQuestionaire.findingAndComments],
          remarksForNoOption: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.currentAssetsInspectionDetails.stockCheckListQuestionaire === undefined ? ''
                      : this.formDataForEdit.currentAssetsInspectionDetails.stockCheckListQuestionaire.remarksForNoOption]
        }),
        receivablesAndPayables: this.formBuilder.group({
          parties: this.formBuilder.array([]),
          threeMonthTotal: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.currentAssetsInspectionDetails.receivablesAndPayables === undefined ? ''
                      : this.formDataForEdit.currentAssetsInspectionDetails.receivablesAndPayables.threeMonthTotal],
          sixMonthTotal: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.currentAssetsInspectionDetails.receivablesAndPayables === undefined ? ''
                      : this.formDataForEdit.currentAssetsInspectionDetails.receivablesAndPayables.sixMonthTotal],
          oneYearTotal: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.currentAssetsInspectionDetails.receivablesAndPayables === undefined ? ''
                      : this.formDataForEdit.currentAssetsInspectionDetails.receivablesAndPayables.oneYearTotal],
          moreThanOneYearTotal: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.currentAssetsInspectionDetails.receivablesAndPayables === undefined ? ''
                  : this.formDataForEdit.currentAssetsInspectionDetails.receivablesAndPayables.moreThanOneYearTotal],
          findingsAndCommentsForCurrentAssetsInspection: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.currentAssetsInspectionDetails.receivablesAndPayables === undefined ? ''
                      : this.formDataForEdit.currentAssetsInspectionDetails
                          .receivablesAndPayables.findingsAndCommentsForCurrentAssetsInspection],
          grandTotal:   [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.currentAssetsInspectionDetails.receivablesAndPayables === undefined ? ''
                      : this.formDataForEdit.currentAssetsInspectionDetails
                          .receivablesAndPayables.grandTotal],
        }),
        payable: this.formBuilder.group({
          parties: this.formBuilder.array([]),
          threeMonthTotal: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.currentAssetsInspectionDetails.payable === undefined ? ''
                      : this.formDataForEdit.currentAssetsInspectionDetails.payable.threeMonthTotal],
          sixMonthTotal: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.currentAssetsInspectionDetails.payable === undefined ? ''
                      : this.formDataForEdit.currentAssetsInspectionDetails.payable.sixMonthTotal],
          oneYearTotal: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.currentAssetsInspectionDetails.payable === undefined ? ''
                      : this.formDataForEdit.currentAssetsInspectionDetails.payable.oneYearTotal],
          moreThanOneYearTotal: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.currentAssetsInspectionDetails.payable === undefined ? ''
                      : this.formDataForEdit.currentAssetsInspectionDetails.payable.moreThanOneYearTotal],
          findingsAndCommentsForCurrentAssetsInspection: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.currentAssetsInspectionDetails.payable === undefined ? ''
                      : this.formDataForEdit.currentAssetsInspectionDetails
                          .payable.findingsAndCommentsForCurrentAssetsInspection],
          grandTotal:   [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.currentAssetsInspectionDetails.payable === undefined ? ''
                      : this.formDataForEdit.currentAssetsInspectionDetails
                          .payable.grandTotal],
        }),

        otherCurrentAssets: this.formBuilder.group({
          receivableAssets: this.formBuilder.array([]),
          receivableCurrentAssetsTotal: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.currentAssetsInspectionDetails.otherCurrentAssets === undefined ? ''
                      : this.formDataForEdit.currentAssetsInspectionDetails.otherCurrentAssets.receivableCurrentAssetsTotal],
          payableAssets: this.formBuilder.array([]),
          payableCurrentAssetsTotal: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.currentAssetsInspectionDetails.otherCurrentAssets === undefined ? ''
                      : this.formDataForEdit.currentAssetsInspectionDetails.otherCurrentAssets.payableCurrentAssetsTotal],
          inspectingStaffs: this.formBuilder.array([]),
          bankExposures: this.formBuilder.array([]),
          overAllFindings: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.currentAssetsInspectionDetails.otherCurrentAssets === undefined ? ''
                      : this.formDataForEdit.currentAssetsInspectionDetails.otherCurrentAssets.overAllFindings]
        })
      })
    });
  }

  checkboxSelected(label: String, isChecked: boolean) {
    if (label === 'currentResident') {
      this.currentResidentForm = isChecked;
      this.siteVisitFormGroup.get('currentResidentFormChecked').patchValue(isChecked);
    } else if (label === 'businessSiteVisit') {
      this.businessSiteVisitForm = isChecked;
      this.siteVisitFormGroup.get('businessSiteVisitFormChecked').patchValue(isChecked);

    } else if (label === 'fixedAssetCollateral') {
      this.fixedAssetCollateralForm = isChecked;
      this.siteVisitFormGroup.get('fixedAssetCollateralFormChecked').patchValue(isChecked);

    } else if (label === 'currentAssetsInspection') {
      this.currentAssetsInspectionForm = isChecked;
      this.siteVisitFormGroup.get('currentAssetsInspectionFormChecked').patchValue(isChecked);
    }
  }

  populateData() {
    const formData = this.formDataForEdit.fixedAssetCollateralDetails.vicinityToTheBasicAmenities;
    const currentAssetsInspectionData = this.formDataForEdit.currentAssetsInspectionDetails;
    this.checkboxSelected('currentResident', this.formDataForEdit['currentResidentFormChecked']);
    this.checkboxSelected('businessSiteVisit', this.formDataForEdit['businessSiteVisitFormChecked']);
    this.checkboxSelected('fixedAssetCollateral', this.formDataForEdit['fixedAssetCollateralFormChecked']);
    this.checkboxSelected('currentAssetsInspection', this.formDataForEdit['currentAssetsInspectionFormChecked']);
    this.setStaffDetails(formData.staffs);
    this.setInspectingStaffsDetails(currentAssetsInspectionData.insuranceVerification.inspectingStaffsDetails);
    this.setPartyFormDetails(currentAssetsInspectionData.receivablesAndPayables.parties);
    this.setPayablePartyFormDetails(currentAssetsInspectionData.payable ? currentAssetsInspectionData.payable.parties : undefined);
    this.setReceivableAssetsDetails(currentAssetsInspectionData.otherCurrentAssets.receivableAssets);
    this.setPayableAssetsDetails(currentAssetsInspectionData.otherCurrentAssets.payableAssets);
    this.setOtherCurrentInspectingStaffs(currentAssetsInspectionData.otherCurrentAssets.inspectingStaffs);
    this.setBankExposures(currentAssetsInspectionData.otherCurrentAssets.bankExposures);
  }

  staffsFormGroup(): FormGroup {
    return this.formBuilder.group({
      staffRepresentativeNameDesignation: undefined,
      staffRepresentativeName: undefined,
      alternativeStaffRepresentativeNameDesignation: undefined,
      alternativeStaffRepresentativeName: undefined,
    });
  }

  addStaffs() {
    const controls =  (<FormArray>(<FormGroup>(<FormGroup>this.siteVisitFormGroup.get('fixedAssetCollateralDetails'))
    .get('vicinityToTheBasicAmenities'))
    .get('staffs'));
    if (FormUtils.checkEmptyProperties(controls)) {
      this.toastService.show(new Alert(AlertType.INFO, 'Please Fil All Staffs Data To Add More'));
     return;
    }
    controls.push(this.staffsFormGroup());
  }

  deleteStaff(i) {
    (<FormArray>(<FormGroup>(<FormGroup>this.siteVisitFormGroup.get('fixedAssetCollateralDetails'))
    .get('vicinityToTheBasicAmenities'))
    .get('staffs')).removeAt(i);
  }

  staffLength() {
    return (<FormArray>(<FormGroup>(<FormGroup>this.siteVisitFormGroup.get('fixedAssetCollateralDetails'))
    .get('vicinityToTheBasicAmenities'))
    .get('staffs')).length;

  }

  addInspectingStaffsDetails() {
    const controls = (<FormArray>(<FormGroup>(<FormGroup>this.siteVisitFormGroup.get('currentAssetsInspectionDetails'))
    .get('insuranceVerification'))
    .get('inspectingStaffsDetails'));
    if (FormUtils.checkEmptyProperties(controls)) {
      this.toastService.show(new Alert(AlertType.INFO, 'Please Fil All Staff Detail To Add More'));
      return;
    }
    controls.push(this.staffsFormGroup());
  }

  deleteInspectingStaffsDetails(i) {
    (<FormArray>(<FormGroup>(<FormGroup>this.siteVisitFormGroup.get('currentAssetsInspectionDetails'))
    .get('insuranceVerification'))
    .get('inspectingStaffsDetails'))
    .removeAt(i);
  }

  inspectingStaffsDetailsLength() {
    return (<FormArray>(<FormGroup>(<FormGroup>this.siteVisitFormGroup.get('currentAssetsInspectionDetails'))
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

  addPartyForm() {
   const controls = (<FormArray>(<FormGroup>(<FormGroup>this.siteVisitFormGroup.get('currentAssetsInspectionDetails'))
    .get('receivablesAndPayables'))
    .get('parties'));
    if (FormUtils.checkEmptyProperties(controls)) {
      this.toastService.show(new Alert(AlertType.INFO, 'Please Fil All Data To Add More'));
      return;
    }
    controls.push(this.partyFormGroup());
  }

  addPayablePartyForm() {
    const controls = (<FormArray>(<FormGroup>(<FormGroup>this.siteVisitFormGroup.get('currentAssetsInspectionDetails'))
    .get('payable'))
    .get('parties'));
    if (FormUtils.checkEmptyProperties(controls)) {
      this.toastService.show(new Alert(AlertType.INFO, 'Please Fil All Data To Add More'));
      return;
    }
    controls.push(this.partyFormGroup());
  }

  deletePartyForm(i) {
    (<FormArray>(<FormGroup>(<FormGroup>this.siteVisitFormGroup.get('currentAssetsInspectionDetails'))
    .get('receivablesAndPayables'))
    .get('parties')).removeAt(i);
  }

  deletePayablePartyForm(i) {
    (<FormArray>(<FormGroup>(<FormGroup>this.siteVisitFormGroup.get('currentAssetsInspectionDetails'))
    .get('payable'))
    .get('parties')).removeAt(i);
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

  addReceivableAssets() {
    const controls = (<FormArray>(<FormGroup>(<FormGroup>this.siteVisitFormGroup.get('currentAssetsInspectionDetails'))
    .get('otherCurrentAssets'))
    .get('receivableAssets'));
    if (FormUtils.checkEmptyProperties(controls)) {
      this.toastService.show(new Alert(AlertType.INFO, 'Please Fil All Assets Data To Add More'));
      return;
    }
    controls.push(this.assetsFormGroup());
  }

  deleteReceivableAssets(i) {
    (<FormArray>(<FormGroup>(<FormGroup>this.siteVisitFormGroup.get('currentAssetsInspectionDetails'))
    .get('otherCurrentAssets'))
    .get('receivableAssets')).removeAt(i);
  }

  receivableAssetsLength() {
    return (<FormArray>(<FormGroup>(<FormGroup>this.siteVisitFormGroup.get('currentAssetsInspectionDetails'))
    .get('otherCurrentAssets'))
    .get('receivableAssets')).length;
  }

  addPayableAssets() {
    const controls = (<FormArray>(<FormGroup>(<FormGroup>this.siteVisitFormGroup.get('currentAssetsInspectionDetails'))
    .get('otherCurrentAssets'))
    .get('payableAssets'));
    if (FormUtils.checkEmptyProperties(controls)) {
      this.toastService.show(new Alert(AlertType.INFO, 'Please Fil All Assets Data To Add More'));
      return;
    }
    controls.push(this.assetsFormGroup());
  }

  deletePayableAssets(i) {
    (<FormArray>(<FormGroup>(<FormGroup>this.siteVisitFormGroup.get('currentAssetsInspectionDetails'))
    .get('otherCurrentAssets'))
    .get('payableAssets')).removeAt(i);
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
    controls.push(this.staffsFormGroup());
  }

  deleteInspectingStaffs(i) {
    (<FormArray>(<FormGroup>(<FormGroup>this.siteVisitFormGroup.get('currentAssetsInspectionDetails'))
    .get('otherCurrentAssets'))
    .get('inspectingStaffs')).removeAt(i);
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

  addBankExposure() {
    const controls = (<FormArray>(<FormGroup>(<FormGroup>this.siteVisitFormGroup.get('currentAssetsInspectionDetails'))
    .get('otherCurrentAssets'))
    .get('bankExposures'));
    if (FormUtils.checkEmptyProperties(controls)) {
      this.toastService.show(new Alert(AlertType.INFO, 'Please Fil Exposure Detail To Add More'));
      return;
    }
    controls.push(this.bankExposureFormGroup());
  }

  deleteBankExposure(i) {
    (<FormArray>(<FormGroup>(<FormGroup>this.siteVisitFormGroup.get('currentAssetsInspectionDetails'))
    .get('otherCurrentAssets'))
    .get('bankExposures')).removeAt(i);
  }

  bankExposureLength() {
    return (<FormArray>(<FormGroup>(<FormGroup>this.siteVisitFormGroup.get('currentAssetsInspectionDetails'))
    .get('otherCurrentAssets'))
    .get('bankExposures')).length;
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
    console.log(this.siteVisitFormGroup);
    if (!this.currentResidentForm && !this.businessSiteVisitForm && !this.fixedAssetCollateralForm && !this.currentAssetsInspectionForm) {
      this.toastService.show(new Alert(AlertType.INFO, 'Please Select Atleast One SiteVisit!'));
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
      this.businessOfficeAddress.onSubmit();
      if (this.siteVisitFormGroup.get('businessSiteVisitDetails').invalid || this.businessOfficeAddress.addressForm.invalid) {
        this.business = true;
        return;
      } else {
        this.siteVisitFormGroup.get('businessSiteVisitDetails').get('officeAddress').patchValue(this.businessOfficeAddress.submitData);
      }
    }
    if (this.fixedAssetCollateralForm ) {
      this.fixedAssetsAddress.onSubmit();
      if (this.siteVisitFormGroup.get('fixedAssetCollateralDetails').invalid || this.fixedAssetsAddress.addressForm.invalid) {
        this.fixed = true;
        return;
      } else {
        this.siteVisitFormGroup.get('fixedAssetCollateralDetails').get('address').patchValue(this.fixedAssetsAddress.submitData);
      }
    }
    if (this.currentAssetsInspectionForm) {
      if (this.siteVisitFormGroup.get('currentAssetsInspectionDetails').invalid) {
        this.current = true;
        return;
      }
    }


    if (!ObjectUtil.isEmpty(this.formValue)) {
      this.siteVisitData = this.formValue;
    }
    this.siteVisitData.data = JSON.stringify(this.siteVisitFormGroup.value);
    this.siteVisitDataEmitter.emit(this.siteVisitData.data);
  }

  onChangeValue(childFormControlName: string, totalFormControlName: string) {
    let total = 0;
    this.partyForm.forEach(party => {
      total += Number(party.get(`${childFormControlName}`).value);
    });
    ((this.siteVisitFormGroup.get('currentAssetsInspectionDetails') as FormGroup).get('receivablesAndPayables') as FormGroup)
    .get(`${totalFormControlName}`).patchValue(total);
  }

  onChangePayableValue(childFormControlName: string, totalFormControlName) {
    let total = 0;
    this.payablePartyForm.forEach(party => {
      total += Number(party.get(`${childFormControlName}`).value);
    });
    ((this.siteVisitFormGroup.get('currentAssetsInspectionDetails') as FormGroup).get('payable') as FormGroup)
    .get(`${totalFormControlName}`).patchValue(total);
  }


  onReceivableAssetValueChange(childFormControlName: string, totalFormControlName: string) {
    let total = 0;
    this.receivableAssetsForm.forEach(receivableAssets => {
      total += Number(receivableAssets.get(`${childFormControlName}`).value);
    });
    ((this.siteVisitFormGroup.get('currentAssetsInspectionDetails') as FormGroup).get('otherCurrentAssets') as FormGroup)
    .get(`${totalFormControlName}`).patchValue(total);

  }

  onPayableAssetsValueChange(childFormControlName: string, totalFormControlName: string) {
    let total = 0;
    this.payableAssetsForm.forEach(payableAssets => {
      total += Number(payableAssets.get(`${childFormControlName}`).value);
    });
    ((this.siteVisitFormGroup.get('currentAssetsInspectionDetails') as FormGroup).get('otherCurrentAssets') as FormGroup)
    .get(`${totalFormControlName}`).patchValue(total);

  }

  addStaffOfVicinity() {
    const controls = ((this.siteVisitFormGroup.get('fixedAssetCollateralDetails') as FormGroup)
    .get('vicinityToTheBasicAmenities') as FormGroup)
    .get('staffs') as FormArray;
    controls.push(
        this.formBuilder.group({
          staffRepresentativeNameDesignation: undefined,
          staffRepresentativeName: undefined,
          alternativeStaffRepresentativeNameDesignation: undefined,
          alternativeStaffRepresentativeName: undefined,
        })
    );
  }

  addStaffOfInsurance() {
    const controls = ((this.siteVisitFormGroup.get('currentAssetsInspectionDetails') as FormGroup)
    .get('insuranceVerification') as FormGroup)
    .get('inspectingStaffsDetails') as FormArray;
    controls.push(
        this.formBuilder.group({
          staffRepresentativeNameDesignation: undefined,
          staffRepresentativeName: undefined,
          alternativeStaffRepresentativeNameDesignation: undefined,
          alternativeStaffRepresentativeName: undefined,
        })
    );
  }

  addStaffOfOtherAssets() {
    const controls = ((this.siteVisitFormGroup.get('currentAssetsInspectionDetails') as FormGroup)
    .get('otherCurrentAssets') as FormGroup)
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
            alternativeStaffRepresentativeNameDesignation: [data.alternativeStaffRepresentativeNameDesignation],
            alternativeStaffRepresentativeName: [data.alternativeStaffRepresentativeName],
          })
      );
    });
  }

  setInspectingStaffsDetails(currentData) {
    const controls = ((this.siteVisitFormGroup.get('currentAssetsInspectionDetails') as FormGroup)
    .get('insuranceVerification') as FormGroup)
    .get('inspectingStaffsDetails') as FormArray;

    if (currentData !== undefined) {
      currentData.forEach(data => {
        controls.push(
            this.formBuilder.group({
              staffRepresentativeNameDesignation: [data.staffRepresentativeNameDesignation],
              staffRepresentativeName: [data.staffRepresentativeName],
              alternativeStaffRepresentativeNameDesignation: [data.alternativeStaffRepresentativeNameDesignation],
              alternativeStaffRepresentativeName: [data.alternativeStaffRepresentativeName],
            })
        );
      });
    }
  }

  setPartyFormDetails(currentData) {
    const controls = ((this.siteVisitFormGroup.get('currentAssetsInspectionDetails') as FormGroup)
    .get('receivablesAndPayables') as FormGroup)
    .get('parties') as FormArray;
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

  setPayablePartyFormDetails(currentData) {
    const controls = ((this.siteVisitFormGroup.get('currentAssetsInspectionDetails') as FormGroup)
    .get('payable') as FormGroup)
    .get('parties') as FormArray;
    if (ObjectUtil.isEmpty(currentData)) {
      this.addPayablePartyForm();
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

  setReceivableAssetsDetails(currentData) {
    const controls = ((this.siteVisitFormGroup.get('currentAssetsInspectionDetails') as FormGroup)
    .get('otherCurrentAssets') as FormGroup)
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

  setPayableAssetsDetails(currentData) {
    const controls = ((this.siteVisitFormGroup.get('currentAssetsInspectionDetails') as FormGroup)
    .get('otherCurrentAssets') as FormGroup)
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

  setOtherCurrentInspectingStaffs(currentData) {
    const controls = ((this.siteVisitFormGroup.get('currentAssetsInspectionDetails') as FormGroup)
    .get('otherCurrentAssets') as FormGroup)
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

  setBankExposures(currentData) {
    const controls = ((this.siteVisitFormGroup.get('currentAssetsInspectionDetails') as FormGroup)
    .get('otherCurrentAssets') as FormGroup)
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

  calculateGrandTotal(formControl) {
    let grandTotal = 0;
    grandTotal = this.siteVisitFormGroup.get(['currentAssetsInspectionDetails',
          formControl, 'threeMonthTotal']).value +
        this.siteVisitFormGroup.get(['currentAssetsInspectionDetails',
          formControl, 'sixMonthTotal']).value + this.siteVisitFormGroup.get(['currentAssetsInspectionDetails',
          formControl, 'oneYearTotal']).value + this.siteVisitFormGroup.get(['currentAssetsInspectionDetails',
          formControl, 'moreThanOneYearTotal']).value ;
    this.siteVisitFormGroup.get(['currentAssetsInspectionDetails',
      formControl, 'grandTotal']).patchValue(grandTotal);

  }
}


