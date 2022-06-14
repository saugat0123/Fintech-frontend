import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Editor} from '../../../../@core/utils/constants/editor';
import {Security} from '../../../loan/model/security';
import {CalendarType} from '../../../../@core/model/calendar-type';

@Component({
  selector: 'app-corporation-guarantee',
  templateUrl: './corporation-guarantee.component.html',
  styleUrls: ['./corporation-guarantee.component.scss']
})
export class CorporationGuaranteeComponent implements OnInit {
    corporateForm: FormGroup;
    submitted = false;
    ckeConfig;
    @Input() security: Security;
    @Input() isEdit = false;
    @Input() calendarType: CalendarType;


    constructor(private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.configEditor();
        this.buildForm();
        if (this.isEdit) {
            this.setCorporateGuarantee();
        } else {
            this.addCorporateGuarantee();
        }
    }

    setCorporateGuarantee() {
        const formData = JSON.parse(this.security.data);
        const corporateGuaranteeData = this.corporateForm.get('corporateGuarantee') as FormArray;
        corporateGuaranteeData.push(
            this.formBuilder.group({
                name: [formData.name],
                address: [formData.address],
                keyPerson: [formData.keyPerson],
                email: [formData.email],
                phoneNumber: [formData.phoneNumber],
                considerValue: [formData.considerValue],
                fairMarketValue: [formData.fairMarketValue],
                distressValue: [formData.distressValue],
                otherDetail: [formData.otherDetail],
                corporateGuaranteeFirstValuationDate: [new Date(formData.corporateGuaranteeFirstValuationDate)]
            })
        );
    }

    configEditor() {
        this.ckeConfig = Editor.CK_CONFIG;
    }

    private buildForm(): FormGroup {
        return this.corporateForm = this.formBuilder.group({
            corporateGuarantee: this.formBuilder.array([])
        });
    }

  public addCorporateGuarantee(): void {
    (this.corporateForm.get('corporateGuarantee') as FormArray).push(this.corporateDetailsFormGroup());
  }

  public removeCorporate(index: number): void {
    (<FormArray>this.corporateForm.get('corporateGuarantee')).removeAt(index);
  }

  public corporateDetailsFormGroup(): FormGroup {
    return this.formBuilder.group({
          name: [undefined, Validators.required],
          address: [undefined],
          keyPerson: [undefined],
          email: [undefined],
          phoneNumber: [undefined],
          considerValue: 0,
          fairMarketValue: [undefined],
          distressValue: [undefined],
          otherDetail: [undefined],
          corporateGuaranteeFirstValuationDate: [undefined]
        }
    );
  }

}
