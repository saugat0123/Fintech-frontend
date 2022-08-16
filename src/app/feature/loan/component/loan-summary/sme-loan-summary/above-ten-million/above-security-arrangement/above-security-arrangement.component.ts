import {Component, Input, OnInit} from '@angular/core';
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
export class AboveSecurityArrangementComponent implements OnInit {
  @Input() security: Security;
  @Input() shareSecurity: ShareSecurity;
  @Input() docStatus;
  formData: Object;
  @Input() collateralSiteVisit;

  alphabet = 'abcdefghijklmnopqrstuvwxyz';

  landSelected = false;
  apartmentSelected = false;
  plantSelected = false;
  landBuilding = false;

  proposedSecurity1: {
    owner: string,
    location: string,
    locationDetail: [{
      plotNumber: string,
      areaFormat: string,
      area: string,
    }],
    considerValue: number,
    marketValue: number,
    distressValue: number,
    typeOfProperty: string,
    plantAndMachinery: boolean,
    plantMachineryData: {
      modelNo: string;
      amount: number
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
  } [] = [];
  existingSecurity1: {
    owner: string, location: string, plot: string, area: string,
    considerValue: number, marketValue: number, distressValue: number
  } [] = [];
  existingAsPropose1: {
    owner: string, location: string, plot: string, area: string,
    considerValue: number, marketValue: number, distressValue: number
  } [] = [];

  totalMV = 0;
  totalFMV = 0;
  totalDV = 0;
  totalMVEx = 0;
  totalFMVEx = 0;
  totalDVEx = 0;
  totalMVAsPs = 0;
  totalFMVAsPs = 0;
  totalDVAsPs = 0;
  securityId: number;

  constructor(private collateralSiteVisitService: CollateralSiteVisitService) {
  }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.security)) {
      this.securityId = this.security.id;
      this.formData = JSON.parse(this.security.data);
    }
    if (this.formData['selectedArray'] !== undefined) {
      if (this.formData['initialForm'] !== undefined) {
        const landDetail = this.formData['initialForm']['landDetails'];
        const landBuildingDetail = this.formData['initialForm']['landBuilding'];
        const apartmentDetail = this.formData['initialForm']['buildingDetails'];
        this.checkSecurityInSelectedArray('LandSecurity');
        this.checkSecurityInSelectedArray('Land and Building Security');
        this.checkSecurityInSelectedArray('ApartmentSecurity');
        if (this.landSelected) {
          landDetail.forEach((d) => {
           this.getSecurityAndFixedCollateralData(d.uuid, d);
          });

        }
        // const landBuildings = this.formData['initialForm']['landBuilding'];
        if (this.landBuilding) {
          landBuildingDetail.forEach((d) => {
            this.getSecurityAndFixedCollateralData(d.uuid, d);
          });
        }
        console.log('proposedSecurity1', this.proposedSecurity1);
      }
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

  calcPlantDV(data) {
    const finalDv = (0.8 * Number(data));
    console.log('before return', finalDv);
    return finalDv;
  }

  getSecurityAndFixedCollateralData(uuid: string, d: any) {
    let collateralData = null;
    this.collateralSiteVisitService.getCollateralByLatestDateOfVisit(this.securityId, uuid).subscribe((res: any) => {
      if (!ObjectUtil.isEmpty(res.detail)) {
        collateralData = JSON.parse(res.detail.siteVisitJsonData);
        console.log('collateralData', collateralData);
      }
      if (d.forProposed) {
        this.totalMV += Number(d.landConsideredValue);
        this.totalFMV += Number(d.marketValue);
        this.totalDV += Number(d.distressValue);

        this.proposedSecurity1.push({
          owner: d.owner,
          location: d.location,
          locationDetail: d.locationDetail,
          considerValue: d.landConsideredValue,
          marketValue: d.marketValue,
          distressValue: d.distressValue,
          typeOfProperty: d.typeOfProperty,
          plantAndMachinery: d.plantMachineryChecked,
          plantMachineryData: {
            modelNo: d.plantMachineryModel,
            amount: ObjectUtil.isEmpty(d.plantMachineryAmount) ? 0 : d.plantMachineryAmount,
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
          valuationDate: d.landValuatorDate
        });

      }


      if (d.forExisting) {
        this.totalMVEx += Number(d.landConsideredValue);
        this.totalFMVEx += Number(d.marketValue);
        this.totalDVEx += Number(d.distressValue);
        this.existingSecurity1.push({
          owner: d.owner,
          location: d.location,
          plot: d.plotNumber,
          area: d.areaFormat,
          considerValue: d.landConsideredValue,
          marketValue: d.marketValue,
          distressValue: d.distressValue,
        });

      }
    });
  }
}
