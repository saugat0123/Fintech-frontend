import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomerApprovedLoanCadDocumentation} from '../../model/customerApprovedLoanCadDocumentation';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {RouterUtilsService} from '../../utils/router-utils.service';
import {CreditAdministrationService} from '../../service/credit-administration.service';
import {ToastService} from '../../../../@core/utils';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {NbDialogRef} from '@nebular/theme';

@Component({
    selector: 'app-update-customer-cad-info',
    templateUrl: './update-customer-cad-info.component.html',
    styleUrls: ['./update-customer-cad-info.component.scss']
})
export class UpdateCustomerCadInfoComponent implements OnInit {
    @Input()
    cadData: CustomerApprovedLoanCadDocumentation;
    updateForm: FormGroup;
    spinner = false;
    data = {accountNo: null, accountName: null, issuanceOfMc: null, operativeAc: null, againstPurchaseOf: null};

    constructor(private formBuilder: FormBuilder,
                private routerUtilsService: RouterUtilsService,
                private service: CreditAdministrationService,
                private toastService: ToastService,
                private modalService: NgbModal,
                private dialogRef: NbDialogRef<UpdateCustomerCadInfoComponent>) {
    }

    ngOnInit() {
        if (!ObjectUtil.isEmpty(this.cadData.data)) {
            const basicInfo = JSON.parse(this.cadData.data);
            this.data = basicInfo.acInfo;
            console.log(this.data);
        }
        this.buildForm();
    }

    buildForm() {
        this.updateForm = this.formBuilder.group({
            accountNo: [ObjectUtil.isEmpty(this.data.accountNo) ? undefined : this.data.accountNo, [Validators.required]],
            accountName: [ObjectUtil.isEmpty(this.data.accountName) ? undefined : this.data.accountName, [Validators.required]],
            // tslint:disable-next-line:max-line-length
            againstPurchaseOf: [ObjectUtil.isEmpty(this.data.againstPurchaseOf) ? undefined : this.data.againstPurchaseOf, [Validators.required]],
            issuanceOfMc: [ObjectUtil.isEmpty(this.data.issuanceOfMc) ? undefined : this.data.issuanceOfMc, [Validators.required]],
            operativeAc: [ObjectUtil.isEmpty(this.data.operativeAc) ? undefined : this.data.operativeAc, [Validators.required]],
        });
    }


    submit() {

        this.spinner = true;
        const basicInfo = {
            acInfo: this.updateForm.value
        };
        this.cadData.data = JSON.stringify(basicInfo);
        this.service.saveCadDocumentBulk(this.cadData).subscribe((res:any) => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved  data!!!'));
            this.spinner = false;
            this.dialogRef.close(res.detail);

        }, error => {
            console.log(error);
            this.spinner = false;
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save data!!!'));
        });
    }

    onClose() {
        this.dialogRef.close();
    }
}
