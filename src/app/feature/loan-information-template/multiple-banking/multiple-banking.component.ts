import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MultipleBanking} from '../../admin/modal/multipleBanking';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {CustomerType} from '../../customer/model/customerType';
import {LoanConfigService} from '../../admin/component/loan-config/loan-config.service';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-multiple-banking',
    templateUrl: './multiple-banking.component.html',
    styleUrls: ['./multiple-banking.component.scss']
})
export class MultipleBankingComponent implements OnInit {

    @Input() fromProfile: boolean;
    @Input() multiBankingData: MultipleBanking;
    @Output() multiBankingDataEmitter = new EventEmitter();
    customerType: CustomerType;
    calendarType = 'AD';
    multiBankingForm: FormGroup;
    multiBanking: MultipleBanking = new MultipleBanking();
    bankName = ['CCBL', 'Other Banks'];
    financialArrange = ['None', 'Sole', 'Multiple Banking', 'Consortium'];
    swapChecked = false;
    loanList = [];

    constructor(private formBuilder: FormBuilder,
                private loanConfigService: LoanConfigService,
                private router: ActivatedRoute) {
    }

    ngOnInit() {
        this.router.queryParams.subscribe((res: any) => {
           this.customerType = res.customerType;
        });
        this.loanConfigService.getAllByLoanCategory(this.customerType).subscribe((res: any) => {
            this.loanList = res.detail;
        });
        this.buildForm();
        if (!ObjectUtil.isEmpty(this.multiBankingData)) {
            const multiData = JSON.parse(this.multiBankingData.data);
            this.setMultiBankingData(multiData.multiBanking);
            this.setConsortiumData(multiData.consortium);
            this.setSwapData(multiData.bfiSwap);
            this.multiBankingForm.patchValue(multiData);
            this.patchDate(multiData);
        } else {
            const consortium = this.multiBankingForm.get('consortium') as FormArray;
            this.bankName.forEach((bn: any) => {
                consortium.push(this.addConsortium(bn));
            });
            this.addMultipleBanking();
            this.addSwap();
        }
    }

    buildForm() {
        this.multiBankingForm = this.formBuilder.group({
            multiBankingDate: [undefined],
            multiBanking: this.formBuilder.array([]),
            consortium: this.formBuilder.array([]),
            totalLimit: [undefined],
            totalOutstanding: [undefined],
            totalFunded: [undefined],
            totalNonFunded: [undefined],
            totalTermLoan: [undefined],
            totalTotal: [undefined],
            totalPercent: [undefined],
            bfiSwap: this.formBuilder.array([]),
            swapDate: [undefined],
            swapComment: [undefined]
        });
    }

    addMultipleBanking() {
        (this.multiBankingForm.get('multiBanking') as FormArray).push(
            this.formBuilder.group({
                bankName: [undefined],
                facilityName: [undefined],
                limit: [undefined],
                outstanding: [undefined],
                overDue: [undefined],
            })
        );
    }

    removeData(i: number, arrayName: string) {
        (this.multiBankingForm.get(arrayName) as FormArray).removeAt(i);
    }

    submitForm() {
        this.multiBanking.data = JSON.stringify(this.multiBankingForm.value);
        this.multiBankingDataEmitter.emit(this.multiBanking);
    }

    setMultiBankingData(data) {
        const multiData = this.multiBankingForm.get('multiBanking') as FormArray;
        if (!ObjectUtil.isEmpty(data)) {
            data.forEach(d => {
                multiData.push(
                    this.formBuilder.group({
                        bankName: [d.bankName],
                        facilityName: [d.facilityName],
                        limit: [d.limit],
                        outstanding: [d.outstanding],
                        overDue: [d.overDue],
                    })
                );
            });
        }
    }

    setConsortiumData(data) {
        const conData = this.multiBankingForm.get('consortium') as FormArray;
        if (!ObjectUtil.isEmpty(data)) {
            data.forEach((d) => {
                conData.push(
                    this.formBuilder.group({
                        coBankName: [d.coBankName],
                        funded: [d.funded],
                        nonFunded: [d.nonFunded],
                        termLoan: [d.termLoan],
                        total: [d.total],
                        bankPercent: [d.bankPercent],
                    })
                );
            });
        }
    }

    addConsortium(data): FormGroup {
        return this.formBuilder.group({
            coBankName: [data],
            funded: [0],
            nonFunded: [0],
            termLoan: [0],
            total: [0],
            bankPercent: [0],
        });
    }

    calculateAmount(index, total, arrayName) {
        let funded = 0;
        let nonFunded = 0;
        let termLoan = 0;
        let totalTotal = 0;
        let totalPercent = 0;
        let totalAmount = 0;
        const array = this.multiBankingForm.get(arrayName) as FormArray;
        array.value.forEach(av => {
            funded += av.funded;
            nonFunded += av.nonFunded;
            termLoan += av.termLoan;
            totalTotal += av.total;
            totalPercent += av.bankPercent;
        });
        switch (total) {
            case 'totalFunded':
                this.multiBankingForm.get(total).patchValue(funded);
                break;
            case 'totalNonFunded':
                this.multiBankingForm.get(total).patchValue(nonFunded);
                break;
            case 'totalTermLoan':
                this.multiBankingForm.get(total).patchValue(termLoan);
                break;
            case 'totalTotal':
                this.multiBankingForm.get(total).patchValue(totalTotal);
                break;
            case 'totalPercent':
                this.multiBankingForm.get(total).patchValue(totalPercent);
                break;
        }
        totalAmount = array.value[index].funded + array.value[index].nonFunded + array.value[index].termLoan;
        this.multiBankingForm.get([arrayName, index, 'total']).patchValue(totalAmount);
    }

    changeFinancialArrange(event) {
        console.log('selected data', event);
    }

    checkChecked(checked, type) {
        switch (type) {
            case 'swap':
            if (checked) {
                this.swapChecked = true;
            } else {
                this.swapChecked = false;
            }
        }
    }

    addSwap() {
        (this.multiBankingForm.get('bfiSwap') as FormArray).push(
            this.formBuilder.group({
                bankName: [undefined],
                facilityName: [undefined],
                limit: [undefined],
                outstanding: [undefined],
                classification: [undefined],
                account: [undefined],
            })
        );
    }

    setSwapData(data) {
        const swapData = this.multiBankingForm.get('bfiSwap') as FormArray;
        if (!ObjectUtil.isEmpty(data)) {
            data.forEach(d => {
                swapData.push(
                    this.formBuilder.group({
                        bankName: [d.bankName],
                        facilityName: [d.facilityName],
                        limit: [d.limit],
                        outstanding: [d.outstanding],
                        classification: [d.classification],
                        account: [d.account],
                    })
                );
            });
        }
    }

    private patchDate(multiData) {
        if (!ObjectUtil.isEmpty(multiData.multiBankingDate)) {
            this.multiBankingForm.get('multiBankingDate').patchValue(new Date(multiData.multiBankingDate));
        }
        if (!ObjectUtil.isEmpty(multiData.swapDate)) {
            this.multiBankingForm.get('swapDate').patchValue(new Date(multiData.swapDate));
        }
    }
}
