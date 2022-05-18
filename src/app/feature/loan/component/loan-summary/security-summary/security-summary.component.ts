import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {NepseMaster} from '../../../../admin/modal/NepseMaster';
import {environment} from '../../../../../../environments/environment';
import {Clients} from '../../../../../../environments/Clients';
import {OwnershipTransfer} from '../../../model/ownershipTransfer';
import {CollateralSiteVisitService} from '../../../../loan-information-template/security/security-initial-form/fix-asset-collateral/collateral-site-visit.service';
import {CollateralSiteVisit} from '../../../../loan-information-template/security/security-initial-form/fix-asset-collateral/CollateralSiteVisit';
import {SiteVisitDocument} from '../../../../loan-information-template/security/security-initial-form/fix-asset-collateral/site-visit-document';
import {flatten} from '@angular/compiler';
import {Security} from '../../../model/security';
import {SecuritiesType} from '../../../../constants/securities-type';


@Component({
    selector: 'app-security-summary',
    templateUrl: './security-summary.component.html',
    styleUrls: ['./security-summary.component.scss']
})
export class SecuritySummaryComponent implements OnInit {
    @Input() formData: Object;
    @Input() shareSecurity;
    @Input() collateralData;
    @Input() proposal;
    @Input() securities: Array<Security>;
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
    @Input() collateralSiteVisitDetail = [];
    @Input() isCollateralSiteVisit;
    @Input() nepaliDate;
    @Input() siteVisitDocuments: Array<SiteVisitDocument>;
    collateralSiteVisitDocuments: Array<SiteVisitDocument>;
    isCollateralSiteVisitPresent = false;
    collateralSiteVisits: Array<CollateralSiteVisit> = [];
    siteVisitJson = [];
    isPrintable = 'YES';
    @Input() docStatus;
    @Output() downloadSiteVisitDocument = new EventEmitter();
    @Input() isApproveSecurity;
    isSecurityPresent = false;
    landArray;
    landBuildingArray;
    apartmentArray;
    vehicleArray;
    leaseArray;
    assignmentArray;
    corporateArray;
    fdArray;
    hypoArray;
    insuranceArray;
    otherArray;
    personalArray;
    shareArray;
    plantArray;
    constructor(private collateralSiteVisitService: CollateralSiteVisitService) {
    }

    ngOnInit() {
        this.selectedSecurities();
        this.setSelectedSecurities();
        // if (!ObjectUtil.isEmpty(this.securityId)) {
        //     this.collateralSiteVisitService.getCollateralSiteVisitBySecurityId(this.securityId)
        //         .subscribe((response: any) => {
        //             const siteVisit = response.detail;
        //             if (this.landSelected) {
        //                 const landDetails = this.formData['initialForm']['landDetails'];
        //                 landDetails.forEach(v => {
        //                     if (!ObjectUtil.isEmpty(v.uuid)) {
        //                         this.collateralSiteVisits.push(...siteVisit.filter(f => f.uuid === v.uuid));
        //                     }
        //                 });
        //                 this.landArray = this.managedArray(this.formData['initialForm']['landDetails']);
        //             }
        //             if (this.landBuilding) {
        //                 const landBuilding = this.formData['initialForm']['landBuilding'];
        //                 landBuilding.forEach(v => {
        //                     if (!ObjectUtil.isEmpty(v.uuid)) {
        //                         this.collateralSiteVisits.push(...siteVisit.filter(f => f.uuid === v.uuid));
        //                     }
        //                 });
        //                 this.landBuildingArray = this.managedArray(this.formData['initialForm']['landBuilding']);
        //             }
        //             if (this.apartmentSelected) {
        //                 const buildingDetails = this.formData['initialForm']['buildingDetails'];
        //                 buildingDetails.forEach(v => {
        //                     if (!ObjectUtil.isEmpty(v.uuid)) {
        //                         this.collateralSiteVisits.push(...siteVisit.filter(f => f.uuid === v.uuid));
        //                     }
        //                 });
        //                 this.apartmentArray = this.managedArray(this.formData['initialForm']['buildingDetails']);
        //             }
        //             // for old loan that does not contains uuid for security and site visit
        //             if (this.landSelected) {
        //                 const landDetails = this.formData['initialForm']['landDetails'];
        //                 landDetails.forEach(v => {
        //                     if (ObjectUtil.isEmpty(v.uuid)) {
        //                         this.collateralSiteVisits.push(...siteVisit.filter(f => f.uuid === null));
        //                     }
        //                 });
        //                 this.landArray = this.managedArray(this.formData['initialForm']['landDetails']);
        //             }
        //             if (this.landBuilding) {
        //                 const landBuilding = this.formData['initialForm']['landBuilding'];
        //                 landBuilding.forEach(v => {
        //                     if (ObjectUtil.isEmpty(v.uuid)) {
        //                         this.collateralSiteVisits.push(...siteVisit.filter(f => f.uuid === null));
        //                     }
        //                 });
        //                 this.landBuildingArray = this.managedArray(this.formData['initialForm']['landBuilding']);
        //             }
        //             if (this.apartmentSelected) {
        //                 const buildingDetails = this.formData['initialForm']['buildingDetails'];
        //                 buildingDetails.forEach(v => {
        //                     if (ObjectUtil.isEmpty(v.uuid)) {
        //                         this.collateralSiteVisits.push(...siteVisit.filter(f => f.uuid === null));
        //                     }
        //                 });
        //                 this.apartmentArray = this.managedArray(this.formData['initialForm']['buildingDetails']);
        //             }
        //             const arr = [];
        //             this.collateralSiteVisits.forEach(f => {
        //                 if (!ObjectUtil.isEmpty(f.siteVisitDocuments)) {
        //                     arr.push(f.siteVisitDocuments);
        //                 }
        //             });
        //             // make nested array of objects as a single array eg: [1,2,[3[4,[5,6]]]] = [1,2,3,4,5,6]
        //             const docArray = flatten(arr);
        //             // filter for only printable document
        //             this.collateralSiteVisitDocuments = docArray.filter(f => f.isPrintable === this.isPrintable);
        //
        //             this.collateralSiteVisits.filter(item => {
        //                 this.siteVisitJson.push(JSON.parse(item.siteVisitJsonData));
        //             });
        //             if (this.collateralSiteVisits.length > 0) {
        //                 this.isCollateralSiteVisitPresent = true;
        //             }
        //             this.downloadSiteVisitDocument.emit(this.collateralSiteVisitDocuments);
        //         });
        // }
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

    setSelectedSecurities() {
        if (this.apartmentSelected) {
            const apartment = this.securities.map((d) => {
                if (d.securityType === SecuritiesType.APARTMENT_SECURITY) {
                    return JSON.parse(d.data);
                }
            });
            this.apartmentArray = this.managedArray(apartment);
        }
        if (this.landSelected) {
            const land = this.securities.map((d) => {
                if (d.securityType === SecuritiesType.LAND_SECURITY) {
                    return JSON.parse(d.data);
                }
            });
            this.landArray = this.managedArray(land);
        }
        if (this.landBuilding) {
            const landBuilding = this.securities.map((d) => {
                if (d.securityType === SecuritiesType.LAND_BUILDING_SECURITY) {
                    return JSON.parse(d.data);
                }
            });
            this.landBuildingArray = this.managedArray(landBuilding);

        }
        if (this.assignments) {
            const lease = this.securities.map((d) => {
                if (d.securityType === SecuritiesType.LEASE_ASSIGNMENT) {
                    return JSON.parse(d.data);
                }
            });
            this.leaseArray = lease;
        }
        if (this.assignment) {
            const assignment = this.securities.map((d) => {
                if (d.securityType === SecuritiesType.ASSIGNMENT_OF_RECEIVABLES) {
                    return JSON.parse(d.data);
                }
            });
            this.assignmentArray = assignment;
        }
        if (this.corporate) {
            const corporate = this.securities.map((d) => {
                if (d.securityType === SecuritiesType.CORPORATE_GUARANTEE) {
                    return JSON.parse(d.data);
                }
            });
            this.corporateArray = corporate;
        }
        if (this.depositSelected) {
            const fd = this.securities.map((d) => {
                if (d.securityType === SecuritiesType.FIXED_DEPOSIT_RECEIPT) {
                    return JSON.parse(d.data);
                }
            });
            this.fdArray = fd;
        }
        if (this.hypothecation) {
            const hypo = this.securities.map((d) => {
                if (d.securityType === SecuritiesType.HYPOTHECATION_OF_STOCK) {
                    return JSON.parse(d.data);
                }
            });
            this.hypoArray = hypo;
        }
        if (this.insurancePolicySelected) {
            const insurance = this.securities.map((d) => {
                if (d.securityType === SecuritiesType.INSURANCE_POLICY_SECURITY) {
                    return JSON.parse(d.data);
                }
            });
            this.insuranceArray = insurance;
        }
        if (this.securityOther) {
            const other = this.securities.map((d) => {
                if (d.securityType === SecuritiesType.OTHER_SECURITY) {
                    return JSON.parse(d.data);
                }
            });
            this.otherArray = other;
        }
        if (this.personal) {
            const personal = this.securities.map((d) => {
                if (d.securityType === SecuritiesType.PERSONAL_GUARANTEE) {
                    return JSON.parse(d.data);
                }
            });
            this.personalArray = personal;
        }
        if (this.shareSelected) {
            const share = this.securities.map((d) => {
                if (d.securityType === SecuritiesType.SHARE_SECURITY) {
                    return JSON.parse(d.data);
                }
            });
            this.shareArray = share;
        }
        if (this.plantSelected) {
            const plant = this.securities.map((d) => {
                if (d.securityType === SecuritiesType.PLANT_AND_MACHINERY_SECURITY) {
                    return JSON.parse(d.data);
                }
            });
            this.plantArray = plant;
        }
        if (this.vehicleSelected) {
            const vehicle = this.securities.map((d) => {
                if (d.securityType === SecuritiesType.VEHICLE_SECURITY) {
                    return JSON.parse(d.data);
                }
            });
            this.vehicleArray =  this.managedArray(vehicle);
        }
    }
    selectedSecurities() {
        if (!ObjectUtil.isEmpty(this.securities)) {
            this.securities.forEach((s, i) => {
                switch (s.securityType) {
                    case SecuritiesType.APARTMENT_SECURITY: {
                        this.apartmentSelected = true;
                    }
                        break;
                    case SecuritiesType.LAND_SECURITY: {
                        this.landSelected = true;
                    }
                        break;
                    case SecuritiesType.ASSIGNMENT_OF_RECEIVABLES: {
                        this.assignments = true;
                    }
                        break;
                    case SecuritiesType.LAND_BUILDING_SECURITY: {
                        this.landBuilding = true;
                    }
                        break;
                    case SecuritiesType.CORPORATE_GUARANTEE: {
                        this.corporate = true;
                    }
                        break;
                    case SecuritiesType.FIXED_DEPOSIT_RECEIPT: {
                        this.depositSelected = true;
                    }
                        break;
                    case SecuritiesType.HYPOTHECATION_OF_STOCK: {
                        this.hypothecation = true;
                    }
                        break;
                    case SecuritiesType.INSURANCE_POLICY_SECURITY: {
                        this.insurancePolicySelected = true;
                    }
                        break;
                    case SecuritiesType.OTHER_SECURITY: {
                        this.securityOther = true;
                    }
                        break;
                    case SecuritiesType.PERSONAL_GUARANTEE: {
                        this.personal = true;
                    }
                        break;
                    case SecuritiesType.LEASE_ASSIGNMENT: {
                        this.assignments = true;
                    }
                        break;
                    case SecuritiesType.SHARE_SECURITY: {
                        this.shareSelected = true;
                    }
                        break;
                    case SecuritiesType.PLANT_AND_MACHINERY_SECURITY: {
                        this.plantSelected = true;
                    }
                        break;
                    case SecuritiesType.VEHICLE_SECURITY: {
                        this.vehicleSelected = true;
                    }
                        break;
                    default: return;
                }
            });
        }
    }
}
