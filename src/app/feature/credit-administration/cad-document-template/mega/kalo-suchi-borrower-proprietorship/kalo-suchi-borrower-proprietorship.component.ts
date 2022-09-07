import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {ToastService} from '../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CadFile} from '../../../model/CadFile';
import {Document} from '../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';

@Component({
    selector: 'app-kalo-suchi-borrower-proprietorship',
    templateUrl: './kalo-suchi-borrower-proprietorship.component.html',
    styleUrls: ['./kalo-suchi-borrower-proprietorship.component.scss']
})
export class KaloSuchiBorrowerProprietorshipComponent implements OnInit {

    @Input() cadData: CustomerApprovedLoanCadDocumentation;
    @Input() documentId: number;
    @Input() customerLoanId: number;
    form: FormGroup;
    nepData;
    initialInfo;

    constructor(private formBuilder: FormBuilder,
                private administrationService: CreditAdministrationService,
                private toastService: ToastService,
                private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
                private routerUtilsService: RouterUtilsService
    ) {
    }

    ngOnInit() {
        this.buildForm();
        if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
            this.cadData.cadFileList.forEach(singleCadFile => {
                if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
                    this.initialInfo = JSON.parse(singleCadFile.initialInformation);
                }
            });
        }
        if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
            this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
        }
        if (!ObjectUtil.isEmpty(this.initialInfo)) {
            this.form.patchValue(this.initialInfo);
        } else {
            this.fillForm();
        }
    }

    buildForm() {
        this.form = this.formBuilder.group({
            debtor: [undefined],
            district: [undefined],
            municipality: [undefined],
            ward: [undefined],
            tole: [undefined],
            loanFacilityTypeNep: [undefined],
            approver: [undefined],
            approverDistrict: [undefined],
            approverMunicipality: [undefined],
            approverWard: [undefined],
            approverTole: [undefined],
            date: [undefined]
        });
    }

    fillForm() {
        this.form.patchValue({
            debtor: !ObjectUtil.isEmpty(this.nepData.nepaliName) ? this.nepData.nepaliName : '',
            district: !ObjectUtil.isEmpty(this.nepData.institutionRegisteredAddress.district) ?
                this.nepData.institutionRegisteredAddress.district : '',
            municipality: !ObjectUtil.isEmpty(this.nepData.institutionRegisteredAddress.municipality) ?
                this.nepData.institutionRegisteredAddress.municipality : '',
            ward: !ObjectUtil.isEmpty(this.nepData.institutionRegisteredAddress.wardNo) ? this.nepData.institutionRegisteredAddress.wardNo : '',
            tole: !ObjectUtil.isEmpty(this.nepData.institutionRegisteredAddress.tole) ? this.nepData.institutionRegisteredAddress.tole : '',
            loanFacilityTypeNep: !ObjectUtil.isEmpty(this.nepData.miscellaneousDetail.loanFacilityTypeInNep) ?
                this.nepData.miscellaneousDetail.loanFacilityTypeInNep : '',
            approver: !ObjectUtil.isEmpty(this.nepData.nepaliName) ? this.nepData.nepaliName : '',
            approverDistrict: !ObjectUtil.isEmpty(this.nepData.institutionRegisteredAddress.district) ?
                this.nepData.institutionRegisteredAddress.district : '',
            approverMunicipality: !ObjectUtil.isEmpty(this.nepData.institutionRegisteredAddress.municipality) ?
                this.nepData.institutionRegisteredAddress.municipality : '',
            approverWard: !ObjectUtil.isEmpty(this.nepData.institutionRegisteredAddress.wardNo) ?
                this.nepData.institutionRegisteredAddress.wardNo : '',
            approverTole: !ObjectUtil.isEmpty(this.nepData.institutionRegisteredAddress.tole) ?
                this.nepData.institutionRegisteredAddress.tole : '',
            date: undefined,
        });
    }

    submit() {
        let flag = true;
        if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
            this.cadData.cadFileList.forEach(singleCadFile => {
                if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
                    flag = false;
                    singleCadFile.initialInformation = JSON.stringify(this.form.value);
                }
            });
            if (flag) {
                const cadFile = new CadFile();
                const document = new Document();
                cadFile.initialInformation = JSON.stringify(this.form.value);
                document.id = this.documentId;
                cadFile.cadDocument = document;
                cadFile.customerLoanId = this.customerLoanId;
                this.cadData.cadFileList.push(cadFile);
            }
        } else {
            const cadFile = new CadFile();
            const document = new Document();
            cadFile.initialInformation = JSON.stringify(this.form.value);
            document.id = this.documentId;
            cadFile.cadDocument = document;
            cadFile.customerLoanId = this.customerLoanId;
            this.cadData.cadFileList.push(cadFile);
        }

        this.administrationService.saveCadDocumentBulk(this.cadData).subscribe(() => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
            this.dialogRef.close();
            this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
            this.dialogRef.close();
        });
    }

}



