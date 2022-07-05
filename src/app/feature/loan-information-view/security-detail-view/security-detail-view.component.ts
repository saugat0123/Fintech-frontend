import {Component, Input, OnInit} from '@angular/core';
import {Security} from '../../loan/model/security';
import {NepseMaster} from '../../admin/modal/NepseMaster';
import {environment} from '../../../../environments/environment';
import {Clients} from '../../../../environments/Clients';
import {OwnershipTransfer} from '../../loan/model/ownershipTransfer';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {LoanDataHolder} from '../../loan/model/loanData';
import {DocStatus} from '../../loan/model/docStatus';
import {SecurityLoanReferenceService} from '../../security-service/security-loan-reference.service';

@Component({
  selector: 'app-security-detail-view',
  templateUrl: './security-detail-view.component.html',
  styleUrls: ['./security-detail-view.component.scss']
})
export class SecurityDetailViewComponent implements OnInit {
  @Input() securities: Array<Security>;
  @Input() customerAllLoanList: LoanDataHolder [];
  @Input() pending;
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

  constructor(private securityLoanReference: SecurityLoanReferenceService) {
  }

  ngOnInit() {
    if (this.customerAllLoanList.length > 0) {
      this.securities = [];
      if (this.pending) {
        this.combineAllSecurity();
        this.selectedSecurities();
        this.setSelectedSecurities();
      } else {
        this.combinedAllApprovedSecurity();
      }
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
          apartment.push(JSON.parse(d.data));
        }
      });
      this.apartmentArray = this.managedArray(apartment);
    }
    if (this.landSelected) {
      const land = [];
      this.securities.forEach((d) => {
        if (d.securityType.toString() === 'LAND_SECURITY') {
          land.push(JSON.parse(d.data));
        }
      });
      this.landArray = this.managedArray(land);
    }
    if (this.landBuilding) {
      const landBuilding = [];
      this.securities.forEach((d) => {
        if (d.securityType.toString() === 'LAND_BUILDING_SECURITY') {
          landBuilding.push(JSON.parse(d.data));
        }
      });
      this.landBuildingArray = this.managedArray(landBuilding);
    }
    if (this.assignments) {
      const lease = [];
      this.securities.forEach((d) => {
        if (d.securityType.toString() === 'LEASE_ASSIGNMENT') {
          lease.push(JSON.parse(d.data));
        }
      });
      this.leaseArray = lease;
    }
    if (this.assignment) {
      const assignment = [];
      this.securities.forEach((d) => {
        if (d.securityType.toString() === 'ASSIGNMENT_OF_RECEIVABLES') {
          assignment.push(JSON.parse(d.data));
        }
      });
      this.assignmentArray = assignment;
    }
    if (this.corporate) {
      const corporate = [];
      this.securities.forEach((d) => {
        if (d.securityType.toString() === 'CORPORATE_GUARANTEE') {
          corporate.push(JSON.parse(d.data));
        }
      });
      this.corporateArray = corporate;
    }
    if (this.depositSelected) {
      const fd = [];
      this.securities.forEach((d) => {
        if (d.securityType.toString() === 'FIXED_DEPOSIT_RECEIPT') {
          fd.push(JSON.parse(d.data));
        }
      });
      this.fdArray = fd;
    }
    if (this.hypothecation) {
      const hypo = [];
      this.securities.forEach((d) => {
        if (d.securityType.toString() === 'HYPOTHECATION_OF_STOCK') {
          hypo.push(JSON.parse(d.data));
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
          vehicle.push(JSON.parse(d.data));

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
  combineAllSecurity() {
    this.customerAllLoanList.forEach((ld) => {
      if (ld.documentStatus.toString() !== DocStatus.value(DocStatus.APPROVED) && ld.securities.length > 0) {
        ld.securities.forEach((s) => {
          this.securities.push(s);
        });
      }
    });
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
}
