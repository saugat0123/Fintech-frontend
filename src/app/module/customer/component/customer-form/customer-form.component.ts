import {Component, DoCheck, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CustomerDataService} from '../../service/customer-data.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-customer-form1',
    templateUrl: './customer-form.component.html',
    styleUrls: ['./customer-form.component.css']
})
export class CustomerFormComponent implements OnInit, DoCheck {

    private currentId: number;
    private finalId: number;
    private customerACOpeningForm: FormGroup;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private customerDataService: CustomerDataService,
        private formBuilder: FormBuilder
    ) {
    }

    ngOnInit() {
        this.finalId = this.customerDataService.totalNavsCount;
        this.buildACOpeningForm();
    }

    ngDoCheck(): void {
        this.currentId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
        if (this.currentId > this.finalId || this.currentId < 1) {
            this.router.navigate(['customer/open/1']);
        }
        console.log(this.customerACOpeningForm.value);
        console.log(this.customerACOpeningForm.status);
    }

    buildACOpeningForm() {
        this.customerACOpeningForm = this.formBuilder.group(
            {
                existingAccountRadio: [undefined, Validators.required],
                existingAccountNumber: [undefined],
                accountTypeRadio: [undefined, Validators.required],
                otherAccountName: [undefined],
                accountCurrency: ['NPR', Validators.required],
                jointAccountRadio: [undefined, Validators.required],
                nomineeRadio: [undefined, Validators.required]
            }
        );
    }

}
