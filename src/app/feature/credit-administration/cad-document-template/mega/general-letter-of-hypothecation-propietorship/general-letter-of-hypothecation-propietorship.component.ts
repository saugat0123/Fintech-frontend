import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CustomerInfoData} from '../../../../loan/model/customerInfoData';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
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
    selector: 'app-general-letter-of-hypothecation-propietorship',
    templateUrl: './general-letter-of-hypothecation-propietorship.component.html',
    styleUrls: ['./general-letter-of-hypothecation-propietorship.component.scss']
})
export class GeneralLetterOfHypothecationPropietorshipComponent implements OnInit {

    HypothecationPropietorship: FormGroup;
    @Input() customerInfo: CustomerInfoData;
    @Input() cadData: CustomerApprovedLoanCadDocumentation;
    @Input() documentId: number;
    @Input() customerLoanId: number;
    nepData;
    guarantorData;
    submitted = false;
    initialInfo;

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
                    this.HypothecationPropietorship.patchValue(JSON.parse(singleCadFile.initialInformation));
                }
            });
        }
        if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
            this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
            this.guarantorData = Object.values(this.nepData.guarantorDetails);
        }
        if (!ObjectUtil.isEmpty(this.initialInfo)) {
            this.HypothecationPropietorship.patchValue(this.initialInfo);
        } else {
            this.fillForm();
        }
    }

    buildForm() {
        this.HypothecationPropietorship = this.formBuilder.group({
            bankBranchName: [undefined],
            guarantorGrandFatherName: [undefined],
            guarrantorFatherName: [undefined],
            guarantorDistrict: [undefined],
            guarantorMunicipalityOrVdc: [undefined],
            Municipality: [undefined],
            guarantorWardNo: [undefined],
            guarantorName: [undefined],
            guarantorDistrict1: [undefined],
            docWrittenYear: [undefined],
            docWrittenMonth: [undefined],
            docWrittenDay: [undefined],
            date: [undefined],
            registerNum: [undefined],
            AuthorizedPersonName: [undefined],
            guarantorAge: [undefined],
        });
    }

    fillForm() {
        this.HypothecationPropietorship.patchValue({
            guarantorGrandFatherName: !ObjectUtil.isEmpty(this.nepData.authorizedPersonDetail) ?
                this.nepData.authorizedPersonDetail.grandFatherName : '',
            guarrantorFatherName: !ObjectUtil.isEmpty(this.nepData.authorizedPersonDetail) ?
                this.nepData.authorizedPersonDetail.fatherName : '',
            guarantorMunicipalityOrVdc: !ObjectUtil.isEmpty(this.nepData.institutionRegisteredAddress) ?
                this.nepData.institutionRegisteredAddress.municipality : '',
            Municipality: !ObjectUtil.isEmpty(this.nepData.companyRegOffice) ?
                this.nepData.companyRegOffice : '',
            guarantorWardNo: !ObjectUtil.isEmpty(this.nepData.institutionRegisteredAddress) ?
                this.nepData.institutionRegisteredAddress.wardNo : '',
            guarantorAge: [undefined],
            guarantorName: !ObjectUtil.isEmpty(this.nepData.nepaliName) ?
                this.nepData.nepaliName : '',
            guarantorDistrict1: !ObjectUtil.isEmpty(this.nepData.institutionRegisteredAddress) ?
                this.nepData.institutionRegisteredAddress.district : '',
            date: !ObjectUtil.isEmpty(this.nepData.regIssueDate) ?
                this.nepData.regIssueDate : '',
            registerNum: !ObjectUtil.isEmpty(this.nepData.registrationNo) ?
                this.nepData.registrationNo : '',
            AuthorizedPersonName: !ObjectUtil.isEmpty(this.nepData.authorizedPersonDetail) ?
                this.nepData.authorizedPersonDetail.name : '',
            bankBranchName: !ObjectUtil.isEmpty(this.nepData.companyRegOffice) ?
                this.nepData.companyRegOffice : '',
            guarantorDistrict: !ObjectUtil.isEmpty(this.nepData.institutionRegisteredAddress) ?
                this.nepData.institutionRegisteredAddress.district : '',

        });
    }


    changeToNepAmount(event: any, target, from) {
        this.HypothecationPropietorship.get([target]).patchValue(event.nepVal);
        this.HypothecationPropietorship.get([from]).patchValue(event.val);
    }

    patchFunction(target) {
        const patchValue1 = this.HypothecationPropietorship.get([target]).value;
        return patchValue1;
    }

    submit() {
        let flag = true;
        if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
            this.cadData.cadFileList.forEach(singleCadFile => {
                if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
                    flag = false;
                    singleCadFile.initialInformation = JSON.stringify(this.HypothecationPropietorship.value);
                }
            });
            if (flag) {
                const cadFile = new CadFile();
                const document = new Document();
                cadFile.initialInformation = JSON.stringify(this.HypothecationPropietorship.value);
                document.id = this.documentId;
                cadFile.cadDocument = document;
                cadFile.customerLoanId = this.customerLoanId;
                this.cadData.cadFileList.push(cadFile);
            }
        } else {
            const cadFile = new CadFile();
            const document = new Document();
            cadFile.initialInformation = JSON.stringify(this.HypothecationPropietorship.value);
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
