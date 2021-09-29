import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
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
import {NabilDocumentChecklist} from '../../../../admin/modal/nabil-document-checklist.enum';

@Component({
    selector: 'app-loan-deed-individual',
    templateUrl: './loan-deed-individual.component.html',
    styleUrls: ['./loan-deed-individual.component.scss']
})
export class LoanDeedIndividualComponent implements OnInit {
    loanDeedIndividual: FormGroup;
    individualData;
    @Input() cadData: CustomerApprovedLoanCadDocumentation;
    @Input() documentId: number;
    @Input() customerLoanId: number;
    initialInfoPrint;
    offerLetterConst = NabilDocumentChecklist;

    constructor(private formBuilder: FormBuilder,
                private administrationService: CreditAdministrationService,
                private toastService: ToastService,
                private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
                private routerUtilsService: RouterUtilsService) { }

    ngOnInit() {
        this.buildForm();
        console.log('This is cad Approved doc ', this.cadData);
        if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
            this.cadData.cadFileList.forEach(individualCadFile => {
                if (individualCadFile.customerLoanId === this.customerLoanId && individualCadFile.cadDocument.id === this.documentId) {
                    const initialInfo = JSON.parse(individualCadFile.initialInformation);
                    this.initialInfoPrint = initialInfo;
                    this.loanDeedIndividual.patchValue(initialInfo);
                }
            });
        }
        if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
            this.individualData = JSON.parse(this.cadData.loanHolder.nepData);
        }
        console.log("individual data: ", this.individualData);
        this.fillForm();

    }

    buildForm() {
        this.loanDeedIndividual = this.formBuilder.group({
            branch: [undefined],
            name: [undefined],
            permanentDistrict: [undefined],
            permanentMunicipality: [undefined],
            placeName: [undefined],
            branchName: [undefined],
            grandFatherName: [undefined],
            fatherName: [undefined],
            fatherInLawName: [undefined],
            husbandName: [undefined],
            District: [undefined],
            Municipality: [undefined],
            WadNo: [undefined],
            age: [undefined],
            borrowerName: [undefined],
            issueDate: [undefined],
            facilityName: [undefined],
            loanAmount: [undefined],
            Interest: [undefined],
            expiryDate: [undefined],
            totalLoanAmount: [undefined],
            totalLoanAmountWord: [undefined],
            propertyOwnerName: [undefined],
            plotNo: [undefined],
            area: [undefined],
            year: [undefined],
            month: [undefined],
            day: [undefined],
            time: [undefined],
            propertyOwnerName1: [undefined],
            District1: [undefined],
            Municipality1: [undefined],
            WadNo1: [undefined],
            plotNo1: [undefined],
            area1: [undefined]
        });
    }

    fillForm(){
        this.loanDeedIndividual.patchValue(
            {
                branchName: this.individualData.branch.ct,
                grandFatherName: this.individualData.grandFatherName.ct,
                fatherName: this.individualData.fatherName.ct,
                District: this.individualData.permanentDistrict.ct,
                Municipality: this.individualData.permanentMunicipality.ct,
                WadNo: this.individualData.permanentWard.ct,
                borrowerName: this.individualData.name.ct,
            }
        )
    }

    submit() {
        let flag = true;
        if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
            this.cadData.cadFileList.forEach(individualCadFile => {
                if (individualCadFile.customerLoanId === this.customerLoanId && individualCadFile.cadDocument.id === this.documentId) {
                    flag = false;
                    individualCadFile.initialInformation = JSON.stringify(this.loanDeedIndividual.value);
                }
            });
            if (flag) {
                const cadFile = new CadFile();
                const document = new Document();
                cadFile.initialInformation = JSON.stringify(this.loanDeedIndividual.value);
                this.initialInfoPrint = cadFile.initialInformation;
                document.id = this.documentId;
                cadFile.cadDocument = document;
                cadFile.customerLoanId = this.customerLoanId;
                this.cadData.cadFileList.push(cadFile);
            }
            } else {
                const cadFile = new CadFile();
                const document = new Document();
                cadFile.initialInformation = JSON.stringify(this.loanDeedIndividual.value);
                this.initialInfoPrint = cadFile.initialInformation;
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
}
