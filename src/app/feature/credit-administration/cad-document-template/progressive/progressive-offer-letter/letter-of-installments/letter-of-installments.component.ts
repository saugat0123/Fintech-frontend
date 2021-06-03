import {Component, Input, OnInit} from '@angular/core';
import {ProgressiveOfferLetterConst} from '../../progressive-offer-letter-const';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ExcelOfferLetterConst} from '../../../../../cad-documents/cad-document-core/excel-offer-letter/excel-offer-letter-const';
import {CustomerOfferLetter} from '../../../../../loan/model/customer-offer-letter';
import {OfferDocument} from '../../../../model/OfferDocument';
import {NbDialogRef} from '@nebular/theme';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {CustomerOfferLetterService} from '../../../../../loan/service/customer-offer-letter.service';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CadDocStatus} from '../../../../model/CadDocStatus';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
@Component({
  selector: 'app-letter-of-installments',
  templateUrl: './letter-of-installments.component.html',
  styleUrls: ['./letter-of-installments.component.scss']
})
export class LetterOfInstallmentsComponent implements OnInit {

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
  constructor(private formBuilder:FormBuilder,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private routerUtilsService: RouterUtilsService,
              private customerOfferLetterService: CustomerOfferLetterService,
              private dialogRef: NbDialogRef<LetterOfInstallmentsComponent>) { }

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
            === this.offerLetterConst.value(this.offerLetterConst.LETTER_OF_INSTALLMENT).toString())[0];
        if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
            this.offerLetterDocument = new OfferDocument();
            this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.LETTER_OF_INSTALLMENT);
            this.fillForm();
        } else {
            const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
            this.initialInfoPrint = initialInfo;
            this.existingOfferLetter = true;
            this.form.patchValue(initialInfo);
        }
    }

  onSumbit():void{
      this.spinner = true;
      this.cadOfferLetterApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;

      if (this.existingOfferLetter) {
          this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
              if (offerLetterPath.docName.toString() ===
                  this.offerLetterConst.value(this.offerLetterConst.LETTER_OF_INSTALLMENT).toString()) {
                  offerLetterPath.initialInformation = JSON.stringify(this.form.value);
              }
          });
      } else {
          const offerDocument = new OfferDocument();
          offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.LETTER_OF_INSTALLMENT);
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
    buildForm(){
        this.form=this.formBuilder.group({
            date:[undefined],
            branchName:[undefined],
            customerName:[undefined],
            karjaAmount:[undefined],
            timePeriod:[undefined],
            kistaAmount:[undefined],
            kista:[undefined],
            debtorSign:[undefined],
            debtorName:[undefined],
            InstitutionStamp:[undefined],
            guarantorName:[undefined],
            guarantorAddress:[undefined]

        })
    }
    getNumAmountWord(numLabel, wordLabel) {
        const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
        const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
        this.form.get(wordLabel).patchValue(returnVal);
    }
}

