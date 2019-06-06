import {Component, Input, OnInit} from '@angular/core';
import {DmsLoanService} from '../component/loan-main-template/dms-loan-file/dms-loan-service';
import {ActivatedRoute, Router} from '@angular/router';
import {LoanActionService} from './service/loan-action.service';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
    selector: 'app-loan-action',
    templateUrl: './loan-action.component.html',
    styleUrls: ['./loan-action.component.scss']
})
export class LoanActionComponent implements OnInit {


    constructor(
        private router: ActivatedRoute,
        private dmsLoanService: DmsLoanService,
        private route: Router,
        private loanActionService: LoanActionService,
        private formBuilder: FormBuilder,
    ) {
    }

    @Input() loanConfigId: number;
    @Input() id: number;

    sendForwardBackwardList = [];

    formAction: FormGroup;


    ngOnInit() {
        this.formAction = this.formBuilder.group(
            {
                id: [undefined],
                customerId: [undefined],
                toUser: [undefined],
                docAction: [undefined],
                comment: [undefined]
            }
        );


    }

    sendBackwardList() {
        this.loanActionService.getSendBackwardList().subscribe(
            (response: any) => {
                this.sendForwardBackwardList = response.detail;
            });
        this.formAction.patchValue({
                docAction: 'BACKWARD'
            }
        );

    }

    sendForwardList() {
        this.loanActionService.getSendForwardList().subscribe(
            (response: any) => {
                this.sendForwardBackwardList = response.detail;
            });
        this.formAction.patchValue({
                docAction: 'FORWARD'
            }
        );
    }

    onSubmit() {
        this.formAction.patchValue({
                id: this.loanConfigId,
                customerId: this.id
            }
        );

        this.loanActionService.postLoanAction(this.formAction.value).subscribe((response: any) => {
        });

    }

    onEdit() {
        this.route.navigate(['/home/loan/loanForm'], {queryParams: {loanId: this.loanConfigId, customerId: this.id}});
    }

}
