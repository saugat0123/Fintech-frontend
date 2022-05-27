import {ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {CustomerInfoData} from '../../../loan/model/customerInfoData';
import {LoanDataHolder} from '../../../loan/model/loanData';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {Auto} from '../../../loan/model/Auto';
import {LandBuilding} from '../../../loan/model/LandBuilding';
import {SecurityLoanReferenceService} from '../../../security-service/security-loan-reference.service';

@Component({
    selector: 'app-security-adder',
    templateUrl: './security-adder.component.html',
    styleUrls: ['./security-adder.component.scss']
})
export class SecurityAdderComponent implements OnInit, OnChanges {
    form: FormGroup;
    @Input() security;
    @Input() shareSecurityData;
    @Input() taggedShareSecurities;
    @Input() customerInfo: CustomerInfoData;
    @Input() loanHolder: LoanDataHolder;
    @Input() proposedAmount: number;
    proposedLimit: number;
    customerShareData: any;
    selectedShareSecurityList: any;
    securityList: any;
    msg = '';
    @Output() tagSecurityEmitter = new EventEmitter();

    selectedSecurities;
    landBuilding = false;
    auto = false;
    share = false;
    autoId = [];
    landBuildingId = [];
    autoSecurity: Auto;
    landBuildingSecurity: LandBuilding;
    considerValue = 0;
    isLimitExceed = false;
    totalFreeLimit = 0;
    totalFreeLimitAuto = 0;
    approvedShareSecurity: any;
    isAutoFreeLimitExceed = [];
    isLandBuildingFreeLimitExceed = [];
    listSecurities = [{value: 'Land and Building Security'}, {value: 'VehicleSecurity'}];
    toggleArray: { toggled: boolean, security: any }[] = [];
    spinner = false;
    tagged;
    limitExceed = [];

    constructor(private fb: FormBuilder,
                private securityLoanReferenceService: SecurityLoanReferenceService,
                private change: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.buildForm();
        // this.customerShareData = this.shareSecurityData.customerShareData;
        if (!ObjectUtil.isEmpty(this.customerInfo.selectedArray)) {
            this.selectedSecurities = JSON.parse(this.customerInfo.selectedArray);
            this.selectedSecurity();
            this.toggleSecurity();
        }
        if (!ObjectUtil.isEmpty(this.customerInfo.landBuildings)) {
            this.setLandBuildingDetail();
        }
        if (!ObjectUtil.isEmpty(this.customerInfo.autos)) {
            this.setAutoDetail();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        // this.proposedLimit = changes.proposedAmount.currentValue;
        this.change.detectChanges();
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
            if (ObjectUtil.isEmpty(singleData.freeLimit)) {
                singleData.freeLimit = singleData.considerValue;
            }
            arrayForm.push(this.fb.group({
                id: [singleData.id],
                version: [singleData.version],
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
                usedAmount: [undefined],
                registerOffice: [singleData.registerOffice],
                sheetNo: [singleData.sheetNo],
                coverage: [singleData.coverage],
            }));
        });
    }

    public setAutoDetail(): void {
        const arrayForm = this.form.get('autoForm') as FormArray;
        this.customerInfo.autos.forEach((singleData: any) => {
            if (ObjectUtil.isEmpty(singleData.freeLimit)) {
                singleData.freeLimit = singleData.considerValue;
            }
            arrayForm.push(this.fb.group({
                id: [singleData.id],
                version: [singleData.version],
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
                usedAmount: [undefined],
                coverage: [singleData.coverage],
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
        this.tagSecurityEmitter.emit(this.loanHolder);
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
                this.setLimitExceed(this.customerInfo.landBuildings);
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
                this.setLimitExceed(this.customerInfo.landBuildings);
            }
                break;
            default :
                return;
        }

    }

    toggleSecurity() {
        this.toggleArray = [];
        switch (this.selectedSecurities) {
            case 'Land and Building Security': {
                this.setToggled(this.customerInfo.landBuildings);
            }
                break;
            case 'VehicleSecurity': {
                this.setToggled(this.customerInfo.autos);
            }
                break;
            default :
                return;
        }

    }

    public tagSecurity(security: any, key, idx: number): void {
        if (key === 'auto') {
            if (this.loanHolder.autos.length > 0) {
                this.loanHolder.autos.splice(idx, 1);
            }
            const coverage = this.calculateLoanForAutoBuildingCoverage(security.value.usedAmount);
            this.form.get(['autoForm', idx, 'coverage']).setValue(Number(coverage.toFixed(8)));
            this.loanHolder.autos.push(security.value);
        }
        if (key === 'landBuilding') {
            if (this.loanHolder.landBuildings.length > 0) {
                this.loanHolder.landBuildings.splice(idx, 1);
            }
            const coverage = this.calculateLoanForLandBuildingCoverage(security.value.usedAmount);
            this.form.get(['landBuildingForm', idx, 'coverage']).setValue(Number(coverage.toFixed(8)));
            this.loanHolder.landBuildings.push(security.value);
        }
        this.selectedSecurity();
        // this.tagSecurityEmitter.emit(this.loanHolder);
    }

    private calculateLoanForLandBuildingCoverage(usedAmount): number {
        let coverage = 0;
        coverage = (usedAmount / this.proposedLimit) * 100;
        return coverage;
    }

    private calculateLoanForAutoBuildingCoverage(usedAmount): number {
        let coverage = 0;
        coverage = (usedAmount / this.proposedLimit) * 100;
        return coverage;
    }

    setToggled(array) {
        this.toggleArray = [];
        array.forEach((a, i) => {
            this.toggleArray.push({toggled: false, security: null});
            this.getSecurityDetails(a.id, i);
        });
    }

    getSecurityDetails(id, i) {
        this.spinner = true;
        this.securityLoanReferenceService.getAllSecurityLoanReferences(Number(id)).subscribe(res => {
            this.spinner = false;
            this.toggleArray[i].security = res.detail;
        }, (err) => {
            this.spinner = false;
        });
    }


    public calcFreeLimit(index: number, considerValue: number, usedAmount: number, formControlName: string): void {
        let freeLimit = considerValue;
        freeLimit -= usedAmount;
        const coverage = (usedAmount / this.proposedLimit) * 100;
        this.limitExceed[index] = freeLimit < 0;
        this.form.get([formControlName, index, 'freeLimit']).setValue(freeLimit);
        this.form.get([formControlName, index, 'coverage']).setValue(coverage.toFixed(8));
    }
    setLimitExceed(array) {
        this.limitExceed = [];
        array.forEach((s: any) => {
          this.limitExceed.push(s.freeLimit < 0);
        });
    }
}
