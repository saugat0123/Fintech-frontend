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
    totalFreeLimitAuto = 0;
    approvedShareSecurity: any;

    constructor(private fb: FormBuilder) {
    }

    ngOnInit() {
        this.buildForm();
        this.customerShareData = this.shareSecurityData.customerShareData;
        this.approvedShareSecurity = JSON.parse(this.shareSecurityData.approvedData).shareSecurityDetails;
        if (!ObjectUtil.isEmpty(this.loanHolder.selectedArray)) {
            this.selectedSecurities = JSON.parse(this.loanHolder.selectedArray);
            this.selectedSecurity();
        }
        if (!ObjectUtil.isEmpty(this.customerInfo.landBuildings)) {
            this.setLandBuildingDetail();
        }
        if (!ObjectUtil.isEmpty(this.customerInfo.autos)) {
            this.setAutoDetail();
        }
    }

    private buildForm(): FormGroup {
        return this.form = this.fb.group({
            landBuildingForm: this.fb.array([]),
            autoForm: this.fb.array([])
        });
    }

    get landBuildingForm(): FormArray {
        return this.form.get('landBuildingForm') as FormArray;
    }

    get autoForm(): FormArray {
        return this.form.get('autoForm') as FormArray;
    }

    public setLandBuildingDetail(): void {
        const arrayForm = this.form.get('landBuildingForm') as FormArray;
        this.customerInfo.landBuildings.forEach((singleData: any) => {
            arrayForm.push(this.fb.group({
                id: [singleData.id],
                addressLine1: [singleData.addressLine1],
                addressLine2: [singleData.addressLine2],
                buildingValuator: [singleData.buildingValuator],
                considerValue: [singleData.considerValue],
                data: [singleData.data],
                distressValue: [singleData.distressValue],
                district: [singleData.district],
                freeLimit: [singleData.freeLimit],
                geoLocation: [singleData.geoLocation],
                governmentRate: [singleData.governmentRate],
                marketRate: [singleData.marketRate],
                marketValue: [singleData.marketValue],
                municipalityVdc: [singleData.municipalityVdc],
                plotNumber: [singleData.plotNumber],
                province: [singleData.province],
                registerOffice: [singleData.registerOffice],
                sheetNo: [singleData.sheetNo],
                usedAmount: [singleData.usedAmount],
            }));
        });
    }

    public setAutoDetail(): void {
        const arrayForm = this.form.get('autoForm') as FormArray;
        this.customerInfo.autos.forEach((singleData: any) => {
            arrayForm.push(this.fb.group({
                id: [singleData.id],
                chassisNumber: [singleData.chassisNumber],
                considerValue: [singleData.considerValue],
                data: [singleData.data],
                discountPrice: [singleData.discountPrice],
                engineNumber: [singleData.engineNumber],
                freeLimit: [singleData.freeLimit],
                isNew: [singleData.isNew],
                manufactureYear: [singleData.manufactureYear],
                model: [singleData.model],
                quotationAmount: [singleData.quotationAmount],
                usedAmount: [singleData.usedAmount],
                vehicalValuator: [singleData.vehicalValuator],
            }));
        });
    }

    removeAutoSecurity(idx) {
        this.loanHolder.autos.splice(idx, 1);
        this.selectedSecurity();
    }

    removeLandBuilding(idx) {
        this.loanHolder.landBuildings.splice(idx, 1);
        this.selectedSecurity();
    }

    removeShareSecurity(data) {
        const removeIndex = this.findShareSecurityIndex(data);
        this.approvedShareSecurity.splice(removeIndex, 1);
    }

    findShareSecurityIndex(data) {
        return this.approvedShareSecurity.indexOf(this.approvedShareSecurity.filter(
            d => d.totalShareUnit.toString() === data.totalShareUnit.toString() && d.companyName === data.companyName)[0]);
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
                        this.auto = true;
                        this.autoId = [];
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
            this.loanHolder.autos.push(security.value);
        }
        if (key === 'landBuilding') {
            this.loanHolder.landBuildings.push(security.value);
        }
        this.selectedSecurity();
        }

        public calcFreeLimitForLandBuilding(index: number, considerValue: number,  value: any): void {
            let freeLimit = considerValue;
            freeLimit -= value;
            this.totalFreeLimit = considerValue;
            this.totalFreeLimit -= value;
            this.form.get(['landBuildingForm', index, 'freeLimit']).setValue(freeLimit);
        }

        public calculateFreeLimitForAuto(index: number, considerValue: number,  value: any): void {
            let freeLimit = considerValue;
            freeLimit -= value;
            this.totalFreeLimitAuto = considerValue;
            this.totalFreeLimitAuto -= value;
            this.form.get(['autoForm', index, 'freeLimit']).setValue(freeLimit);
        }
}
