import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {SiteVisit} from '../../admin/modal/siteVisit';
import {ToastService} from "../../../@core/utils";
import {Alert, AlertType} from "../../../@theme/model/Alert";


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

  constructor(private formBuilder: FormBuilder,
              private toastService: ToastService) {
  }

  get staffsForm() {
    .get('vicinityToTheBasicAmenities'))
    .get('staffs')).controls);
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
      this.addDetailsOfParties();
      this.addDetailsOfReceivableAssets();
      this.addDetailsOfPayableAssets();
      this.addDetailsOfBankExposure();
    }
    this.onBuildingValueChange();
  }

  buildForm() {
    this.siteVisitFormGroup = this.formBuilder.group({
      currentResidentFormChecked: [false],
      businessSiteVisitFormChecked: [false],
      fixedAssetCollateralFormChecked: [false],
      currentAssetsInspectionFormChecked: [false],
      currentResidentDetails: this.formBuilder.group({
        houseNumber: [this.formDataForEdit === undefined ? '' : (this.formDataForEdit.currentResidentDetails === undefined ? ''
            : this.formDataForEdit.currentResidentDetails.houseNumber), Validators.required],
        streetName: [this.formDataForEdit === undefined ? '' : (this.formDataForEdit.currentResidentDetails === undefined ? ''
            : this.formDataForEdit.currentResidentDetails.streetName), Validators.required],
        address: [this.formDataForEdit === undefined ? '' : (this.formDataForEdit.currentResidentDetails === undefined ? ''
            : this.formDataForEdit.currentResidentDetails.address), Validators.required],
        nearBy: [this.formDataForEdit === undefined ? '' : (this.formDataForEdit.currentResidentDetails === undefined ? ''
            : this.formDataForEdit.currentResidentDetails.nearBy), Validators.required],
        ownerName: [this.formDataForEdit === undefined ? '' : (this.formDataForEdit.currentResidentDetails === undefined ? ''
            : this.formDataForEdit.currentResidentDetails.ownerName), Validators.required],
        locationPreview: [this.formDataForEdit === undefined ? '' : (this.formDataForEdit.currentResidentDetails === undefined ? ''
            : this.formDataForEdit.currentResidentDetails.locationPreview)]
      }),
      businessSiteVisitDetails: this.formBuilder.group({
        officeAddress: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.businessSiteVisitDetails === undefined ? ''
            : this.formDataForEdit.businessSiteVisitDetails.officeAddress, Validators.required],
        nameOfThePersonContacted: [this.formDataForEdit === undefined ? ''
            : this.formDataForEdit.businessSiteVisitDetails === undefined ? ''
                : this.formDataForEdit.businessSiteVisitDetails.nameOfThePersonContacted, Validators.required],
        dateOfVisit: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.businessSiteVisitDetails === undefined ? ''
            : this.formDataForEdit.businessSiteVisitDetails.dateOfVisit, Validators.required],
        objectiveOfVisit: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.businessSiteVisitDetails === undefined ? ''
            : this.formDataForEdit.businessSiteVisitDetails.objectiveOfVisit, Validators.required],
        visitedBy: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.businessSiteVisitDetails === undefined ? ''
            : this.formDataForEdit.businessSiteVisitDetails.visitedBy, Validators.required],
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
        address: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.fixedAssetCollateralDetails === undefined ? ''
            : this.formDataForEdit.fixedAssetCollateralDetails.address, Validators.required],
        personContacted: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.fixedAssetCollateralDetails === undefined ? ''
            : this.formDataForEdit.fixedAssetCollateralDetails.personContacted, Validators.required],
        phoneNoOfContact: [this.formDataForEdit === undefined ? ''
            : this.formDataForEdit.fixedAssetCollateralDetails === undefined ? ''
                : this.formDataForEdit.fixedAssetCollateralDetails.phoneNoOfContact, Validators.required],
        facilities: this.formBuilder.group({
          roadApproach: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.fixedAssetCollateralDetails === undefined ? ''
              : this.formDataForEdit.fixedAssetCollateralDetails.facilities === undefined ? ''
                  : this.formDataForEdit.fixedAssetCollateralDetails.facilities === undefined ? ''
                      : this.formDataForEdit.fixedAssetCollateralDetails.facilities.roadApproach, Validators.required],
          roadWidth: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.fixedAssetCollateralDetails === undefined ? ''
                  : this.formDataForEdit.fixedAssetCollateralDetails.facilities === undefined ? ''
                      : this.formDataForEdit.fixedAssetCollateralDetails.facilities.roadWidth, Validators.required],
          prominentPlace: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.fixedAssetCollateralDetails === undefined ? ''
                  : this.formDataForEdit.fixedAssetCollateralDetails.facilities === undefined ? ''
                      : this.formDataForEdit.fixedAssetCollateralDetails.facilities.prominentPlace, Validators.required],
          approachDistance: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.fixedAssetCollateralDetails === undefined ? ''
                  : this.formDataForEdit.fixedAssetCollateralDetails.facilities === undefined ? ''
                      : this.formDataForEdit.fixedAssetCollateralDetails.facilities.approachDistance, Validators.required]
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
          remarksForOtherFacility: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.fixedAssetCollateralDetails === undefined ? ''
                  : this.formDataForEdit.fixedAssetCollateralDetails.otherFacilities === undefined ? ''
                      : this.formDataForEdit.fixedAssetCollateralDetails.otherFacilities.remarksForOtherFacility, Validators.required],
          building: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.fixedAssetCollateralDetails === undefined ? ''
                  : this.formDataForEdit.fixedAssetCollateralDetails.otherFacilities === undefined ? ''
                      : this.formDataForEdit.fixedAssetCollateralDetails.otherFacilities.building, Validators.required],
          buildingArea: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.fixedAssetCollateralDetails === undefined ? ''
                  : this.formDataForEdit.fixedAssetCollateralDetails.otherFacilities === undefined ? ''
                      : this.formDataForEdit.fixedAssetCollateralDetails.otherFacilities.buildingArea, Validators.required],
          constructionYear: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.fixedAssetCollateralDetails === undefined ? ''
                  : this.formDataForEdit.fixedAssetCollateralDetails.otherFacilities === undefined ? ''
                      : this.formDataForEdit.fixedAssetCollateralDetails.otherFacilities.constructionYear, Validators.required],
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
          majorMarketPlaces: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.fixedAssetCollateralDetails.vicinityToTheBasicAmenities === undefined ? ''
                  : this.formDataForEdit.fixedAssetCollateralDetails.vicinityToTheBasicAmenities.majorMarketPlaces, Validators.required],
          schoolOrCollege: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.fixedAssetCollateralDetails.vicinityToTheBasicAmenities === undefined ? ''
                  : this.formDataForEdit.fixedAssetCollateralDetails.vicinityToTheBasicAmenities.schoolOrCollege, Validators.required],
          hospitalOrNursingHome: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.fixedAssetCollateralDetails.vicinityToTheBasicAmenities === undefined ? ''
                  : this.formDataForEdit.fixedAssetCollateralDetails.vicinityToTheBasicAmenities.hospitalOrNursingHome,
            Validators.required],
          electricityLine: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.fixedAssetCollateralDetails.vicinityToTheBasicAmenities === undefined ? ''
                  : this.formDataForEdit.fixedAssetCollateralDetails.vicinityToTheBasicAmenities.electricityLine, Validators.required],
          telephoneLine: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.fixedAssetCollateralDetails.vicinityToTheBasicAmenities === undefined ? ''
                  : this.formDataForEdit.fixedAssetCollateralDetails.vicinityToTheBasicAmenities.telephoneLine, Validators.required],
          waterPipeline: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.fixedAssetCollateralDetails.vicinityToTheBasicAmenities === undefined ? ''
                  : this.formDataForEdit.fixedAssetCollateralDetails.vicinityToTheBasicAmenities.waterPipeline, Validators.required],
          staffs: this.formBuilder.array([]),
          commentAboutFAC: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.fixedAssetCollateralDetails.vicinityToTheBasicAmenities === undefined ? ''
                  : this.formDataForEdit.fixedAssetCollateralDetails.vicinityToTheBasicAmenities.commentAboutFAC, Validators.required],
          branchInchargeComment: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.fixedAssetCollateralDetails.vicinityToTheBasicAmenities === undefined ? ''
                  : this.formDataForEdit.fixedAssetCollateralDetails.vicinityToTheBasicAmenities.branchInchargeComment, Validators.required]
        })
      }),
      currentAssetsInspectionDetails: this.formBuilder.group({
        dateOfInspection: [this.formDataForEdit === undefined ? ''
            : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                : this.formDataForEdit.currentAssetsInspectionDetails.dateOfInspection, Validators.required],
        particularsOfGoodInspected: [this.formDataForEdit === undefined ? ''
            : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                : this.formDataForEdit.currentAssetsInspectionDetails.particularsOfGoodInspected, Validators.required],
        stockValueReported: [this.formDataForEdit === undefined ? ''
            : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                : this.formDataForEdit.currentAssetsInspectionDetails.stockValueReported, Validators.required],
        rents: [this.formDataForEdit === undefined ? ''
            : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                : this.formDataForEdit.currentAssetsInspectionDetails.rents, Validators.required],
        isRentPmtUpToDate: [this.formDataForEdit === undefined ? ''
            : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                : this.formDataForEdit.currentAssetsInspectionDetails.isRentPmtUpToDate, Validators.required],
        isRentReceiptShown: [this.formDataForEdit === undefined ? ''
            : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                : this.formDataForEdit.currentAssetsInspectionDetails.isRentReceiptShown, Validators.required],
        insuranceVerification: this.formBuilder.group({
          assetsMortgaged: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.currentAssetsInspectionDetails.insuranceVerification === undefined ? ''
                      : this.formDataForEdit.currentAssetsInspectionDetails.insuranceVerification.assetsMortgaged, Validators.required],
          insuredAmount: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.currentAssetsInspectionDetails.insuranceVerification === undefined ? ''
                      : this.formDataForEdit.currentAssetsInspectionDetails.insuranceVerification.insuredAmount, Validators.required],
          insuranceCompany: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.currentAssetsInspectionDetails.insuranceVerification === undefined ? ''
                      : this.formDataForEdit.currentAssetsInspectionDetails.insuranceVerification.insuranceCompany, Validators.required],
          expiryDate: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.currentAssetsInspectionDetails.insuranceVerification === undefined ? ''
                      : this.formDataForEdit.currentAssetsInspectionDetails.insuranceVerification.expiryDate, Validators.required],
          clientsOverallRating: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.currentAssetsInspectionDetails.insuranceVerification === undefined ? ''
                      : this.formDataForEdit.currentAssetsInspectionDetails.insuranceVerification.clientsOverallRating,
            Validators.required],
          comments: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.currentAssetsInspectionDetails.insuranceVerification === undefined ? ''
                      : this.formDataForEdit.currentAssetsInspectionDetails.insuranceVerification.comments, Validators.required],
          stockValueConfirmed: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.currentAssetsInspectionDetails.insuranceVerification === undefined ? ''
                      : this.formDataForEdit.currentAssetsInspectionDetails.insuranceVerification.stockValueConfirmed, Validators.required],
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
                      : this.formDataForEdit.currentAssetsInspectionDetails.receivablesAndPayables.threeMonthTotal, Validators.required],
          sixMonthTotal: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.currentAssetsInspectionDetails.receivablesAndPayables === undefined ? ''
                      : this.formDataForEdit.currentAssetsInspectionDetails.receivablesAndPayables.sixMonthTotal, Validators.required],
          oneYearTotal: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.currentAssetsInspectionDetails.receivablesAndPayables === undefined ? ''
                      : this.formDataForEdit.currentAssetsInspectionDetails.receivablesAndPayables.oneYearTotal, Validators.required],
          moreThanOneYearTotal: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.currentAssetsInspectionDetails.receivablesAndPayables === undefined ? ''
                      : this.formDataForEdit.currentAssetsInspectionDetails.receivablesAndPayables.moreThanOneYearTotal, Validators.required],
          findingsAndCommentsForCurrentAssetsInspection: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.currentAssetsInspectionDetails.receivablesAndPayables === undefined ? ''
                      : this.formDataForEdit.currentAssetsInspectionDetails
                          .receivablesAndPayables.findingsAndCommentsForCurrentAssetsInspection, Validators.required]
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
    this.setReceivableAssetsDetails(currentAssetsInspectionData.otherCurrentAssets.receivableAssets);
    this.setPayableAssetsDetails(currentAssetsInspectionData.otherCurrentAssets.payableAssets);
    this.setOtherCurrentInspectingStaffs(currentAssetsInspectionData.otherCurrentAssets.inspectingStaffs);
    this.setBankExposures(currentAssetsInspectionData.otherCurrentAssets.bankExposures);
  }

  staffsFormGroup(): FormGroup {
    return this.formBuilder.group({
      name: [undefined, Validators.required],
      position: [undefined, Validators.required]
    });
  }

  addStaffs() {
    (<FormArray>(<FormGroup>(<FormGroup>this.siteVisitFormGroup.get('fixedAssetCollateralDetails'))
    .get('vicinityToTheBasicAmenities'))
    .get('staffs'))
    .push(this.staffsFormGroup());
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
    (<FormArray>(<FormGroup>(<FormGroup>this.siteVisitFormGroup.get('currentAssetsInspectionDetails'))
    .get('insuranceVerification'))
    .get('inspectingStaffsDetails'))
    .push(this.staffsFormGroup());
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
      party: [undefined, Validators.required],
      withinThreeMonths: [undefined, Validators.required],
      sixMonth: [undefined, Validators.required],
      oneYear: [undefined, Validators.required],
      oneYearPlus: [undefined, Validators.required]
    });
  }

  addPartyForm() {
    (<FormArray>(<FormGroup>(<FormGroup>this.siteVisitFormGroup.get('currentAssetsInspectionDetails'))
    .get('receivablesAndPayables'))
    .get('parties')).push(this.partyFormGroup());
  }

  deletePartyForm(i) {
    (<FormArray>(<FormGroup>(<FormGroup>this.siteVisitFormGroup.get('currentAssetsInspectionDetails'))
    .get('receivablesAndPayables'))
    .get('parties')).removeAt(i);
  }

  partyLength() {
    return (<FormArray>(<FormGroup>(<FormGroup>this.siteVisitFormGroup.get('currentAssetsInspectionDetails'))
    .get('receivablesAndPayables'))
    .get('parties')).length;
  }

  assetsFormGroup() {
    return this.formBuilder.group({
      particulars: [undefined, Validators.required],
      amount: [undefined, Validators.required]
    });
  }

  addReceivableAssets() {
    (<FormArray>(<FormGroup>(<FormGroup>this.siteVisitFormGroup.get('currentAssetsInspectionDetails'))
    .get('otherCurrentAssets'))
    .get('receivableAssets'))
    .push(this.assetsFormGroup());
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
    (<FormArray>(<FormGroup>(<FormGroup>this.siteVisitFormGroup.get('currentAssetsInspectionDetails'))
    .get('otherCurrentAssets'))
    .get('payableAssets'))
    .push(this.assetsFormGroup());
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
    (<FormArray>(<FormGroup>(<FormGroup>this.siteVisitFormGroup.get('currentAssetsInspectionDetails'))
    .get('otherCurrentAssets'))
    .get('inspectingStaffs'))
    .push(this.staffsFormGroup());
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
      bankName: [undefined, Validators.required],
      amount: [undefined, Validators.required]
    });
  }

  addBankExposure() {
    (<FormArray>(<FormGroup>(<FormGroup>this.siteVisitFormGroup.get('currentAssetsInspectionDetails'))
    .get('otherCurrentAssets'))
    .get('bankExposures'))
    .push(this.bankExposureFormGroup());
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
    if (!this.currentResidentForm && !this.businessSiteVisitForm && !this.fixedAssetCollateralForm && !this.currentAssetsInspectionForm) {
      this.toastService.show(new Alert(AlertType.INFO, 'Please Select Atleast One SiteVisit!'));
      return;
    }
    if (this.currentResidentForm) {
      if (this.siteVisitFormGroup.get('currentResidentDetails').invalid) {
        this.submitted = true;
        return;
      }
    }
    if (this.businessSiteVisitForm) {
      if (this.siteVisitFormGroup.get('businessSiteVisitDetails').invalid) {
        this.business = true;
        return;
      }
    }
    if (this.fixedAssetCollateralForm) {
      if (this.siteVisitFormGroup.get('fixedAssetCollateralDetails').invalid) {
        this.fixed = true;
        return;
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
          name: [undefined, Validators.required],
          position: [undefined, Validators.required]
        })
    );
  }

  addStaffOfInsurance() {
    const controls = ((this.siteVisitFormGroup.get('currentAssetsInspectionDetails') as FormGroup)
    .get('insuranceVerification') as FormGroup)
    .get('inspectingStaffsDetails') as FormArray;
    controls.push(
        this.formBuilder.group({
          name: [undefined, Validators.required],
          position: [undefined, Validators.required]
        })
    );
  }

  addStaffOfOtherAssets() {
    const controls = ((this.siteVisitFormGroup.get('currentAssetsInspectionDetails') as FormGroup)
    .get('otherCurrentAssets') as FormGroup)
    .get('inspectingStaffs') as FormArray;
    controls.push(
        this.formBuilder.group({
          name: [undefined, Validators.required],
          position: [undefined, Validators.required]
        })
    );
  }

  addDetailsOfParties() {
    const controls = ((this.siteVisitFormGroup.get('currentAssetsInspectionDetails') as FormGroup)
    .get('receivablesAndPayables') as FormGroup)
    .get('parties') as FormArray;
    controls.push(
        this.formBuilder.group({
          party: [undefined, Validators.required],
          withinThreeMonths: [undefined, Validators.required],
          sixMonth: [undefined, Validators.required],
          oneYear: [undefined, Validators.required],
          oneYearPlus: [undefined, Validators.required]
        })
    );
  }

  addDetailsOfReceivableAssets() {
    const controls = ((this.siteVisitFormGroup.get('currentAssetsInspectionDetails') as FormGroup)
    .get('otherCurrentAssets') as FormGroup)
    .get('receivableAssets') as FormArray;
    controls.push(
        this.formBuilder.group({
          particulars: [undefined, Validators.required],
          amount: [undefined, Validators.required]
        })
    );
  }

  addDetailsOfPayableAssets() {
    const controls = ((this.siteVisitFormGroup.get('currentAssetsInspectionDetails') as FormGroup)
    .get('otherCurrentAssets') as FormGroup)
    .get('payableAssets') as FormArray;
    controls.push(
        this.formBuilder.group({
          particulars: [undefined, Validators.required],
          amount: [undefined, Validators.required]
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
            name: [data.name, Validators.required],
            position: [data.position, Validators.required]
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
              name: [data.name, Validators.required],
              position: [data.position, Validators.required]
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
            party: [data.party, Validators.required],
            withinThreeMonths: [data.withinThreeMonths, Validators.required],
            sixMonth: [data.sixMonth, Validators.required],
            oneYear: [data.oneYear, Validators.required],
            oneYearPlus: [data.oneYearPlus, Validators.required]
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
            particulars: [data.particulars, Validators.required],
            amount: [data.amount, Validators.required]
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
            particulars: [data.particulars, Validators.required],
            amount: [data.amount, Validators.required]
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
            name: [data.name, Validators.required],
            position: [data.position, Validators.required]
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
            bankName: [data.bankName, Validators.required],
            amount: [data.amount, Validators.required]
          })
      );
    });
  }


  onBuildingValueChange() {
    const control = (this.siteVisitFormGroup.get('fixedAssetCollateralDetails') as FormGroup);
    control.get('otherFacilities').get('building').valueChanges.subscribe(value => {
      if (value === 'NO') {
        control.get('otherFacilities').get('buildingArea').setValidators(null);
        control.get('otherFacilities').get('constructionYear').setValidators(null);
      } else if (value === 'YES') {
        control.get('otherFacilities').get('buildingArea').setValidators(Validators.required);
        control.get('otherFacilities').get('constructionYear').setValidators(Validators.required);
      }
      control.get('otherFacilities').get('buildingArea').updateValueAndValidity();
      control.get('otherFacilities').get('constructionYear').updateValueAndValidity();
    });
  }

  public removeValidators(form: FormGroup) {
    for(const key in form.controls) {
      form.get(key).clearValidators();
      form.get(key).updateValueAndValidity();
    }
  }
}


