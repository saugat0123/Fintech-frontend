import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {FiscalYearService} from '../../../../../admin/service/fiscal-year.service';
import {FiscalYear} from '../../../../../admin/modal/FiscalYear';
import {OtherCompanyDetail} from '../../../../../admin/modal/otherCompanyDetail';
import {NrbDirective} from '../../../../../admin/modal/nrbDirective';

@Component({
    selector: 'app-company-other-detail',
    templateUrl: './company-other-detail.component.html',
    styleUrls: ['./company-other-detail.component.scss']
})
export class CompanyOtherDetailComponent implements OnInit {
    @Input() companyOtherDetail;
    companyOtherDetailGroupForm: FormGroup;
    submitted = false;
    fiscalYears: Array<FiscalYear> = [];
    submitData: OtherCompanyDetail;
    nrbDirective = NrbDirective.enumObject();

    constructor(private formBuilder: FormBuilder,
                private fiscalYearService: FiscalYearService) {
    }

    get form() {
        return this.companyOtherDetailGroupForm.controls;
    }

    ngOnInit() {
        this.fiscalYearService.getAll().subscribe(response => {
            this.fiscalYears = response.detail;
        });
        this.buildForm();
        this.setData();
    }

    setData() {
        console.log(this.companyOtherDetail);
        if (!ObjectUtil.isEmpty(this.companyOtherDetail)) {
            this.companyOtherDetailGroupForm.patchValue(this.companyOtherDetail);
        }
    }

    buildForm() {
        this.companyOtherDetailGroupForm = this.formBuilder.group({
            taxClearanceTill: [undefined],
            taxClearanceRemark: [undefined],
            ClassificationByNRB: [undefined],
            negativeList: [undefined],
            negativeListRemark: [undefined],
        });
    }

    onSubmit() {
        this.submitted = true;
        this.submitData = this.companyOtherDetailGroupForm.value;
    }

    /*ngOnChanges(changes: SimpleChanges): void {
      if (!ObjectUtil.isEmpty(changes.companyOtherDetail.currentValue && !ObjectUtil.isEmpty(this.companyOtherDetailGroupForm))) {
        console.log(changes.companyOtherDetail.currentValue);
        this.companyOtherDetailGroupForm.patchValue(changes.companyOtherDetail.currentValue);
      }
    }*/
}
