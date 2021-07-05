import {Component, Input, OnInit} from '@angular/core';
import {ProgressiveOfferLetterConst} from '../../progressive-offer-letter-const';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CustomerOfferLetter} from '../../../../../loan/model/customer-offer-letter';
import {OfferDocument} from '../../../../model/OfferDocument';
import {NbDialogRef} from '@nebular/theme';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {CustomerOfferLetterService} from '../../../../../loan/service/customer-offer-letter.service';
import {ObjectUtil} from "../../../../../../@core/utils/ObjectUtil";
import {CadDocStatus} from "../../../../model/CadDocStatus";
import {Alert, AlertType} from "../../../../../../@theme/model/Alert";

@Component({
    selector: 'app-cross-guarantee-bond',
    templateUrl: './cross-guarantee-bond.component.html',
    styleUrls: ['./cross-guarantee-bond.component.scss']
})
export class CrossGuaranteeBondComponent implements OnInit {
    @Input() offerLetterType;
    @Input() cadOfferLetterApprovedDoc;
    spinner;
    form: FormGroup;
    offerLetterConst = ProgressiveOfferLetterConst;
    customerOfferLetter: CustomerOfferLetter;
    initialInfoPrint;
    existingOfferLetter = false;
    offerLetterDocument: OfferDocument;
    nepaliData;

    constructor(private dialogRef: NbDialogRef<CrossGuaranteeBondComponent>,
                private formBuilder: FormBuilder,
                private nepToEngNumberPipe: NepaliToEngNumberPipe,
                private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
                private administrationService: CreditAdministrationService,
                private toastService: ToastService,
                private routerUtilsService: RouterUtilsService,
                private customerOfferLetterService: CustomerOfferLetterService) {
    }

    ngOnInit() {
        this.buildForm();
        this.checkOfferLetter();
    }
    fillForm() {
        this.nepaliData = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);

        this.form.patchValue({
            customerName: this.nepaliData.name ? this.nepaliData.name : '',
        });



    }

    checkOfferLetter() {
        this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
            === this.offerLetterConst.value(this.offerLetterConst.CROSS_GUARANTEE_BOND).toString())[0];
        if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
            this.offerLetterDocument = new OfferDocument();
            this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.CROSS_GUARANTEE_BOND);
            this.fillForm();
        } else {
            const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
            this.initialInfoPrint = initialInfo;
            this.existingOfferLetter = true;

            this.form.patchValue(initialInfo);
        }
    }

    onSubmit(): void {
        console.log(this.form.value);
        this.spinner = true;
        this.cadOfferLetterApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;

        if (this.existingOfferLetter) {
            this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
                if (offerLetterPath.docName.toString() ===
                    this.offerLetterConst.value(this.offerLetterConst.CROSS_GUARANTEE_BOND).toString()) {
                    offerLetterPath.initialInformation = JSON.stringify(this.form.value);
                }
            });
        } else {
            const offerDocument = new OfferDocument();
            offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.CROSS_GUARANTEE_BOND);
            offerDocument.initialInformation = JSON.stringify(this.form.value);
            this.cadOfferLetterApprovedDoc.offerDocumentList.push(offerDocument);
        }

        this.administrationService.saveCadDocumentBulk(this.cadOfferLetterApprovedDoc).subscribe(() => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
            this.spinner = false;
            this.dialogRef.close();
            this.routerUtilsService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
            this.spinner = false;
            this.dialogRef.close();
            this.routerUtilsService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
        });

    }


    buildForm() {
        this.form = this.formBuilder.group({
          branchName:[undefined],
          regOffice:[undefined],
          date:[undefined],
          praliNo:[undefined],
            regDistrict:[undefined],
            regMunicipality:[undefined],
            regWadNo:[undefined],
            district:[undefined],
            municipality:[undefined],
            wadNo:[undefined],
            fromPersonNAme:[undefined],
            sanchalakName:[undefined],
            husbandName:[undefined],
            sasuraName:[undefined],
            middleDistrict:[undefined],
            middleMunicipality:[undefined],
            middleWadNo:[undefined],
            permanentDistrict:[undefined],
            permanentMuniciplaity:[undefined],
            permanentWadNo:[undefined],
            age:[undefined],
            dhitoGuarantor:[undefined],
            banijyaOffice:[undefined],
            middleDate:[undefined],
            middlePraliNo:[undefined],
            middleRegDistrict:[undefined],
            middleRegMunicipality:[undefined],
            middleRegWadNo:[undefined],
            buttonDistrict:[undefined],
            buttonMunicipality:[undefined],
            buttonWadNo:[undefined],
            buttonPersonName:[undefined],
            buttonSanchalakName:[undefined],
            buttonHusbandName:[undefined],
            buttonSasuraName:[undefined],
            downDistrictName:[undefined],
            downMunicipalityName:[undefined],
            downWadno:[undefined],
            downTempDistrict:[undefined],
            downTempMunicplaity:[undefined],
            downTempWadNo:[undefined],
            downAge:[undefined],
            downDebtorName:[undefined],
            downguarantor:[undefined],
            chaNo:[undefined],
            BS:[undefined],
            amount:[undefined],
            amountInWord:[undefined],
            mapoka:[undefined],
            buttonBS:[undefined],
            RNo:[undefined],
            buttonChaNo:[undefined],
            buttonBsDate:[undefined],
            karja:[undefined],
            buttonAmount:[undefined],
            buttonAmountInWord:[undefined],
            landownerName:[undefined],
            landownerParentName:[undefined],
            landownerSasuraName:[undefined],
            tableDistrict:[undefined],
            tableMunicipality:[undefined],
            tableWadNo:[undefined],
            tableKeyNo:[undefined],
            tableLandArea:[undefined],
            tableComment:[undefined],
            itsisambatYear:[undefined],
            itsisambatMonth:[undefined],
            itsisambatDate:[undefined],
            itsisambatRojSubham:[undefined]



        })
    }

    getNumAmountWord(numLabel, wordLabel) {
        const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
        const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
        this.form.get(wordLabel).patchValue(returnVal);
    }

}
