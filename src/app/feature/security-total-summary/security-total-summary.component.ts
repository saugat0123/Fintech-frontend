import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ExistingExposure} from '../loan/model/existingExposure';
import {ObjectUtil} from '../../@core/utils/ObjectUtil';
import {Security} from '../loan/model/security';
import {LoanDataHolder} from '../loan/model/loanData';
import {CustomerInfoData} from '../loan/model/customerInfoData';
import {Clients} from '../../../environments/Clients';

@Component({
    selector: 'app-security-total-summary',
    templateUrl: './security-total-summary.component.html',
    styleUrls: ['./security-total-summary.component.scss']
})
export class SecurityTotalSummaryComponent implements OnInit {
    @Input() securities;
    @Input() customerAllLoanList: LoanDataHolder[];
    @Input() loanHolder: CustomerInfoData;
    @Input() approvedSec;
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
    fixedAssets: number;
    totalProposedLimit = 0;
    landSelected = false;
    apartmentSelected = false;
    plantSelected = false;
    vehicleSelected = false;
    depositSelected = false;
    shareSelected = false;
    hypothecation = false;
    securityOther = false;
    corporate = false;
    personal = false;
    landBuilding = false;
    insurancePolicySelected = false;
    clientName = Clients;
    assignment = false;
    otherDetail: any;
    assignments = false;
  constructor() {
  }
    ngOnInit() {
        this.approvedSec = this.approvedSec.concat(this.securities);
        this.subKey.pop();
        // getting total proposed limit
        this.selectedSecurities();
        this.setApprovedSecurities();
        this.customerAllLoanList.forEach((d) => {
            this.totalProposedLimit += d.withIn ? 0 : JSON.parse(d.proposal.data).proposedLimit;
        });
        if (!ObjectUtil.isEmpty(this.loanHolder.customerShareBatches) &&
            this.loanHolder.customerShareBatches.length > 0) {
            this.loanHolder.customerShareBatches[0].shareSecurity.forEach((share) => {
                this.totalIndividualSec.share.fmv += JSON.parse(share.data).totalFmv ? JSON.parse(share.data).totalFmv : 0;
                this.totalIndividualSec.share.mv += JSON.parse(share.data).totalFmv ? JSON.parse(share.data).totalFmv : 0;
                // tslint:disable-next-line:max-line-length
                this.totalIndividualSec.share.rv += JSON.parse(share.data).totalRealizableAmount ? JSON.parse(share.data).totalRealizableAmount : 0;
                this.totalIndividualSec.share.added = true;
            });
        }
        this.keys.forEach(k => {
            if (this.totalIndividualSec[k].added && k !== 'total') {
                this.subKey.forEach(sk => {
                    this.totalIndividualSec.total[sk] += Number(this.totalIndividualSec[k][sk]);
                });
            }
        });
        this.fixedAssets = this.totalIndividualSec.total.rv - Number(this.totalProposedLimit);
        if (this.fixedAssets < 0) {
            this.fixedAssets = Math.abs(this.fixedAssets);
        } else {
            this.fixedAssets = 0;
        }
    }

    selectedSecurities() {
        if (!ObjectUtil.isEmpty(this.approvedSec)) {
            this.approvedSec.forEach((s, i) => {
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
                    default:
                        return;
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
                    this.totalIndividualSec.fd.rv += data.realizableValue || 0;
                    this.totalIndividualSec.fd.fmv += data.fairMarketValue || 0;
                    this.totalIndividualSec.fd.mv += data.fairMarketValue || 0;
                    this.totalIndividualSec.fd.added = true;
                }
            });
        }
        if (this.hypothecation) {
            this.approvedSec.forEach((d) => {
                if (d.securityType.toString() === 'HYPOTHECATION_OF_STOCK') {
                    const data = JSON.parse(d.data);
                    this.totalIndividualSec.hypo.rv += data.realiasableValue || 0;
                    this.totalIndividualSec.hypo.fmv += data.fairMarketValue || 0;
                    this.totalIndividualSec.hypo.mv += data.fairMarketValue || 0;
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
                    const data = JSON.parse(d.data);
                    this.totalIndividualSec.plant.rv += data.quotation || 0;
                    this.totalIndividualSec.plant.fmv += data.fairMarketValue || 0;
                    this.totalIndividualSec.plant.mv += data.fairMarketValue || 0;
                    this.totalIndividualSec.plant.added = true;
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
