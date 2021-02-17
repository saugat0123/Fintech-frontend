import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NumberUtils} from '../../../../@core/utils/number-utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {ToastService} from '../../../../@core/utils';
import {BorrowerPortfolio} from '../../../loan/model/borrwerportfolio';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';

@Component({
    selector: 'app-borrower-loan-portofolio',
    templateUrl: './borrower-loan-portofolio.component.html',
    styleUrls: ['./borrower-loan-portofolio.component.scss']
})
export class BorrowerLoanPortfolioComponent implements OnInit {
    @Input() fromProfile;
    @Input() borrowerPortfolioData;
    @Output() dataEmitter = new EventEmitter();
    portfolioForm: FormGroup;
    dataForEdit;

    submitted = false;
    borrowerPortfolio: BorrowerPortfolio = new BorrowerPortfolio();

    constructor(private formBuilder: FormBuilder,
                private elementRef: ElementRef,
                private toastService: ToastService) {
    }

    get form() {
        return this.portfolioForm.controls;
    }

    ngOnInit() {
        this.buildForm();
        if (!ObjectUtil.isEmpty(this.borrowerPortfolioData)) {
            this.dataForEdit = JSON.parse(this.borrowerPortfolioData.data);
            this.setPortFolioDetail(this.dataForEdit);
        } else {
            this.addPortfolioDetail();
        }
    }

    buildForm() {
        this.portfolioForm = this.formBuilder.group({
            portfolioDetail: this.formBuilder.array([])
        });
    }

    setPortFolioDetail(portfolioData) {
        console.log(this.dataForEdit.portfolioDetail);
        const formArray = (this.portfolioForm.get('portfolioDetail') as FormArray);
        portfolioData.portfolioDetail.forEach(data => {
            formArray.push(this.formBuilder.group({
                loanType: [data.loanType, Validators.required],
                balance: [data.balance, Validators.required],
                classificationThreeMonth: [data.classificationThreeMonth, Validators.required],
                classificationThreeToSix: [data.classificationThreeToSix, Validators.required],
                classificationSixtoThirteen: [data.classificationSixtoThirteen, Validators.required],
                classificationOverYear: [data.classificationOverYear, Validators.required],
                totalNonPerformingLoan: [data.totalNonPerformingLoan, Validators.required],
            }));
        });
    }

    addPortfolioDetail() {
        (this.portfolioForm.get('portfolioDetail') as FormArray).push(
            this.formBuilder.group({
                loanType: [undefined, Validators.required],
                balance: [undefined, Validators.required],
                classificationThreeMonth: [undefined, Validators.required],
                classificationThreeToSix: [undefined, Validators.required],
                classificationSixtoThirteen: [undefined, Validators.required],
                classificationOverYear: [undefined, Validators.required],
                totalNonPerformingLoan: [undefined, Validators.required],
            })
        );
    }

    removePortFolioDetail(index) {
        (this.portfolioForm.get('portfolioDetail') as FormArray).removeAt(index);
    }

    total(formControlName) {
        let total = 0;
        (this.portfolioForm.get('portfolioDetail') as FormArray).controls.forEach(value => {
            total += Number(value.get(formControlName).value);
        });
        return NumberUtils.isNumber(total);
    }

    calculateTotalNonPerformingLoan(index) {
        let totalNonPerformingLoan: number;
        const form = (this.portfolioForm.get('portfolioDetail') as FormArray).at(index);
        totalNonPerformingLoan = Number(form.get('classificationThreeToSix').value) +
            Number(form.get('classificationSixtoThirteen').value) +
            Number(form.get('classificationOverYear').value);
        form.get('totalNonPerformingLoan').setValue(totalNonPerformingLoan);
    }

    scrollToInvalidControl() {
        const firstInvalidControl: HTMLElement = this.elementRef.nativeElement.querySelector(
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
        const labelOffSet = 50;
        return controlEl.getBoundingClientRect().top + window.scrollY - labelOffSet;
    }

    submitForm() {
        this.submitted = true;
        if (this.portfolioForm.invalid) {
            this.toastService.show(new Alert(AlertType.ERROR, 'All fields are mandatory!'));
            return;
        }
        this.borrowerPortfolio.data = JSON.stringify(this.portfolioForm.value);
        this.dataEmitter.emit(this.borrowerPortfolio);
    }
}
