import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LoanDataHolder} from '../../loan/model/loanData';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {LoanConfig} from '../../admin/modal/loan-config';

@Component({
    selector: 'app-product-paper-checklist',
    templateUrl: './product-paper-checklist.component.html',
    styleUrls: ['./product-paper-checklist.component.scss']
})
export class ProductPaperChecklistComponent implements OnInit {

    constructor(private formBuilder: FormBuilder) {
    }

    @Input() loan: LoanConfig;
    @Input() fromLoan;
    @Input() loanDataHolder: LoanDataHolder;
    @Output() checkList = new EventEmitter();
    paperFormIndividual: FormGroup;
    paperFormInstitutional: FormGroup;
    yesNoNa = ['Yes', 'No', 'Na'];
    yesNo = ['Yes', 'No'];
    formData;

    ngOnInit() {
        if (!ObjectUtil.isEmpty(this.loanDataHolder.paperProductChecklist)) {
            this.formData = JSON.parse(this.loanDataHolder.paperProductChecklist);
        }
        if (this.fromLoan && this.loan.loanCategory === 'INDIVIDUAL') {
            this.buildIndividualForm();
            if (!ObjectUtil.isEmpty(this.formData)) {
                this.paperFormIndividual.patchValue(this.formData);
            }
        } else if (this.fromLoan && this.loan.loanCategory === 'INSTITUTION') {
            this.buildInstitutionForm();
            if (!ObjectUtil.isEmpty(this.formData)) {
                this.paperFormInstitutional.patchValue(this.formData);
            }
        }
    }

    buildIndividualForm() {
        this.paperFormIndividual = this.formBuilder.group({
            ciclDate: [undefined],
            internal: [undefined],
            negative: [undefined],
            reference: [undefined],
            statements: [undefined],
            lalPurja: [undefined],
            bluePrint: [undefined],
            boundary: [undefined],
            bcc: [undefined],
            bca: [undefined],
            fac: [undefined],
            salaryCertificate: [undefined],
            pension: [undefined],
            rental: [undefined],
            professional: [undefined],
            businessIncome: [undefined],
            agricultureIncome: [undefined],
            loanAmount: [undefined],
            creditChain: [undefined],
            loanTenure: [undefined],
            loanAmountMax: [undefined],
            ltv: [undefined],
            groupExposure: [undefined],
            ageOfBorrower: [undefined],
            ageOfCoBorrower: [undefined],
            dbr: [undefined],
            interestRate: [undefined],
            loanFee: [undefined],
            commitmentFee: [undefined],
            swapFee: [undefined],
            aggregate: [undefined],
        });
    }

    buildInstitutionForm() {
        this.paperFormInstitutional = this.formBuilder.group({
            loanAmount: [undefined],
            drawingPower: [undefined],
            fmv: [undefined],
            tenure: [undefined],
            scc: [undefined],
            dscr: [undefined],
            sole: [undefined],
            radius: [undefined],
            fac: [undefined],
            laf: [undefined],
            attached: [undefined],
            stockInspection: [undefined],
            financial: [undefined],
            tax: [undefined],
            hotList: [undefined],
            obtained: [undefined],
            paripasu: [undefined],
        });
    }

    save() {
        if (this.loan.loanCategory === 'INDIVIDUAL') {
            this.checkList.emit(this.paperFormIndividual.value);
        } else {
            this.checkList.emit(this.paperFormInstitutional.value);
        }
    }

    yesToAll() {
        this.paperFormIndividual.patchValue({
            ciclDate: 'Yes',
            internal: 'Yes',
            negative: 'Yes',
            reference: 'Yes',
            statements: 'Yes',
            lalPurja: 'Yes',
            bluePrint: 'Yes',
            boundary: 'Yes',
            bcc: 'Yes',
            bca: 'Yes',
            fac: 'Yes',
            salaryCertificate: 'Yes',
            pension: 'Yes',
            rental: 'Yes',
            professional: 'Yes',
            businessIncome: 'Yes',
            agricultureIncome: 'Yes',
            loanAmount: 'Yes',
            creditChain: 'Yes',
            loanTenure: 'Yes',
            loanAmountMax: 'Yes',
            ltv: 'Yes',
            groupExposure: 'Yes',
            ageOfBorrower: 'Yes',
            ageOfCoBorrower: 'Yes',
            dbr: 'Yes',
            interestRate: 'Yes',
            loanFee: 'Yes',
            commitmentFee: 'Yes',
            swapFee: 'Yes',
            aggregate: 'Yes',
        });
    }

    noToAll() {
        this.paperFormIndividual.patchValue({
            ciclDate: 'No',
            internal: 'No',
            negative: 'No',
            reference: 'No',
            statements: 'No',
            lalPurja: 'No',
            bluePrint: 'No',
            boundary: 'No',
            bcc: 'No',
            bca: 'No',
            fac: 'No',
            salaryCertificate: 'No',
            pension: 'No',
            rental: 'No',
            professional: 'No',
            businessIncome: 'No',
            agricultureIncome: 'No',
            loanAmount: 'No',
            creditChain: 'No',
            loanTenure: 'No',
            loanAmountMax: 'No',
            ltv: 'No',
            groupExposure: 'No',
            ageOfBorrower: 'No',
            ageOfCoBorrower: 'No',
            dbr: 'No',
            interestRate: 'No',
            loanFee: 'No',
            commitmentFee: 'No',
            swapFee: 'No',
            aggregate: 'No',
        });
    }

    naToAll() {
        this.paperFormIndividual.patchValue({
            ciclDate: 'Na',
            internal: 'Na',
            negative: 'Na',
            reference: 'Na',
            statements: 'Na',
            lalPurja: 'Na',
            bluePrint: 'Na',
            boundary: 'Na',
            bcc: 'Na',
            bca: 'Na',
            fac: 'Na',
            salaryCertificate: 'Na',
            pension: 'Na',
            rental: 'Na',
            professional: 'Na',
            businessIncome: 'Na',
            agricultureIncome: 'Na',
            loanAmount: 'Na',
            creditChain: 'Na',
            loanTenure: 'Na',
            loanAmountMax: 'Na',
            ltv: 'Na',
            groupExposure: 'Na',
            ageOfBorrower: 'Na',
            ageOfCoBorrower: 'Na',
            dbr: 'Na',
            interestRate: 'Na',
            loanFee: 'Na',
            commitmentFee: 'Na',
            swapFee: 'Na',
            aggregate: 'Na',
        });
    }
}

