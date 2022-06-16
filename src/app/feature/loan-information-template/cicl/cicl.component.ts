import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Cicl, CiclArray} from '../../admin/modal/cicl';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {FormUtils} from '../../../@core/utils/form.utils';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {ToastService} from '../../../@core/utils';
import {Editor} from '../../../@core/utils/constants/editor';
import {RelationshipList} from '../../loan/model/relationshipList';
import {CiclRelationListEnum} from '../../loan/model/ciclRelationListEnum';
import {CalendarType} from '../../../@core/model/calendar-type';
import {BankingRelationship} from '../../admin/modal/banking-relationship';
import {CustomerInfoService} from '../../customer/service/customer-info.service';
import {ApiConfig} from '../../../@core/utils/api/ApiConfig';

@Component({
  selector: 'app-cicl',
  templateUrl: './cicl.component.html',
  styleUrls: ['./cicl.component.scss']
})
export class CiclComponent implements OnInit {
    @Input() ciclValue: CiclArray;
    @Input() customerInfoId: number;
    // @Input() calendarType: CalendarType;

    @Input() fromProfile: boolean;
    calendarType = CalendarType.AD;

    ciclForm: FormGroup;

    ciclList: Array<Cicl> = new Array<Cicl>();
    @Output() ciclDataEmitter = new EventEmitter();

    submitted = false;
    ckeConfig = Editor.CK_CONFIG;

    relationshipList: RelationshipList = new RelationshipList();
    relationlist;
    ciclRelation = CiclRelationListEnum.pair();
    ciclHistory = false;
    variableChecked = false;
    bankingRelationChecked;
    bankingRelationshipList = BankingRelationship.enumObject();
    bankingRelationship;

    constructor(
        private formBuilder: FormBuilder,
        private toastService: ToastService,
        private el: ElementRef,
        private customerInfoService: CustomerInfoService
    ) {
    }


    get ciclRemarks() {
        return this.ciclForm.get('ciclRemarks');
    }

    get ciclArray() {
        return this.ciclForm.get('ciclArray');
    }

    get ciclFormControls() {
        return this.ciclForm.controls;
    }


    ngOnInit() {
        if (!ObjectUtil.isEmpty(this.ciclValue)) {
            this.ciclList = JSON.parse(this.ciclValue.data);
        } else {
            this.ciclValue = new CiclArray();
        }
        const ciclList = this.ciclList[0];
        if (ciclList === undefined) {
            this.ciclHistory = false;
        } else if (ciclList.nameOfBorrower !== null) {
            this.ciclHistory = true;
        }
        if (!ObjectUtil.isEmpty(this.ciclValue.cibRemark)) {
            this.variableChecked = JSON.parse(this.ciclValue.cibRemark).checked;
            if (!ObjectUtil.isEmpty(JSON.parse(this.ciclValue.cibRemark).value)) {
                this.ciclValue.cibCharge = JSON.parse(this.ciclValue.cibRemark).value;
            }
            this.bankingRelationship = JSON.parse(this.ciclValue.cibRemark).bankingRelationship;
            this.bankingRelationChecked = JSON.parse(this.ciclValue.cibRemark).bankingRelationChecked;
        }
        this.buildCiclForm();
        this.relationlist = this.relationshipList.relation;
    }

    buildCiclForm() {
        this.ciclForm = this.formBuilder.group({
            ciclArray: this.formBuilder.array([]),
            ciclRemarks: [ObjectUtil.isEmpty(this.ciclValue) ? '' : this.ciclValue.remarks],
            cibCharge: [ObjectUtil.isEmpty(this.ciclValue) ? undefined : this.ciclValue.cibCharge],
            cibRemark: [ObjectUtil.isEmpty(this.ciclValue) ? undefined : this.ciclValue.cibRemark],
        });
        if (!ObjectUtil.isEmpty(this.ciclList)) {
            if ((this.ciclList.length > 0)) {
                this.patchCiclFormGroup(this.ciclList);
            } else {
                this.addCiclFormGroup();
            }
        } else {
            this.addCiclFormGroup();
        }
    }

    addCiclFormGroup() {
        const controls = this.ciclForm.controls.ciclArray as FormArray;
        controls.push(
            this.formBuilder.group({
                nameOfBorrower: [undefined, Validators.required],
                fiName: [undefined, Validators.required],
                facilityName: [undefined, Validators.required],
                overdueAmount: [undefined, Validators.required],
                outstandingAmount: [undefined, Validators.required],
                ciclStatus: [undefined, Validators.required],
                obtaineddate: [undefined, Validators.required],
                loanamount: [undefined, Validators.required],
                overdue: [undefined],
                ciclRelation: [undefined],
                probabilityDefer: [undefined],
                riskScore: [undefined]
            }));
    }

    addCicl() {
        const controls = this.ciclForm.controls.ciclArray as FormArray;
        if (FormUtils.checkEmptyProperties(controls)) {
            this.toastService.show(new Alert(AlertType.INFO, 'Please Fill All CICL Detail To Add More'));
            return;
        }
        controls.push(
            this.formBuilder.group({
                nameOfBorrower: [undefined, Validators.required],
                fiName: [undefined, Validators.required],
                facilityName: [undefined, Validators.required],
                overdueAmount: [undefined, Validators.required],
                outstandingAmount: [undefined, Validators.required],
                ciclStatus: [undefined, Validators.required],
                obtaineddate: [undefined, Validators.required],
                loanamount: [undefined, Validators.required],
                overdue: [undefined],
                ciclRelation: [undefined],
                probabilityDefer: [undefined],
                riskScore: [undefined]

            }));

    }

    removeCICL(index: number) {
        (this.ciclArray as FormArray).removeAt(index);
    }

    patchCiclFormGroup(ciclList: Array<Cicl>) {
        const controls = this.ciclForm.controls.ciclArray as FormArray;
        ciclList.forEach(cicl => {
            controls.push(
                this.formBuilder.group({
                    nameOfBorrower: [cicl.nameOfBorrower, Validators.required],
                    fiName: [cicl.nameOfFI, Validators.required],
                    facilityName: [cicl.facility, Validators.required],
                    overdueAmount: [cicl.overdueAmount, Validators.required],
                    outstandingAmount: [cicl.outstandingAmount, Validators.required],
                    ciclStatus: [cicl.status, Validators.required],
                    obtaineddate: [new Date(cicl.obtaineddate), Validators.required],
                    loanamount: [cicl.loanamount, Validators.required],
                    overdue: [cicl.overdue],
                    ciclRelation: [cicl.ciclRelation],
                    probabilityDefer: [cicl.probabilityDefer],
                    riskScore: [cicl.riskScore],

                }));
        });
    }

    scrollToFirstInvalidControl() {
        const firstInvalidControl: HTMLElement = this.el.nativeElement.querySelector(
            'form .ng-invalid'
        );
        window.scroll({
            top: this.getTopOffset(firstInvalidControl),
            left: 0,
            behavior: 'smooth'
        });
        firstInvalidControl.focus();
    }

    private getTopOffset(controlEl: HTMLElement): number {
        const labelOffset = 50;
        return controlEl.getBoundingClientRect().top + window.scrollY - labelOffset;
    }


    onSubmit() {
        this.submitted = true;
        if (this.ciclHistory === false) {
            const controls = this.ciclForm.controls.ciclArray as FormArray;
            controls.clearAsyncValidators();
            controls.clear();
        }
        if (this.ciclHistory === true) {
            if (this.ciclForm.invalid) {
                this.scrollToFirstInvalidControl();
                return;
            }
        }

        // CICL

        this.ciclList = new Array<Cicl>();
        const ciclControls = this.ciclArray as FormArray;
        for (const arrayControl of ciclControls.controls) {
            const controls = (arrayControl as FormGroup).controls;
            const cicl: Cicl = new Cicl();
            cicl.nameOfBorrower = controls.nameOfBorrower.value;
            cicl.nameOfFI = controls.fiName.value;
            cicl.facility = controls.facilityName.value;
            cicl.overdueAmount = controls.overdueAmount.value;
            cicl.outstandingAmount = controls.outstandingAmount.value;
            cicl.status = controls.ciclStatus.value;
            cicl.obtaineddate = controls.obtaineddate.value;
            cicl.loanamount = controls.loanamount.value;
            cicl.overdue = controls.overdue.value;
            cicl.ciclRelation = controls.ciclRelation.value;
            cicl.probabilityDefer = controls.probabilityDefer.value;
            cicl.riskScore = controls.riskScore.value;

            this.ciclList.push(cicl);

        }
        // uncomment if value is need
        this.ciclValue.remarks = this.ciclForm.get('ciclRemarks').value === undefined ? '' : this.ciclForm.get('ciclRemarks').value;
        if (!this.variableChecked) {
            this.ciclValue.cibCharge = this.ciclForm.get('cibCharge').value === undefined ? '' : this.ciclForm.get('cibCharge').value;
            this.ciclValue.cibRemark = null;
            const ciclRemark = {
                value: '',
                checked: false,
                bankingRelationship: this.bankingRelationship,
                bankingRelationChecked: this.bankingRelationChecked
            };
            this.ciclValue.cibRemark = JSON.stringify(ciclRemark);
        } else {
            const ciclRemark = {
                value: this.ciclForm.get('cibCharge').value === undefined ? '' : this.ciclForm.get('cibCharge').value,
                checked: true,
                bankingRelationship: this.bankingRelationship,
                bankingRelationChecked: this.bankingRelationChecked
            };
            this.ciclValue.cibRemark = JSON.stringify(ciclRemark);
            this.ciclValue.cibCharge = null;
        }
        this.ciclValue.data = JSON.stringify(this.ciclList);
        this.ciclDataEmitter.emit(this.ciclValue);
    }

    public ciclHistoryFound(ciclChk) {
        if (!ciclChk) {
            this.ciclHistory = false;
        } else {
            this.ciclHistory = true;
        }
    }

    variableCheck(event, type) {
        if (type === 'variable') {
            this.variableChecked = event;
        } else if (type === 'banking') {
            this.bankingRelationChecked = event;
        }
    }

    download() {
        this.customerInfoService.downloadCiclCsv(this.customerInfoId).subscribe((response: any) => {
            const link = document.createElement('a');
            link.target = '_blank';
            link.href = ApiConfig.URL + '/' + response.detail;
            link.download = name;
            link.setAttribute('visibility', 'hidden');
            link.click();
        }, error => {
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Download Customer!'));
        });
    }
}
