import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NepseMaster} from '../../../../admin/modal/NepseMaster';
import {environment} from '../../../../../../environments/environment';
import {Clients} from '../../../../../../environments/Clients';
import {OwnershipTransfer} from '../../../model/ownershipTransfer';
import {SiteVisitDocument} from '../../../../loan-information-template/security/security-initial-form/fix-asset-collateral/site-visit-document';
import {CollateralSiteVisit} from '../../../../loan-information-template/security/security-initial-form/fix-asset-collateral/CollateralSiteVisit';
import {CollateralSiteVisitService} from '../../../../loan-information-template/security/security-initial-form/fix-asset-collateral/collateral-site-visit.service';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {flatten} from '@angular/compiler';

@Component({
  selector: 'app-security-approved-summary',
  templateUrl: './security-approved-summary.component.html',
  styleUrls: ['./security-approved-summary.component.scss']
})
export class SecurityApprovedSummaryComponent implements OnInit {
  @Input() formData: Object;
  @Input() count;
  @Input() shareSecurity;
  @Input() collateralData;
  landSelected = false;
  apartmentSelected = false;
  plantSelected = false;
  vehicleSelected = false;
  depositSelected = false;
  shareSelected = false;
  isPresentGuarantor = false;
  totalAmount = 0;
  shareTotalValue = 0;
  totalConsideredValue = 0;
  buildingSelected = false;
  hypothecation = false;
  securityOther = false;
  corporate = false;
  personal = false;
  loanSharePercent: NepseMaster = new NepseMaster();
  landBuilding = false;
  showTitle = false;
  insurancePolicySelected = false;
  client = environment.client;
  clientName = Clients;
  ownerShipTransfer = OwnershipTransfer;
  assignment = false;
  otherDetail: any;
  assignments = false;
  leaseAssignment: any;
  @Input() securityId: number;
  @Input() collateralSiteVisitDetail: Array<CollateralSiteVisit>;
  @Input() isCollateralSiteVisit;
  @Input() nepaliDate;
  @Input() siteVisitDocuments: Array<SiteVisitDocument>;
  collateralSiteVisitDocuments: Array<SiteVisitDocument>;
  isCollateralSiteVisitPresent = false;
  collateralSiteVisits: Array<CollateralSiteVisit> = [];
  siteVisitJson = [];
  @Input() loanCategory;
  @Input() approveSheet;
  isPrintable = 'YES';
  @Input() docStatus;
  @Output() downloadSiteVisitDocument = new EventEmitter();
  isSecurityPresent = false;

  constructor(private collateralSiteVisitService: CollateralSiteVisitService) {
  }

  ngOnInit() {
    if (this.formData['selectedArray'] !== undefined) {
      this.isSecurityPresent = true;
      // land security
      this.formData['selectedArray'].filter(f => {
        if (f.indexOf('LandSecurity') !== -1) {
          this.showTitle = true;
          this.landSelected = true;
        }
      });

      // apartment security
      this.formData['selectedArray'].filter(f => {
        if (f.indexOf('ApartmentSecurity') !== -1) {
          this.showTitle = true;
          this.apartmentSelected = true;
        }
      });
      // land and building security
      this.formData['selectedArray'].filter(f => {
        if (f.indexOf('Land and Building Security') !== -1) {
          this.showTitle = true;
          this.landBuilding = true;
        }
      });
      // plant and machinery security
      this.formData['selectedArray'].filter(f => {
        if (f.indexOf('PlantSecurity') !== -1) {
          this.showTitle = true;
          this.plantSelected = true;
        }
      });
      // // vehicle security
      this.formData['selectedArray'].filter(f => {
        if (f.indexOf('VehicleSecurity') !== -1) {
          this.showTitle = true;
          this.vehicleSelected = true;
        }
      });
      // fixed deposit receipt security
      this.formData['selectedArray'].filter(f => {
        if (f.indexOf('FixedDeposit') !== -1) {
          this.showTitle = true;
          this.depositSelected = true;
        }
      });
      //
      // // shared security
      this.formData['selectedArray'].filter(f => {
        if (f.indexOf('ShareSecurity') !== -1) {
          this.showTitle = true;
          this.shareSelected = true;
        }
      });
      // hypothecation of stock security
      this.formData['selectedArray'].filter(f => {
        if (f.indexOf('HypothecationOfStock') !== -1) {
          this.showTitle = true;
          this.hypothecation = true;
        }
      });
      // assignment of receivables
      this.formData['selectedArray'].filter(f => {
        if (f.indexOf('AssignmentOfReceivables') !== -1) {
          this.showTitle = true;
          this.assignment = true;
        }
      });
      // lease assignment
      this.formData['selectedArray'].filter(f => {
        if (f.indexOf('LeaseAssignment') !== -1) {
          this.showTitle = true;
          this.assignments = true;
        }
      });
      // other security
      this.formData['selectedArray'].filter(f => {
        if (f.indexOf('OtherSecurity') !== -1) {
          this.showTitle = true;
          this.securityOther = true;
        }
      });
      // corporate guarantee
      this.formData['selectedArray'].filter(f => {
        if (f.indexOf('CorporateGuarantee') !== -1) {
          this.showTitle = true;
          this.corporate = true;
        }
      });
      // personal guarantee
      this.formData['selectedArray'].filter(f => {
        if (f.indexOf('PersonalGuarantee') !== -1) {
          this.showTitle = true;
          this.personal = true;
        }
      });
      // insurance policy
      this.formData['selectedArray'].filter(f => {
        if (f.indexOf('InsurancePolicySecurity') !== -1) {
          this.showTitle = true;
          this.insurancePolicySelected = true;
        }
      });
    }

    if (this.depositSelected) {
      this.calculateTotal();
    }
    if (this.shareSelected) {
      this.calculateShareTotals();
      this.loanSharePercent = this.shareSecurity['loanShareRate'];
    }
    if (this.formData['guarantorsForm']['guarantorsDetails'].length !== 0) {
      this.isPresentGuarantor = true;
    }
    if (!ObjectUtil.isEmpty(this.securityId)) {
      this.collateralSiteVisitService.getCollateralSiteVisitBySecurityId(this.securityId)
          .subscribe((response: any) => {
            const siteVisit = response.detail;
            if (this.landSelected) {
              const landDetails = this.formData['initialForm']['landDetails'];
              landDetails.forEach(v => {
                if (!ObjectUtil.isEmpty(v.uuid)) {
                  this.collateralSiteVisits.push(...siteVisit.filter(f => f.uuid === v.uuid));
                }
              });
            }
            if (this.landBuilding) {
              const landBuilding = this.formData['initialForm']['landBuilding'];
              landBuilding.forEach(v => {
                if (!ObjectUtil.isEmpty(v.uuid)) {
                  this.collateralSiteVisits.push(...siteVisit.filter(f => f.uuid === v.uuid));
                }
              });
            }
            if (this.apartmentSelected) {
              const buildingDetails = this.formData['initialForm']['buildingDetails'];
              buildingDetails.forEach(v => {
                if (!ObjectUtil.isEmpty(v.uuid)) {
                  this.collateralSiteVisits.push(...siteVisit.filter(f => f.uuid === v.uuid));
                }
              });
            }
            // for old loan that does not contains uuid for security and site visit
            if (this.landSelected) {
              const landDetails = this.formData['initialForm']['landDetails'];
              landDetails.forEach(v => {
                if (ObjectUtil.isEmpty(v.uuid)) {
                  this.collateralSiteVisits.push(...siteVisit.filter(f => f.uuid === null));
                }
              });
            }
            if (this.landBuilding) {
              const landBuilding = this.formData['initialForm']['landBuilding'];
              landBuilding.forEach(v => {
                if (ObjectUtil.isEmpty(v.uuid)) {
                  this.collateralSiteVisits.push(...siteVisit.filter(f => f.uuid === null));
                }
              });
            }
            if (this.apartmentSelected) {
              const buildingDetails = this.formData['initialForm']['buildingDetails'];
              buildingDetails.forEach(v => {
                if (ObjectUtil.isEmpty(v.uuid)) {
                  this.collateralSiteVisits.push(...siteVisit.filter(f => f.uuid === null));
                }
              });
            }
            const arr = [];
            this.collateralSiteVisits.forEach(f => {
              if (!ObjectUtil.isEmpty(f.siteVisitDocuments)) {
                arr.push(f.siteVisitDocuments);
              }
            });
            // make nested array of objects as a single array eg: [1,2,[3[4,[5,6]]]] = [1,2,3,4,5,6]
            const docArray = flatten(arr);
            // filter for only printable document
            this.collateralSiteVisitDocuments = docArray.filter(f => f.isPrintable === this.isPrintable);

            this.collateralSiteVisits.filter(item => {
              this.siteVisitJson.push(JSON.parse(item.siteVisitJsonData));
            });
            if (this.collateralSiteVisits.length > 0) {
              this.isCollateralSiteVisitPresent = true;
            }
            this.downloadSiteVisitDocument.emit(this.collateralSiteVisitDocuments);
          });
    }

  }

  calculateTotal() {
    const depositList = this.formData['initialForm']['fixedDepositDetails'];
    depositList.forEach(deposit => {
      this.totalAmount += deposit.amount;
    });
  }

  private calculateShareTotals() {
    const shareList = this.shareSecurity['shareSecurityDetails'];
    shareList.forEach(share => {
      this.shareTotalValue += share.total;
      this.totalConsideredValue += share.consideredValue;
    });
  }

}
