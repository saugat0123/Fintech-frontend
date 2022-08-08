import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CadFile} from '../../../../model/CadFile';
import {Document} from '../../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {CadCheckListTemplateEnum} from '../../../../../admin/modal/cadCheckListTemplateEnum';
import {NepaliNumberPipe} from '../../../../../../@core/pipe/nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../@core/pipe/currency-formatter.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';

@Component({
    selector: 'app-loan-deed-individual',
    templateUrl: './loan-deed-individual.component.html',
    styleUrls: ['./loan-deed-individual.component.scss']
})
export class LoanDeedIndividualComponent implements OnInit {

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
        private nepaliNumber: NepaliNumberPipe
    ) {
    }

    @Input() cadData;
    @Input() documentId;
    @Input() customerLoanId;
    initialInfoPrint;
    spinner = false;
    form: FormGroup;
    cadCheckListEnum = CadCheckListTemplateEnum;
    nepaliData;
    amount;

    ngOnInit() {
        this.buildForm();
        this.amount = this.cadData.assignedLoan[0].proposal.proposedLimit;
        if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
            this.cadData.cadFileList.forEach(singleCadFile => {
                if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
                    this.initialInfoPrint = singleCadFile.initialInformation;
                    if (!ObjectUtil.isEmpty( JSON.parse(singleCadFile.initialInformation).rupees)) {
                        this.amount = JSON.parse(singleCadFile.initialInformation).rupees;
                    }
                }
            });
        }
        if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
            this.nepaliData = JSON.parse(this.cadData.loanHolder.nepData);
        }
        if (!ObjectUtil.isEmpty(this.initialInfoPrint)) {
          this.form.patchValue(JSON.parse(this.initialInfoPrint));
        this.form.patchValue({
            amount: this.nepaliCurrencyWordPipe.transform(this.nepaliToEnglishPipe.transform(this.amount))
        });
        } else {
        this.fillForm();
        this.form.patchValue({
        rupees: this.nepaliNumber.transform(this.amount, 'preeti'),
            amount: this.nepaliCurrencyWordPipe.transform(this.amount)
        });
        }
    }
    con(e) {
        this.form.patchValue({
            amount: this.nepaliCurrencyWordPipe.transform(this.nepaliToEnglishPipe.transform(e.target.value))
        });
    }
    fillForm() {
        if (!ObjectUtil.isEmpty(this.nepaliData)) {
            this.form.patchValue({
                wadNo: this.nepaliNumber.transform(this.cadData.assignedLoan[0].branch.wardNumber, 'preeti'),
                grandParentName: this.nepaliData.grandFatherName,
                fatherName: this.nepaliData.fatherName ? this.nepaliData.fatherName : this.nepaliData.fatherInLawName,
                husbandWifeName: this.nepaliData.husbandName,
                permanentDistrict: this.nepaliData.permanentDistrict,
                permanentWardNum: this.nepaliData.permanentWard,
                permanentMunicipality: this.nepaliData.permanentMunicipality,
                temporaryMunicipality: this.nepaliData.temporaryMunicipality,
                temporaryDistrict: this.nepaliData.temporaryDistrict,
                tempWardNum: this.nepaliData.temporaryWard,
                naPraNa: this.nepaliNumber.transform(this.cadData.assignedLoan[0].customerInfo.citizenshipNumber, 'preeti'),
                districtOffice: this.nepaliData.citizenshipIssueDistrict,
                customerName: this.nepaliData.name,
                rupees: this.nepaliNumber.transform(this.amount, 'preeti'),
                amount: this.nepaliCurrencyWordPipe.transform(this.amount)
            });
        }
    }

    buildForm() {
        this.form = this.formBuilder.group({
            district: [undefined],
            municipality: [undefined],
            wadNo: [undefined],
            branch: [undefined],
            grandParentName: [undefined],
            fatherName: [undefined],
            husbandWifeName: [undefined],
            permanentDistrict: [undefined],
            permanentMunicipality: [undefined],
            permanentWardNum: [undefined],
            temporaryDistrict: [undefined],
            temporaryMunicipality: [undefined],
            tempWardNum: [undefined],
            age: [undefined],
            name: [undefined],
            naPraNa: [undefined],
            districtOffice: [undefined],
            issuedYear: [undefined],
            issuedMonth: [undefined],
            issuedDay: [undefined],
            offerYear: [undefined],
            offerMonth: [undefined],
            offerDay: [undefined],
            customerName: [undefined],
            rupees: [undefined],
            amount: [undefined],
            itisambatYear: [undefined],
            itisambatMonth: [undefined],
            itisambatDay: [undefined],
            roj: [undefined],
            witnessDistrictOne: [undefined],
            witnessMunicipalityOne: [undefined],
            witnessWadNoOne: [undefined],
            witnessDistrictTwo: [undefined],
            witnessMunicipalityTwo: [undefined],
            witnessWadNoTwo: [undefined],
            role: [undefined],
            roleName: [undefined]
        });
    }


    submit() {
        this.spinner = true;
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
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved '));
            this.dialogRef.close();
            this.spinner = false;
            this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
        }, error => {
            console.error(error);
            this.spinner = false;
            this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save '));
            this.dialogRef.close();
        });
    }
}
