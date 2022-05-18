import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../model/loanData';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {flatten} from '@angular/compiler';
import {CollateralSiteVisitService} from '../../../../loan-information-template/security/security-initial-form/fix-asset-collateral/collateral-site-visit.service';
import {ApiConfig} from '../../../../../@core/utils/api/ApiConfig';
import {NepseMaster} from '../../../../admin/modal/NepseMaster';
import {SiteVisitDocument} from '../../../../loan-information-template/security/security-initial-form/fix-asset-collateral/site-visit-document';
import {Security} from '../../../model/security';
import {OwnershipTransfer} from '../../../model/ownershipTransfer';

@Component({
  selector: 'app-collateral-site-visit',
  templateUrl: './collateral-site-visit.component.html',
  styleUrls: ['./collateral-site-visit.component.scss']
})
export class CollateralSiteVisitComponent implements OnInit {

  constructor(private collateralSiteVisitService: CollateralSiteVisitService) {
  }
  @Input() loanDataHolder: LoanDataHolder;
  url;
  securityData;
  collateralSiteVisits = [];
    vehicleSelected = false;
    landSelected = false;
    hypothecation = false;
    corporate = false;
    personal = false;
    apartmentSelected = false;
    plantSelected = false;
    depositSelected = false;
    totalAmount = 0;
    shareSelected = false;
    insurancePolicySelected = false;
    shareTotalValue = 0;
    totalConsideredValue = 0;
    loanSharePercent: NepseMaster = new NepseMaster();
    landBuilding = false;
    isSecurityPresent = false;
    isCollateralSiteVisitPresent = false;
    assignments: any;
    assignment = false;
    securityOther = false;
    siteVisitDocuments: Array<SiteVisitDocument>;
    separator = '/';
    fileType = '.jpg';
    isPrintable = 'YES';
    siteVisitJson = [];
    random;
    security: Security;
    ownerShipTransfer = OwnershipTransfer;
  ngOnInit() {
      this.url = ApiConfig.URL;
      this.random = Math.floor(Math.random() * 100) + 1;
    //   if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.security)) {
    //       this.securityData = JSON.parse(this.loanDataHolder.loanHolder.security.data);
    //       if (!ObjectUtil.isEmpty(this.securityData)) {
    //           this.security = this.securityData.initialForm;
    //           if (this.securityData['selectedArray'] !== undefined) {
    //               this.isSecurityPresent = true;
    //               // land security
    //               this.securityData['selectedArray'].filter(f => {
    //                   if (f.indexOf('LandSecurity') !== -1) {
    //                       this.landSelected = true;
    //                   }
    //               });
    //
    //               // apartment security
    //               this.securityData['selectedArray'].filter(f => {
    //                   if (f.indexOf('ApartmentSecurity') !== -1) {
    //                       this.apartmentSelected = true;
    //                   }
    //               });
    //               // land and building security
    //               this.securityData['selectedArray'].filter(f => {
    //                   if (f.indexOf('Land and Building Security') !== -1) {
    //                       this.landBuilding = true;
    //                   }
    //               });
    //               // plant and machinery security
    //               this.securityData['selectedArray'].filter(f => {
    //                   if (f.indexOf('PlantSecurity') !== -1) {
    //                       this.plantSelected = true;
    //                   }
    //               });
    //               // // vehicle security
    //               this.securityData['selectedArray'].filter(f => {
    //                   if (f.indexOf('VehicleSecurity') !== -1) {
    //                       this.vehicleSelected = true;
    //                   }
    //               });
    //               // fixed deposit receipt security
    //               this.securityData['selectedArray'].filter(f => {
    //                   if (f.indexOf('FixedDeposit') !== -1) {
    //                       this.depositSelected = true;
    //                   }
    //               });
    //               //
    //               // // shared security
    //               this.securityData['selectedArray'].filter(f => {
    //                   if (f.indexOf('ShareSecurity') !== -1) {
    //                       this.shareSelected = true;
    //                   }
    //               });
    //               // hypothecation of stock security
    //               this.securityData['selectedArray'].filter(f => {
    //                   if (f.indexOf('HypothecationOfStock') !== -1) {
    //                       this.hypothecation = true;
    //                   }
    //               });
    //               // assignment of receivables
    //               this.securityData['selectedArray'].filter(f => {
    //                   if (f.indexOf('AssignmentOfReceivables') !== -1) {
    //                       this.assignment = true;
    //                   }
    //               });
    //               // lease assignment
    //               this.securityData['selectedArray'].filter(f => {
    //                   if (f.indexOf('LeaseAssignment') !== -1) {
    //                       this.assignments = true;
    //                   }
    //               });
    //               // other security
    //               this.securityData['selectedArray'].filter(f => {
    //                   if (f.indexOf('OtherSecurity') !== -1) {
    //                       this.securityOther = true;
    //                   }
    //               });
    //               // corporate guarantee
    //               this.securityData['selectedArray'].filter(f => {
    //                   if (f.indexOf('CorporateGuarantee') !== -1) {
    //                       this.corporate = true;
    //                   }
    //               });
    //               // personal guarantee
    //               this.securityData['selectedArray'].filter(f => {
    //                   if (f.indexOf('PersonalGuarantee') !== -1) {
    //                       this.personal = true;
    //                   }
    //               });
    //               // insurance policy
    //               this.securityData['selectedArray'].filter(f => {
    //                   if (f.indexOf('InsurancePolicySecurity') !== -1) {
    //                       this.insurancePolicySelected = true;
    //                   }
    //               });
    //           }
    //       this.collateralSiteVisitService.getCollateralSiteVisitBySecurityId(this.loanDataHolder.loanHolder.security.id)
    //           .subscribe((response: any) => {
    //               const siteVisit = response.detail;
    //               if (this.landSelected) {
    //                   const landDetails = this.securityData['initialForm']['landDetails'];
    //                   landDetails.forEach(v => {
    //                       if (!ObjectUtil.isEmpty(v.uuid)) {
    //                           this.collateralSiteVisits.push(...siteVisit.filter(f => f.uuid === v.uuid));
    //                       }
    //                   });
    //               }
    //               if (this.landBuilding) {
    //                   const landBuilding = this.securityData['initialForm']['landBuilding'];
    //                   landBuilding.forEach(v => {
    //                       if (!ObjectUtil.isEmpty(v.uuid)) {
    //                           this.collateralSiteVisits.push(...siteVisit.filter(f => f.uuid === v.uuid));
    //                       }
    //                   });
    //               }
    //               if (this.apartmentSelected) {
    //                   const buildingDetails = this.securityData['initialForm']['buildingDetails'];
    //                   buildingDetails.forEach(v => {
    //                       if (!ObjectUtil.isEmpty(v.uuid)) {
    //                           this.collateralSiteVisits.push(...siteVisit.filter(f => f.uuid === v.uuid));
    //                       }
    //                   });
    //               }
    //               // for old loan that does not contains uuid for security and site visit
    //               if (this.landSelected) {
    //                   const landDetails = this.securityData['initialForm']['landDetails'];
    //                   landDetails.forEach(v => {
    //                       if (ObjectUtil.isEmpty(v.uuid)) {
    //                           this.collateralSiteVisits.push(...siteVisit.filter(f => f.uuid === null));
    //                       }
    //                   });
    //               }
    //               if (this.landBuilding) {
    //                   const landBuilding = this.securityData['initialForm']['landBuilding'];
    //                   landBuilding.forEach(v => {
    //                       if (ObjectUtil.isEmpty(v.uuid)) {
    //                           this.collateralSiteVisits.push(...siteVisit.filter(f => f.uuid === null));
    //                       }
    //                   });
    //               }
    //               if (this.apartmentSelected) {
    //                   const buildingDetails = this.securityData['initialForm']['buildingDetails'];
    //                   buildingDetails.forEach(v => {
    //                       if (ObjectUtil.isEmpty(v.uuid)) {
    //                           this.collateralSiteVisits.push(...siteVisit.filter(f => f.uuid === null));
    //                       }
    //                   });
    //               }
    //               const arr = [];
    //               this.collateralSiteVisits.forEach(f => {
    //                   if (!ObjectUtil.isEmpty(f.siteVisitDocuments)) {
    //                       arr.push(f.siteVisitDocuments);
    //                   }
    //               });
    //               // make nested array of objects as a single array eg: [1,2,[3[4,[5,6]]]] = [1,2,3,4,5,6]
    //               const docArray = flatten(arr);
    //               // filter for only printable document
    //               this.siteVisitDocuments = docArray.filter(f => f.isPrintable === this.isPrintable);
    //
    //               this.collateralSiteVisits.filter(item => {
    //                   this.siteVisitJson.push(JSON.parse(item.siteVisitJsonData));
    //               });
    //               if (this.collateralSiteVisits.length > 0) {
    //                   this.isCollateralSiteVisitPresent = true;
    //               }
    //           });
    //   }
    // }
  }
    viewDocument(url: string, name: string) {
        const viewDocName = name.concat(this.fileType);
        const link = document.createElement('a');
        link.target = '_blank';
        link.href = `${ApiConfig.URL}/${url}${viewDocName}?${Math.floor(Math.random() * 100) + 1}`;
        link.setAttribute('visibility', 'hidden');
        link.click();
    }
}
