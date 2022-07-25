import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CadCheckListTemplateEnum} from '../../../../../admin/modal/cadCheckListTemplateEnum';
import {CadFile} from '../../../../model/CadFile';
import {Document} from '../../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';

@Component({
    selector: 'app-promisory-note-institutional',
    templateUrl: './promisory-note-institutional.component.html',
    styleUrls: ['./promisory-note-institutional.component.scss']
})
export class PromisoryNoteInstitutionalComponent implements OnInit {

    @Input() cadData;
    @Input() documentId;
    @Input() customerLoanId;
    form: FormGroup;
    spinner = false;
    amount;
    customerInfo;
    initialInfoPrint;
    nepaliData;
    cadChecklistEnum = CadCheckListTemplateEnum;
    individual = false;
    constructor(
        private formBuilder: FormBuilder,
        private administrationService: CreditAdministrationService,
        private toastService: ToastService,
        private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
        private routerUtilsService: RouterUtilsService,
    ) {
    }


    ngOnInit() {
        if (this.cadData.assignedLoan[0].loanCategory === 'INDIVIDUAL') {
            this.individual = true;
        }
        this.buildForm();
        if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
            this.cadData.cadFileList.forEach(singleCadFile => {
                if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
                    this.initialInfoPrint = JSON.parse(singleCadFile.supportedInformation);
                }
            });
        }
        if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
            this.nepaliData = JSON.parse(this.cadData.loanHolder.nepData);
        }
        this.fillNepaliData();
    }

    setFreeText() {
        const freeText = {
            district: this.form.get('district').value ? this.form.get('district').value : '',
            municipality: this.form.get('municipality').value ? this.form.get('municipality').value : '',
            wardNum: this.form.get('wardNum').value ? this.form.get('wardNum').value : '',
            age: this.form.get('age').value ? this.form.get('age').value : '',
            sakshiName: this.form.get('sakshiName').value ? this.form.get('sakshiName').value : '',
            districtTwo: this.form.get('districtTwo').value ? this.form.get('districtTwo').value : '',
            municipalityTwo: this.form.get('municipalityTwo').value ? this.form.get('municipalityTwo').value : '',
            wardNumTwo: this.form.get('wardNumTwo').value ? this.form.get('wardNumTwo').value : '',
            ageTwo: this.form.get('ageTwo').value ? this.form.get('ageTwo').value : '',
            sakshiNameTwo: this.form.get('sakshiNameTwo').value ? this.form.get('sakshiNameTwo').value : '',
            role: this.form.get('role').value ? this.form.get('role').value : '',
            roleName: this.form.get('roleName').value ? this.form.get('roleName').value : '',
            itiSambatYear: this.form.get('itiSambatYear').value ? this.form.get('itiSambatYear').value : '',
            itiSambatMonth: this.form.get('itiSambatMonth').value ? this.form.get('itiSambatMonth').value : '',
            itiSambatDay: this.form.get('itiSambatDay').value ? this.form.get('itiSambatDay').value : '',
            roj: this.form.get('roj').value ? this.form.get('roj').value : '',
        };
        return JSON.stringify(freeText);
    }

    fillNepaliData() {
        this.form.patchValue({
            branch: this.nepaliData.branchDetail.branchNameInNepali ? this.nepaliData.branchDetail.branchNameInNepali : '',
            district: this.initialInfoPrint ? this.initialInfoPrint.district : '',
            municipality: this.initialInfoPrint ? this.initialInfoPrint.municipality : '',
            wardNum: this.initialInfoPrint ? this.initialInfoPrint.wardNum : '',
            age: this.initialInfoPrint ? this.initialInfoPrint.age : '',
            sakshiName: this.initialInfoPrint ? this.initialInfoPrint.sakshiName : '',
            districtTwo: this.initialInfoPrint ? this.initialInfoPrint.districtTwo : '',
            municipalityTwo: this.initialInfoPrint ? this.initialInfoPrint.municipalityTwo : '',
            wardNumTwo: this.initialInfoPrint ? this.initialInfoPrint.wardNumTwo : '',
            ageTwo: this.initialInfoPrint ? this.initialInfoPrint.ageTwo : '',
            sakshiNameTwo: this.initialInfoPrint ? this.initialInfoPrint.sakshiNameTwo : '',
            role: this.initialInfoPrint ? this.initialInfoPrint.role : '',
            roleName: this.initialInfoPrint ? this.initialInfoPrint.roleName : '',
            itiSambatYear: this.initialInfoPrint ? this.initialInfoPrint.itiSambatYear : '',
            itiSambatMonth: this.initialInfoPrint ? this.initialInfoPrint.itiSambatMonth : '',
            itiSambatDay: this.initialInfoPrint ? this.initialInfoPrint.itiSambatDay : '',
            roj: this.initialInfoPrint ? this.initialInfoPrint.roj : '',
        });
    }
    submit() {
        this.spinner = true;
        let flag = true;
        if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
            this.cadData.cadFileList.forEach(singleCadFile => {
                if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
                    flag = false;
                    singleCadFile.supportedInformation = this.setFreeText();
                }
            });
            if (flag) {
                const cadFile = new CadFile();
                const document = new Document();
                cadFile.supportedInformation = this.setFreeText();
                document.id = this.documentId;
                cadFile.cadDocument = document;
                cadFile.customerLoanId = this.customerLoanId;
                this.cadData.cadFileList.push(cadFile);
            }
        } else {
            const cadFile = new CadFile();
            const document = new Document();
            cadFile.supportedInformation = this.setFreeText();
            document.id = this.documentId;
            cadFile.cadDocument = document;
            cadFile.customerLoanId = this.customerLoanId;
            this.cadData.cadFileList.push(cadFile);
        }

        this.administrationService.saveCadDocumentBulk(this.cadData).subscribe(() => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
            this.dialogRef.close();
            this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
            this.spinner = false;
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
            this.dialogRef.close();
            this.spinner = false;
        });
    }
    buildForm() {
        this.form = this.formBuilder.group({
            branch: [undefined],
            district: [undefined],
            municipality: [undefined],
            wardNum: [undefined],
            age: [undefined],
            sakshiName: [undefined],
            districtTwo: [undefined],
            municipalityTwo: [undefined],
            wardNumTwo: [undefined],
            ageTwo: [undefined],
            sakshiNameTwo: [undefined],
            role: [undefined],
            roleName: [undefined],
            itiSambatYear: [undefined],
            itiSambatMonth: [undefined],
            itiSambatDay: [undefined],
            roj: [undefined],
        });
    }
}
