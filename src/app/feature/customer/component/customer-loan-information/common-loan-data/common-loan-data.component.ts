import {Component, Input, OnInit} from '@angular/core';
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
import {LoanDataHolder} from '../../../../loan/model/loanData';
import {CombinedLoanService} from '../../../../service/combined-loan.service';
import {Proposal} from '../../../../admin/modal/proposal';
import {CustomerLoanDto} from '../../../../loan/model/customerLoanDto';

@Component({
    selector: 'app-common-loan-data',
    templateUrl: './common-loan-data.component.html',
    styleUrls: ['./common-loan-data.component.scss']
})
export class CommonLoanDataComponent implements OnInit {
    @Input() customerInfo: CustomerInfoData;
    @Input() loanId: any;
    @Input() isLoanCombined = false;

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
    netChecked = false;
    swapChargeChecked = false;
    subsidizedLoanChecked = false;
    client = environment.client;
    clientName = Clients;
    ckeConfig;
    singleLoan: LoanDataHolder;
    parsedProposalData;
    resCombinedData: any;
    finalProposalData: Array<Proposal>;
    finalLoanData: Array<CustomerLoanDto>;

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
        this.spinner.show();
        this.ckeConfig = Editor.CK_CONFIG;
        this.buildProposalCommonForm();
        if (this.isLoanCombined) {
            this.fetchCombinedLoanData(this.loanId);
        } else {
            this.fetchLoanData(this.loanId);
        }
    }

    buildProposalCommonForm() {
        this.commonLoanData = this.formBuilder.group({
            borrowerInformation: [undefined],
            disbursementCriteria: [undefined],
            repayment: [undefined],
            remark: [undefined],
            summeryRecommendation: [undefined],
            waiverConclusionRecommendation: [undefined],
            deviationConclusionRecommendation: [undefined],
            solConclusionRecommendation: [undefined],
            riskConclusionRecommendation: [undefined],
            termsAndCondition: [undefined],
            mergedCheck: [undefined],
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
        });
    }

    fetchLoanData(id: any) {
        if (ObjectUtil.isEmpty(id)) {
            return;
        }
        this.customerLoanService.getSingleLoanByLoanHolderId(id).subscribe((res: any) => {
            this.singleLoan = res.detail;
            const tempProposal = !ObjectUtil.isEmpty(this.singleLoan) ? this.singleLoan.proposal : null;
            this.parsedProposalData = !ObjectUtil.isEmpty(tempProposal) ? JSON.parse(this.singleLoan.proposal.data)
                : null;
            this.setTestValue(this.parsedProposalData);
            this.spinner.hide();
        }, error => {
            this.toastService.show(new Alert(AlertType.DANGER, 'Error while loading loan data!!'));
            this.spinner.hide();
        });
    }

    /* For the Customer Loan Service */
    fetchCombinedLoanData(id) {
        if (ObjectUtil.isEmpty(id)) {
            return;
        }
        this.combinedLoanService.detail(id).subscribe((res: any) => {
            this.resCombinedData = res.detail;
            const tempLoanList = !ObjectUtil.isEmpty(this.resCombinedData) ?
                this.resCombinedData.loans : null;
            const tempProposalData = !ObjectUtil.isEmpty(tempLoanList) ?
                JSON.parse(tempLoanList[0].proposal.data) : null;
            this.setTestValue(tempProposalData);
            this.spinner.hide();
        }, error => {
            this.toastService.show(new Alert(AlertType.DANGER, 'Error while loading loan data!!'));
            this.spinner.hide();
        });
    }

    setTestValue(parsedData) {
        if (!ObjectUtil.isEmpty(parsedData)) {
            if (ObjectUtil.isEmpty(parsedData.commonLoanData)) {
                return;
            }
            const commonData = JSON.parse(parsedData.commonLoanData);
            this.commonLoanData.patchValue(commonData);
            this.setCheckedData(JSON.parse(this.commonLoanData.get('mergedCheck').value));
            if (!ObjectUtil.isEmpty(commonData.vehicle)) {
                this.setFormData(commonData.vehicle, 'vehicle');
            } else {
                this.addKeyValue('vehicle');
            }
            if (!ObjectUtil.isEmpty(commonData.realState)) {
                this.setFormData(commonData.realState, 'realState');
            } else {
                this.addKeyValue('realState');
            }
            if (!ObjectUtil.isEmpty(commonData.shares)) {
                this.setFormData(commonData.shares, 'shares');
            } else {
                this.addKeyValue('shares');
            }
            if (!ObjectUtil.isEmpty(commonData.deposit)) {
                this.setFormData(commonData.deposit, 'deposit');
            } else {
                this.addKeyValue('deposit');
            }
        }
    }

    saveCommonLoanData() {
        this.spinner.show();
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
            netChecked: this.netChecked,
        };
        this.commonLoanData.patchValue({
            mergedCheck: JSON.stringify(mergeChecked)
        });
        const testData = [];

        if (!this.isLoanCombined) {
            /* For Individual Save */
            this.customerInfo.commonLoanData = JSON.stringify(this.commonLoanData.value);
            const proposal = !ObjectUtil.isEmpty(this.singleLoan) ? this.singleLoan.proposal : null;
            const finalData = !ObjectUtil.isEmpty(proposal) ? JSON.parse(proposal.data) : null;

            if (!ObjectUtil.isEmpty(finalData)) {
                finalData['commonLoanData'] = JSON.stringify(this.commonLoanData.value);
                this.singleLoan.proposal.data = JSON.stringify(finalData);
                testData.push(this.singleLoan);
            } else {
                const temp = {
                    commonLoanData: this.commonLoanData.value
                };
                this.singleLoan.proposal.data = JSON.stringify(temp);
                testData.push(this.singleLoan);
            }
        } else {
            // this.updateCombinedDetails();
            this.resCombinedData.loans.forEach((value) => {
                const tempProposalData = JSON.parse(value.proposal.data);
                if (!ObjectUtil.isEmpty(tempProposalData)) {
                    tempProposalData['commonLoanData'] = JSON.stringify(this.commonLoanData.value);
                    value.proposal.data = JSON.stringify(tempProposalData);
                    testData.push(value);
                }
                this.resCombinedData.loans = testData;
            });
        }

        /* TEST FOR THE API */
        this.customerLoanService.saveCommonLoanDataBulk(testData).subscribe((res: any) => {
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

    updateIndividualDetails() {
        /* For Individual Save */
        const testData = [];
        this.customerInfo.commonLoanData = JSON.stringify(this.commonLoanData.value);
        const proposal = !ObjectUtil.isEmpty(this.singleLoan) ? this.singleLoan.proposal : null;
        const finalData = !ObjectUtil.isEmpty(proposal) ? JSON.parse(proposal.data) : null;

        if (!ObjectUtil.isEmpty(finalData)) {
            finalData['commonLoanData'] = JSON.stringify(this.commonLoanData.value);
            this.singleLoan.proposal.data = JSON.stringify(finalData);
            testData.push(this.singleLoan.proposal);
        } else {
            const temp = {
                commonLoanData: this.commonLoanData.value
            };
            this.singleLoan.proposal.data = JSON.stringify(temp);
            testData.push(this.singleLoan.proposal);
        }

        /*this.customerLoanService.save(this.singleLoan).subscribe((res: any) => {
            this.toastService.show(new Alert(AlertType.SUCCESS, ' Successfully saved  Common Data!'));
            this.singleLoan = res.detail;
            this.nbDialogRef.close(true);
            this.spinner.hide();
        }, error => {
            this.spinner.hide();
            this.toastService.show(new Alert(AlertType.DANGER, 'Some thing Went Wrong'));
        });*/

        /* TEST FOR THE API */

        this.customerLoanService.saveCommonLoanDataBulk(testData).subscribe((res: any) => {
            this.toastService.show(new Alert(AlertType.SUCCESS, ' Successfully saved  Common Data!'));
            this.finalLoanData = res.detail;
            this.nbDialogRef.close(true);
            this.spinner.hide();
        }, error => {
            this.spinner.hide();
            this.toastService.show(new Alert(AlertType.DANGER, 'Some thing Went Wrong'));
        });
    }

    updateCombinedDetails() {
        /* For Combine Save */
        if (this.isLoanCombined && !ObjectUtil.isEmpty(this.resCombinedData)) {
            const tempData = [];
            this.resCombinedData.loans.forEach((value) => {
                const tempProposalData = JSON.parse(value.proposal.data);
                if (!ObjectUtil.isEmpty(tempProposalData)) {
                    tempProposalData['commonLoanData'] = JSON.stringify(this.commonLoanData.value);
                    value.proposal.data = JSON.stringify(tempProposalData);
                    tempData.push(value);
                }
                this.resCombinedData.loans = tempData;
            });

            this.combinedLoanService.save(this.resCombinedData).subscribe((res: any) => {
                this.toastService.show(new Alert(AlertType.SUCCESS, ' Successfully saved  Common Data!'));
                this.singleLoan = res.detail;
                this.nbDialogRef.close(true);
                this.spinner.hide();
            }, error => {
                this.spinner.hide();
                this.toastService.show(new Alert(AlertType.DANGER, 'Some thing Went Wrong'));
            });
        }
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

}
