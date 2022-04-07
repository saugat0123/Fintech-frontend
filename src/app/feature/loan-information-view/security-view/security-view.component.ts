import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Security} from '../../loan/model/security';
import {NepseMaster} from '../../admin/modal/NepseMaster';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {OwnershipTransfer} from '../../loan/model/ownershipTransfer';
import {Clients} from '../../../../environments/Clients';
import {environment} from '../../../../environments/environment';
import {CollateralSiteVisit} from '../../loan-information-template/security/security-initial-form/fix-asset-collateral/CollateralSiteVisit';
import {CollateralSiteVisitService} from '../../loan-information-template/security/security-initial-form/fix-asset-collateral/collateral-site-visit.service';
import {SiteVisitDocument} from '../../loan-information-template/security/security-initial-form/fix-asset-collateral/site-visit-document';
import {ApiConfig} from '../../../@core/utils/api/ApiConfig';
import {flatten} from '@angular/compiler';

@Component({
  selector: 'app-security-view',
  templateUrl: './security-view.component.html',
  styleUrls: ['./security-view.component.scss']
})
export class SecurityViewComponent implements OnInit {
  @Input() security: Security;
  @Input() shareSecurityData;
  @Input() collateralData;
  @Input() docStatus;
  @Input() proposal;
  securityData: Security;
  shareSecurity;
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
  buildingSelected = false;
  landBuilding = false;
  ownerShipTransfer = OwnershipTransfer;
  disableCrgAlphaParams = environment.disableCrgAlpha;
  crgLambdaDisabled = environment.disableCrgLambda;
  client = environment.client;
  clientName = Clients;
  securityOther: any;
  assignments: any;
  assignment = false;
  @Input() securityId: number;
  collateralSiteVisits: Array<CollateralSiteVisit> = [];
  siteVisitJson = [];
  isCollateralSiteVisit = false;
  siteVisitDocuments: Array<SiteVisitDocument>;
  url: string;
  separator = '/';
  fileType = '.jpg';
  isPrintable = 'YES';
  random;
  @Output() downloadSiteVisitDocument = new EventEmitter();
  isSecurityPresent = false;
  isCollateralSiteVisitPresent = false;
  landArray;
  landBuildingArray;
  apartmentArray;
  vehicleArray;
  constructor(private collateralSiteVisitService: CollateralSiteVisitService) {
  }

  ngOnInit() {
    this.random = Math.floor(Math.random() * 100) + 1;
    this.url = ApiConfig.URL;
    this.securityData = JSON.parse(this.security.data);
    console.log(this.securityData);
    if (this.securityData['selectedArray'] !== undefined) {
      this.isSecurityPresent = true;
      // land security
      this.securityData['selectedArray'].filter(f => {
        if (f.indexOf('LandSecurity') !== -1) {
          this.landSelected = true;
        }
      });

      // apartment security
      this.securityData['selectedArray'].filter(f => {
        if (f.indexOf('ApartmentSecurity') !== -1) {
          this.apartmentSelected = true;
        }
      });
      // land and building security
      this.securityData['selectedArray'].filter(f => {
        if (f.indexOf('Land and Building Security') !== -1) {
          this.landBuilding = true;
        }
      });
      // plant and machinery security
      this.securityData['selectedArray'].filter(f => {
        if (f.indexOf('PlantSecurity') !== -1) {
          this.plantSelected = true;
        }
      });
      // // vehicle security
      this.securityData['selectedArray'].filter(f => {
        if (f.indexOf('VehicleSecurity') !== -1) {
          this.vehicleSelected = true;
          this.vehicleArray = this.managedArray(this.securityData['initialForm']['vehicleDetails']);
        }
      });
      // fixed deposit receipt security
      this.securityData['selectedArray'].filter(f => {
        if (f.indexOf('FixedDeposit') !== -1) {
          this.depositSelected = true;
        }
      });
      //
      // // shared security
      this.securityData['selectedArray'].filter(f => {
        if (f.indexOf('ShareSecurity') !== -1) {
          this.shareSelected = true;
        }
      });
      // hypothecation of stock security
      this.securityData['selectedArray'].filter(f => {
        if (f.indexOf('HypothecationOfStock') !== -1) {
          this.hypothecation = true;
        }
      });
      // assignment of receivables
      this.securityData['selectedArray'].filter(f => {
        if (f.indexOf('AssignmentOfReceivables') !== -1) {
          this.assignment = true;
        }
      });
      // lease assignment
      this.securityData['selectedArray'].filter(f => {
        if (f.indexOf('LeaseAssignment') !== -1) {
          this.assignments = true;
        }
      });
      // other security
      this.securityData['selectedArray'].filter(f => {
        if (f.indexOf('OtherSecurity') !== -1) {
          this.securityOther = true;
        }
      });
      // corporate guarantee
      this.securityData['selectedArray'].filter(f => {
        if (f.indexOf('CorporateGuarantee') !== -1) {
          this.corporate = true;
        }
      });
      // personal guarantee
      this.securityData['selectedArray'].filter(f => {
        if (f.indexOf('PersonalGuarantee') !== -1) {
          this.personal = true;
        }
      });
      // insurance policy
      this.securityData['selectedArray'].filter(f => {
        if (f.indexOf('InsurancePolicySecurity') !== -1) {
          this.insurancePolicySelected = true;
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.shareSecurityData)) {
      this.shareSecurity = JSON.parse(this.shareSecurityData.data);
      if (ObjectUtil.isEmpty(this.shareSecurity) && !ObjectUtil.isEmpty(this.shareSecurityData.approvedData)) {
        this.shareSecurity = JSON.parse(this.shareSecurityData.approvedData);
      }
    } else {
      this.shareSelected = false;
    }
    if (this.shareSelected) {
      this.calculateShareTotals();
      this.loanSharePercent = this.shareSecurity['loanShareRate'];
    }
    if (this.depositSelected) {
      this.calculateTotal();
    }
    if (!ObjectUtil.isEmpty(this.securityId)) {
      this.collateralSiteVisitService.getCollateralSiteVisitBySecurityId(this.securityId)
          .subscribe((response: any) => {
            const siteVisit = response.detail;
            if (this.landSelected) {
              const landDetails = this.securityData['initialForm']['landDetails'];
              landDetails.forEach(v => {
                if (!ObjectUtil.isEmpty(v.uuid)) {
                  this.collateralSiteVisits.push(...siteVisit.filter(f => f.uuid === v.uuid));
                }
              });
              this.landArray = this.managedArray(this.securityData['initialForm']['landDetails']);
            }
            if (this.landBuilding) {
              const landBuilding = this.securityData['initialForm']['landBuilding'];
              landBuilding.forEach(v => {
                if (!ObjectUtil.isEmpty(v.uuid)) {
                  this.collateralSiteVisits.push(...siteVisit.filter(f => f.uuid === v.uuid));
                }
              });
              this.landBuildingArray = this.managedArray(this.securityData['initialForm']['landBuilding']);
            }
            if (this.apartmentSelected) {
              const buildingDetails = this.securityData['initialForm']['buildingDetails'];
              buildingDetails.forEach(v => {
                if (!ObjectUtil.isEmpty(v.uuid)) {
                  this.collateralSiteVisits.push(...siteVisit.filter(f => f.uuid === v.uuid));
                }
              });
              this.apartmentArray = this.managedArray(this.securityData['initialForm']['buildingDetails']);
            }
            // for old loan that does not contains uuid for security and site visit
            if (this.landSelected) {
              const landDetails = this.securityData['initialForm']['landDetails'];
              landDetails.forEach(v => {
                if (ObjectUtil.isEmpty(v.uuid)) {
                  this.collateralSiteVisits.push(...siteVisit.filter(f => f.uuid === null));
                }
              });
              this.landArray = this.managedArray(this.securityData['initialForm']['landDetails']);
            }
            if (this.landBuilding) {
              const landBuilding = this.securityData['initialForm']['landBuilding'];
              landBuilding.forEach(v => {
                if (ObjectUtil.isEmpty(v.uuid)) {
                  this.collateralSiteVisits.push(...siteVisit.filter(f => f.uuid === null));
                }
              });
              this.landBuildingArray = this.managedArray(this.securityData['initialForm']['landBuilding']);
            }
            if (this.apartmentSelected) {
              const buildingDetails = this.securityData['initialForm']['buildingDetails'];
              buildingDetails.forEach(v => {
                if (ObjectUtil.isEmpty(v.uuid)) {
                  this.collateralSiteVisits.push(...siteVisit.filter(f => f.uuid === null));
                }
              });
              this.apartmentArray = this.managedArray(this.securityData['initialForm']['buildingDetails']);
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
            this.siteVisitDocuments = docArray.filter(f => f.isPrintable === this.isPrintable);

            this.collateralSiteVisits.filter(item => {
              this.siteVisitJson.push(JSON.parse(item.siteVisitJsonData));
            });
            if (this.collateralSiteVisits.length > 0) {
              this.isCollateralSiteVisitPresent = true;
            }
            this.downloadSiteVisitDocument.emit(this.siteVisitDocuments);
          });
    }
  }

  calculateShareTotals() {
    const shareList = this.shareSecurity['shareSecurityDetails'];
    shareList.forEach(share => {
      this.shareTotalValue += share.total;
      this.totalConsideredValue += share.consideredValue;
    });
  }

  calculateTotal() {
    const depositList = this.securityData['initialForm']['fixedDepositDetails'];
    depositList.forEach(deposit => {
      this.totalAmount += deposit.amount;
    });
  }

  viewDocument(url: string, name: string) {
    const viewDocName = name.concat(this.fileType);
    const link = document.createElement('a');
    link.target = '_blank';
    link.href = `${ApiConfig.URL}/${url}${viewDocName}?${Math.floor(Math.random() * 100) + 1}`;
    link.setAttribute('visibility', 'hidden');
    link.click();
  }

  public onError(event): void {
    event.target.src = 'assets/img/noImage.png';
  }
  private managedArray(array) {
    let newArray = [];
    const returnArray = [];
    array.forEach((g, i) => {
      newArray.push(g);
      if ((i + 1) % 2 === 0) {
        if (newArray.length > 0) {
          returnArray.push(newArray);
        }
        newArray = [];
      }
      if (i === array.length - 1) {
        if (newArray.length > 0) {
          returnArray.push(newArray);
        }
        newArray = [];
      }
    });
    return returnArray;
  }
}
