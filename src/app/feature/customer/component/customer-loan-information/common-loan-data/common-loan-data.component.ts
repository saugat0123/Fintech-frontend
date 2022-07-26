import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {CustomerInfoData} from '../../../../loan/model/customerInfoData';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ToastService} from '../../../../../@core/utils';
import {CustomerInfoService} from '../../../service/customer-info.service';
import {CustomerService} from '../../../service/customer.service';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {NgxSpinnerService} from 'ngx-spinner';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {environment} from '../../../../../../environments/environment';
import {Clients} from '../../../../../../environments/Clients';
import {Editor} from '../../../../../@core/utils/constants/editor';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {LoanFormService} from '../../../../loan/component/loan-form/service/loan-form.service';
import {CombinedLoanService} from '../../../../service/combined-loan.service';
import {CustomerLoanDto} from '../../../../loan/model/customerLoanDto';
import {
    CadFileSetupComponent
} from '../../../../credit-administration/cad-work-flow/cad-work-flow-base/legal-and-disbursement/cad-file-setup/cad-file-setup.component';

@Component({
    selector: 'app-common-loan-data',
    templateUrl: './common-loan-data.component.html',
    styleUrls: ['./common-loan-data.component.scss']
})
export class CommonLoanDataComponent implements OnInit {
    @Input() customerInfo: CustomerInfoData;
    @Input() loanId: any;
    @Input() resCombinedData: any;
    @ViewChild('cadSetup', {static: false}) cadSetup: CadFileSetupComponent;

    commonLoanData: FormGroup;
    solChecked = false;
    waiverChecked = false;
    deviationChecked = false;
    riskChecked = false;
    commitmentChecked = false;
    swapDoubleChargeChecked = false;
    prepaymentChargeChecked = false;
    purposeChecked = false;
    debtChecked = false;
    borrowChecked = false;
    endUseChecked = false;
    netChecked = false;
    swapChargeChecked = false;
    subsidizedLoanChecked = false;
    client = environment.client;
    clientName = Clients;
    ckeConfig;
    parsedProposalData;
    finalLoanData: Array<CustomerLoanDto>;
    files = [];
    isSbk = false;

    constructor(private toastService: ToastService,
                private customerInfoService: CustomerInfoService,
                private customerService: CustomerService,
                private modalService: NbDialogService,
                private spinner: NgxSpinnerService,
                private nbService: NgbModal,
                private activeModal: NgbActiveModal,
                private nbDialogRef: NbDialogRef<CommonLoanDataComponent>,
                private customerLoanService: LoanFormService,
                private combinedLoanService: CombinedLoanService,
                private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        if (this.customerInfo.clientType === 'SMALL_BUSINESS_FINANCIAL_SERVICES') {
            this.isSbk = true;
        }
        this.ckeConfig = Editor.CK_CONFIG;
        this.buildProposalCommonForm();
        this.fetchCombinedLoanData();
    }

    buildProposalCommonForm() {
        this.commonLoanData = this.formBuilder.group({
            borrowerInformation: [undefined],
            disbursementCriteria: [undefined],
            repayment: [undefined],
            // remark: [undefined],
            summeryRecommendation: [undefined],
            waiverConclusionRecommendation: [undefined],
            deviationConclusionRecommendation: [undefined],
            solConclusionRecommendation: [undefined],
            riskConclusionRecommendation: [undefined],
            termsAndCondition: [undefined],
            borrowingCase: [undefined],
            endUseOfFund: [undefined],
            shares: this.formBuilder.array([]),
            realState: this.formBuilder.array([]),
            vehicle: this.formBuilder.array([]),
            deposit: this.formBuilder.array([]),
            depositBank: [undefined],
            depositOther: [undefined],
            depositBankRemark: [undefined],
            depositOtherRemark: [undefined],
            total: [undefined],
            totals: [undefined],
            files: [undefined],
            requestType: [undefined]
        });
    }

    /* For the Customer Loan Service */
    fetchCombinedLoanData() {
         const tempLoanList = this.resCombinedData ? this.resCombinedData : null;
        const tempProposalData = !ObjectUtil.isEmpty(tempLoanList) ?
            JSON.parse(tempLoanList[0].proposal.data) : null;
        this.setTestValue(tempProposalData);
        this.spinner.hide();
    }

    setTestValue(parsedData) {
        if (!ObjectUtil.isEmpty(parsedData)) {
            this.commonLoanData.patchValue(parsedData);
            if (!ObjectUtil.isEmpty(parsedData.files)) {
                this.files = JSON.parse(parsedData.files);
            }
            console.log('this is checked data', JSON.parse(this.resCombinedData[0].proposal.checkedData));
            this.setCheckedData(JSON.parse(this.resCombinedData[0].proposal.checkedData));
            if (!ObjectUtil.isEmpty(parsedData.vehicle)) {
                this.setFormData(parsedData.vehicle, 'vehicle');
            } else {
                this.addKeyValue('vehicle');
            }
            if (!ObjectUtil.isEmpty(parsedData.realState)) {
                this.setFormData(parsedData.realState, 'realState');
            } else {
                this.addKeyValue('realState');
            }
            if (!ObjectUtil.isEmpty(parsedData.shares)) {
                this.setFormData(parsedData.shares, 'shares');
            } else {
                this.addKeyValue('shares');
            }
            if (!ObjectUtil.isEmpty(parsedData.deposit)) {
                this.setFormData(parsedData.deposit, 'deposit');
            } else {
                this.addKeyValue('deposit');
            }
        }
    }

    saveCommonLoanData() {
        this.spinner.show();
        this.cadSetup.save();
        const mergeChecked = {
            solChecked: this.solChecked,
            waiverChecked: this.waiverChecked,
            riskChecked: this.riskChecked,
            swapChargeChecked: this.swapChargeChecked,
            subsidizedLoanChecked: this.subsidizedLoanChecked,
            deviationChecked: this.deviationChecked,
            commitmentChecked: this.commitmentChecked,
            swapDoubleChargeChecked: this.swapDoubleChargeChecked,
            prepaymentChargeChecked: this.prepaymentChargeChecked,
            purposeChecked: this.purposeChecked,
            debtChecked: this.debtChecked,
            borrowChecked: this.borrowChecked,
            endUseChecked: this.endUseChecked,
            netChecked: this.netChecked,
        };
        const loanList = [];
        // this.updateCombinedDetails();
        this.resCombinedData.forEach((value) => {
            const tempProposalData = JSON.parse(value.proposal.data);
                value.proposal.checkedData = JSON.stringify(mergeChecked);
            if (!ObjectUtil.isEmpty(tempProposalData)) {
                tempProposalData['commonLoanData'] = JSON.stringify(this.commonLoanData.value);
                const tempForm = this.formBuilder.group(tempProposalData);
                tempForm.patchValue(this.commonLoanData.value);
                value.proposal.data = JSON.stringify(tempForm.value);
                loanList.push(value);
            }
            this.resCombinedData = loanList;
        });
        /* TEST FOR THE API */
        this.customerLoanService.saveCommonLoanDataBulk(loanList).subscribe((res: any) => {
            this.toastService.show(new Alert(AlertType.SUCCESS, ' Successfully saved  Common Data!'));
            this.finalLoanData = res.detail;
            this.nbDialogRef.close(true);
            this.spinner.hide();
        }, error => {
            this.spinner.hide();
            this.toastService.show(new Alert(AlertType.DANGER, 'Some thing Went Wrong'));
        });
    }

    closeDialog() {
        this.nbDialogRef.close(false);
    }


    checkChecked(event, type) {
        switch (type) {
            case 'sol':
                if (event) {
                    this.solChecked = true;
                } else {
                    this.solChecked = false;
                    this.commonLoanData.get('solConclusionRecommendation').setValue(null);
                }
                break;
            case 'waiver':
                if (event) {
                    this.waiverChecked = true;
                } else {
                    this.waiverChecked = false;
                    this.commonLoanData.get('waiverConclusionRecommendation').setValue(null);
                }
                break;
            case 'risk':
                if (event) {
                    this.riskChecked = true;
                } else {
                    this.riskChecked = false;
                    this.commonLoanData.get('riskConclusionRecommendation').setValue(null);
                }
                break;
            case 'deviation':
                if (event) {
                    this.deviationChecked = true;
                } else {
                    this.deviationChecked = false;
                    this.commonLoanData.get('deviationConclusionRecommendation').setValue(null);
                }
                break;
            case 'commitment': {
                this.commitmentChecked = event;
            }
                break;
            case 'swapDoubleCharge': {
                this.swapDoubleChargeChecked = event;
            }
                break;
            case 'prepayment': {
                this.prepaymentChargeChecked = event;
            }
                break;
            case 'purpose': {
                this.purposeChecked = event;
            }
                break;
            case 'debt': {
                this.debtChecked = event;
            }
                break;
            case 'borrow': {
                this.borrowChecked = event;
            }
                break;
            case 'endUse': {
                this.endUseChecked = event;
            }
                break;
            case 'net': {
                this.netChecked = event;
            }
                break;
        }
    }

    calculate() {
        let total = this.commonLoanData.get('depositBank').value + this.commonLoanData.get('depositOther').value;
        total += this.getArrayTotal('shares');
        total += this.getArrayTotal('vehicle');
        total += this.getArrayTotal('realState');
        total += this.getArrayTotal('deposit');
        this.commonLoanData.get('total').patchValue(total);
    }

    getArrayTotal(formControl): number {
        let total = 0;
        (this.commonLoanData.get(formControl).value).forEach((d, i) => {
            total += d.amount;
        });
        return total;
    }

    addKeyValue(formControl: string) {
        (this.commonLoanData.get(formControl) as FormArray).push(
            this.formBuilder.group({
                assets: undefined,
                amount: 0,
            })
        );
    }

    removeValue(formControl: string, index: number) {
        (<FormArray>this.commonLoanData.get(formControl)).removeAt(index);
    }

    setCheckedData(data) {
        if (!ObjectUtil.isEmpty(data)) {
            this.checkChecked(data['solChecked'], 'sol');
            this.checkChecked(data['waiverChecked'], 'waiver');
            this.checkChecked(data['riskChecked'], 'risk');
            this.checkChecked(data['swapChargeChecked'], 'swapCharge');
            this.checkChecked(data['subsidizedLoanChecked'], 'subsidizedLoan');
            this.checkChecked(data['deviationChecked'], 'deviation');
            this.checkChecked(data['commitmentChecked'], 'commitment');
            this.checkChecked(data['swapDoubleChargeChecked'], 'swapDoubleCharge');
            this.checkChecked(data['prepaymentChargeChecked'], 'prepayment');
            this.checkChecked(data['purposeChecked'], 'purpose');
            this.checkChecked(data['debtChecked'], 'debt');
            this.checkChecked(data['borrowChecked'], 'borrow');
            this.checkChecked(data['endUseChecked'], 'endUse');
            this.checkChecked(data['netChecked'], 'net');
        }
    }

    setFormData(data, formControl) {
        const form = this.commonLoanData.get(formControl) as FormArray;
        if (!ObjectUtil.isEmpty(data)) {
            data.forEach(l => {
                form.push(this.formBuilder.group({
                    assets: [l.assets],
                    amount: [l.amount]
                }));
            });
        }
    }

    getData(data) {
        this.files = data;
        this.commonLoanData.patchValue({
            files: JSON.stringify(data)
        });
    }

}
