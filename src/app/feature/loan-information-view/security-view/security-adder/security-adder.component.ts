import {ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {CustomerInfoData} from '../../../loan/model/customerInfoData';
import {LoanDataHolder} from '../../../loan/model/loanData';
import {SecurityLoanReferenceService} from '../../../security-service/security-loan-reference.service';
import {Security} from '../../../loan/model/security';
import {PlantMachineryAdderComponent} from './plant-machinery-adder/plant-machinery-adder.component';
import {LandBuildingAdderComponent} from './land-building-adder/land-building-adder.component';

@Component({
    selector: 'app-security-adder',
    templateUrl: './security-adder.component.html',
    styleUrls: ['./security-adder.component.scss']
})
export class SecurityAdderComponent implements OnInit, OnChanges {
    @Input() customerInfo: CustomerInfoData;
    @Input() loanHolder: LoanDataHolder;
    @Input() proposedAmount: number;
    @ViewChild('plantMachineryAdder', {static: false}) plantMachineryAdder: PlantMachineryAdderComponent;
    @ViewChild('landBuildingAdderComponent', {static: false}) landBuildingAdderComponent: LandBuildingAdderComponent;
    @Output() tagSecurityEmitter = new EventEmitter();
    proposedLimit: number;
    selectedSecurities;
    spinner = false;
    uniqSecurityList: Set<string> = new Set<string>();
    securityList: Array<string> = new Array<string>();
    plantMachinery = false;
    vehicle = false;
    land = false;
    landBuilding = false;
    apartment = false;

    constructor(private fb: FormBuilder,
                private securityLoanReferenceService: SecurityLoanReferenceService,
                private change: ChangeDetectorRef) {
    }

    ngOnInit() {
        console.log(this.customerInfo);
        if (this.customerInfo.securities.length > 0) {
            this.selectedSecurity();
        }
        if (this.customerInfo.securities.length > 0) {
            this.getAllSecurityTypeList();
        }
        if (this.uniqSecurityList.size > 0) {
            this.securityList.push(...this.uniqSecurityList);
        }
    }

    private getAllSecurityTypeList(): void {
        this.customerInfo.securities.forEach((security: Security) => {
            this.uniqSecurityList.add(security.securityType.toString());
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.proposedLimit = changes.proposedAmount.currentValue;
        this.change.detectChanges();
    }

    save() {
        if (this.plantMachinery) {
            this.loanHolder.securities.concat(this.plantMachineryAdder.securityList);
        }
        if (this.landBuilding) {

        }
        this.tagSecurityEmitter.emit(this.loanHolder);
    }

    selectedSecurity() {
        switch (this.selectedSecurities) {
            case 'LAND_SECURITY': {
                this.land = true;
            }
                break;
            case 'VEHICLE_SECURITY': {
                this.vehicle = true;
            }
                break;
            case 'APARTMENT_SECURITY': {
                this.apartment = true;
            }
                break;
            case 'LAND_BUILDING_SECURITY': {
                this.landBuilding = true;
            }
                break;
            case 'PLANT_AND_MACHINERY_SECURITY': {
                this.plantMachinery = true;
            }
                break;
            default :
                return;
        }
    }
}
