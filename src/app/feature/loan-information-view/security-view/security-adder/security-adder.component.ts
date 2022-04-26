import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {CustomerInfoData} from '../../../loan/model/customerInfoData';
import {LoanDataHolder} from '../../../loan/model/loanData';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {Auto} from '../../../loan/model/Auto';
import {LandBuilding} from '../../../loan/model/LandBuilding';

@Component({
    selector: 'app-security-adder',
    templateUrl: './security-adder.component.html',
    styleUrls: ['./security-adder.component.scss']
})
export class SecurityAdderComponent implements OnInit {
    form: FormGroup;
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
    autoSecurity: Auto;
    landBuildingSecurity: LandBuilding;
    considerValue = 0;
    isLimitExceed = false;
    totalFreeLimit = 0;

    constructor(private fb: FormBuilder) {
    }

    ngOnInit() {
        this.buildForm();
        if (!ObjectUtil.isEmpty(this.loanHolder.selectedArray)) {
            this.selectedSecurities = JSON.parse(this.loanHolder.selectedArray);
            this.selectedSecurity();
        }
        if (!ObjectUtil.isEmpty(this.customerInfo.landBuildings)) {
            this.setLandBuildingDetail();
        }
    }

    private buildForm(): FormGroup {
        return this.form = this.fb.group({
            landBuildingForm: this.fb.array([])
        });
    }

    get landBuildingForm(): FormArray {
        return this.form.get('landBuildingForm') as FormArray;
    }

    public landBuildingFormGroup(): FormGroup {
        return  this.form = this.fb.group({
            usedAmount: [undefined],
            freeLimit: [undefined],
            considerValue: [undefined],
            fairMarketValue: [undefined],
            governmentRate: [undefined],
            geoLocation: [undefined],
            name: [undefined],
        });
    }

    public setLandBuildingDetail(): void {
        const arrayForm = this.form.get('landBuildingForm') as FormArray;
        this.customerInfo.landBuildings.forEach((singleData: any) => {
            arrayForm.push(this.fb.group({
                usedAmount: [singleData.usedAmount],
                freeLimit: [singleData.freeLimit],
                considerValue: [singleData.considerValue],
                fairMarketValue: [singleData.marketValue],
                governmentRate: [singleData.governmentRate],
                geoLocation: [singleData.geoLocation],
                name: [singleData.district.name]
            }));
        });
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

    public tagSecurity(security: any, key): void {
        if (key === 'auto') {
            this.autoSecurity = security;
        }
        if (key === 'landBuilding') {
            this.landBuildingSecurity = security;
        }
        // switch (key) {
        //     case 'auto': {
        //         this.loanHolder.autos.push(security);
        //     }
        //         break;
        //     case 'landBuilding': {
        //         this.loanHolder.landBuildings.push(security);
        //     }
        // }
        // this.selectedSecurity();
        }

        public onSubmit(): void {
            // submit logic goes here

        }

        public calculateFreeLimit(val: number): void {
            let freeLimit = this.considerValue;
            freeLimit -= val;
            this.totalFreeLimit = this.considerValue;
            this.totalFreeLimit -= val;
            this.isLimitExceed = this.totalFreeLimit < 0;
            this.form.get('freeLimit').setValue(freeLimit);
        }

        public calc(index: number, considerValue: number,  value: any): void {
            let freeLimit = considerValue;
            freeLimit -= value;
            this.totalFreeLimit = considerValue;
            this.totalFreeLimit -= value;
            this.form.get(['landBuildingForm', index, 'freeLimit']).setValue(freeLimit);
        }
}
