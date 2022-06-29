import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {CurrencyFormatterPipe} from '../../../../../../@core/pipe/currency-formatter.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliNumberPipe} from '../../../../../../@core/pipe/nepali-number.pipe';
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
        private currencyFormatPipe: CurrencyFormatterPipe,
        private engToNepNumberPipe: EngToNepaliNumberPipe,
        private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
        private nepaliToEnglishPipe: NepaliToEngNumberPipe,
        private nepaliNumber: NepaliNumberPipe,
    ) {
    }


    ngOnInit() {
        if (this.cadData.assignedLoan[0].loanCategory === 'INDIVIDUAL') {
            this.individual = true;
        }
        this.buildForm();
        this.amount = this.cadData.assignedLoan[0].proposal.proposedLimit;
        this.customerInfo = this.cadData.assignedLoan[0].customerInfo;
        if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
            this.cadData.cadFileList.forEach(singleCadFile => {
                if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
                    this.initialInfoPrint = singleCadFile.initialInformation;
                    if (!ObjectUtil.isEmpty(JSON.parse(singleCadFile.initialInformation).proposedAmount)) {
                        this.amount = JSON.parse(singleCadFile.initialInformation).proposedAmount;
                    }
                }
            });
        }
        if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
            this.nepaliData = JSON.parse(this.cadData.loanHolder.nepData);
        }
        this.checkInitialData();
    }



    submit() {
        this.spinner = true;
        let flag = true;
        this.form.patchValue({
            branch: this.cadData.assignedLoan[0].branch.nepaliName
        });
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
            this.spinner = false;
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
            this.dialogRef.close();
            this.spinner = false;
        });
    }
    checkInitialData() {
        if (!ObjectUtil.isEmpty(this.initialInfoPrint)) {
            this.form.patchValue(JSON.parse(this.initialInfoPrint));
            this.form.patchValue({
                amountInWords: this.nepaliCurrencyWordPipe.transform(this.nepaliToEnglishPipe.transform(this.amount)),
                branch: this.cadData.assignedLoan[0].branch.nepaliName
            });
        } else {
            this.fillNepaliData();
            this.form.patchValue({
                proposedAmount: this.nepaliNumber.transform(this.amount, 'preeti'),
                amountInWords: this.nepaliCurrencyWordPipe.transform(this.amount),
                branch: this.cadData.assignedLoan[0].branch.nepaliName
            });
        }
    }
    fillNepaliData() {
        if (!ObjectUtil.isEmpty(this.nepaliData)) {
            this.form.patchValue({
                grandFatherName: this.nepaliData.grandFatherName,
                fatherName: this.nepaliData.fatherName,
                customerName: this.nepaliData.name,
                // husbandName: this.nepaliData.husbandName,
                customerCitizenship: this.nepaliNumber.transform(this.customerInfo.citizenshipNumber, 'preeti'),
                customerCitizenshipDistrict: this.nepaliData.citizenshipIssueDistrict,
                customerDistrict: this.nepaliData.permanentDistrict,
                customerMunicipality: this.nepaliData.permanentMunicipality,
                customerWadNo: this.nepaliData.permanentWard,
                currentAddress: `${this.nepaliData.temporaryDistrict} ,${this.nepaliData.temporaryMunicipality}, ${this.nepaliData.temporaryWard}`,
                // personalDetails: `${this.nepaliNumber.transform(this.customerInfo.citizenshipNumber, 'preeti')} ,${this.nepaliData.citizenshipIssueDate}, ${this.nepaliData.citizenshipIssueDistrict}`,
                rupees: this.nepaliNumber.transform(this.amount, 'preeti'),
                amount: this.nepaliCurrencyWordPipe.transform(this.amount)
            });
        }
    }
    buildForm() {
        this.form = this.formBuilder.group({
            branch: [undefined],
            proposedAmount: [undefined],
            amountInWords: [undefined],
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
    con(e) {
        this.form.patchValue({
            amountInWords: this.nepaliCurrencyWordPipe.transform(this.nepaliToEnglishPipe.transform(e.target.value))
        });
    }
}
