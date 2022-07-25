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
import {Exposure} from '../../../../credit-administration/model/Exposure';
import {ExistingExposure} from '../../../model/existingExposure';


@Component({
    selector: 'app-security-summary',
    templateUrl: './security-summary.component.html',
    styleUrls: ['./security-summary.component.scss']
})
export class SecuritySummaryComponent implements OnInit {
    @Input() securities;
    @Input() pending;
    isPrintable = 'YES';
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
    constructor() {
    }

    ngOnInit() {
            if (!ObjectUtil.isEmpty(this.securities)) {
            const proposedSecurity = this.securities.map(d => d.id);
            this.securities =  this.securities
                .filter((value, index) => proposedSecurity.indexOf(value.id) === index);
            this.selectedSecurities();
            this.setSelectedSecurities();
        }
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
                    const data = JSON.parse(d.data);
                    plant.push(data);
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
}
