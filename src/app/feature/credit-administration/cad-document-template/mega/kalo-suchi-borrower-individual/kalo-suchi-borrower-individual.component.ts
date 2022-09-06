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
    selector: 'app-kalo-suchi-borrower-individual',
    templateUrl: './kalo-suchi-borrower-individual.component.html',
    styleUrls: ['./kalo-suchi-borrower-individual.component.scss']
})
export class KaloSuchiBorrowerIndividualComponent implements OnInit {

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
        if (!ObjectUtil.isEmpty(this.initialInfo)) {
            this.form.patchValue(this.initialInfo);
        } else {
            this.filForm();
        }
        if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
            this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
        }
    }

    buildForm() {
        this.form = this.formBuilder.group({
            municipality: [undefined],
            approver: [undefined],
            debtor: [undefined],
            approverDistrict: [undefined],
            approverMunicipality: [undefined],
            approverWard: [undefined],
            approverTole: [undefined],
            approverCurProvince: [undefined],
            approverCurDistrict: [undefined],
            approverCurMunicipality: [undefined],
            approverCurWard: [undefined],
            ward: [undefined],
            district: [undefined],
            tole: [undefined],
            curProvince: [undefined],
            curDistrict: [undefined],
            curMunicipality: [undefined],
            curWard: [undefined],
            loanFacilityTypeNep: [undefined],
            fatherInLawName: [undefined],
            fatherName: [undefined],
            husbandName: [undefined],
            citizenshipNo: [undefined],
            citizenshipIssuedDate: [undefined],
            citizenshipIssuingOffice: [undefined],
            date: [undefined],
        });
    }

    filForm() {
        this.form.patchValue({
            debtor: !ObjectUtil.isEmpty(this.nepData.nepaliName) ? this.nepData.nepaliName : '',
            district: !ObjectUtil.isEmpty(this.nepData.customerPermanentAddress.district) ?
                this.nepData.customerPermanentAddress.district : '',
            municipality: !ObjectUtil.isEmpty(this.nepData.customerPermanentAddress.municipality) ?
                this.nepData.customerPermanentAddress.municipality : '',
            ward: !ObjectUtil.isEmpty(this.nepData.customerPermanentAddress.wardNo) ? this.nepData.customerPermanentAddress.wardNo : '',
            tole: !ObjectUtil.isEmpty(this.nepData.customerPermanentAddress.tole) ? this.nepData.customerPermanentAddress.tole : '',
            curProvince: undefined,
            curDistrict: !ObjectUtil.isEmpty(this.nepData.customerTemporaryAddress.district) ?
                this.nepData.customerTemporaryAddress.district : '',
            curMunicipality: !ObjectUtil.isEmpty(this.nepData.customerTemporaryAddress.municipality) ?
                this.nepData.customerTemporaryAddress.municipality : '',
            curWard: !ObjectUtil.isEmpty(this.nepData.customerTemporaryAddress.wardNo) ?
                this.nepData.customerTemporaryAddress.wardNo : '',
            loanFacilityTypeNep: !ObjectUtil.isEmpty(this.nepData.miscellaneousDetail.loanFacilityTypeInNep) ?
                this.nepData.miscellaneousDetail.loanFacilityTypeInNep : '',
            approver: !ObjectUtil.isEmpty(this.nepData.nepaliName) ? this.nepData.nepaliName : '',
            fatherName: !ObjectUtil.isEmpty(this.nepData.fatherName) ? this.nepData.fatherName : '',
            fatherInLawName: !ObjectUtil.isEmpty(this.nepData.fatherInLawName) ? this.nepData.fatherInLawName : '',
            husbandName: !ObjectUtil.isEmpty(this.nepData.husbandName) ? this.nepData.husbandName : '',
            approverDistrict: !ObjectUtil.isEmpty(this.nepData.customerPermanentAddress.district) ?
                this.nepData.customerPermanentAddress.district : '',
            approverMunicipality: !ObjectUtil.isEmpty(this.nepData.customerPermanentAddress.municipality) ?
                this.nepData.customerPermanentAddress.municipality : '',
            approverWard: !ObjectUtil.isEmpty(this.nepData.customerPermanentAddress.wardNo) ?
                this.nepData.customerPermanentAddress.wardNo : '',
            approverTole: !ObjectUtil.isEmpty(this.nepData.customerPermanentAddress.tole) ?
                this.nepData.customerPermanentAddress.tole : '',
            approverCurProvince: undefined,
            approverCurDistrict: !ObjectUtil.isEmpty(this.nepData.customerTemporaryAddress.district) ?
                this.nepData.customerTemporaryAddress.district : '',
            approverCurMunicipality: !ObjectUtil.isEmpty(this.nepData.customerTemporaryAddress.municipality) ?
                this.nepData.customerTemporaryAddress.municipality : '',
            approverCurWard: !ObjectUtil.isEmpty(this.nepData.customerTemporaryAddress.wardNo) ?
                this.nepData.customerTemporaryAddress.wardNo : '',
            citizenshipNo: !ObjectUtil.isEmpty(this.nepData.citizenshipNo) ? this.nepData.citizenshipNo : '',
            citizenshipIssuedDate: !ObjectUtil.isEmpty(this.nepData.citizenshipIssueDate) ? this.nepData.citizenshipIssueDate : '',
            citizenshipIssuingOffice: !ObjectUtil.isEmpty(this.nepData.citizenshipIssueDistrict) ? this.nepData.citizenshipIssueDistrict : '',
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

