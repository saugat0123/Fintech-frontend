import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CalendarType} from '../../../../@core/model/calendar-type';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {LocalStorageUtil} from '../../../../@core/utils/local-storage-util';
import {ValuatorService} from '../../../admin/component/valuator/valuator.service';
import {SecurityValuator} from '../../../loan/model/securityValuator';
import {BranchService} from '../../../admin/component/branch/branch.service';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {ToastService} from '../../../../@core/utils';
import {RoleService} from '../../../admin/component/role-permission/role.service';
import {NumberUtils} from '../../../../@core/utils/number-utils';
import {Security} from '../../../loan/model/security';

@Component({
    selector: 'app-vehicle',
    templateUrl: './vehicle.component.html',
    styleUrls: ['./vehicle.component.scss']
})
export class VehicleComponent implements OnInit {
    vehicleForm: FormGroup;
    submitted = false;
    @Input() calendarType: CalendarType;
    landOtherBranchChecked = false;
    vehicleOtherBranchChecked = false;
    securityValuator: SecurityValuator = new SecurityValuator();
    branchLists;
    designationList = [];
    spinner = false;
    @Input() security: Security;
    @Input() isEdit = false;

    constructor(private valuatorService: ValuatorService,
                private branchService: BranchService,
                private toastService: ToastService,
                private roleService: RoleService,
                private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.buildForm();
        this.branchList();
        this.getRoleList();
        if (this.isEdit) {
            this.setVehicleDetail();
        } else {
            this.addVehicleSecurity();
        }
    }

    setVehicleDetail() {
        const formData = JSON.parse(this.security.data);
        const vehicleForm = this.vehicleForm.get('vehicleDetails') as FormArray;
        vehicleForm.push(
            this.formBuilder.group({
                model: [formData.model],
                registrationNumber: [formData.registrationNumber],
                registrationDate: [formData.registrationDate],
                engineNo: [formData.engineNo],
                chasisNo: [formData.chasisNo],
                quotationAmount: [formData.quotationAmount],
                downPayment: [formData.downPayment],
                remainingAmount: [formData.remainingAmount],
                loanExposure: [formData.loanExposure],
                showroomCommission: [formData.showroomCommission],
                vehicalValuator: [formData.vehicalValuator],
                vehicalValuatorDate: [formData.vehicalValuatorDate],
                vehicalValuatorRepresentative: [formData.vehicalValuatorRepresentative],
                vehicalStaffRepresentativeName: [formData.vehicalStaffRepresentativeName],
                vehicalBranch: [formData.vehicalBranch],
                vehicalStaffRepresentativeDesignation: [formData.vehicalStaffRepresentativeDesignation],
                vehicaleStaffRepresentativeDesignation2: [formData.vehicaleStaffRepresentativeDesignation2],
                vehicaleStaffRepresentativeName2: [formData.vehicaleStaffRepresentativeName2],
                showroomAddress: [formData.showroomAddress],
                showroomName: [formData.showroomName],
                ownershipTransferDate: [formData.ownershipTransferDate],
                vehicleQuotationDate: [formData.vehicleQuotationDate],
                vehicleRemarks: [formData.vehicleRemarks],
                vehicleOtherBranchChecked: [formData.vehicleOtherBranchChecked],
                isNew: [formData.isNew],
                vehicleRealiasableAmount: [formData.vehicleRealiasableAmount],
                vehicleRate: [formData.vehicleRate],
                manufactureYear: [formData.manufactureYear],
                discountPrice: [formData.discountPrice],
                considerValue: [formData.considerValue],
                fairMarketValue: [formData.fairMarketValue],
                distressValue: [formData.distressValue],
                freeLimit: [formData.freeLimit],
                vehicleFirstValuationDate: [new Date(formData.vehicleFirstValuationDate)]
            })
        );
    }


    get vehicleDetails() {
        return this.vehicleForm.get('vehicleDetails') as FormArray;
    }

    private buildForm(): FormGroup {
        return this.vehicleForm = this.formBuilder.group({
            vehicleLoanExposure: [undefined],
            vehicleDetails: this.formBuilder.array([])
        });
    }

    public getRoleList(): void {
        this.spinner = true;
        this.roleService.getAll().subscribe(res => {
            this.designationList = res.detail;
            this.spinner = false;
        }, error => {
            this.toastService.show(new Alert(AlertType.ERROR, 'Error While Fetching List'));
            this.spinner = false;
        });
    }

    public branchList(): void {
        this.branchService.getAll().subscribe((res: any) => {
            this.branchLists = res.detail;
        });
    }

    public removeVehicleDetails(index: number): void {
        (this.vehicleForm.get('vehicleDetails') as FormArray).removeAt(index);
    }

    public vehicleRemainingAmount(index: number): void {
        const v = this.vehicleDetails.at(index);
        v.get('remainingAmount').setValue(v.get('quotationAmount').value - v.get('downPayment').value);
    }

    public calcRealiasable(i, key): void {
        if (key === 'vehicle') {
            const reliasableValue = (Number(this.vehicleForm.get(['vehicleDetails', i, 'quotationAmount']).value)
                * (Number(this.vehicleForm.get(['vehicleDetails', i, 'vehicleRate']).value) / 100));
            this.vehicleForm.get(['vehicleDetails', i, 'vehicleRealiasableAmount']).patchValue(reliasableValue);
        }
    }

    public setFreeLimitAmount(index, formArrayName: string, considerValue: number,) {
        if (this.isEdit === false) {
            this.vehicleForm.get([formArrayName, index, 'freeLimit']).setValue(considerValue);
        }
    }

    public valuator(branchId, type: string, index: number): void {
        if ((this.vehicleOtherBranchChecked) && ObjectUtil.isEmpty(branchId)) {
            return;
        }
        const valuatorSearch = {
            'branchIds': LocalStorageUtil.getStorage().branch
        };
        if (!ObjectUtil.isEmpty(branchId)) {
            valuatorSearch.branchIds = JSON.stringify(branchId);
        }
        if (type === 'vehicle') {
            this.valuatorService.getListWithSearchObject(valuatorSearch).subscribe((res: any) => {
                this.securityValuator.vehicalValuator[index] = res.detail.filter(item => item.valuatingField.includes('VEHICLE'));
            });
        }
    }

    get totalVehicleExposure() {
        let totalRemaining = 0;
        let totalValuation = 0;
        let exposures = 0;
        this.vehicleDetails.controls.forEach((c: AbstractControl) => {
            totalRemaining += c.get('remainingAmount').value;
            totalValuation += c.get('quotationAmount').value;
        });
        exposures = NumberUtils.isNumber((totalRemaining / totalValuation) * 100);
        this.vehicleForm.get('vehicleLoanExposure').setValue(exposures);
        return exposures;
    }

    public addVehicleSecurity() {
        (this.vehicleForm.get('vehicleDetails') as FormArray).push(this.vehicleDetailsFormGroup());
    }

    public vehicleDetailsFormGroup(): FormGroup {
        return this.formBuilder.group({
            model: [undefined, Validators.required],
            registrationNumber: [undefined],
            registrationDate: [undefined],
            engineNo: [undefined],
            chasisNo: [undefined],
            quotationAmount: [undefined, Validators.required],
            downPayment: [undefined],
            remainingAmount: [undefined],
            loanExposure: [undefined],
            showroomCommission: [undefined],
            vehicalValuator: [undefined],
            vehicalValuatorDate: [undefined],
            vehicalValuatorRepresentative: [undefined],
            vehicalStaffRepresentativeName: [undefined],
            vehicalBranch: [undefined],
            vehicalStaffRepresentativeDesignation: [undefined],
            vehicaleStaffRepresentativeDesignation2: [undefined],
            vehicaleStaffRepresentativeName2: [undefined],
            showroomAddress: undefined,
            showroomName: undefined,
            ownershipTransferDate: undefined,
            vehicleQuotationDate: undefined,
            vehicleRemarks: [undefined],
            vehicleOtherBranchChecked: [undefined],
            isNew: [undefined],
            vehicleRealiasableAmount: [undefined],
            vehicleRate: [undefined],
            manufactureYear: [undefined],
            discountPrice: [undefined],
            considerValue: [undefined],
            fairMarketValue: [undefined],
            distressValue: [undefined],
            freeLimit: [undefined],
            vehicleFirstValuationDate: [undefined]
        });
    }

}
