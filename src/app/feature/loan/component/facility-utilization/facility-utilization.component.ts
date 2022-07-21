import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CustomerInfoData} from '../../model/customerInfoData';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {Pattern} from '../../../../@core/utils/constants/pattern';
import {environment} from '../../../../../environments/environment';
import {RepaymentTrackCurrentBank} from '../../../admin/modal/crg/RepaymentTrackCurrentBank';
import {Editor} from '../../../../@core/utils/constants/editor';

@Component({
    selector: 'app-facility-utilization',
    templateUrl: './facility-utilization.component.html',
    styleUrls: ['./facility-utilization.component.scss']
})
export class FacilityUtilizationComponent implements OnInit {
    isNewCustomer = false;
    submitted = false;
    repaymentTrack = RepaymentTrackCurrentBank.enumObject();
    facilityConfig = Editor.CK_CONFIG;
    parsedData;
    overdraftUtilizationTable = '<table border=\"1\" cellpadding=\"3\" cellspacing=\"1\" style=\"width:771.667px\">\n\t<tbody>\n\t\t<tr>\n\t\t\t<td style=\"width:166px\">Month</td>\n\t\t\t<td style=\"width:167px\">Average Untilization %</td>\n\t\t\t<td style=\"width:171px\">Minimum Utilization %</td>\n\t\t\t<td style=\"width:241px\">Maximum Utilization %</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td style=\"width:166px\">&nbsp;</td>\n\t\t\t<td style=\"width:167px\">&nbsp;</td>\n\t\t\t<td style=\"width:171px\">&nbsp;</td>\n\t\t\t<td style=\"width:241px\">&nbsp;</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td style=\"width:166px\">&nbsp;</td>\n\t\t\t<td style=\"width:167px\">&nbsp;</td>\n\t\t\t<td style=\"width:171px\">&nbsp;</td>\n\t\t\t<td style=\"width:241px\">&nbsp;</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td style=\"width:166px\">&nbsp;</td>\n\t\t\t<td style=\"width:167px\">&nbsp;</td>\n\t\t\t<td style=\"width:171px\">&nbsp;</td>\n\t\t\t<td style=\"width:241px\">&nbsp;</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td style=\"width:166px\">&nbsp;</td>\n\t\t\t<td style=\"width:167px\">&nbsp;</td>\n\t\t\t<td style=\"width:171px\">&nbsp;</td>\n\t\t\t<td style=\"width:241px\">&nbsp;</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td style=\"width:166px\">&nbsp;</td>\n\t\t\t<td style=\"width:167px\">&nbsp;</td>\n\t\t\t<td style=\"width:171px\">&nbsp;</td>\n\t\t\t<td style=\"width:241px\">&nbsp;</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td style=\"width:166px\">&nbsp;</td>\n\t\t\t<td style=\"width:167px\">&nbsp;</td>\n\t\t\t<td style=\"width:171px\">&nbsp;</td>\n\t\t\t<td style=\"width:241px\">&nbsp;</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td style=\"width:166px\">&nbsp;</td>\n\t\t\t<td style=\"width:167px\">&nbsp;</td>\n\t\t\t<td style=\"width:171px\">&nbsp;</td>\n\t\t\t<td style=\"width:241px\">&nbsp;</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td style=\"width:166px\">&nbsp;</td>\n\t\t\t<td style=\"width:167px\">&nbsp;</td>\n\t\t\t<td style=\"width:171px\">&nbsp;</td>\n\t\t\t<td style=\"width:241px\">&nbsp;</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td style=\"width:166px\">&nbsp;</td>\n\t\t\t<td style=\"width:167px\">&nbsp;</td>\n\t\t\t<td style=\"width:171px\">&nbsp;</td>\n\t\t\t<td style=\"width:241px\">&nbsp;</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td style=\"width:166px\">&nbsp;</td>\n\t\t\t<td style=\"width:167px\">&nbsp;</td>\n\t\t\t<td style=\"width:171px\">&nbsp;</td>\n\t\t\t<td style=\"width:241px\">&nbsp;</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td style=\"width:166px\">Average Utilization</td>\n\t\t\t<td style=\"width:167px\">&nbsp;</td>\n\t\t\t<td style=\"width:171px\">&nbsp;</td>\n\t\t\t<td style=\"width:241px\">&nbsp;</td>\n\t\t</tr>\n\t</tbody>\n</table>\n\n<p>&nbsp;</p>\n"';
    letterOfCreditIssuedTable = '<table border=\"1\" cellpadding=\"3\" cellspacing=\"1\" style=\"width:500px\">\n\t<tbody>\n\t\t<tr>\n\t\t\t<td><strong>LC Issued Date</strong></td>\n\t\t\t<td><strong>LC Number </strong></td>\n\t\t\t<td><strong>Currency</strong></td>\n\t\t\t<td><strong>LC Amount</strong></td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td>&nbsp;</td>\n\t\t\t<td>&nbsp;</td>\n\t\t\t<td>&nbsp;</td>\n\t\t\t<td>&nbsp;</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td>&nbsp;</td>\n\t\t\t<td>&nbsp;</td>\n\t\t\t<td>&nbsp;</td>\n\t\t\t<td>&nbsp;</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td>&nbsp;</td>\n\t\t\t<td>&nbsp;</td>\n\t\t\t<td>&nbsp;</td>\n\t\t\t<td>&nbsp;</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td>&nbsp;</td>\n\t\t\t<td>&nbsp;</td>\n\t\t\t<td>&nbsp;</td>\n\t\t\t<td>&nbsp;</td>\n\t\t</tr>\n\t</tbody>\n</table>\n\n<p>&nbsp;</p>\n';
    bankGuaranteeIssuedTable = '<table border=\"1\" cellpadding=\"3\" cellspacing=\"1\" style=\"width:500px\">\n\t<tbody>\n\t\t<tr>\n\t\t\t<td><strong>BG Issued Date</strong></td>\n\t\t\t<td><strong>BG Number </strong></td>\n\t\t\t<td><strong>Currency</strong></td>\n\t\t\t<td><strong>BG Amount</strong></td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td>&nbsp;</td>\n\t\t\t<td>&nbsp;</td>\n\t\t\t<td>&nbsp;</td>\n\t\t\t<td>&nbsp;</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td>&nbsp;</td>\n\t\t\t<td>&nbsp;</td>\n\t\t\t<td>&nbsp;</td>\n\t\t\t<td>&nbsp;</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td>&nbsp;</td>\n\t\t\t<td>&nbsp;</td>\n\t\t\t<td>&nbsp;</td>\n\t\t\t<td>&nbsp;</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td>&nbsp;</td>\n\t\t\t<td>&nbsp;</td>\n\t\t\t<td>&nbsp;</td>\n\t\t\t<td>&nbsp;</td>\n\t\t</tr>\n\t</tbody>\n</table>\n\n<p>&nbsp;</p>\n';
    oneOffLoansApprovedTable = '<table border=\"1\" cellpadding=\"3\" cellspacing=\"1\" style=\"width:500px\">\n\t<tbody>\n\t\t<tr>\n\t\t\t<td><strong>Approved date</strong></td>\n\t\t\t<td><strong>Loan Amount</strong></td>\n\t\t\t<td><strong>Tenure</strong></td>\n\t\t\t<td><strong>BG Amount</strong></td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td>&nbsp;</td>\n\t\t\t<td>&nbsp;</td>\n\t\t\t<td>&nbsp;</td>\n\t\t\t<td>&nbsp;</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td>&nbsp;</td>\n\t\t\t<td>&nbsp;</td>\n\t\t\t<td>&nbsp;</td>\n\t\t\t<td>&nbsp;</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td>&nbsp;</td>\n\t\t\t<td>&nbsp;</td>\n\t\t\t<td>&nbsp;</td>\n\t\t\t<td>&nbsp;</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td>&nbsp;</td>\n\t\t\t<td>&nbsp;</td>\n\t\t\t<td>&nbsp;</td>\n\t\t\t<td>&nbsp;</td>\n\t\t</tr>\n\t</tbody>\n</table>\n\n<p>&nbsp;</p>\n';
    constructor(private formBuilder: FormBuilder,
                private el: ElementRef) {
    }

    @Input() customerInfo: CustomerInfoData;
    @Input() fromProfile: boolean;
    @Output() emitter = new EventEmitter();
    @Input() facilityUtilizationData;
    facilityUtilizatoinForm: FormGroup;
     totals = {
         limit: null,
         averageUtilization: null,
         utilization: null,
         maximum: null,
         minimum: null
    };
     totalKeys = Object.keys(this.totals);
     data;
    ngOnInit() {
        this.buildForm();
        if (!ObjectUtil.isEmpty(this.facilityUtilizationData)) {
            this.parsedData = JSON.parse(this.facilityUtilizationData);
        }
        if (!ObjectUtil.isEmpty(this.parsedData)) {
            this.facilityUtilizatoinForm.patchValue(this.parsedData);
        } else {
            this. fillTable();
        }
        // if (this.customerInfo.facilityUtilization) {
        //     this.setFacility();
        // } else {
        //    this.addUtilization();
        // }
    }

    buildForm() {
        this.facilityUtilizatoinForm = this.formBuilder.group({
            // data: this.formBuilder.array([]),
            // lcIssued: [undefined],
            // oneLimit: [undefined],
            // remarks: [undefined],
            // newCustomerChecked: [false],
            // accountTransactionForm: this.formBuilder.group({
            //     creditTransactionNumber: [undefined, [Validators.required, Validators.pattern(Pattern.NUMBER_DOUBLE)]],
            //     creditTransactionValue: [undefined, [Validators.required, Validators.pattern(Pattern.NUMBER_DOUBLE)]],
            //     debitTransactionNumber: [undefined, [Validators.required, Validators.pattern(Pattern.NUMBER_DOUBLE)]],
            //     debitTransactionValue: [undefined, [Validators.required, Validators.pattern(Pattern.NUMBER_DOUBLE)]],
            //     repaymentTrackWithCurrentBank: [undefined, Validators.required]
            // })
            overdraftUtilization: [undefined],
            remarks: [undefined],
            otherFacilityUtilization: [undefined],
            remarks1: [undefined],
            letterOfCreditIssued: [undefined],
            remarks2: [undefined],
            bankGuaranteeIssued: [undefined],
            remarks3: [undefined],
            oneOffLoansApproved: [undefined],
            remarks4: [undefined]
        });
    }

    get formControls() {
        return this.facilityUtilizatoinForm.controls;
    }

    get transactionForm() {
        return this.facilityUtilizatoinForm.controls.accountTransactionForm['controls'];
    }

    onAdditionalFieldSelect(chk) {
        if (chk) {
            this.facilityUtilizatoinForm.get('accountTransactionForm').disable();
        } else {
            this.facilityUtilizatoinForm.get('accountTransactionForm').enable();
        }
        this.isNewCustomer = chk;
    }

    addUtilization() {
        const formArray = (this.facilityUtilizatoinForm.get('data') as FormArray);
        formArray.push(this.formBuilder.group({
            facility: [undefined],
            limit: [undefined],
            averageUtilization: [undefined],
            utilization: [undefined],
            maximum: [undefined],
            minimum: [undefined]
        }));
    }

    removeUtilization(i: number) {
        this.allCalculate();
        const formArray = (this.facilityUtilizatoinForm.get('data') as FormArray);
        formArray.removeAt(i);
    }

    setFacility() {
        const data = JSON.parse(this.customerInfo.facilityUtilization);
        this.data = data;
        this.facilityUtilizatoinForm.patchValue(data);
        if (!ObjectUtil.isEmpty(data.data) && data.data.length > 0) {
            const formArray = (this.facilityUtilizatoinForm.get('data') as FormArray);
            data.data.forEach((d) => {
                formArray.push(this.formBuilder.group({
                    facility: [d.facility],
                    limit: [d.limit],
                    averageUtilization: [d.averageUtilization],
                    utilization: [d.utilization],
                    maximum: [d.maximum],
                    minimum: [d.minimum]
                }));
            });
            this.allCalculate();
        } else {
            this.addUtilization();
        }
    }
    saveFacilityUtilization() {
        this.submitted = true;
        if (this.facilityUtilizatoinForm.invalid) {
            this.scrollToFirstInvalidControl();
            return;
        }
      this.customerInfo.facilityUtilization = JSON.stringify(this.facilityUtilizatoinForm.value);
      this.emitter.emit(this.customerInfo);
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

    calculateTotalAverage(key: string) {
        let total = 0;
        const formArray = this.facilityUtilizatoinForm.get('data').value;
        formArray.forEach(d => {
            total += Number(d[key]);
        });
            this.totals[key] = total;
    }
    allCalculate() {
        this.calculateTotalAverage('limit');
        this.calculateTotalAverage('averageUtilization');
        this.calculateTotalAverage('utilization');
        this.calculateTotalAverage('maximum');
        this.calculateTotalAverage('minimum');
    }
    fillTable() {
           this.facilityUtilizatoinForm.patchValue({
               overdraftUtilization: this.overdraftUtilizationTable,
               letterOfCreditIssued: this.letterOfCreditIssuedTable,
               bankGuaranteeIssued: this.bankGuaranteeIssuedTable,
               oneOffLoansApproved: this.oneOffLoansApprovedTable
           });
    }
}
