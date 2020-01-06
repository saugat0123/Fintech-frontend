import {Component , Input , OnInit} from '@angular/core';
import {FormArray , FormBuilder , FormGroup} from '@angular/forms';


@Component({
    selector: 'app-security-detail' ,
    templateUrl: './security-detail.component.html' ,
    styleUrls: ['./security-detail.component.scss']
})
export class SecurityDetailComponent implements OnInit {
    securityGroup: FormGroup;
    @Input() data: any;
    @Input() finalValuatorName;

    constructor(
        private securityBuilder: FormBuilder
    ) {
    }

    ngOnInit() {
        this.formBuild();
        if (this.data !== undefined) {
            this.data.securityDetail.securityArray.forEach((value) => this.setSecurityDetail(value));

        } else {
            this.addSecurityDetail();
        }
    }

    formBuild() {
        this.securityGroup = this.securityBuilder.group({securityArray: this.securityBuilder.array([])});
    }

    addSecurityDetail() {
        const addDetail = this.securityGroup.get('securityArray') as FormArray;
        addDetail.push(
            this.securityBuilder.group({
                details: [undefined] ,
                against: [undefined] ,
                fmv: [undefined] ,
                interestRate: [undefined] ,
                dv: [undefined] ,
                validatorName: [undefined] ,
                valuationDate: [undefined] ,
                number: [undefined] ,
                couponRate: [undefined] ,
                amount: [undefined] ,
                expiryDate: [undefined] ,
                beneficiary: [undefined] ,
                fdAmount: [undefined] ,
                value: [undefined] ,
                shareValue: [undefined] ,
                securityType: [undefined]
            })
        );
    }

    setSecurityDetail(value) {
        const addDetail = this.securityGroup.get('securityArray') as FormArray;
        addDetail.push(
            this.securityBuilder.group({
                details: [value.details] ,
                against: [value.against] ,
                fmv: [value.fmv] ,
                interestRate: [value.interestRate] ,
                dv: [value.dv] ,
                validatorName: [value.validatorName] ,
                valuationDate: [value.valuatedDate] ,
                number: [value.number] ,
                couponRate: [value.couponRate] ,
                amount: [value.amount] ,
                expiryDate: [value.expiryDate] ,
                beneficiary: [value.beneficiary] ,
                fdAmount: [value.fdAmount] ,
                value: [value.value] ,
                shareValue: [value.shareValue] ,
                securityType: [value.securityType]
            })
        );
    }

    removeSecurityDetail(index) {
        (this.securityGroup.get('securityArray') as FormArray).removeAt(index);
    }

}
