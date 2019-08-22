import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {SiteVisit} from '../../../../admin/modal/siteVisit';
import {InspectingStaff} from '../../../../admin/modal/inspectingStaff';
import {PartyInfo} from '../../../../admin/modal/partyInfo';
import {ReceivableCurrentAssets} from '../../../../admin/modal/receivableCurrentAssets';
import {PayableCurrentAssets} from '../../../../admin/modal/payableCurrentAssets';
import {BankExposureAssets} from '../../../../admin/modal/bankExposureAssets';

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
  infoWindowOpen = new FormControl(false);
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
          remarksForOtherFacility: [undefined],
          building: [undefined],
          buildingArea: [undefined],
          constructionYear: [undefined],
          qualityOfConstructionRemarks: [undefined],
          loadBearingWall: [undefined],
          mortarCement: [undefined],
          otherRoofing: [undefined],
          insideFurniture: [undefined],
          frameStructure: [undefined],
          rccRoofing: [undefined],
          bathroomAndToilet: [undefined],
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
          insuranceVerificationPosition: [undefined],
          inspectingStaffsDetails: this.formBuilder.array([
            this.staffsFormGroup()
          ])
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
          findingAndComments: [undefined],
          remarksForNoOption: [undefined]
        }),
        receivablesAndPayables: this.formBuilder.group({
          parties: this.formBuilder.array([
            this.partyFormGroup()
          ]),
          threeMonthTotal: [undefined],
          sixMonthTotal: [undefined],
          oneYearTotal: [undefined],
          moreThanOneYearTotal: [undefined],
          findingsAndCommentsForCurrentAssetsInspection: [undefined]
        }),
        otherCurrentAssets: this.formBuilder.group({
          receivableAssets: this.formBuilder.array([
            this.assetsFormGroup()
          ]),
          receivableCurrentAssetsTotal: [undefined],
          payableAssets: this.formBuilder.array([
            this.assetsFormGroup()
          ]),
          payableCurrentAssetsTotal: [undefined],
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
    this.siteVisitFormGroup.valueChanges.subscribe(console.log); // logged here
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
    this.formValue.hasCurrentResident = this.currentResidentForm;
    this.formValue.hasBusinessSiteVisit = this.businessSiteVisitForm;
    this.formValue.hasFixedAssetsCollateral = this.fixedAssetCollateralForm;
    this.formValue.hasCurrentAssetsInspection = this.currentAssetsInspectionForm;

    // currentResident
    if (this.currentResidentForm) {
      this.formValue.currentResident.residentHouseNo = this.siteVisitFormGroup.get('currentResidentDetails').get('houseNumber').value;
      this.formValue.currentResident.residentStreetName = this.siteVisitFormGroup.get('currentResidentDetails').get('streetName').value;
      this.formValue.currentResident.residentAddress = this.siteVisitFormGroup.get('currentResidentDetails').get('address').value;
      this.formValue.currentResident.residentNearby = this.siteVisitFormGroup.get('currentResidentDetails').get('nearBy').value;
      this.formValue.currentResident.residentOwnerName = this.siteVisitFormGroup.get('currentResidentDetails').get('ownerName').value;
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
      this.formValue.fixedAssetsCollateral.date = this.siteVisitFormGroup.get('fixedAssetCollateralDetails').get('date').value;
      this.formValue.fixedAssetsCollateral.address = this.siteVisitFormGroup.get('fixedAssetCollateralDetails').get('address').value;
      this.formValue.fixedAssetsCollateral.nameOfPersonContacted =
          this.siteVisitFormGroup.get('fixedAssetCollateralDetails').get('personContacted').value;
      this.formValue.fixedAssetsCollateral.personContactedPhone =
          this.siteVisitFormGroup.get('fixedAssetCollateralDetails').get('phoneNoOfContact').value;
      this.formValue.fixedAssetsCollateral.roadApproach =
          this.siteVisitFormGroup.get('fixedAssetCollateralDetails').get('facilities').get('roadApproach').value;
      this.formValue.fixedAssetsCollateral.roadWidth =
          this.siteVisitFormGroup.get('fixedAssetCollateralDetails').get('facilities').get('roadWidth').value;
      this.formValue.fixedAssetsCollateral.prominentPlace =
          this.siteVisitFormGroup.get('fixedAssetCollateralDetails').get('facilities').get('prominentPlace').value;
      this.formValue.fixedAssetsCollateral.approachDistance =
          this.siteVisitFormGroup.get('fixedAssetCollateralDetails').get('facilities').get('approachDistance').value;
      this.formValue.fixedAssetsCollateral.waterSupply =
          this.siteVisitFormGroup.get('fixedAssetCollateralDetails').get('otherFacilities').get('waterSupply').value;
      this.formValue.fixedAssetsCollateral.electricity =
          this.siteVisitFormGroup.get('fixedAssetCollateralDetails').get('otherFacilities').get('electricity').value;
      this.formValue.fixedAssetsCollateral.boundryWallConstruction =
          this.siteVisitFormGroup.get('fixedAssetCollateralDetails').get('otherFacilities').get('boundaryWallConstruction').value;
      this.formValue.fixedAssetsCollateral.boundryFencing =
          this.siteVisitFormGroup.get('fixedAssetCollateralDetails').get('otherFacilities').get('boundaryFencing').value;
      this.formValue.fixedAssetsCollateral.drainage =
          this.siteVisitFormGroup.get('fixedAssetCollateralDetails').get('otherFacilities').get('drainage').value;
      this.formValue.fixedAssetsCollateral.open =
          this.siteVisitFormGroup.get('fixedAssetCollateralDetails').get('otherFacilities').get('open').value;
      this.formValue.fixedAssetsCollateral.remarksForOtherFacility =
          this.siteVisitFormGroup.get('fixedAssetCollateralDetails').get('otherFacilities').get('remarksForOtherFacility').value;
      this.formValue.fixedAssetsCollateral.building =
          this.siteVisitFormGroup.get('fixedAssetCollateralDetails').get('otherFacilities').get('building').value;
      this.formValue.fixedAssetsCollateral.buildingArea =
          this.siteVisitFormGroup.get('fixedAssetCollateralDetails').get('otherFacilities').get('buildingArea').value;
      this.formValue.fixedAssetsCollateral.dateOfBuildingConstruction =
          this.siteVisitFormGroup.get('fixedAssetCollateralDetails').get('otherFacilities').get('constructionYear').value;
      this.formValue.fixedAssetsCollateral.qualityOfConstructionRemarks =
          this.siteVisitFormGroup.get('fixedAssetCollateralDetails').get('otherFacilities').get('qualityOfConstructionRemarks').value;
      this.formValue.fixedAssetsCollateral.loadBearingWall =
          this.siteVisitFormGroup.get('fixedAssetCollateralDetails').get('otherFacilities').get('loadBearingWall').value;
      this.formValue.fixedAssetsCollateral.mortarCement =
          this.siteVisitFormGroup.get('fixedAssetCollateralDetails').get('otherFacilities').get('mortarCement').value;
      this.formValue.fixedAssetsCollateral.otherRoofing =
          this.siteVisitFormGroup.get('fixedAssetCollateralDetails').get('otherFacilities').get('otherRoofing').value;
      this.formValue.fixedAssetsCollateral.insideFurniture =
          this.siteVisitFormGroup.get('fixedAssetCollateralDetails').get('otherFacilities').get('insideFurniture').value;
      this.formValue.fixedAssetsCollateral.frameStructure =
          this.siteVisitFormGroup.get('fixedAssetCollateralDetails').get('otherFacilities').get('frameStructure').value;
      this.formValue.fixedAssetsCollateral.rccRoofing =
          this.siteVisitFormGroup.get('fixedAssetCollateralDetails').get('otherFacilities').get('rccRoofing').value;
      this.formValue.fixedAssetsCollateral.bathroomToilet =
          this.siteVisitFormGroup.get('fixedAssetCollateralDetails').get('otherFacilities').get('bathroomAndToilet').value;
      this.formValue.fixedAssetsCollateral.majorMarketplacesDistance =
          this.siteVisitFormGroup.get('fixedAssetCollateralDetails').get('vicinityToTheBasicAmenities').get('majorMarketPlaces').value;
      this.formValue.fixedAssetsCollateral.schoolCollegeDistance =
          this.siteVisitFormGroup.get('fixedAssetCollateralDetails').get('vicinityToTheBasicAmenities').get('schoolOrCollege').value;
      this.formValue.fixedAssetsCollateral.hospitalNursingHomeDistance =
          this.siteVisitFormGroup.get('fixedAssetCollateralDetails').get('vicinityToTheBasicAmenities').get('hospitalOrNursingHome').value;
      this.formValue.fixedAssetsCollateral.electricityLineDistance =
          this.siteVisitFormGroup.get('fixedAssetCollateralDetails').get('vicinityToTheBasicAmenities').get('electricityLine').value;
      this.formValue.fixedAssetsCollateral.telephoneLineDistance =
          this.siteVisitFormGroup.get('fixedAssetCollateralDetails').get('vicinityToTheBasicAmenities').get('telephoneLine').value;
      this.formValue.fixedAssetsCollateral.waterPipelineDistance =
          this.siteVisitFormGroup.get('fixedAssetCollateralDetails').get('vicinityToTheBasicAmenities').get('waterPipeline').value;
      let staffIndex = 0;
      const staffArray = (this.siteVisitFormGroup
      .get('fixedAssetCollateralDetails')
      .get('vicinityToTheBasicAmenities')
      .get('staffs') as FormArray);
      console.log(staffArray);
      while (staffIndex < staffArray.length) {
        const inspectingStaff: InspectingStaff = new InspectingStaff();
        inspectingStaff.name = staffArray.controls[staffIndex].value.name;
        inspectingStaff.position = staffArray.controls[staffIndex].value.position;
        this.formValue.fixedAssetsCollateral.inspectingStaffList.push(inspectingStaff);
        staffIndex++;
      }
      this.formValue.fixedAssetsCollateral.commentsAboutFAC =
          this.siteVisitFormGroup.get('fixedAssetCollateralDetails').get('vicinityToTheBasicAmenities').get('commentAboutFAC').value;
      this.formValue.fixedAssetsCollateral.branchInchargeComment =
          this.siteVisitFormGroup.get('fixedAssetCollateralDetails').get('vicinityToTheBasicAmenities').get('branchInchargeComment').value;
    }
    // currentAssetsInspection
    if (this.currentAssetsInspectionForm) {
      this.formValue.assetsInspection.dateOfInspection =
          this.siteVisitFormGroup.get('currentAssetsInspectionDetails').get('dateOfInspection').value;
      this.formValue.assetsInspection.goodsParticular =
          this.siteVisitFormGroup.get('currentAssetsInspectionDetails').get('particularsOfGoodInspected').value;
      this.formValue.assetsInspection.stockValueReported =
          this.siteVisitFormGroup.get('currentAssetsInspectionDetails').get('stockValueReported').value;
      this.formValue.assetsInspection.premisesOwnedRented =
          this.siteVisitFormGroup.get('currentAssetsInspectionDetails').get('rents').value;
      this.formValue.assetsInspection.rentPmtUptoDate =
          this.siteVisitFormGroup.get('currentAssetsInspectionDetails').get('isRentPmtUpToDate').value;
      this.formValue.assetsInspection.rentReceiptShown =
          this.siteVisitFormGroup.get('currentAssetsInspectionDetails').get('isRentReceiptShown').value;
      this.formValue.assetsInspection.insuranceVerification.assetsMortgaged =
          this.siteVisitFormGroup.get('currentAssetsInspectionDetails').get('insuranceVerification').get('assetsMortgaged').value;
      this.formValue.assetsInspection.insuranceVerification.insuredAmount =
          this.siteVisitFormGroup.get('currentAssetsInspectionDetails').get('insuranceVerification').get('insuredAmount').value;
      let i = 0;
      const staffArray = (this.siteVisitFormGroup
      .get('currentAssetsInspectionDetails')
      .get('insuranceVerification')
      .get('inspectingStaffsDetails') as FormArray);
      while (i < staffArray.length) {
        const inspectingStaff: InspectingStaff = new InspectingStaff();
        inspectingStaff.name = staffArray.controls[i].value.name;
        inspectingStaff.position = staffArray.controls[i].value.position;
        this.formValue.assetsInspection.insuranceVerification.inspectingStaffList.push(inspectingStaff);
        i++;
      }
      this.formValue.assetsInspection.insuranceVerification.insuranceCompany =
          this.siteVisitFormGroup.get('currentAssetsInspectionDetails').get('insuranceVerification').get('insuranceCompany').value;
      this.formValue.assetsInspection.insuranceVerification.expiryDate =
          this.siteVisitFormGroup.get('currentAssetsInspectionDetails').get('insuranceVerification').get('expireDate').value;
      this.formValue.assetsInspection.insuranceVerification.clientRating =
          this.siteVisitFormGroup.get('currentAssetsInspectionDetails').get('insuranceVerification').get('clientsOverallRating').value;
      this.formValue.assetsInspection.insuranceVerification.comments =
          this.siteVisitFormGroup.get('currentAssetsInspectionDetails').get('insuranceVerification').get('comments').value;
      this.formValue.assetsInspection.insuranceVerification.stockValueConfirmed =
          this.siteVisitFormGroup.get('currentAssetsInspectionDetails').get('insuranceVerification').get('stockValueConfirmed').value;
      this.formValue.currentAssetsInspection.uptoDateWithCharges =
          this.siteVisitFormGroup.get('currentAssetsInspectionDetails').get('stockCheckListQuestionaire').get('uptoDateWithCharges').value;
      this.formValue.currentAssetsInspection.borrowersPossession =
          this.siteVisitFormGroup.get('currentAssetsInspectionDetails').get('stockCheckListQuestionaire').get('borrowersPossession').value;
      this.formValue.currentAssetsInspection.notUnderTR =
          this.siteVisitFormGroup.get('currentAssetsInspectionDetails').get('stockCheckListQuestionaire').get('notUnderTR').value;
      this.formValue.currentAssetsInspection.otherBankNotInterested =
          this.siteVisitFormGroup
          .get('currentAssetsInspectionDetails')
          .get('stockCheckListQuestionaire')
          .get('otherBankNotInterested').value;
      this.formValue.currentAssetsInspection.securityOrder =
          this.siteVisitFormGroup.get('currentAssetsInspectionDetails').get('stockCheckListQuestionaire').get('securityOrder').value;
      this.formValue.currentAssetsInspection.goodsSaleable =
          this.siteVisitFormGroup.get('currentAssetsInspectionDetails').get('stockCheckListQuestionaire').get('goodsSaleable').value;
      this.formValue.currentAssetsInspection.stocksUptoDate =
          this.siteVisitFormGroup.get('currentAssetsInspectionDetails').get('stockCheckListQuestionaire').get('stocksUptoDate').value;
      this.formValue.currentAssetsInspection.matchWithTheStockList =
          this.siteVisitFormGroup
          .get('currentAssetsInspectionDetails')
          .get('stockCheckListQuestionaire')
          .get('matchWithTheStockList').value;
      this.formValue.currentAssetsInspection.storageConditionSatisfactory =
          this.siteVisitFormGroup
          .get('currentAssetsInspectionDetails')
          .get('stockCheckListQuestionaire')
          .get('storageConditionSatisfactory').value;
      this.formValue.currentAssetsInspection.fireFightingEvidence =
          this.siteVisitFormGroup
          .get('currentAssetsInspectionDetails')
          .get('stockCheckListQuestionaire')
          .get('fireFightingEvidence').value;
      this.formValue.currentAssetsInspection.buildingStoreCondition =
          this.siteVisitFormGroup
          .get('currentAssetsInspectionDetails')
          .get('stockCheckListQuestionaire')
          .get('buildingStoreCondition').value;
      this.formValue.currentAssetsInspection.warrantiesUptoDate =
          this.siteVisitFormGroup
          .get('currentAssetsInspectionDetails')
          .get('stockCheckListQuestionaire')
          .get('warrantiesUptoDate').value;
      this.formValue.currentAssetsInspection.noHazardousNature =
          this.siteVisitFormGroup
          .get('currentAssetsInspectionDetails')
          .get('stockCheckListQuestionaire')
          .get('noHazardousNature').value;
      this.formValue.currentAssetsInspection.nameBoardProperlyDisplayed =
          this.siteVisitFormGroup
          .get('currentAssetsInspectionDetails')
          .get('stockCheckListQuestionaire')
          .get('nameBoardProperlyDisplayed').value;
      this.formValue.currentAssetsInspection.padlocksUse =
          this.siteVisitFormGroup.get('currentAssetsInspectionDetails').get('stockCheckListQuestionaire').get('padlocksUse').value;
      this.formValue.currentAssetsInspection.findingAndComments =
          this.siteVisitFormGroup.get('currentAssetsInspectionDetails').get('stockCheckListQuestionaire').get('findingAndComments').value;
      this.formValue.currentAssetsInspection.remarksForNoOption =
          this.siteVisitFormGroup.get('currentAssetsInspectionDetails').get('stockCheckListQuestionaire').get('remarksForNoOption').value;
      let parties = 0;
      const partiesArray = (this.siteVisitFormGroup
      .get('currentAssetsInspectionDetails')
      .get('receivablesAndPayables')
      .get('parties') as FormArray);
      while (parties < partiesArray.length) {
        const partyInfo: PartyInfo = new PartyInfo();
        partyInfo.party = partiesArray.controls[parties].value.party;
        partyInfo.threeMonth = partiesArray.controls[parties].value.threeMonth;
        partyInfo.sixMonth = partiesArray.controls[parties].value.sixMonth;
        partyInfo.oneYear = partiesArray.controls[parties].value.oneYear;
        partyInfo.moreThanOneYear = partiesArray.controls[parties].value.moreThanOneYear;
        this.formValue.receivablePayableAssetsInspection.partyInfoList.push(partyInfo);
        parties++;
      }
      this.formValue.receivablePayableAssetsInspection.threeMonthTotal =
          this.siteVisitFormGroup
          .get('currentAssetsInspectionDetails')
          .get('receivablesAndPayables')
          .get('threeMonthTotal').value;
      this.formValue.receivablePayableAssetsInspection.sixMonthTotal =
          this.siteVisitFormGroup
          .get('currentAssetsInspectionDetails')
          .get('receivablesAndPayables')
          .get('sixMonthTotal').value;
      this.formValue.receivablePayableAssetsInspection.oneYearTotal =
          this.siteVisitFormGroup
          .get('currentAssetsInspectionDetails')
          .get('receivablesAndPayables')
          .get('oneYearTotal').value;
      this.formValue.receivablePayableAssetsInspection.moreThanOneYearTotal =
          this.siteVisitFormGroup
          .get('currentAssetsInspectionDetails')
          .get('receivablesAndPayables')
          .get('moreThanOneYearTotal').value;

      this.formValue.receivablePayableAssetsInspection.findingsAndCommentsForCurrentAssetsInspection =
          this.siteVisitFormGroup
          .get('currentAssetsInspectionDetails')
          .get('receivablesAndPayables')
          .get('findingsAndCommentsForCurrentAssetsInspection').value;
      let receivableIndex = 0;
      const receivableAssetsArray = (this.siteVisitFormGroup
      .get('currentAssetsInspectionDetails')
      .get('otherCurrentAssets')
      .get('receivableAssets') as FormArray);
      while (receivableIndex < receivableAssetsArray.length) {
        const receivableCurrentAssets: ReceivableCurrentAssets = new ReceivableCurrentAssets();
        receivableCurrentAssets.particular = receivableAssetsArray.controls[receivableIndex].value.particular;
        receivableCurrentAssets.amount = receivableAssetsArray.controls[receivableIndex].value.amount;
        this.formValue.receivablePayableAssetsInspection.receivableCurrentAssetsList.push(receivableCurrentAssets);
        receivableIndex++;
      }
      this.formValue.receivablePayableAssetsInspection.receivableCurrentAssetsTotal =
          this.siteVisitFormGroup
          .get('currentAssetsInspectionDetails')
          .get('otherCurrentAssets')
          .get('receivableCurrentAssetsTotal').value;

      let payableIndex = 0;
      const payableAssetArray = (this.siteVisitFormGroup
      .get('currentAssetsInspectionDetails')
      .get('otherCurrentAssets')
      .get('payableAssets') as FormArray);
      while (payableIndex < payableAssetArray.length) {
        const payableCurrentAssets: PayableCurrentAssets = new PayableCurrentAssets();
        payableCurrentAssets.particular = payableAssetArray.controls[payableIndex].value.particular;
        payableCurrentAssets.amount = payableAssetArray.controls[payableIndex].value.amount;
        this.formValue.receivablePayableAssetsInspection.payableCurrentAssetsList.push(payableCurrentAssets);
        payableIndex++;
      }
      this.formValue.receivablePayableAssetsInspection.payableCurrentAssetsTotal =
          this.siteVisitFormGroup
          .get('currentAssetsInspectionDetails')
          .get('otherCurrentAssets')
          .get('payableCurrentAssetsTotal').value;

      let staffIndex = 0;
      const staffsArray = (this.siteVisitFormGroup
      .get('currentAssetsInspectionDetails')
      .get('otherCurrentAssets')
      .get('inspectingStaffs') as FormArray);
      while (staffIndex < staffsArray.length) {
        const inspectingStaffs: InspectingStaff = new InspectingStaff();
        inspectingStaffs.name = staffsArray.controls[staffIndex].value.name;
        inspectingStaffs.position = staffsArray.controls[staffIndex].value.position;
        this.formValue.receivablePayableAssetsInspection.inspectingStaffList.push(inspectingStaffs);
        staffIndex++;
      }

      let bankExposureIndex = 0;
      const bankExposureArray = (this.siteVisitFormGroup
      .get('currentAssetsInspectionDetails')
      .get('otherCurrentAssets')
      .get('bankExposures') as FormArray);
      while (bankExposureIndex < bankExposureArray.length) {
        const bankExposure: BankExposureAssets = new BankExposureAssets();
        bankExposure.bankName = bankExposureArray.controls[bankExposureIndex].value.bankName;
        bankExposure.amount = bankExposureArray.controls[bankExposureIndex].value.amount;
        this.formValue.receivablePayableAssetsInspection.bankExposureAssetsList.push(bankExposure);
        bankExposureIndex++;
      }

      this.formValue.receivablePayableAssetsInspection.overallFindingAndCommentsOfCAI =
          this.siteVisitFormGroup
          .get('currentAssetsInspectionDetails')
          .get('otherCurrentAssets')
          .get('overAllFindings').value;
    }
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
}


