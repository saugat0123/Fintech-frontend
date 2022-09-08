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
    selector: 'app-vehicle-loan-deed-partnership',
    templateUrl: './vehicle-loan-deed-partnership.component.html',
    styleUrls: ['./vehicle-loan-deed-partnership.component.scss']
})
export class VehicleLoanDeedPartnershipComponent implements OnInit {
    @Input() cadData: CustomerApprovedLoanCadDocumentation;
    @Input() documentId: number;
    @Input() customerLoanId: number;
    vehicleLoanDeedPartnership: FormGroup;
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
            this.vehicleLoanDeedPartnership.patchValue(this.initialInfo);
        } else {
            this.fillForm();
        }
    }

    buildForm() {
        this.vehicleLoanDeedPartnership = this.formBuilder.group({
            branchOfficeAddress: [undefined],
            companyRegistrationOffice: [undefined],
            act: [undefined],
            regNo: [undefined],
            regDate: [undefined],
            metropolitan: [undefined],
            wardNo: [undefined],
            borrowerName: [undefined],
            authorizedPerson1GrandFather: [undefined],
            authorizedPerson1Father: [undefined],
            authorizedPerson1Husband: [undefined],
            authorizedPerson1District: [undefined],
            authorizedPerson1Metropolitan: [undefined],
            authorizedPerson1WardNo: [undefined],
            authorizedPerson1Age: [undefined],
            authorizedPerson1: [undefined],
            authorizedPerson2GrandFather: [undefined],
            authorizedPerson2Father: [undefined],
            authorizedPerson2Husband: [undefined],
            authorizedPerson2District: [undefined],
            authorizedPerson2Metropolitan: [undefined],
            authorizedPerson2WardNo: [undefined],
            authorizedPerson2Age: [undefined],
            authorizedPerson2: [undefined],
            loanAmount: [undefined],
            loanAmountInWords: [undefined],
            offerLetterIssuedDate: [undefined],
            witness1: [undefined],
            witness2: [undefined],
            district: [undefined],
            age: [undefined],
            sambatYear: [undefined],
            sambatMonth: [undefined],
            sambatDay: [undefined],
            sambatDate: [undefined],
            shubham: [undefined],
            engineNo: [undefined],
            vehicleCompany: [undefined],
            vehicleModel: [undefined],
            vehicleRegNo: [undefined],
            witness3: [undefined],
            chassisNo: [undefined],
        });
    }

    fillForm() {
        this.vehicleLoanDeedPartnership.patchValue({
                branchOfficeAddress: [!ObjectUtil.isEmpty(this.nepData.branchDetail) ? this.nepData.branchDetail.branchNameInNepali : ''],
                companyRegistrationOffice: [!ObjectUtil.isEmpty(this.nepData.companyRegOffice) ? this.nepData.companyRegOffice : ''],
                regDate: [!ObjectUtil.isEmpty(this.nepData.regIssueDate) ? this.nepData.regIssueDate : ''],
                regNo: [!ObjectUtil.isEmpty(this.nepData.registrationNo) ? this.nepData.registrationNo : ''],
                district: [!ObjectUtil.isEmpty
                (this.nepData.institutionRegisteredAddress) ? this.nepData.institutionRegisteredAddress.district : ''],
                metropolitan: [!ObjectUtil.isEmpty
                (this.nepData.institutionRegisteredAddress) ? this.nepData.institutionRegisteredAddress.district : ''],
                wardNo: [!ObjectUtil.isEmpty
                (this.nepData.institutionRegisteredAddress) ? this.nepData.institutionRegisteredAddress.municipality : ''],
                borrowerName: [!ObjectUtil.isEmpty
                (this.nepData.nepaliName) ? this.nepData.nepaliName : ''],
                authorizedPerson1GrandFather: [!ObjectUtil.isEmpty
                (this.nepData.authorizedPersonDetail) ? this.nepData.authorizedPersonDetail.grandFatherName : ''],
                authorizedPerson1Father: [!ObjectUtil.isEmpty
                (this.nepData.authorizedPersonDetail) ? this.nepData.authorizedPersonDetail.fatherName : ''],
                authorizedPerson1Husband: [!ObjectUtil.isEmpty
                (this.nepData.authorizedPersonDetail) ? this.nepData.authorizedPersonDetail.husbandName : ''],
                authorizedPerson1District: [!ObjectUtil.isEmpty
                (this.nepData.authorizedPersonAddress) ? this.nepData.authorizedPersonAddress.district : ''],
                authorizedPerson1Metropolitan: [!ObjectUtil.isEmpty
                (this.nepData.authorizedPersonAddress) ? this.nepData.authorizedPersonAddress.municipality : ''],
                authorizedPerson1WardNo: [!ObjectUtil.isEmpty
                (this.nepData.authorizedPersonAddress) ? this.nepData.authorizedPersonAddress.wardNo : ''],
                authorizedPerson1: [!ObjectUtil.isEmpty
                (this.nepData.authorizedPersonDetail) ? this.nepData.authorizedPersonDetail.name : ''],
                offerLetterIssuedDate: [!ObjectUtil.isEmpty
                (this.nepData.miscellaneousDetail) ? this.nepData.miscellaneousDetail.offerIssueDate : ''],
                loanAmount: [!ObjectUtil.isEmpty(this.nepData.miscellaneousDetail) ? this.nepData.miscellaneousDetail.loanAmountInFig : ''],
                loanAmountInWords: [!ObjectUtil.isEmpty(this.nepData.miscellaneousDetail) ?
                    this.nepData.miscellaneousDetail.loanAmountInWord : ''],
            }
        );
    }

    submit() {
        let flag = true;
        if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
            this.cadData.cadFileList.forEach(singleCadFile => {
                if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
                    flag = false;
                    singleCadFile.initialInformation = JSON.stringify(this.vehicleLoanDeedPartnership.value);
                }
            });
            if (flag) {
                const cadFile = new CadFile();
                const document = new Document();
                cadFile.initialInformation = JSON.stringify(this.vehicleLoanDeedPartnership.value);
                document.id = this.documentId;
                cadFile.cadDocument = document;
                cadFile.customerLoanId = this.customerLoanId;
                this.cadData.cadFileList.push(cadFile);
            }
        } else {
            const cadFile = new CadFile();
            const document = new Document();
            cadFile.initialInformation = JSON.stringify(this.vehicleLoanDeedPartnership.value);
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

    changeToNepAmount(event: any, target, from) {
        this.vehicleLoanDeedPartnership.get([target]).patchValue(event.nepVal);
        this.vehicleLoanDeedPartnership.get([from]).patchValue(event.val);
    }

    patchFunction(target) {
        const patchValue1 = this.vehicleLoanDeedPartnership.get([target]).value;
        return patchValue1;
    }
}
