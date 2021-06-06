import {Component, Input, OnInit} from '@angular/core';
import {ProgressiveOfferLetterConst} from '../../progressive-offer-letter-const';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
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
    selector: 'app-letter-of-disbursement',
    templateUrl: './letter-of-disbursement.component.html',
    styleUrls: ['./letter-of-disbursement.component.scss']
})
export class LetterOfDisbursementComponent implements OnInit {

    @Input()
    offerLetterType
    @Input()
    cadOfferLetterApprovedDoc
    form: FormGroup;
    spinner;
    offerLetterConst = ProgressiveOfferLetterConst;
    customerOfferLetter: CustomerOfferLetter;
    initialInfoPrint;
    existingOfferLetter = false;
    offerLetterDocument: OfferDocument;
    nepaliData;

    constructor(private formBuilder: FormBuilder,
                private nepToEngNumberPipe: NepaliToEngNumberPipe,
                private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
                private administrationService: CreditAdministrationService,
                private toastService: ToastService,
                private routerUtilsService: RouterUtilsService,
                private customerOfferLetterService: CustomerOfferLetterService,
                private dialogRef: NbDialogRef<LetterOfDisbursementComponent>) {
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

        this.setGuarantorDetails(this.nepaliData.guarantorDetails);


    }

    checkOfferLetter() {
        this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
            === this.offerLetterConst.value(this.offerLetterConst.LETTER_OF_DISBURSEMENT).toString())[0];
        if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
            this.offerLetterDocument = new OfferDocument();
            this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.LETTER_OF_DISBURSEMENT);
            this.fillForm();
        } else {
            const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
            this.initialInfoPrint = initialInfo;
            this.existingOfferLetter = true;
            console.log(initialInfo)
            this.setGuarantorDetails(initialInfo.guarantorDetails);
            this.form.patchValue(initialInfo);
        }
    }

    onSubmit(): void {
        this.spinner = true;
        this.cadOfferLetterApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;

        if (this.existingOfferLetter) {
            this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
                if (offerLetterPath.docName.toString() ===
                    this.offerLetterConst.value(this.offerLetterConst.LETTER_OF_DISBURSEMENT).toString()) {
                    offerLetterPath.initialInformation = JSON.stringify(this.form.value);
                }
            });
        } else {
            const offerDocument = new OfferDocument();
            offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.LETTER_OF_DISBURSEMENT);
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
            date:[undefined],
            amount:[undefined],
            amountInWord:[undefined],
            accNumber:[undefined],
            sincerlyname:[undefined],
            sincerlyPermanentAddress:[undefined],
            sincerlytempAddress:[undefined],
            parentName:[undefined],
            grandParentName:[undefined],
            husbandWifeName:[undefined],
            biktiyaPersonName:[undefined],
            itiSambatYear:[undefined],
            itiSambatMonth:[undefined],
            itiSambatDate:[undefined],
            itiSambatTime:[undefined],
            itiSambatRojSumbham:[undefined],
            guarantorDetails:this.formBuilder.array([])

        })
    }

    guarantorFormgroup():FormGroup{
        return this.formBuilder.group({
            guarantorName: [undefined],
            issuedPlace: [undefined]
        })
    }

    addGuarantor():void{
        const fomrArray=this.form.get('guarantorDetails') as FormArray;
        fomrArray.push(this.guarantorFormgroup())
    }

    removeGuarantor(index:number):void{
        const fomrArray=this.form.get('guarantorDetails') as FormArray;
        fomrArray.removeAt(index);
    }


    setGuarantorDetails(data){
        const fomrArray=this.form.get('guarantorDetails') as FormArray;
        if(data.length===0){
            this.addGuarantor();
            return;
        }
        data.forEach((value)=>{
            fomrArray.push(
                this.formBuilder.group({
                    guarantorName: [value.name],
                    issuedPlace: [value.issuedPlace]
                })
            )
        })

    }

    getNumAmountWord(numLabel, wordLabel) {
        const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
        const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
        this.form.get(wordLabel).patchValue(returnVal);
    }

}
