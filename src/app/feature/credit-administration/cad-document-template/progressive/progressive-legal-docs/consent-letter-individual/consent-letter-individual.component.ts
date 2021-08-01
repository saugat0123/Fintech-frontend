import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from "../../../../model/customerApprovedLoanCadDocumentation";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {ProgressiveLegalDocConst} from "../progressive-legal-doc-const";
import {CustomerOfferLetter} from "../../../../../loan/model/customer-offer-letter";
import {OfferDocument} from "../../../../model/OfferDocument";
import {NbDialogRef} from "@nebular/theme";
import {NepaliToEngNumberPipe} from "../../../../../../@core/pipe/nepali-to-eng-number.pipe";
import {NepaliCurrencyWordPipe} from "../../../../../../@core/pipe/nepali-currency-word.pipe";
import {CreditAdministrationService} from "../../../../service/credit-administration.service";
import {ToastService} from "../../../../../../@core/utils";
import {RouterUtilsService} from "../../../../utils/router-utils.service";
import {CustomerOfferLetterService} from "../../../../../loan/service/customer-offer-letter.service";
import {ObjectUtil} from "../../../../../../@core/utils/ObjectUtil";
import {CadFile} from "../../../../model/CadFile";
import {Document} from "../../../../../admin/modal/document";
import {Alert, AlertType} from "../../../../../../@theme/model/Alert";

@Component({
    selector: 'app-consent-letter-individual',
    templateUrl: './consent-letter-individual.component.html',
    styleUrls: ['./consent-letter-individual.component.scss']
})
export class ConsentLetterIndividualComponent implements OnInit {
    @Input() cadData: CustomerApprovedLoanCadDocumentation;
    @Input() documentId: number;
    @Input() customerLoanId: number;
    spinner;
    form: FormGroup;
    offerLetterConst = ProgressiveLegalDocConst;
    customerOfferLetter: CustomerOfferLetter;
    initialInfoPrint;
    existingOfferLetter = false;
    offerLetterDocument: OfferDocument;
    nepaliData;

    constructor(
        private dialogRef: NbDialogRef<ConsentLetterIndividualComponent>,
        private formBuilder: FormBuilder,
        private nepToEngNumberPipe: NepaliToEngNumberPipe,
        private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
        private administrationService: CreditAdministrationService,
        private toastService: ToastService,
        private routerUtilsService: RouterUtilsService,
        private customerOfferLetterService: CustomerOfferLetterService
    ) {
    }

    ngOnInit() {
        this.bindForm()
        this.fillForm()
    }

    fillForm():void{
        if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
            this.cadData.cadFileList.forEach(singleCadFile => {
                if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
                    const initialInfo = JSON.parse(singleCadFile.initialInformation);
                    this.initialInfoPrint = initialInfo;
                    if (!ObjectUtil.isEmpty(initialInfo.sahamati)) {
                        this.setSahamati(initialInfo.sahamati);
                    }
                    if (!ObjectUtil.isEmpty(initialInfo.guarantorDetails)) {
                        this.setGuarantorDetails(initialInfo.guarantorDetails);
                    }
                    this.form.patchValue(this.initialInfoPrint);
                }
            });
        }

        if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
            this.nepaliData = JSON.parse(this.cadData.loanHolder.nepData);

            this.form.patchValue({
                customerName: this.nepaliData.name ? this.nepaliData.name : '',
            });
        }



    }
    submit(): void {
        let flag = true;
        if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
            this.cadData.cadFileList.forEach(singleCadFile => {
                if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
                    flag = false;
                    singleCadFile.initialInformation = JSON.stringify(this.form.value);
                    this.initialInfoPrint = singleCadFile.initialInformation;
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
            this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save '));
            this.dialogRef.close();
        });

    }

    bindForm(): void {
        this.form = this.formBuilder.group({
            branch: [undefined],
            name: [undefined],
            fname: [undefined],
            gharName: [undefined],
            district: [undefined],
            wadNo: [undefined],
            kiNo: [undefined],
            bargaMeter: [undefined],
            sitNo: [undefined],
            itisambatYear: [undefined],
            itisambatMonth: [undefined],
            itisambatDay: [undefined],
            itisambatTime: [undefined],
            itisambatRojSubham: [undefined],
            sahamati: this.formBuilder.array([]),
            guarantorDetails:this.formBuilder.array([])
        })
    }

    addSahamati() {
        const formArray = this.form.get("sahamati") as FormArray
        formArray.push(this.Sahamati())
    }

    removeSahamati(i) {
        const formGroup = this.form.get("sahamati") as FormArray
        formGroup.removeAt(i)
    }

    Sahamati(): FormGroup {
        return this.formBuilder.group({
            sahamatiName: [undefined],
            relationship: [undefined],
            signature: [undefined]
        })


    }

    addGuarantor(): void {
        const formArray = this.form.get('guarantorDetails') as FormArray;
        formArray.push(this.guarantorFormGroup());
    }

    removeGuarantor(index: number): void {
        const formArray = this.form.get('guarantorDetails') as FormArray;
        formArray.removeAt(index);
    }


    guarantorFormGroup(): FormGroup {
        return this.formBuilder.group({
            name: [undefined],
            citizenNumber: [undefined],
            issuedYear: [undefined],
            guarantorCDOoffice: [undefined],
            guarantorDistrict: [undefined],
            guarantorMunicipality: [undefined],
            guarantorWadNo: [undefined]
        });
    }


    setGuarantorDetails(data) {
        const formArray = this.form.get('guarantorDetails') as FormArray;
        if (data.length === 0) {
            this.addGuarantor();
            return;
        }
        data.forEach((value) => {
            formArray.push(this.formBuilder.group({
                name: [value.name],
                citizenNumber: [value.citizenNumber],
                issuedYear: [value.issuedYear],
                guarantorCDOoffice: [value.guarantorCDOoffice],
                guarantorDistrict: [value.guarantorDistrict],
                guarantorMunicipality: [value.guarantorMunicipality],
                guarantorWadNo: [value.guarantorWadNo]
            }));
        });
    }

    setSahamati(data) {
        const formArray = this.form.get("sahamati") as FormArray
        if (data.length === 0) {
            this.addSahamati()
            return;
        }
        data.forEach((e) => {
            formArray.push(this.formBuilder.group({
                sahamatiName: [undefined],
                relationship: [undefined],
                signature: [undefined]
            }))

        })
    }

}
