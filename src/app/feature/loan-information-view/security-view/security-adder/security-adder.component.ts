import {ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {CustomerInfoData} from '../../../loan/model/customerInfoData';
import {LoanDataHolder} from '../../../loan/model/loanData';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {SecurityLoanReferenceService} from '../../../security-service/security-loan-reference.service';
import {Security} from '../../../loan/model/security';
import {SecuritiesType} from '../../../constants/securities-type';

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
    msg = '';
    @Output() tagSecurityEmitter = new EventEmitter();

    selectedSecurities;
    landBuilding = false;
    auto = false;
    share = false;
    autoId = [];
    landBuildingId = [];
    considerValue = 0;
    approvedShareSecurity: any;
    toggleArray: { toggled: boolean, security: any }[] = [];
    spinner = false;
    tagged;
    limitExceed = [];
    isUsedAmount = [];
    coveragePercent = [];
    securityPresent = [];
    uniqSecurityList: Set<string> = new Set<string>();
    securityList: Array<string> = new Array<string>();

    constructor(private fb: FormBuilder,
                private securityLoanReferenceService: SecurityLoanReferenceService,
                private change: ChangeDetectorRef) {
    }

    ngOnInit() {
        console.log(this.customerInfo);
        this.buildForm();
        // this.customerShareData = this.shareSecurityData.customerShareData;
        // this.approvedShareSecurity = JSON.parse(this.shareSecurityData.approvedData).shareSecurityDetails;
        if (this.customerInfo.securities.length > 0) {
            // this.selectedSecurities = JSON.parse(this.customerInfo.selectedArray)[0];
            console.log('inside security');
            this.selectedSecurity();
            this.toggleSecurity();
        }
        if (!ObjectUtil.isEmpty(this.customerInfo.landBuildings)) {
            this.setLandBuildingDetail();
        }
        if (!ObjectUtil.isEmpty(this.customerInfo.autos)) {
            this.setAutoDetail();
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
        this.coveragePercent.splice(idx, 1);
        this.totalCoverage();
    }

    removeLandBuilding(idx) {
        this.loanHolder.landBuildings.splice(idx, 1);
        this.selectedSecurity();
        this.coveragePercent.splice(idx, 1);
        this.totalCoverage();
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
        // this.loanHolder.selectedArray = JSON.stringify(this.selectedSecurities);
        this.tagSecurityEmitter.emit(this.loanHolder);
    }

    selectedSecurity() {
        this.landBuilding = false;
        this.auto = false;
        this.share = false;
        switch (this.selectedSecurities) {
            // land building security
            case 'LAND_BUILDING_SECURITY': {
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
            // vehicle security
            case 'VEHICLE_SECURITY': {
                this.auto = true;
                if (!ObjectUtil.isEmpty(this.loanHolder.autos)) {
                    this.auto = true;
                    this.autoId = [];
                    this.loanHolder.autos.forEach((da: any) => {
                        this.autoId.push(da.id);
                    });
                }
                this.setLimitExceed(this.customerInfo.autos);
            }
                break;
            default :
                return;
        }

    }

    toggleSecurity() {
        this.toggleArray = [];
        switch (this.selectedSecurities) {
            // land building security
            case 'LAND_BUILDING_SECURITY': {
                this.setToggled(this.customerInfo.landBuildings);
            }
                break;
            // vehicle security
            case 'VEHICLE_SECURITY': {
                this.setToggled(this.customerInfo.autos);
            }
                break;
            default :
                return;
        }

    }

    public totalCoverage(): number {
        let percent = 0;
     this.coveragePercent.forEach(v => {
         percent += v.percent;
     });
     return Number(percent.toFixed(2));
    }

    public tagSecurity(security: any, key, idx: number): void {
        if (security.value.usedAmount <= 0) {
            this.isUsedAmount[idx] = true;
            return;
        }
        if (key === 'auto') {
            if (this.loanHolder.autos.length > 0) {
                this.loanHolder.autos.splice(idx, 1);
                this.coveragePercent.splice(idx, 1);
            }
            const coverage = this.calculateLoanForAutoBuildingCoverage(security.value.usedAmount);
            this.form.get(['autoForm', idx, 'coverage']).setValue(Number(coverage.toFixed(2)));
            this.loanHolder.autos.push(security.value);
            this.coveragePercent.push({percent: coverage});
        }
        if (key === 'landBuilding') {
            if (this.loanHolder.landBuildings.length > 0) {
                this.loanHolder.landBuildings.splice(idx, 1);
                this.coveragePercent.splice(idx, 1);
            }
            const coverage = this.calculateLoanForLandBuildingCoverage(security.value.usedAmount);
            this.form.get(['landBuildingForm', idx, 'coverage']).setValue(Number(coverage.toFixed(2)));
            this.loanHolder.landBuildings.push(security.value);
            this.coveragePercent.push({percent: coverage});
        }
        this.selectedSecurity();
        this.totalCoverage();
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
            this.securityPresent[i] = this.toggleArray[i].security.length > 0;
        }, (err) => {
            this.spinner = false;
        });
    }


    public calcFreeLimit(index: number, freeLimit: number, usedAmount: number, formControlName: string): void {
        freeLimit -= usedAmount;
        const coverage = (usedAmount / this.proposedLimit) * 100;
        this.limitExceed[index] = freeLimit < 0;
        this.isUsedAmount[index] = false;
        this.form.get([formControlName, index, 'freeLimit']).setValue(freeLimit);
        this.form.get([formControlName, index, 'coverage']).setValue(coverage.toFixed(2));
    }
    setLimitExceed(array) {
        this.limitExceed = [];
        array.forEach((s: any) => {
          this.limitExceed.push(s.freeLimit < 0);
        });
    }
}