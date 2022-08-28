import {Component, DoCheck, Input, IterableDiffers, OnInit} from '@angular/core';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';
import {Security} from '../../../../../model/security';
import {ShareSecurity} from '../../../../../../admin/modal/shareSecurity';
import {
  CollateralSiteVisitService
} from '../../../../../../loan-information-template/security/security-initial-form/fix-asset-collateral/collateral-site-visit.service';

@Component({
  selector: 'app-above-security-arrangement',
  templateUrl: './above-security-arrangement.component.html',
  styleUrls: ['./above-security-arrangement.component.scss']
})
export class AboveSecurityArrangementComponent implements OnInit, DoCheck {
  @Input() security: Security;
  @Input() shareSecurity: ShareSecurity;
  @Input() docStatus;
  formData: Object;
  @Input() fixedAssetsCollateral;

  alphabet = 'abcdefghijklmnopqrstuvwxyz';

  landSelected = false;
  apartmentSelected = false;
  plantSelected = false;
  landBuilding = false;

  proposedSecurity1: {
    securityName: string,
    purpose: string;
    owner: string,
    location: string,
    locationDetail: [{
      plotNumber: string,
      areaFormat: string,
      area: string,
    }],
    fairMarketValue: number,
    marketValue: number,
    distressValue: number,
    typeOfProperty: string,
    plantAndMachinery: boolean,
    plantMachineryData: {
      modelNo: string;
      amountMV: number
      amountFMV: number
      amountDV: number
    },
    collateralData: {
      zoningType: string,
      accessRoad: string,
      setBack: {
        river: string,
        road: string;
        highTension: string;
      },
      visitedBy: string
      visitDate: string
      coordinate: {
        longitude: string,
        latitude: string;
      };
    },
    valuatorName: string,
    valuationDate: string;
    landBuilding: {
      fairMarketValue: number,
      marketValue: number,
      distressValue: number
    }
    totalFMV: number,
    totalDV: number,
    totalMV: number
    building: {
      fairMarketValue: number,
      marketValue: number,
      distressValue: number
      area: string
    }
  } [] = [];
  securityId: number;
  iterableDiffer;

  constructor(private collateralSiteVisitService: CollateralSiteVisitService,
              private iterableDiffers: IterableDiffers) {
    this.iterableDiffer = iterableDiffers.find([]).create(null);
  }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.security)) {
      this.securityId = this.security.id;
      this.formData = JSON.parse(this.security.data);
    }
  }

  checkSecurityInSelectedArray(securityName: string) {
    this.formData['selectedArray'].filter(f => {
      if (f.indexOf(securityName) !== -1) {
        switch (securityName) {
          case 'LandSecurity':
            this.landSelected = true;
            break;
          case 'Land and Building Security':
            this.landBuilding = true;
            break;
          case 'ApartmentSecurity':
            this.apartmentSelected = true;
            break;
          case 'PlantSecurity':
            this.plantSelected = true;
            break;
        }
      }
    });
  }

  getSecurityAndFixedCollateralData(uuid: string, d: any, securityName: string, security: string) {
    const colData = this.fixedAssetsCollateral.filter(f => f.securityName === securityName);
    let collateralData = null;
    if (colData.length > 0) {
      collateralData = JSON.parse(colData[0].collateralData[0].siteVisitJsonData);
    }
    let DV = 0;
    let FMV = 0;
    let MV = 0;
    switch (securityName) {
      case 'Land Security':
        if (d.plantMachineryChecked) {
          MV = (ObjectUtil.isEmpty(d.landConsideredValue) ? 0 : Number(d.landConsideredValue)) +
              (ObjectUtil.isEmpty(d.plantMachineryMV) ? 0 : Number(d.plantMachineryMV));
          FMV = (ObjectUtil.isEmpty(d.marketValue) ? 0 : Number(d.marketValue)) +
              (ObjectUtil.isEmpty(d.plantMachineryFMV) ? 0 : Number(d.plantMachineryFMV));
          DV = (ObjectUtil.isEmpty(d.distressValue) ? 0 : Number(d.distressValue)) +
              (ObjectUtil.isEmpty(d.plantMachineryDV) ? 0 : Number(d.plantMachineryDV));
        } else {
          MV = ObjectUtil.isEmpty(d.landConsideredValue) ? 0 : Number(d.landConsideredValue);
          FMV = ObjectUtil.isEmpty(d.marketValue) ? 0 : Number(d.marketValue);
          DV = ObjectUtil.isEmpty(d.distressValue) ? 0 : Number(d.distressValue);
        }
        this.proposedSecurity1.push({
          securityName: securityName,
          purpose: ObjectUtil.isEmpty(d.forProposed) ? false : d.forProposed,
          owner: d.owner,
          location: d.location,
          locationDetail: d.locationDetail,
          fairMarketValue: ObjectUtil.isEmpty(d.marketValue) ? 0 : d.marketValue,
          marketValue: ObjectUtil.isEmpty(d.landConsideredValue) ? 0 : d.landConsideredValue,
          distressValue: ObjectUtil.isEmpty(d.distressValue) ? 0 : d.distressValue,
          typeOfProperty: d.typeOfProperty,
          plantAndMachinery: d.plantMachineryChecked,
          plantMachineryData: {
            modelNo: d.plantMachineryModel,
            amountMV: ObjectUtil.isEmpty(d.plantMachineryMV) ? 0 : d.plantMachineryMV,
            amountFMV: ObjectUtil.isEmpty(d.plantMachineryFMV) ? 0 : d.plantMachineryFMV,
            amountDV: ObjectUtil.isEmpty(d.plantMachineryDV) ? 0 : d.plantMachineryDV,
          },
          collateralData: {
            zoningType: ObjectUtil.isEmpty(collateralData) ? null : collateralData.typeOfProperty,
            accessRoad: ObjectUtil.isEmpty(collateralData) ? null : collateralData.roadAccessFrom,
            setBack: {
              road: ObjectUtil.isEmpty(collateralData) ? null : collateralData.roadSetbacks,
              river: ObjectUtil.isEmpty(collateralData) ? null : collateralData.riverOrCanalSetbacks,
              highTension: ObjectUtil.isEmpty(collateralData) ? null : collateralData.highTensionSetbacks
            },
            visitedBy: ObjectUtil.isEmpty(collateralData) ? null : collateralData.personContacted,
            visitDate: ObjectUtil.isEmpty(collateralData) ? null : collateralData.date,
            coordinate: {
              longitude: ObjectUtil.isEmpty(collateralData) ? null : collateralData.fixedAssetsLongitude,
              latitude: ObjectUtil.isEmpty(collateralData) ? null : collateralData.fixedAssetsLatitude,
            }
          },
          valuatorName: d.landValuator,
          valuationDate: d.landValuatorDate,
          landBuilding: {
            fairMarketValue: null,
            marketValue: null,
            distressValue: null,
          },
          totalFMV: FMV,
          totalDV: DV,
          totalMV: MV,
          building: {
            fairMarketValue: null,
            marketValue: null,
            distressValue: null,
            area: null,
          }
        });
        break;
      case 'Land and Building Security':
        if (d.plantMachineryChecked) {
          MV = (ObjectUtil.isEmpty(d.landConsideredValue) ? 0 : Number(d.landConsideredValue)) +
              (ObjectUtil.isEmpty(d.plantMachineryMV) ? 0 : Number(d.plantMachineryMV)) +
              (ObjectUtil.isEmpty(d.considerValue) ? 0 : Number(d.considerValue));
          FMV = (ObjectUtil.isEmpty(d.marketValue) ? 0 : Number(d.marketValue)) +
              (ObjectUtil.isEmpty(d.plantMachineryFMV) ? 0 : Number(d.plantMachineryFMV)) +
              (ObjectUtil.isEmpty(d.totalCost) ? 0 : Number(d.totalCost));
          DV = (ObjectUtil.isEmpty(d.distressValue) ? 0 : Number(d.distressValue)) +
              (ObjectUtil.isEmpty(d.plantMachineryDV) ? 0 : Number(d.plantMachineryDV)) +
              (ObjectUtil.isEmpty(d.buildingDistressValue) ? 0 : Number(d.buildingDistressValue));
        } else {
          MV = (ObjectUtil.isEmpty(d.landConsideredValue) ? 0 : Number(d.landConsideredValue)) +
              (ObjectUtil.isEmpty(d.considerValue) ? 0 : Number(d.considerValue));
          FMV = (ObjectUtil.isEmpty(d.marketValue) ? 0 : Number(d.marketValue)) +
              (ObjectUtil.isEmpty(d.totalCost) ? 0 : Number(d.totalCost));
          DV = (ObjectUtil.isEmpty(d.distressValue) ? 0 : Number(d.distressValue)) +
              (ObjectUtil.isEmpty(d.buildingDistressValue) ? 0 : Number(d.buildingDistressValue));
        }

        this.proposedSecurity1.push({
          securityName: securityName,
          purpose: ObjectUtil.isEmpty(d.forProposed) ? false : d.forProposed,
          owner: d.owner,
          location: d.location,
          locationDetail: d.locationDetail,
          fairMarketValue: ObjectUtil.isEmpty(d.marketValue) ? 0 : d.marketValue,
          marketValue: ObjectUtil.isEmpty(d.landConsideredValue) ? 0 : d.landConsideredValue,
          distressValue: ObjectUtil.isEmpty(d.distressValue) ? 0 : d.distressValue,
          typeOfProperty: d.typeOfProperty,
          plantAndMachinery: d.plantMachineryChecked,
          plantMachineryData: {
            modelNo: d.plantMachineryModel,
            amountMV: ObjectUtil.isEmpty(d.plantMachineryMV) ? 0 : d.plantMachineryMV,
            amountFMV: ObjectUtil.isEmpty(d.plantMachineryFMV) ? 0 : d.plantMachineryFMV,
            amountDV: ObjectUtil.isEmpty(d.plantMachineryDV) ? 0 : d.plantMachineryDV,
          },
          collateralData: {
            zoningType: ObjectUtil.isEmpty(collateralData) ? null : collateralData.typeOfProperty,
            accessRoad: ObjectUtil.isEmpty(collateralData) ? null : collateralData.roadAccessFrom,
            setBack: {
              road: ObjectUtil.isEmpty(collateralData) ? null : collateralData.roadSetbacks,
              river: ObjectUtil.isEmpty(collateralData) ? null : collateralData.riverOrCanalSetbacks,
              highTension: ObjectUtil.isEmpty(collateralData) ? null : collateralData.highTensionSetbacks
            },
            visitedBy: ObjectUtil.isEmpty(collateralData) ? null : collateralData.personContacted,
            visitDate: ObjectUtil.isEmpty(collateralData) ? null : collateralData.date,
            coordinate: {
              longitude: ObjectUtil.isEmpty(collateralData) ? null : collateralData.fixedAssetsLongitude,
              latitude: ObjectUtil.isEmpty(collateralData) ? null : collateralData.fixedAssetsLatitude,
            }
          },
          valuatorName: d.landValuator,
          valuationDate: d.landValuatorDate,
          landBuilding: {
            fairMarketValue: ObjectUtil.isEmpty(d.totalCost) ? 0 : Number(d.totalCost),
            marketValue: ObjectUtil.isEmpty(d.considerValue) ? 0 : Number(d.considerValue),
            distressValue: ObjectUtil.isEmpty(d.buildingDistressValue) ? 0 : Number(d.buildingDistressValue),
          },
          totalFMV: FMV,
          totalDV: DV,
          totalMV: MV,
          building: {
            fairMarketValue: null,
            marketValue: null,
            distressValue: null,
            area: null,
          }
        });
        break;
      case 'Building Security':
        if (d.plantMachineryChecked) {
          MV = (ObjectUtil.isEmpty(d.plantMachineryMV) ? 0 : Number(d.plantMachineryMV)) +
              (ObjectUtil.isEmpty(d.totalCost) ? 0 : Number(d.totalCost));
          FMV = (ObjectUtil.isEmpty(d.plantMachineryFMV) ? 0 : Number(d.plantMachineryFMV)) +
              (ObjectUtil.isEmpty(d.buildingFairMarketValue) ? 0 : Number(d.buildingFairMarketValue));
          DV = (ObjectUtil.isEmpty(d.plantMachineryDV) ? 0 : Number(d.plantMachineryDV)) +
              (ObjectUtil.isEmpty(d.buildingDistressValue) ? 0 : Number(d.buildingDistressValue));
        } else {
          MV = ObjectUtil.isEmpty(d.totalCost) ? 0 : Number(d.totalCost);
          FMV = ObjectUtil.isEmpty(d.buildingFairMarketValue) ? 0 : Number(d.buildingFairMarketValue);
          DV = ObjectUtil.isEmpty(d.buildingDistressValue) ? 0 : d.buildingDistressValue;
        }
        this.proposedSecurity1.push({
          purpose: ObjectUtil.isEmpty(d.forProposed) ? false : d.forProposed,
          securityName: securityName,
          owner: d.buildingName,
          location: null,
          locationDetail: null,
          fairMarketValue: null,
          marketValue: null,
          distressValue: null,
          typeOfProperty: d.typeOfProperty,
          plantAndMachinery: d.plantMachineryChecked,
          plantMachineryData: {
            modelNo: d.plantMachineryModel,
            amountMV: ObjectUtil.isEmpty(d.plantMachineryMV) ? 0 : d.plantMachineryMV,
            amountFMV: ObjectUtil.isEmpty(d.plantMachineryFMV) ? 0 : d.plantMachineryFMV,
            amountDV: ObjectUtil.isEmpty(d.plantMachineryDV) ? 0 : d.plantMachineryDV,
          },
          collateralData: {
            zoningType: ObjectUtil.isEmpty(collateralData) ? null : collateralData.typeOfProperty,
            accessRoad: ObjectUtil.isEmpty(collateralData) ? null : collateralData.roadAccessFrom,
            setBack: {
              road: ObjectUtil.isEmpty(collateralData) ? null : collateralData.roadSetbacks,
              river: ObjectUtil.isEmpty(collateralData) ? null : collateralData.riverOrCanalSetbacks,
              highTension: ObjectUtil.isEmpty(collateralData) ? null : collateralData.highTensionSetbacks
            },
            visitedBy: ObjectUtil.isEmpty(collateralData) ? null : collateralData.personContacted,
            visitDate: ObjectUtil.isEmpty(collateralData) ? null : collateralData.date,
            coordinate: {
              longitude: ObjectUtil.isEmpty(collateralData) ? null : collateralData.fixedAssetsLongitude,
              latitude: ObjectUtil.isEmpty(collateralData) ? null : collateralData.fixedAssetsLatitude,
            }
          },
          valuatorName: d.landValuator,
          valuationDate: d.landValuatorDate,
          landBuilding: {
            fairMarketValue: null,
            marketValue: null,
            distressValue: null,
          },
          totalFMV: FMV,
          totalDV: DV,
          totalMV: MV,
          building: {
            fairMarketValue: ObjectUtil.isEmpty(d.buildingFairMarketValue) ? 0 : d.buildingFairMarketValue,
            marketValue: ObjectUtil.isEmpty(d.totalCost) ? 0 : d.totalCost,
            distressValue: ObjectUtil.isEmpty(d.buildingDistressValue) ? 0 : d.buildingDistressValue,
            area: d.buildArea,
          }
        });
        break;
      case 'Plant and Machinery Security':
        this.proposedSecurity1.push({
          securityName: securityName,
          purpose: d.forProposed,
          owner: null,
          location: d.location,
          locationDetail: null,
          fairMarketValue: null,
          marketValue: null,
          distressValue: null,
          typeOfProperty: null,
          plantAndMachinery: true,
          plantMachineryData: {
            modelNo: null,
            amountMV: ObjectUtil.isEmpty(d.quotationMV) ? 0 : d.quotationMV,
            amountDV: ObjectUtil.isEmpty(d.quotationDv) ? 0 : d.quotationDv,
            amountFMV: ObjectUtil.isEmpty(d.quotation) ? 0 : d.quotation,
          },
          collateralData: {
            zoningType: null,
            accessRoad: null,
            setBack: null,
            visitedBy: null,
            visitDate: null,
            coordinate: {
              longitude: null,
              latitude: null,
            }
          },
          valuatorName: d.landValuator,
          valuationDate: d.landValuatorDate,
          landBuilding: null,
          totalMV: ObjectUtil.isEmpty(d.quotationMV) ? 0 : d.quotationMV,
          totalDV: ObjectUtil.isEmpty(d.quotationDv) ? 0 : d.quotationDv,
          totalFMV: ObjectUtil.isEmpty(d.quotation) ? 0 : d.quotation,
          building: null,
        });
        break;
    }
  }

  ngDoCheck(): void {
    const changes = this.iterableDiffer.diff(this.fixedAssetsCollateral);
    if (changes) {
      if (this.formData['selectedArray'] !== undefined) {
        if (this.formData['initialForm'] !== undefined) {
          const landDetail = this.formData['initialForm']['landDetails'];
          const landBuildingDetail = this.formData['initialForm']['landBuilding'];
          const apartmentDetail = this.formData['initialForm']['buildingDetails'];
          const plantDetail = this.formData['initialForm']['plantDetails'];
          this.checkSecurityInSelectedArray('LandSecurity');
          if (this.landSelected) {
            landDetail.forEach((d, i) => {
              this.getSecurityAndFixedCollateralData(d.uuid, d, 'Land Security', 'Land Security ' + (i + 1));
            });
          }
          this.checkSecurityInSelectedArray('Land and Building Security');
          if (this.landBuilding) {
            landBuildingDetail.forEach((d, i) => {
              this.getSecurityAndFixedCollateralData(d.uuid, d, 'Land and Building Security', 'Land and Building Security ' + (i + 1));
            });
          }
          this.checkSecurityInSelectedArray('ApartmentSecurity');
          this.checkSecurityInSelectedArray('PlantSecurity');

          if (this.apartmentSelected) {
            apartmentDetail.forEach((d, i) => {
              this.getSecurityAndFixedCollateralData(d.uuid, d, 'Building Security', 'Building Security ' + (i + 1));
            });
          }
          if (this.plantSelected) {
            plantDetail.forEach((d, i) => {
              this.getSecurityAndFixedCollateralData(d.uuid, d, 'Plant and Machinery Security', 'Plant and Machinery Security ' + (i + 1));
            });
          }
        }
      }
    }
  }
}
