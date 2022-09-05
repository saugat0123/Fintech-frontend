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
    selector: 'app-supplementary-agreement-company',
    templateUrl: './supplementary-agreement-company.component.html',
    styleUrls: ['./supplementary-agreement-company.component.scss']
})
export class SupplementaryAgreementCompanyComponent implements OnInit {

    @Input() cadData: CustomerApprovedLoanCadDocumentation;
    @Input() documentId: number;
    @Input() customerLoanId: number;
    supplementaryAgreementCompany: FormGroup;
    nepData;
    guarantorData;
    submitted = false;

    constructor(private formBuilder: FormBuilder,
                private administrationService: CreditAdministrationService,
                private toastService: ToastService,
                private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
                private routerUtilsService: RouterUtilsService) {
    }

    ngOnInit(): void {
        this.buildForm();
        if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
            this.cadData.cadFileList.forEach(singleCadFile => {
                if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
                    this.supplementaryAgreementCompany.patchValue(JSON.parse(singleCadFile.initialInformation));
                }
            });
        }
        if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
            this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
            this.guarantorData = Object.values(this.nepData.guarantorDetails);
        }
        this.fillForm();
    }

    buildForm() {
        this.supplementaryAgreementCompany = this.formBuilder.group({
            date: [undefined],
            branch: [undefined],
            companyAct: [undefined],
            companyRegistrationOffice: [undefined],
            registrationIssuedDate: [undefined],
            registrationNo: [undefined],
            companyDistrict: [undefined],
            companyMunicipalityVDC: [undefined],
            companyWardNo: [undefined],
            borrowerName: [undefined],
            authorizedPersonName: [undefined],
            date2: [undefined],
            offerLetterIssuedDate: [undefined],
            amount: [undefined],
            amountInWords: [undefined],
            date3: [undefined],
            receiptNo: [undefined],
            receiptDate: [undefined],
            itemDetails: [undefined],
            itemDetails2: [undefined],
        });
    }
    fillForm() {
        this.supplementaryAgreementCompany.patchValue({
                branch: [!ObjectUtil.isEmpty(this.nepData.branchDetail) ? this.nepData.branchDetail.branchName : ''],
                companyRegistrationOffice: [!ObjectUtil.isEmpty(this.nepData.companyRegOffice) ? this.nepData.companyRegOffice : ''],
                registrationIssuedDate: [!ObjectUtil.isEmpty(this.nepData.regIssueDate) ? this.nepData.regIssueDate : ''],
                registrationNo: [!ObjectUtil.isEmpty(this.nepData.registrationNo) ? this.nepData.registrationNo : ''],
                companyDistrict: [!ObjectUtil.isEmpty
                (this.nepData.institutionRegisteredAddress) ? this.nepData.institutionRegisteredAddress.district : ''],
                companyMunicipalityVDC: [!ObjectUtil.isEmpty
                (this.nepData.institutionRegisteredAddress) ? this.nepData.institutionRegisteredAddress.district : ''],
                companyWardNo: [!ObjectUtil.isEmpty
                (this.nepData.institutionRegisteredAddress) ? this.nepData.institutionRegisteredAddress.municipality : ''],
                borrowerName: [!ObjectUtil.isEmpty
                (this.nepData.nepaliName) ? this.nepData.nepaliName : ''],
                authorizedPersonName: [!ObjectUtil.isEmpty
                (this.nepData.authorizedPersonDetail) ? this.nepData.authorizedPersonDetail.name : ''],
                offerLetterIssuedDate: [!ObjectUtil.isEmpty
                (this.nepData.miscellaneousDetail) ? this.nepData.miscellaneousDetail.offerIssueDate : ''],
                amount: [!ObjectUtil.isEmpty(this.nepData.miscellaneousDetail) ? this.nepData.miscellaneousDetail.loanAmountInFig : ''],
                amountInWords: [!ObjectUtil.isEmpty(this.nepData.miscellaneousDetail) ? this.nepData.miscellaneousDetail.loanAmountInWord : ''],
            }
        );
    }
    submit() {
        let flag = true;
        if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
            this.cadData.cadFileList.forEach(singleCadFile => {
                if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
                    flag = false;
                    singleCadFile.initialInformation = JSON.stringify(this.supplementaryAgreementCompany.value);
                }
            });
            if (flag) {
                const cadFile = new CadFile();
                const document = new Document();
                cadFile.initialInformation = JSON.stringify(this.supplementaryAgreementCompany.value);
                document.id = this.documentId;
                cadFile.cadDocument = document;
                cadFile.customerLoanId = this.customerLoanId;
                this.cadData.cadFileList.push(cadFile);
            }
        } else {
            const cadFile = new CadFile();
            const document = new Document();
            cadFile.initialInformation = JSON.stringify(this.supplementaryAgreementCompany.value);
            document.id = this.documentId;
            cadFile.cadDocument = document;
            cadFile.customerLoanId = this.customerLoanId;
            this.cadData.cadFileList.push(cadFile);
        }

        this.administrationService.saveCadDocumentBulk(this.cadData).subscribe(() => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved '));
            this.dialogRef.close();
            this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save '));
            this.dialogRef.close();
        });
    }

    changeToNepAmount(event: any, target, from) {
        this.supplementaryAgreementCompany.get([target]).patchValue(event.nepVal);
        this.supplementaryAgreementCompany.get([from]).patchValue(event.val);
    }

    patchFunction(target) {
        const patchValue1 = this.supplementaryAgreementCompany.get([target]).value;
        return patchValue1;
    }
}
