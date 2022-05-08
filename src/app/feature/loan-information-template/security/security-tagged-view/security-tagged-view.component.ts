import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../loan/model/loanData';
import {Proposal} from '../../../admin/modal/proposal';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-security-tagged-view',
  templateUrl: './security-tagged-view.component.html',
  styleUrls: ['./security-tagged-view.component.scss']
})
export class SecurityTaggedViewComponent implements OnInit {
  @Input() loanDataHolder: LoanDataHolder;
  hasLandBuilding = false;
  hasAuto = false;
  hasLand = false;
  hasHypothecation = false;
  hasCorporate = false;
  hasPersonal = false;
  hasApartment = false;
  hasPlant = false;
  hasDeposit = false;
  hasShare = false;
  hasInsurancePolicy;
  totalConsideredValue = 0;
  hasSecurityOther: any;
  hasAssignment = false;
  hasLease = false;
  files;
  proposal: Proposal;
  security;
  iniitialForm;
  constructor() { }
  ngOnInit() {
    this.security = JSON.parse(this.loanDataHolder.loanHolder.security.data);
    this.iniitialForm = this.security.initialForm;
    this.checkSecurity();
  //   this.hasLandBuilding = this.checkIndividualSecurity(this.loanDataHolder.landBuildings);
  //   this.hasAuto = this.checkIndividualSecurity(this.loanDataHolder.autos);
    this.proposal = this.loanDataHolder.proposal;
    if (!ObjectUtil.isEmpty(this.proposal.data)) {
      if (!ObjectUtil.isEmpty(JSON.parse(this.proposal.data).files)) {
        this.files = JSON.parse(JSON.parse(this.proposal.data).files);
      }
    }
  }

  checkSecurity() {
    // for old security json
    console.log(this.iniitialForm);
    this.security.selectedArray.forEach((d) => {
      switch (d) {
        case 'Land and Building Security': {
          this.hasLandBuilding = this.checkIndividualSecurity(this.iniitialForm.landBuilding);
        }
          break;
        case 'VehicleSecurity': {
          this.hasAuto = this.checkIndividualSecurity(this.iniitialForm.vehicleDetails);
        }
          break;
        case 'LandSecurity': {
          this.hasLand = this.checkIndividualSecurity(this.iniitialForm.landDetails);
        }
          break;
        case 'ApartmentSecurity': {
          this.hasApartment = this.checkIndividualSecurity(this.iniitialForm.buildingDetails);
        }
          break;
        case 'PlantSecurity': {
          this.hasPlant = this.checkIndividualSecurity(this.iniitialForm.plantDetails);
        }
          break;
        case 'ShareSecurity': {
          const shareSecurity = JSON.parse(this.loanDataHolder.loanHolder.shareSecurity.data);
          this.hasShare = this.checkIndividualSecurity(shareSecurity.shareSecurityDetails);
        }
          break;
        case 'FixedDeposit': {
          this.hasDeposit = this.checkIndividualSecurity(this.iniitialForm.fixedDepositDetails);
        }
          break;
        case 'HypothecationOfStock': {
          this.hasHypothecation = this.checkIndividualSecurity(this.iniitialForm.hypothecationOfStock);
        }
          break;
        case 'LeaseAssignment': {
          this.hasLease = this.checkIndividualSecurity(this.iniitialForm.leaseAssignment);
        }
          break;
        case 'OtherSecurity': {
          this.hasSecurityOther = this.checkIndividualSecurity(this.iniitialForm.otherSecurity);
        }
          break;
        case 'CorporateGuarantee': {
          this.hasCorporate = this.checkIndividualSecurity(this.iniitialForm.corporateGuarantee);
        }
          break;
        case 'PersonalGuarantee': {
          this.hasPersonal = this.checkIndividualSecurity(this.iniitialForm.personalGuarantee);
        }
          break;
        case 'InsurancePolicySecurity': {
          this.hasInsurancePolicy = this.checkIndividualSecurity(this.iniitialForm.insurancePolicy);
        }
          break;
        case 'AssignmentOfReceivables': {
          this.hasAssignment = this.checkIndividualSecurity(this.iniitialForm.assignmentOfReceivables);
        }
          break;
        default:
          return;

      }
    });
  }
  checkIndividualSecurity(array: Array<any>) {
    if (!ObjectUtil.isEmpty(array)) {
      return array.length > 0;
    }
  }
}
