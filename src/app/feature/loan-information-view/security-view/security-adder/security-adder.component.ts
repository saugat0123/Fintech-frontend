import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {CustomerInfoData} from '../../../loan/model/customerInfoData';
import {LoanDataHolder} from '../../../loan/model/loanData';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';

@Component({
    selector: 'app-security-adder',
    templateUrl: './security-adder.component.html',
    styleUrls: ['./security-adder.component.scss']
})
export class SecurityAdderComponent implements OnInit {

    @Input() security;
    @Input() shareSecurityData;
    @Input() taggedShareSecurities;
    @Input() customerInfo: CustomerInfoData;
    @Input() loanHolder: LoanDataHolder;
    customerShareData: any;
    selectedShareSecurityList: any;
    securityList: any;
    msg = '';
    @Output() saveShareSecurity = new EventEmitter();

    selectedSecurities;
    landBuilding = false;
    auto = false;
    share = false;
    autoId = [];
    landBuildingId  = [];
    constructor() {
    }

    ngOnInit() {
        console.log('this is loan holder', this.loanHolder);
        if (!ObjectUtil.isEmpty(this.loanHolder.selectedArray)) {
            this.selectedSecurities = JSON.parse(this.loanHolder.selectedArray);
            this.selectedSecurity();
        }
    }

    removeAutoSecurity(id) {
        this.loanHolder.autos.splice(this.findIndex(this.loanHolder.autos, id), 1);
        this.selectedSecurity();
    }

    removeLandBuilding(id) {
        this.loanHolder.landBuildings.splice(this.findIndex(this.loanHolder.landBuildings, id), 1);
        this.selectedSecurity();
    }

    findIndex(array, id) {
        return array.indexOf(array.filter(
            d => d.id === id));
    }
    save() {
        this.loanHolder.selectedArray = JSON.stringify(this.selectedSecurities);
        this.saveShareSecurity.emit(this.loanHolder);
    }

    selectedSecurity() {
        this.landBuilding = false;
        this.auto = false;
        this.share = false;
            switch (this.selectedSecurities) {
                case 'Land and Building Security': {
                    this.landBuilding = true;
                    this.landBuildingId = [];
                    if (!ObjectUtil.isEmpty(this.loanHolder.landBuildings)) {
                        this.loanHolder.landBuildings.forEach((da: any) => {
                            this.landBuildingId.push(da.id);
                        });
                    }
                }
                    break;
                case 'VehicleSecurity': {
                    this.auto = true;
                    if (!ObjectUtil.isEmpty(this.loanHolder.autos)) {
                        this.loanHolder.autos.forEach((da: any) => {
                            this.autoId.push(da.id);
                        });
                    }
                }
                    break;
                default :
                    return;
            }

    }

    tagSecurity(security, key) {
        switch (key) {
            case 'auto': {
                this.loanHolder.autos.push(security);
            }
            break;
            case 'landBuilding': {
                this.loanHolder.landBuildings.push(security);
            }
        }
        this.selectedSecurity();
    }
}
