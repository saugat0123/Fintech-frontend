import {Component, Input, OnInit} from '@angular/core';
import {Form, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';


declare let google: any;

@Component({
  selector: 'app-site-visit',
  templateUrl: './site-visit.component.html',
  styleUrls: ['./site-visit.component.css']
})
export class SiteVisitComponent implements OnInit {
  @Input() formValue: Object;
  siteVisitData: Array<Object>;
  siteVisitFormGroup: FormGroup;
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

  constructor(private formBuilder: FormBuilder) {

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

  ngOnInit() {
    if (this.formValue !== undefined) {
      const stringFormData = JSON.stringify(this.formValue);
      console.log(this.formValue);
      this.formDataForEdit = JSON.parse(stringFormData);
      console.log(this.formDataForEdit);
    }
    this.buildForm();
    if (this.formValue !== undefined) {
      const formData = this.formDataForEdit.data.fixedAssetCollateralDetails.vicinityToTheBasicAmenities;
      const currentAssetsInspectionData = this.formDataForEdit.data.currentAssetsInspectionDetails;
      console.log(formData);
      this.checkboxSelected('currentResident', true);
      this.checkboxSelected('businessSiteVisit', true);
      this.checkboxSelected('fixedAssetCollateral', true);
      this.checkboxSelected('currentAssetsInspection', true);
      this.setStaffDetails(formData.staffs);
      console.log(currentAssetsInspectionData);
      this.setInspectingStaffsDetails(currentAssetsInspectionData.insuranceVerification.inspectingStaffList);
      this.setPartyFormDetails(currentAssetsInspectionData.receivablesAndPayables.parties);
      this.setReceivableAssetsDetails(currentAssetsInspectionData.otherCurrentAssets.receivableAssets);
      this.setPayableAssetsDetails(currentAssetsInspectionData.otherCurrentAssets.payableAssets);
      this.setOtherCurrentInspectingStaffs(currentAssetsInspectionData.otherCurrentAssets.inspectingStaffs);
      this.setBankExposures(currentAssetsInspectionData.otherCurrentAssets.bankExposures);
    } else {
      this.addStaffOfVicinity();
      this.addStaffOfInsurance();
      this.addStaffOfOtherAssets();
      this.addDetailsOfParties();
      this.addDetailsOfReceivableAssets();
      this.addDetailsOfPayableAssets();
      this.addDetailsOfBankExposure();

    }


  }

  buildForm() {
    this.siteVisitFormGroup = this.formBuilder.group({
      currentResidentDetails: this.formBuilder.group({
        houseNumber: [this.formDataForEdit === undefined ? '' : (this.formDataForEdit.data.currentResidentDetails === undefined ? ''
            : this.formDataForEdit.data.currentResidentDetails.houseNumber)],
        streetName: [this.formDataForEdit === undefined ? '' : (this.formDataForEdit.data.currentResidentDetails === undefined ? ''
            : this.formDataForEdit.data.currentResidentDetails.streetName)],
        address: [this.formDataForEdit === undefined ? '' : (this.formDataForEdit.data.currentResidentDetails === undefined ? ''
            : this.formDataForEdit.data.currentResidentDetails.address)],
        nearBy: [this.formDataForEdit === undefined ? '' : (this.formDataForEdit.data.currentResidentDetails === undefined ? ''
            : this.formDataForEdit.data.currentResidentDetails.nearBy)],
        ownerName: [this.formDataForEdit === undefined ? '' : (this.formDataForEdit.data.currentResidentDetails === undefined ? ''
            : this.formDataForEdit.data.currentResidentDetails.ownerName)]
      }),
      businessSiteVisitDetails: this.formBuilder.group({
        officeAddress: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.data.businessSiteVisitDetails === undefined ? ''
            : this.formDataForEdit.data.businessSiteVisitDetails.officeAddress],
        nameOfThePersonContacted: [this.formDataForEdit === undefined ? ''
            : this.formDataForEdit.data.businessSiteVisitDetails === undefined ? ''
                : this.formDataForEdit.data.businessSiteVisitDetails.nameOfThePersonContacted],
        dateOfVisit: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.data.businessSiteVisitDetails === undefined ? ''
            : this.formDataForEdit.data.businessSiteVisitDetails.dateOfVisit],
        objectiveOfVisit: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.data.businessSiteVisitDetails === undefined ? ''
            : this.formDataForEdit.data.businessSiteVisitDetails.objectiveOfVisit],
        observation: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.data.businessSiteVisitDetails === undefined ? ''
            : this.formDataForEdit.data.businessSiteVisitDetails.observation],
        visitedBy: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.data.businessSiteVisitDetails === undefined ? ''
            : this.formDataForEdit.data.businessSiteVisitDetails.visitedBy],
        conclusion: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.data.businessSiteVisitDetails === undefined ? ''
            : this.formDataForEdit.data.businessSiteVisitDetails.conclusion],
        locationPreview: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.data.businessSiteVisitDetails === undefined ? ''
            : this.formDataForEdit.data.businessSiteVisitDetails.locationPreview],
        mapAddress: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.data.businessSiteVisitDetails === undefined ? ''
            : this.formDataForEdit.data.businessSiteVisitDetails.mapAddress],
        findingsAndComments: [this.formDataForEdit === undefined ? ''
            : this.formDataForEdit.data.businessSiteVisitDetails === undefined ? ''
                : this.formDataForEdit.data.businessSiteVisitDetails.findingsAndComments]
      }),
      fixedAssetCollateralDetails: this.formBuilder.group({
        date: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.data.fixedAssetCollateralDetails === undefined ? ''
            : this.formDataForEdit.data.fixedAssetCollateralDetails.date],
        address: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.data.fixedAssetCollateralDetails === undefined ? ''
            : this.formDataForEdit.data.fixedAssetCollateralDetails.address],
        personContacted: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.data.fixedAssetCollateralDetails === undefined ? ''
            : this.formDataForEdit.data.fixedAssetCollateralDetails.personContacted],
        phoneNoOfContact: [this.formDataForEdit === undefined ? ''
            : this.formDataForEdit.data.fixedAssetCollateralDetails === undefined ? ''
                : this.formDataForEdit.data.fixedAssetCollateralDetails.phoneNoOfContact],
        facilities: this.formBuilder.group({
          roadApproach: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.data.fixedAssetCollateralDetails === undefined ? ''
              : this.formDataForEdit.data.fixedAssetCollateralDetails.facilities === undefined ? ''
                  : this.formDataForEdit.data.fixedAssetCollateralDetails.facilities === undefined ? ''
                      : this.formDataForEdit.data.fixedAssetCollateralDetails.facilities.roadApproach],
          roadWidth: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.fixedAssetCollateralDetails === undefined ? ''
                  : this.formDataForEdit.data.fixedAssetCollateralDetails.facilities === undefined ? ''
                      : this.formDataForEdit.data.fixedAssetCollateralDetails.facilities.roadWidth],
          prominentPlace: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.fixedAssetCollateralDetails === undefined ? ''
                  : this.formDataForEdit.data.fixedAssetCollateralDetails.facilities === undefined ? ''
                      : this.formDataForEdit.data.fixedAssetCollateralDetails.facilities.prominentPlace],
          approachDistance: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.fixedAssetCollateralDetails === undefined ? ''
                  : this.formDataForEdit.data.fixedAssetCollateralDetails.facilities === undefined ? ''
                      : this.formDataForEdit.data.fixedAssetCollateralDetails.facilities.approachDistance]
        }),
        otherFacilities: this.formBuilder.group({
          waterSupply: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.fixedAssetCollateralDetails === undefined ? ''
                  : this.formDataForEdit.data.fixedAssetCollateralDetails.otherFacilities === undefined ? ''
                      : this.formDataForEdit.data.fixedAssetCollateralDetails.otherFacilities.waterSupply],
          electricity: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.fixedAssetCollateralDetails === undefined ? ''
                  : this.formDataForEdit.data.fixedAssetCollateralDetails.otherFacilities === undefined ? ''
                      : this.formDataForEdit.data.fixedAssetCollateralDetails.otherFacilities.electricity],
          boundaryWallConstruction: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.fixedAssetCollateralDetails === undefined ? ''
                  : this.formDataForEdit.data.fixedAssetCollateralDetails.otherFacilities === undefined ? ''
                      : this.formDataForEdit.data.fixedAssetCollateralDetails.otherFacilities.boundryWallConstruction],
          boundaryFencing: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.fixedAssetCollateralDetails === undefined ? ''
                  : this.formDataForEdit.data.fixedAssetCollateralDetails.otherFacilities === undefined ? ''
                      : this.formDataForEdit.data.fixedAssetCollateralDetails.otherFacilities.boundryFencing],
          drainage: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.fixedAssetCollateralDetails === undefined ? ''
                  : this.formDataForEdit.data.fixedAssetCollateralDetails.otherFacilities === undefined ? ''
                      : this.formDataForEdit.data.fixedAssetCollateralDetails.otherFacilities.drainage],
          open: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.fixedAssetCollateralDetails === undefined ? ''
                  : this.formDataForEdit.data.fixedAssetCollateralDetails.otherFacilities === undefined ? ''
                      : this.formDataForEdit.data.fixedAssetCollateralDetails.otherFacilities.open],
          remarksForOtherFacility: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.fixedAssetCollateralDetails === undefined ? ''
                  : this.formDataForEdit.data.fixedAssetCollateralDetails.otherFacilities === undefined ? ''
                      : this.formDataForEdit.data.fixedAssetCollateralDetails.otherFacilities.remarksForOtherFacility],
          building: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.fixedAssetCollateralDetails === undefined ? ''
                  : this.formDataForEdit.data.fixedAssetCollateralDetails.otherFacilities === undefined ? ''
                      : this.formDataForEdit.data.fixedAssetCollateralDetails.otherFacilities.building],
          buildingArea: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.fixedAssetCollateralDetails === undefined ? ''
                  : this.formDataForEdit.data.fixedAssetCollateralDetails.otherFacilities === undefined ? ''
                      : this.formDataForEdit.data.fixedAssetCollateralDetails.otherFacilities.buildingArea],
          constructionYear: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.fixedAssetCollateralDetails === undefined ? ''
                  : this.formDataForEdit.data.fixedAssetCollateralDetails.otherFacilities === undefined ? ''
                      : this.formDataForEdit.data.fixedAssetCollateralDetails.otherFacilities.constructionYear],
          qualityOfConstructionRemarks: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.fixedAssetCollateralDetails === undefined ? ''
                  : this.formDataForEdit.data.fixedAssetCollateralDetails.otherFacilities === undefined ? ''
                      : this.formDataForEdit.data.fixedAssetCollateralDetails.otherFacilities.qualityOfConstructionRemarks],
          loadBearingWall: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.fixedAssetCollateralDetails === undefined ? ''
                  : this.formDataForEdit.data.fixedAssetCollateralDetails.otherFacilities === undefined ? ''
                      : this.formDataForEdit.data.fixedAssetCollateralDetails.otherFacilities.loadBearingWall],
          mortarCement: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.fixedAssetCollateralDetails === undefined ? ''
                  : this.formDataForEdit.data.fixedAssetCollateralDetails.otherFacilities === undefined ? ''
                      : this.formDataForEdit.data.fixedAssetCollateralDetails.otherFacilities.mortarCement],
          otherRoofing: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.fixedAssetCollateralDetails === undefined ? ''
                  : this.formDataForEdit.data.fixedAssetCollateralDetails.otherFacilities === undefined ? ''
                      : this.formDataForEdit.data.fixedAssetCollateralDetails.otherFacilities.otherRoofing],
          insideFurniture: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.fixedAssetCollateralDetails === undefined ? ''
                  : this.formDataForEdit.data.fixedAssetCollateralDetails.otherFacilities === undefined ? ''
                      : this.formDataForEdit.data.fixedAssetCollateralDetails.otherFacilities.insideFurniture],
          frameStructure: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.fixedAssetCollateralDetails === undefined ? ''
                  : this.formDataForEdit.data.fixedAssetCollateralDetails.otherFacilities === undefined ? ''
                      : this.formDataForEdit.data.fixedAssetCollateralDetails.otherFacilities.frameStructure],
          rccRoofing: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.fixedAssetCollateralDetails === undefined ? ''
                  : this.formDataForEdit.data.fixedAssetCollateralDetails.otherFacilities === undefined ? ''
                      : this.formDataForEdit.data.fixedAssetCollateralDetails.otherFacilities.rccRoofing],
          bathroomAndToilet: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.fixedAssetCollateralDetails === undefined ? ''
                  : this.formDataForEdit.data.fixedAssetCollateralDetails.otherFacilities === undefined ? ''
                      : this.formDataForEdit.data.fixedAssetCollateralDetails.otherFacilities.bathroomAndToilet],
        }),
        vicinityToTheBasicAmenities: this.formBuilder.group({
          majorMarketPlaces: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.fixedAssetCollateralDetails.vicinityToTheBasicAmenities === undefined ? ''
                  : this.formDataForEdit.data.fixedAssetCollateralDetails.vicinityToTheBasicAmenities.majorMarketPlaces],
          schoolOrCollege: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.fixedAssetCollateralDetails.vicinityToTheBasicAmenities === undefined ? ''
                  : this.formDataForEdit.data.fixedAssetCollateralDetails.vicinityToTheBasicAmenities.schoolOrCollege],
          hospitalOrNursingHome: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.fixedAssetCollateralDetails.vicinityToTheBasicAmenities === undefined ? ''
                  : this.formDataForEdit.data.fixedAssetCollateralDetails.vicinityToTheBasicAmenities.hospitalOrNursingHome],
          electricityLine: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.fixedAssetCollateralDetails.vicinityToTheBasicAmenities === undefined ? ''
                  : this.formDataForEdit.data.fixedAssetCollateralDetails.vicinityToTheBasicAmenities.electricityLine],
          telephoneLine: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.fixedAssetCollateralDetails.vicinityToTheBasicAmenities === undefined ? ''
                  : this.formDataForEdit.data.fixedAssetCollateralDetails.vicinityToTheBasicAmenities.telephoneLine],
          waterPipeline: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.fixedAssetCollateralDetails.vicinityToTheBasicAmenities === undefined ? ''
                  : this.formDataForEdit.data.fixedAssetCollateralDetails.vicinityToTheBasicAmenities.waterPipeline],
          staffs: this.formBuilder.array([]),
          commentAboutFAC: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.fixedAssetCollateralDetails.vicinityToTheBasicAmenities === undefined ? ''
                  : this.formDataForEdit.data.fixedAssetCollateralDetails.vicinityToTheBasicAmenities.commentAboutFAC],
          branchInchargeComment: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.fixedAssetCollateralDetails.vicinityToTheBasicAmenities === undefined ? ''
                  : this.formDataForEdit.data.fixedAssetCollateralDetails.vicinityToTheBasicAmenities.branchInchargeComment]
        })
      }),
      currentAssetsInspectionDetails: this.formBuilder.group({
        dateOfInspection: [this.formDataForEdit === undefined ? ''
            : this.formDataForEdit.data.currentAssetsInspectionDetails === undefined ? ''
                : this.formDataForEdit.data.currentAssetsInspectionDetails.dateOfInspection],
        particularsOfGoodInspected: [this.formDataForEdit === undefined ? ''
            : this.formDataForEdit.data.currentAssetsInspectionDetails === undefined ? ''
                : this.formDataForEdit.data.currentAssetsInspectionDetails.particularsOfGoodInspected],
        stockValueReported: [this.formDataForEdit === undefined ? ''
            : this.formDataForEdit.data.currentAssetsInspectionDetails === undefined ? ''
                : this.formDataForEdit.data.currentAssetsInspectionDetails.stockValueReported],
        rents: [this.formDataForEdit === undefined ? ''
            : this.formDataForEdit.data.currentAssetsInspectionDetails === undefined ? ''
                : this.formDataForEdit.data.currentAssetsInspectionDetails.rents],
        isRentPmtUpToDate: [this.formDataForEdit === undefined ? ''
            : this.formDataForEdit.data.currentAssetsInspectionDetails === undefined ? ''
                : this.formDataForEdit.data.currentAssetsInspectionDetails.isRentPmtUpToDate],
        isRentReceiptShown: [this.formDataForEdit === undefined ? ''
            : this.formDataForEdit.data.currentAssetsInspectionDetails === undefined ? ''
                : this.formDataForEdit.data.currentAssetsInspectionDetails.isRentReceiptShown],
        insuranceVerification: this.formBuilder.group({
          assetsMortgaged: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.data.currentAssetsInspectionDetails.insuranceVerification === undefined ? ''
                      : this.formDataForEdit.data.currentAssetsInspectionDetails.insuranceVerification.assetsMortgaged],
          insuredAmount: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.data.currentAssetsInspectionDetails.insuranceVerification === undefined ? ''
                      : this.formDataForEdit.data.currentAssetsInspectionDetails.insuranceVerification.insuredAmount],
          insuranceCompany: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.data.currentAssetsInspectionDetails.insuranceVerification === undefined ? ''
                      : this.formDataForEdit.data.currentAssetsInspectionDetails.insuranceVerification.insuranceCompany],
          expireDate: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.data.currentAssetsInspectionDetails.insuranceVerification === undefined ? ''
                      : this.formDataForEdit.data.currentAssetsInspectionDetails.insuranceVerification.expiryDate],
          clientsOverallRating: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.data.currentAssetsInspectionDetails.insuranceVerification === undefined ? ''
                      : this.formDataForEdit.data.currentAssetsInspectionDetails.insuranceVerification.clientsOverallRating],
          comments: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.data.currentAssetsInspectionDetails.insuranceVerification === undefined ? ''
                      : this.formDataForEdit.data.currentAssetsInspectionDetails.insuranceVerification.comments],
          stockValueConfirmed: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.data.currentAssetsInspectionDetails.insuranceVerification === undefined ? ''
                      : this.formDataForEdit.data.currentAssetsInspectionDetails.insuranceVerification.stockValueConfirmed],
          insuranceVerificationPosition: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.data.currentAssetsInspectionDetails.insuranceVerification === undefined ? ''
                      : this.formDataForEdit.data.currentAssetsInspectionDetails.insuranceVerificationPosition],
          inspectingStaffsDetails: this.formBuilder.array([])
        }),
        stockCheckListQuestionaire: this.formBuilder.group({
          uptoDateWithCharges: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.data.currentAssetsInspectionDetails.stockCheckListQuestionaire === undefined ? ''
                      : this.formDataForEdit.data.currentAssetsInspectionDetails.stockCheckListQuestionaire.uptoDateWithCharges],
          borrowersPossession: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.data.currentAssetsInspectionDetails.stockCheckListQuestionaire === undefined ? ''
                      : this.formDataForEdit.data.currentAssetsInspectionDetails.stockCheckListQuestionaire.borrowersPossession],
          notUnderTR: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.data.currentAssetsInspectionDetails.stockCheckListQuestionaire === undefined ? ''
                      : this.formDataForEdit.data.currentAssetsInspectionDetails.stockCheckListQuestionaire.notUnderTR],
          otherBankNotInterested: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.data.currentAssetsInspectionDetails.stockCheckListQuestionaire === undefined ? ''
                      : this.formDataForEdit.data.currentAssetsInspectionDetails.stockCheckListQuestionaire.otherBankNotInterested],
          securityOrder: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.data.currentAssetsInspectionDetails.stockCheckListQuestionaire === undefined ? ''
                      : this.formDataForEdit.data.currentAssetsInspectionDetails.stockCheckListQuestionaire.securityOrder],
          goodsSaleable: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.data.currentAssetsInspectionDetails.stockCheckListQuestionaire === undefined ? ''
                      : this.formDataForEdit.data.currentAssetsInspectionDetails.stockCheckListQuestionaire.goodsSaleable],
          stocksUptoDate: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.data.currentAssetsInspectionDetails.stockCheckListQuestionaire === undefined ? ''
                      : this.formDataForEdit.data.currentAssetsInspectionDetails.stockCheckListQuestionaire.stocksUptoDate],
          matchWithTheStockList: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.data.currentAssetsInspectionDetails.stockCheckListQuestionaire === undefined ? ''
                      : this.formDataForEdit.data.currentAssetsInspectionDetails.stockCheckListQuestionaire.matchWithTheStockList],
          storageConditionSatisfactory: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.data.currentAssetsInspectionDetails.stockCheckListQuestionaire === undefined ? ''
                      : this.formDataForEdit.data.currentAssetsInspectionDetails.stockCheckListQuestionaire.storageConditionSatisfactory],
          fireFightingEvidence: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.data.currentAssetsInspectionDetails.stockCheckListQuestionaire === undefined ? ''
                      : this.formDataForEdit.data.currentAssetsInspectionDetails.stockCheckListQuestionaire.fireFightingEvidence],
          buildingStoreCondition: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.data.currentAssetsInspectionDetails.stockCheckListQuestionaire === undefined ? ''
                      : this.formDataForEdit.data.currentAssetsInspectionDetails.stockCheckListQuestionaire.buildingStoreCondition],
          warrantiesUptoDate: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.data.currentAssetsInspectionDetails.stockCheckListQuestionaire === undefined ? ''
                      : this.formDataForEdit.data.currentAssetsInspectionDetails.stockCheckListQuestionaire.warrantiesUptoDate],
          noHazardousNature: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.data.currentAssetsInspectionDetails.stockCheckListQuestionaire === undefined ? ''
                      : this.formDataForEdit.data.currentAssetsInspectionDetails.stockCheckListQuestionaire.noHazardousNature],
          nameBoardProperlyDisplayed: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.data.currentAssetsInspectionDetails.stockCheckListQuestionaire === undefined ? ''
                      : this.formDataForEdit.data.currentAssetsInspectionDetails.stockCheckListQuestionaire.nameBoardProperlyDisplayed],
          padlocksUse: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.data.currentAssetsInspectionDetails.stockCheckListQuestionaire === undefined ? ''
                      : this.formDataForEdit.data.currentAssetsInspectionDetails.stockCheckListQuestionaire.padlocksUse],
          findingAndComments: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.data.currentAssetsInspectionDetails.stockCheckListQuestionaire === undefined ? ''
                      : this.formDataForEdit.data.currentAssetsInspectionDetails.stockCheckListQuestionaire.findingAndComments],
          remarksForNoOption: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.data.currentAssetsInspectionDetails.stockCheckListQuestionaire === undefined ? ''
                      : this.formDataForEdit.data.currentAssetsInspectionDetails.stockCheckListQuestionaire.remarksForNoOption]
        }),
        receivablesAndPayables: this.formBuilder.group({
          parties: this.formBuilder.array([]),
          threeMonthTotal: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.data.currentAssetsInspectionDetails.receivablesAndPayables === undefined ? ''
                      : this.formDataForEdit.data.currentAssetsInspectionDetails.receivablesAndPayables.threeMonthTotal],
          sixMonthTotal: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.data.currentAssetsInspectionDetails.receivablesAndPayables === undefined ? ''
                      : this.formDataForEdit.data.currentAssetsInspectionDetails.receivablesAndPayables.sixMonthTotal],
          oneYearTotal: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.data.currentAssetsInspectionDetails.receivablesAndPayables === undefined ? ''
                      : this.formDataForEdit.data.currentAssetsInspectionDetails.receivablesAndPayables.oneYearTotal],
          moreThanOneYearTotal: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.data.currentAssetsInspectionDetails.receivablesAndPayables === undefined ? ''
                      : this.formDataForEdit.data.currentAssetsInspectionDetails.receivablesAndPayables.moreThanOneYearTotal],
          findingsAndCommentsForCurrentAssetsInspection: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.data.currentAssetsInspectionDetails.receivablesAndPayables === undefined ? ''
                      : this.formDataForEdit.data.currentAssetsInspectionDetails
                          .receivablesAndPayables.findingsAndCommentsForCurrentAssetsInspection]
        }),
        otherCurrentAssets: this.formBuilder.group({
          receivableAssets: this.formBuilder.array([]),
          receivableCurrentAssetsTotal: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.data.currentAssetsInspectionDetails.otherCurrentAssets === undefined ? ''
                      : this.formDataForEdit.data.currentAssetsInspectionDetails.otherCurrentAssets.receivableCurrentAssetsTotal],
          payableAssets: this.formBuilder.array([]),
          payableCurrentAssetsTotal: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.data.currentAssetsInspectionDetails.otherCurrentAssets === undefined ? ''
                      : this.formDataForEdit.data.currentAssetsInspectionDetails.otherCurrentAssets.payableCurrentAssetsTotal],
          inspectingStaffs: this.formBuilder.array([]),
          bankExposures: this.formBuilder.array([]),
          overAllFindings: [this.formDataForEdit === undefined ? ''
              : this.formDataForEdit.data.currentAssetsInspectionDetails === undefined ? ''
                  : this.formDataForEdit.data.currentAssetsInspectionDetails.otherCurrentAssets === undefined ? ''
                      : this.formDataForEdit.data.currentAssetsInspectionDetails.otherCurrentAssets.overAllFindings]
        })
      })
    });
  }

  checkboxSelected(label: String, isChecked: boolean) {
    if (label === 'currentResident') {
      this.currentResidentForm = isChecked;
    } else if (label === 'businessSiteVisit') {
      this.businessSiteVisitForm = isChecked;
    } else if (label === 'fixedAssetCollateral') {
      this.fixedAssetCollateralForm = isChecked;
    } else if (label === 'currentAssetsInspection') {
      this.currentAssetsInspectionForm = isChecked;
    }
  }

  staffsFormGroup(): FormGroup {
    return this.formBuilder.group({
      name: [undefined],
      position: [undefined]
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
      party: [undefined],
      withinThreeMonths: [undefined],
      sixMonth: [undefined],
      oneYear: [undefined],
      oneYearPlus: [undefined]
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
      particulars: [undefined],
      amount: [undefined]
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
      bankName: [undefined],
      amount: [undefined]
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

  onSubmit() {
    this.siteVisitData = [{data: this.siteVisitFormGroup.value}];
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
    const controls =  ((this.siteVisitFormGroup.get('fixedAssetCollateralDetails') as FormGroup)
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
    console.log(this.siteVisitFormGroup.value);
    console.log(currentData);
    const controls =  ((this.siteVisitFormGroup.get('fixedAssetCollateralDetails') as FormGroup)
    .get('vicinityToTheBasicAmenities') as FormGroup)
    .get('staffs') as FormArray;

    console.log(controls);
    currentData.forEach(data => {
      controls.push(
          this.formBuilder.group({
            name: [data.name, Validators.required],
            position: [data.position, Validators.required]
          })

      );
      console.log(controls);
    });
  }

  setInspectingStaffsDetails(currentData) {
    const controls = ((this.siteVisitFormGroup.get('currentAssetsInspectionDetails') as FormGroup)
    .get('insuranceVerification') as FormGroup)
    .get('inspectingStaffsDetails') as FormArray;
    currentData.forEach(data => {
      controls.push(
          this.formBuilder.group({
              name: [data.name, Validators.required],
              position: [data.position, Validators.required]
          })
      );
    });
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
    console.log(controls);
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
    console.log(controls);
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





}


