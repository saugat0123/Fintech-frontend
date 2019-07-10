import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {SiteVisit} from '../../../../admin/modal/siteVisit';

declare let google: any;

@Component({
  selector: 'app-site-visit',
  templateUrl: './site-visit.component.html',
  styleUrls: ['./site-visit.component.css']
})
export class SiteVisitComponent implements OnInit {

  @Input() formValue: SiteVisit;
  siteVisitFormGroup: FormGroup;
  currentResidentForm = false;
  businessSiteVisitForm = false;
  fixedAssetCollateralForm = false;
  currentAssetsInspectionForm = false;

  latitude = 27.732454;
  longitude = 85.291543;
  markerLatitude = null;
  markerLongitude = null;
  infoWindowOpen = new FormControl('false');
  addressLabel = new FormControl('');
  zoom = 8;
  latLng: string[];

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
    this.siteVisitFormGroup = this.formBuilder.group({
      currentResidentDetails: this.formBuilder.group({
        houseNumber: [undefined],
        streetName: [undefined],
        address: [undefined],
        nearBy: [undefined],
        ownerName: [undefined]
      }),
      businessSiteVisitDetails: this.formBuilder.group({
        officeAddress: [undefined],
        nameOfThePersonContacted: [undefined],
        dateOfVisit: [undefined],
        objectiveOfVisit: [undefined],
        observation: [undefined],
        visitedBy: [undefined],
        conclusion: [undefined],
        locationPreview: [undefined],
        mapAddress: [undefined],
        findingsAndComments: [undefined]
      }),
      fixedAssetCollateralDetails: this.formBuilder.group({
        date: [undefined],
        address: [undefined],
        personContacted: [undefined],
        phoneNoOfContact: [undefined],
        facilities: this.formBuilder.group({
          roadApproach: [undefined],
          roadWidth: [undefined],
          prominentPlace: [undefined],
          approachDistance: [undefined]
        }),
        otherFacilities: this.formBuilder.group({
          waterSupply: [undefined],
          electricity: [undefined],
          boundaryWallConstruction: [undefined],
          boundaryFencing: [undefined],
          drainage: [undefined],
          open: [undefined],
          building: [undefined],
          buildingArea: [undefined],
          constructionYear: [undefined],
          loadBearingWall: [undefined],
          mortarCement: [undefined],
          otherRoofing: [undefined],
          insideFurniture: [undefined],
          frameStructure: [undefined],
          rccRoofing: [undefined],
          bathroomAndToilet: [undefined],
          remarksForNoOption: [undefined]
        }),
        vicinityToTheBasicAmenities: this.formBuilder.group({
          majorMarketPlaces: [undefined],
          schoolOrCollege: [undefined],
          hospitalOrNursingHome: [undefined],
          electricityLine: [undefined],
          telephoneLine: [undefined],
          waterPipeline: [undefined],
          staffs: this.formBuilder.array([
            this.staffsFormGroup()
          ]),
          commentAboutFAC: [undefined],
          branchInchargeComment: [undefined]
        })
      }),
      currentAssetsInspectionDetails: this.formBuilder.group({
        dateOfInspection: [undefined],
        particularsOfGoodInspected: [undefined],
        stockValueReported: [undefined],
        rents: [undefined],
        isRentPmtUpToDate: [undefined],
        isRentReceiptShown: [undefined],
        insuranceVerification: this.formBuilder.group({
          assetsMortgaged: [undefined],
          insuredAmount: [undefined],
          insuranceCompany: [undefined],
          expireDate: [undefined],
          clientsOverallRating: [undefined],
          comments: [undefined],
          stockValueConfirmed: [undefined],
          inspectingStaffsDetails: this.formBuilder.array([
            this.staffsFormGroup()
          ])
        }),
        stockCheckListQuestionaire: this.formBuilder.group({
          isTheCustomerUptoDateWithOtherChargerChargeableToTheOtherPremises: [undefined],
          allGoodsBelongsToTheBorrowersAndNonAreHoldOnAccountOfThirdParties: [undefined],
          confirmThatValuationOfStocksDoesNotIncludeAndGoodsUnderTr: [undefined],
          thereIsNoEvidenceOfAnyOtherBankInterestedInTheGoods: [undefined],
          wasTheSecurityInOrder: [undefined],
          areTheGoodsSaleable: [undefined],
          areTheStocksRegisteredUptoDate: [undefined],
          doesTheStocksRegisteredMatchWithTheStockList: [undefined],
          isTheStorageConditionSatisfactory: [undefined],
          isTheFightingEvidenceThroughArrangement: [undefined],
          areTheBuildingsOrStoreInTheGoodCondition: [undefined],
          areTheSpecialWarrantiesInTheInsurancePolicyUptoDate: [undefined],
          thereIsNoEvidenceOfGoodsHazardousNatureInThePremises: [undefined],
          wereOurNameBoardProperlyDisplayed: [undefined],
          wereOurPadlocksInUse: [undefined],
          findingsAndComments: [undefined],
          remarksForNoOption: [undefined]
        }),
        receivablesAndPayables: this.formBuilder.group({
          parties: this.formBuilder.array([
            this.partyFormGroup()
          ]),
          findingsAndComments: [undefined]
        }),
        otherCurrentAssets: this.formBuilder.group({
          receivableAssets: this.formBuilder.array([
            this.assetsFormGroup()
          ]),
          payableAssets: this.formBuilder.array([
            this.assetsFormGroup()
          ]),
          inspectingStaffs: this.formBuilder.array([
            this.staffsFormGroup()
          ]),
          bankExposures: this.formBuilder.array([
            this.bankExposureFormGroup()
          ]),
          overAllFindings: [undefined]
        })
      })
    });
    this.siteVisitFormGroup.valueChanges.subscribe(console.log);
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
      inspectingStaff: [undefined],
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
    this.formValue.hasCurrentResident = this.currentResidentForm;
    this.formValue.hasBusinessSiteVisit = this.businessSiteVisitForm;
    this.formValue.hasFixedAssetsCollateral = this.fixedAssetCollateralForm;
    this.formValue.hasCurrentAssetsInspection = this.currentAssetsInspectionForm;
    // currentResident
    if (this.currentResidentForm) {
      this.formValue.currentResident.residentHouseNo = this.siteVisitFormGroup.get('currentResidentDetails').get('houseNumber').value;
      this.formValue.currentResident.residentHouseNo = this.siteVisitFormGroup.get('currentResidentDetails').get('streetName').value;
      this.formValue.currentResident.residentHouseNo = this.siteVisitFormGroup.get('currentResidentDetails').get('address').value;
      this.formValue.currentResident.residentHouseNo = this.siteVisitFormGroup.get('currentResidentDetails').get('nearBy').value;
      this.formValue.currentResident.residentHouseNo = this.siteVisitFormGroup.get('currentResidentDetails').get('ownerName').value;
    }
    // businessSiteVisit
    if (this.businessSiteVisitForm) {
      this.formValue.businessSiteVisit.officeAddress = this.siteVisitFormGroup.get('businessSiteVisitDetails').get('officeAddress').value;
      this.formValue.businessSiteVisit.personContactedName =
          this.siteVisitFormGroup.get('businessSiteVisitDetails').get('nameOfThePersonContacted').value;
      this.formValue.businessSiteVisit.dateOfVisit = this.siteVisitFormGroup.get('businessSiteVisitDetails').get('dateOfVisit').value;
      this.formValue.businessSiteVisit.objectiveOfVisit =
          this.siteVisitFormGroup.get('businessSiteVisitDetails').get('objectiveOfVisit').value;
      this.formValue.businessSiteVisit.observation = this.siteVisitFormGroup.get('businessSiteVisitDetails').get('observation').value;
      this.formValue.businessSiteVisit.visitedBy = this.siteVisitFormGroup.get('businessSiteVisitDetails').get('visitedBy').value;
      this.formValue.businessSiteVisit.conclusion = this.siteVisitFormGroup.get('businessSiteVisitDetails').get('conclusion').value;
      this.formValue.businessSiteVisit.embedLocationLink =
          this.siteVisitFormGroup.get('businessSiteVisitDetails').get('locationPreview').value;
      this.formValue.businessSiteVisit.location = this.siteVisitFormGroup.get('businessSiteVisitDetails').get('mapAddress').value;
      this.formValue.businessSiteVisit.comments = this.siteVisitFormGroup.get('businessSiteVisitDetails').get('findingsAndComments').value;
    }
    // fixedAssetCollateral
    if (this.fixedAssetCollateralForm) {

    }
    // currentAssetsInspection
    if (this.currentAssetsInspectionForm) {

    }
  }
}
