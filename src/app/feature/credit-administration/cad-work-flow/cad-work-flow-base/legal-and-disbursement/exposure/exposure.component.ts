import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {LoanDataHolder} from '../../../../../loan/model/loanData';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {Exposure} from '../../../../model/Exposure';
import {CadDocStatus} from '../../../../model/CadDocStatus';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LocalStorageUtil} from '../../../../../../@core/utils/local-storage-util';
import {CommonService} from '../../../../../../@core/service/common.service';

@Component({
    selector: 'app-exposure',
    templateUrl: './exposure.component.html',
    styleUrls: ['./exposure.component.scss']
})
export class ExposureComponent implements OnInit, OnChanges {
    @Input() cadData: CustomerApprovedLoanCadDocumentation;
    @Input() isHistory: boolean;
    customerLoanList: Array<LoanDataHolder>;

    @Output()
    responseCadData: EventEmitter<CustomerApprovedLoanCadDocumentation> = new EventEmitter<CustomerApprovedLoanCadDocumentation>();

    // todo replace with api from backend predefined data
    frequencyList = ['Semi-Annually', 'Quarterly', 'Monthly', 'Bullet', 'Ballooning'];

    spinner = false;
    isValid = false;
    exposureForm: FormGroup;
    details = [];
    docScc;

    constructor(private formBuilder: FormBuilder,
                private routerUtilsService: RouterUtilsService,
                private service: CreditAdministrationService,
                private toastService: ToastService,
                private modalService: NgbModal,
                public commonService: CommonService,
                private creditAdministrationService: CreditAdministrationService,) {
    }

    get disbursementDetails() {
        return this.exposureForm.get('disbursementDetails') as FormArray;
    }

    get totalLimit() {
        let t = 0;
        this.disbursementDetails.controls.forEach(value => t += Number(value.get('loanLimit').value));
        return t;
    }

    ngOnInit() {
        this.buildForm();
        if (!ObjectUtil.isEmpty(this.cadData)) {
            this.initial();
        }
    }

    initial() {
        if (!ObjectUtil.isEmpty(this.cadData)) {
            this.customerLoanList = this.cadData.assignedLoan;
        }
        if (!ObjectUtil.isEmpty(this.cadData.exposure) && !ObjectUtil.isEmpty(this.cadData.exposure.data) && !this.isHistory) {
            this.disbursementDetails.clear();
            this.setDisbursementDetails();
            const d = JSON.parse(this.cadData.exposure.data);

            if (!ObjectUtil.isEmpty(d.sccPath)) {
                this.docScc = d.sccPath;
            }
        } else {
            this.disbursementDetails.clear();
            this.addDisbursementDetail();
        }
    }

    buildForm() {
        this.exposureForm = this.formBuilder.group({
            disbursementDetails: this.formBuilder.array([])
        });
    }

    checkValidation(i) {
        const control = (this.exposureForm.get('disbursementDetails') as FormArray).at(i);
        if (control.valid) {
            this.isValid = true;
            this.exposureForm.get(['disbursementDetails', i, 'isValid']).setValue(true);
        } else {
            this.exposureForm.get(['disbursementDetails', i, 'isValid']).setValue(false);
        }
    }

    addDisbursementDetail() {
        this.cadData.assignedLoan.forEach((value, i) => {
            this.disbursementDetails.push(this.formBuilder.group({
                customerLoanId: [value.id],
                loanName: [value.loan.name],
                loanLimit: [value.proposal.existingLimit, Validators.required],
                newLoanLimit: [!ObjectUtil.isEmpty(value.proposal.enhanceLimitAmount) ?
                    value.proposal.enhanceLimitAmount : '-', Validators.required],
                totalLoanLimit: [value.proposal.proposedLimit, Validators.required],
                disbursement: [value.proposal.proposedLimit, Validators.required],
                initialRate: [value.loan.interestRate, Validators.required],
                maturity: [undefined, Validators.required],
                // frequency: [undefined, Validators.required],
                isFunded: [value.loan.isFundable],
                approvedLoanBy: [value.currentStage.docAction.toString() === 'APPROVED' ? value.currentStage.toUser.name : undefined],
                isValid: [false]
            }));
            this.checkValidation(i);
        });
    }

    setDisbursementDetails() {
        let data = [];
        if (!ObjectUtil.isEmpty(this.cadData.exposure.data)) {
            data = JSON.parse(this.cadData.exposure.data).disbursementDetails;
            data.forEach((value, i) => {
                this.disbursementDetails.push(this.formBuilder.group({
                    customerLoanId: [ObjectUtil.isEmpty(value.id) ? null : value.id],
                    loanName: [value.loanName],
                    loanLimit: [value.loanLimit, Validators.required],
                    newLoanLimit: [value.newLoanLimit, Validators.required],
                    totalLoanLimit: [value.totalLoanLimit, Validators.required],
                    // disbursement: [value.disbursement, Validators.required],
                    initialRate: [value.initialRate, Validators.required],
                    maturity: [value.maturity, Validators.required],
                    // frequency: [value.frequency, Validators.required],
                    isFunded: [value.isFunded],
                    approvedLoanBy: [value.approvedLoanBy],
                    isValid: [value.isValid ? value.isValid : false]
                }));
                this.checkValidation(i);
            });
        }
    }

    submit() {
        this.spinner = true;
        const exposure = new Exposure();
        exposure.data = JSON.stringify(this.exposureForm.value);
        if (!ObjectUtil.isEmpty(this.cadData.exposure)) {
            exposure.id = this.cadData.exposure.id;
            exposure.version = this.cadData.exposure.version;
            if (this.isHistory) {
                let historyData = [];
                if (!ObjectUtil.isEmpty(this.cadData.exposure.historyData)) {
                    historyData = JSON.parse(this.cadData.exposure.historyData);
                }
                const tempDisbursementArray = [];
                const storage = LocalStorageUtil.getStorage();
                const sccPath = JSON.parse(this.cadData.exposure.data).sccPath;
                JSON.parse(this.cadData.exposure.data).disbursementDetails.forEach(d => {
                    d.approveBy = this.cadData.cadCurrentStage.fromUser.name;
                    d.approveByrole = this.cadData.cadCurrentStage.fromRole.roleName;
                    d.approvedOn = this.cadData.cadCurrentStage.lastModifiedAt;
                    d.sccPath = sccPath;
                    tempDisbursementArray.push(d);
                });
                historyData.push(tempDisbursementArray);
                exposure.historyData = JSON.stringify(historyData);
                this.cadData.docStatus = CadDocStatus.DISBURSEMENT_PENDING;
            }
        }
        this.cadData.exposure = exposure;
        this.service.saveCadDocumentBulk(this.cadData).subscribe((res: any) => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Exposure data!!!'));
            // this.routerUtilsService.reloadCadProfileRouteWithActiveTab(this.cadData.id, 1);
            this.responseCadData.emit(res.detail);
            this.spinner = false;
            this.close();
        }, error => {
            console.log(error);
            this.spinner = false;
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save Exposure data!!!'));
            this.close();
        });
    }

    close() {
        this.modalService.dismissAll();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!ObjectUtil.isEmpty(this.cadData)) {
            this.initial();
        }
    }
}
