import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {NepseMaster} from '../../../../admin/modal/NepseMaster';
import {environment} from '../../../../../../environments/environment';
import {Clients} from '../../../../../../environments/Clients';
import {OwnershipTransfer} from '../../../model/ownershipTransfer';
import {CollateralSiteVisitService} from '../../../../loan-information-template/security/security-initial-form/fix-asset-collateral/collateral-site-visit.service';
import {CollateralSiteVisit} from '../../../../loan-information-template/security/security-initial-form/fix-asset-collateral/CollateralSiteVisit';
import {SiteVisitDocument} from '../../../../loan-information-template/security/security-initial-form/fix-asset-collateral/site-visit-document';
import {Security} from '../../../model/security';
import {LoanDataHolder} from '../../../model/loanData';
import {SecurityLoanReferenceService} from '../../../../security-service/security-loan-reference.service';
import {CustomerInfoData} from '../../../model/customerInfoData';


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
    @Input() securities: Array<Security> = [];
    @Input() customerAllLoanList: LoanDataHolder[];
    @Input() pending;
    @Input() loanHolder: CustomerInfoData;
    @Input() approvedSec;
    @Input() securityId: number;
    @Input() collateralSiteVisitDetail = [];
    @Input() isCollateralSiteVisit;
    @Input() nepaliDate;
    @Input() siteVisitDocuments: Array<SiteVisitDocument>;
    isPrintable = 'YES';
    @Input() docStatus;
    @Output() downloadSiteVisitDocument = new EventEmitter();
    @Input() isApproveSecurity;
    landSelected = false;
    apartmentSelected = false;
    plantSelected = false;
    vehicleSelected = false;
    depositSelected = false;
    shareSelected = false;
    totalAmount = 0;
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

    totalIndividualSec = {
        land: {fmv: 0, mv: 0, rv: 0, added: false},
        landBuilding: {fmv: 0, mv: 0, rv: 0, added: false},
        apartment: {fmv: 0, mv: 0, rv: 0, added: false},
        vehicle: {fmv: 0, mv: 0, rv: 0, added: false},
        lease: {fmv: 0, mv: 0, rv: 0, added: false},
        assignment: {fmv: 0, mv: 0, rv: 0, added: false},
        corporate: {fmv: 0, mv: 0, rv: 0, added: false},
        fd: {fmv: 0, mv: 0, rv: 0, added: false},
        hypo: {fmv: 0, mv: 0, rv: 0, added: false},
        insurance: {fmv: 0, mv: 0, rv: 0, added: false},
        other: {fmv: 0, mv: 0, rv: 0, added: false},
        personal: {fmv: 0, mv: 0, rv: 0, added: false},
        share: {fmv: 0, mv: 0, rv: 0, added: false},
        plant: {fmv: 0, mv: 0, rv: 0, added: false},
        total: {fmv: 0, mv: 0, rv: 0, added: true},
    };
    keys = Object.keys(this.totalIndividualSec);
    subKey = Object.keys(this.totalIndividualSec.apartment);
    constructor(private collateralSiteVisitService: CollateralSiteVisitService,
                private securityLoanReference: SecurityLoanReferenceService) {
    }

    ngOnInit() {
        this.subKey.pop();
        // Set Security Details for view
        const  loanListLen = !ObjectUtil.isEmpty(this.customerAllLoanList) ? this.customerAllLoanList.length : 0;
        if (loanListLen > 0 && this.securities.length < 1 ) {
            this.securities = [];
            if (this.pending) {
                this.combineAllSecurity();
            } else {
                this.combinedAllApprovedSecurity();
            }
        } else if (!ObjectUtil.isEmpty(this.securities)) {
            const proposedSecurity = this.securities.map(d => d.id);
            this.securities =  this.securities
                .filter((value, index) => proposedSecurity.indexOf(value.id) === index);
            this.selectedSecurities();
            this.setSelectedSecurities();
        }
        if (!ObjectUtil.isEmpty(this.loanHolder.customerShareBatches) &&
            this.loanHolder.customerShareBatches.length > 0) {
            this.loanHolder.customerShareBatches[0].shareSecurity.forEach((share) => {
                this.totalIndividualSec.share.fmv += JSON.parse(share.data).totalFmv ? JSON.parse(share.data).totalFmv : 0;
                this.totalIndividualSec.share.mv += JSON.parse(share.data).totalFmv ? JSON.parse(share.data).totalFmv : 0;
                this.totalIndividualSec.share.rv += JSON.parse(share.data).totalRealizableAmount ? JSON.parse(share.data).totalRealizableAmount : 0;
                this.totalIndividualSec.share.added = true;
            });
        }
        if (this.pending) {
            this.setApprovedSecurities();
        }
        this.keys.forEach(k => {
            if (this.totalIndividualSec[k].added && k !== 'total') {
                this.subKey.forEach(sk => {
                    this.totalIndividualSec.total[sk] += this.totalIndividualSec[k][sk];
                });
            }
        });
    }

    combineAllSecurity() {
        this.customerAllLoanList.forEach((ld) => {
                this.securities =  this.securities.concat(ld.securities);
        });
        if (this.securities.length > 0) {
            this.selectedSecurities();
            this.setSelectedSecurities();
        }

    }

    combinedAllApprovedSecurity(): void {
        let security: any;
        this.customerAllLoanList.forEach((ld) => {
            if (!ObjectUtil.isEmpty(ld.parentId) && ld.documentStatus.toString() !== 'APPROVED' ) {
                this.securityLoanReference.getAllSecurityLoanReferencesByLoanId(ld.parentId).subscribe({
                    next: (response: any) => {
                         security = response.detail;
                    },
                    error: (err: any) => {},
                    complete: () => {
                        security.forEach((dd: any) => {
                            const securityObj = new Security();
                            securityObj.id = dd.securityId;
                            securityObj.coverage = dd.coverage;
                            securityObj.data = dd.data;
                            securityObj.securityType = dd.securityType;
                            securityObj.usedAmount = dd.usedAmount;
                            securityObj.status = dd.status;
                            this.securities.push(securityObj);
                        });
                        this.selectedSecurities();
                        this.setSelectedSecurities();
                    },
                    });
            }
        });
    }

    private managedArray(array) {
        let newArray = [];
        const returnArray = [];
        array.forEach((g, i) => {
            if (!ObjectUtil.isEmpty(g)) {
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
            }
        });
        return returnArray;
    }

    setSelectedSecurities() {
        if (this.apartmentSelected) {
            const apartment = [];
            this.securities.forEach((d) => {
                if (d.securityType.toString() === 'APARTMENT_SECURITY') {
                    const data = JSON.parse(d.data);
                    apartment.push(data);
                    this.totalIndividualSec.apartment.rv += data.buildingReliasableValue || 0;
                    this.totalIndividualSec.apartment.mv += data.buildingDistressValue || 0;
                    this.totalIndividualSec.apartment.fmv += data.fairMarketValue || 0;
                    this.totalIndividualSec.apartment.added = true;
                }
            });
            this.apartmentArray = this.managedArray(apartment);
        }
        if (this.landSelected) {
            const land = [];
            this.securities.forEach((d, i) => {
                if (d.securityType.toString() === 'LAND_SECURITY') {
                    const data = JSON.parse(d.data);
                    land.push(data);
                    this.totalIndividualSec.land.rv += Number(data.landConsideredValue) || 0;
                    this.totalIndividualSec.land.mv += Number(data.distressValue) || 0;
                    this.totalIndividualSec.land.fmv += Number(data.fairMarketValue) || 0;
                    this.totalIndividualSec.land.added = true;
                }
            });
            this.landArray = this.managedArray(land);
        }
        if (this.landBuilding) {
            const landBuilding = [];
            this.securities.forEach((d, i) => {
                if (d.securityType.toString() === 'LAND_BUILDING_SECURITY') {
                    const data = JSON.parse(d.data);
                    landBuilding.push(data);
                    this.totalIndividualSec.landBuilding.rv += data.landConsideredValue || 0;
                    this.totalIndividualSec.landBuilding.mv += data.totalMarketValue || 0;
                    this.totalIndividualSec.landBuilding.fmv += (data.distressValue + data.apartmentDistressValue);
                    this.totalIndividualSec.landBuilding.added = true;
                }
            });
            this.landBuildingArray = this.managedArray(landBuilding);
        }
        if (this.assignments) {
            const lease = [];
            this.securities.forEach((d) => {
                if (d.securityType.toString() === 'LEASE_ASSIGNMENT') {
                    const data = JSON.parse(d.data);
                    lease.push(data);
                }
            });
            this.leaseArray = lease;
        }
        if (this.assignment) {
            const assignment = [];
            this.securities.forEach((d) => {
                if (d.securityType.toString() === 'ASSIGNMENT_OF_RECEIVABLES') {
                    const data = JSON.parse(d.data);
                    assignment.push(data);
                }
            });
            this.assignmentArray = assignment;
        }
        if (this.corporate) {
            const corporate = [];
            this.securities.forEach((d) => {
                if (d.securityType.toString() === 'CORPORATE_GUARANTEE') {
                    const data = JSON.parse(d.data);
                    corporate.push(data);
                }
            });
            this.corporateArray = corporate;
        }
        if (this.depositSelected) {
            const fd = [];
            this.securities.forEach((d) => {
                if (d.securityType.toString() === 'FIXED_DEPOSIT_RECEIPT') {
                    const data = JSON.parse(d.data);
                    fd.push(data);
                }
            });
            this.fdArray = fd;
        }
        if (this.hypothecation) {
            const hypo = [];
            this.securities.forEach((d) => {
                if (d.securityType.toString() === 'HYPOTHECATION_OF_STOCK') {
                    const data = JSON.parse(d.data);
                    this.totalIndividualSec.hypo.rv += data.realiasableValue || 0;
                    this.totalIndividualSec.hypo.fmv += data.fairMarketValue || 0;
                    this.totalIndividualSec.hypo.mv +=  data.fairMarketValue || 0;
                    this.totalIndividualSec.hypo.added = true;
                    hypo.push(data);
                }
            });
            this.hypoArray = hypo;
        }
        if (this.insurancePolicySelected) {
            const insurance = [];
            this.securities.forEach((d) => {
                if (d.securityType.toString() === 'INSURANCE_POLICY_SECURITY') {
                    insurance.push( JSON.parse(d.data));
                }
            });
            this.insuranceArray = insurance;
        }
        if (this.securityOther) {
            const other = [];
            this.securities.forEach((d) => {
                if (d.securityType.toString() === 'OTHER_SECURITY') {
                     other.push(JSON.parse(d.data));
                }
            });
            this.otherArray = other;
        }
        if (this.personal) {
            const personal = [];
            this.securities.forEach((d) => {
                if (d.securityType.toString() === 'PERSONAL_GUARANTEE') {
                    personal.push( JSON.parse(d.data));
                }
            });
            this.personalArray = personal;
        }
        if (this.shareSelected) {
            const share = [];
            this.securities.forEach((d) => {
                if (d.securityType.toString() === 'SHARE_SECURITY') {
                    share.push(JSON.parse(d.data));
                }
            });
            this.shareArray = share;
        }
        if (this.plantSelected) {
            const plant = [];
            this.securities.forEach((d) => {
                if (d.securityType.toString() === 'PLANT_AND_MACHINERY_SECURITY') {
                    plant.push(JSON.parse(d.data));
                }
            });
            this.plantArray = plant;
        }
        if (this.vehicleSelected) {
            const vehicle = [];
            this.securities.forEach((d) => {
                if (d.securityType.toString() === 'VEHICLE_SECURITY') {
                    const data = JSON.parse(d.data);
                    vehicle.push(data);
                    this.totalIndividualSec.vehicle.rv += data.vehicleRealiasableAmount || 0;
                    this.totalIndividualSec.vehicle.fmv += data.fairMarketValue || 0;
                    this.totalIndividualSec.vehicle.mv += data.quotationAmount || 0;
                    this.totalIndividualSec.vehicle.added = true;

                }
            });
            this.vehicleArray =  this.managedArray(vehicle);
        }
    }
    selectedSecurities() {
        if (!ObjectUtil.isEmpty(this.securities)) {
            this.securities.forEach((s, i) => {
                switch (s.securityType.toString()) {
                    case 'APARTMENT_SECURITY': {
                        this.apartmentSelected = true;
                    }
                        break;
                    case 'LAND_SECURITY': {
                        this.landSelected = true;
                    }
                        break;
                    case 'ASSIGNMENT_OF_RECEIVABLES': {
                        this.assignments = true;
                    }
                        break;
                    case 'LAND_BUILDING_SECURITY': {
                        this.landBuilding = true;
                    }
                        break;
                    case 'CORPORATE_GUARANTEE': {
                        this.corporate = true;
                    }
                        break;
                    case 'FIXED_DEPOSIT_RECEIPT': {
                        this.depositSelected = true;
                    }
                        break;
                    case 'HYPOTHECATION_OF_STOCK': {
                        this.hypothecation = true;
                    }
                        break;
                    case 'INSURANCE_POLICY_SECURITY': {
                        this.insurancePolicySelected = true;
                    }
                        break;
                    case 'OTHER_SECURITY': {
                        this.securityOther = true;
                    }
                        break;
                    case 'PERSONAL_GUARANTEE': {
                        this.personal = true;
                    }
                        break;
                    case 'LEASE_ASSIGNMENT': {
                        this.assignments = true;
                    }
                        break;
                    case 'SHARE_SECURITY': {
                        this.shareSelected = true;
                    }
                        break;
                    case 'PLANT_AND_MACHINERY_SECURITY': {
                        this.plantSelected = true;
                    }
                        break;
                    case 'VEHICLE_SECURITY': {
                        this.vehicleSelected = true;
                    }
                        break;
                    default: return;
                }
            });
        }
    }

    setApprovedSecurities() {
        if (this.apartmentSelected) {
            this.approvedSec.forEach((d) => {
                if (d.securityType.toString() === 'APARTMENT_SECURITY') {
                    const data = JSON.parse(d.data);
                    this.totalIndividualSec.apartment.rv += data.buildingReliasableValue || 0;
                    this.totalIndividualSec.apartment.mv += data.buildingDistressValue || 0;
                    this.totalIndividualSec.apartment.fmv += data.fairMarketValue || 0;
                    this.totalIndividualSec.apartment.added = true;
                }
            });
        }
        if (this.landSelected) {
            this.approvedSec.forEach((d, i) => {
                if (d.securityType.toString() === 'LAND_SECURITY') {
                    const data = JSON.parse(d.data);
                    this.totalIndividualSec.land.rv += Number(data.landConsideredValue) || 0;
                    this.totalIndividualSec.land.mv += Number(data.distressValue) || 0;
                    this.totalIndividualSec.land.fmv += Number(data.fairMarketValue) || 0;
                    this.totalIndividualSec.land.added = true;
                }
            });
        }
        if (this.landBuilding) {
            this.approvedSec.forEach((d, i) => {
                if (d.securityType.toString() === 'LAND_BUILDING_SECURITY') {
                    const data = JSON.parse(d.data);
                    this.totalIndividualSec.landBuilding.rv += data.landConsideredValue || 0;
                    this.totalIndividualSec.landBuilding.mv += data.totalMarketValue || 0;
                    this.totalIndividualSec.landBuilding.fmv += (data.distressValue + data.apartmentDistressValue);
                    this.totalIndividualSec.landBuilding.added = true;
                }
            });
        }
        if (this.assignments) {
            this.approvedSec.forEach((d) => {
                if (d.securityType.toString() === 'LEASE_ASSIGNMENT') {
                    const data = JSON.parse(d.data);
                }
            });
        }
        if (this.assignment) {
            this.approvedSec.forEach((d) => {
                if (d.securityType.toString() === 'ASSIGNMENT_OF_RECEIVABLES') {
                    const data = JSON.parse(d.data);
                }
            });
        }
        if (this.corporate) {
            this.approvedSec.forEach((d) => {
                if (d.securityType.toString() === 'CORPORATE_GUARANTEE') {
                    const data = JSON.parse(d.data);
                }
            });
        }
        if (this.depositSelected) {
            this.approvedSec.forEach((d) => {
                if (d.securityType.toString() === 'FIXED_DEPOSIT_RECEIPT') {
                    const data = JSON.parse(d.data);
                }
            });
        }
        if (this.hypothecation) {
            this.approvedSec.forEach((d) => {
                if (d.securityType.toString() === 'HYPOTHECATION_OF_STOCK') {
                    const data = JSON.parse(d.data);
                    this.totalIndividualSec.hypo.rv += data.realiasableValue || 0;
                    this.totalIndividualSec.hypo.fmv += data.fairMarketValue || 0;
                    this.totalIndividualSec.hypo.mv +=  data.fairMarketValue || 0;
                    this.totalIndividualSec.hypo.added = true;
                }
            });
        }
        if (this.insurancePolicySelected) {
            this.approvedSec.forEach((d) => {
                if (d.securityType.toString() === 'INSURANCE_POLICY_SECURITY') {
                }
            });
        }
        if (this.securityOther) {
            this.approvedSec.forEach((d) => {
                if (d.securityType.toString() === 'OTHER_SECURITY') {
                }
            });
        }
        if (this.personal) {
            this.approvedSec.forEach((d) => {
                if (d.securityType.toString() === 'PERSONAL_GUARANTEE') {
                }
            });
        }
        if (this.shareSelected) {
            this.approvedSec.forEach((d) => {
                if (d.securityType.toString() === 'SHARE_SECURITY') {
                }
            });
        }
        if (this.plantSelected) {
            this.approvedSec.forEach((d) => {
                if (d.securityType.toString() === 'PLANT_AND_MACHINERY_SECURITY') {
                }
            });
        }
        if (this.vehicleSelected) {
            this.approvedSec.forEach((d) => {
                if (d.securityType.toString() === 'VEHICLE_SECURITY') {
                    const data = JSON.parse(d.data);
                    this.totalIndividualSec.vehicle.rv += data.vehicleRealiasableAmount || 0;
                    this.totalIndividualSec.vehicle.fmv += data.fairMarketValue || 0;
                    this.totalIndividualSec.vehicle.mv += data.quotationAmount || 0;
                    this.totalIndividualSec.vehicle.added = true;

                }
            });
        }
    }
}
