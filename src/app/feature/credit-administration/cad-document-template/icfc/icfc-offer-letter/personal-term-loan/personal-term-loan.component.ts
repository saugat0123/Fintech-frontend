import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../@core/pipe/currency-formatter.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CadDocStatus} from '../../../../model/CadDocStatus';
import {OfferDocument} from '../../../../model/OfferDocument';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {NbDialogRef} from '@nebular/theme';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {ToastService} from '../../../../../../@core/utils';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {IcfcOfferLetterConst} from '../../icfc-offer-letter-const';

@Component({
  selector: 'app-personal-term-loan',
  templateUrl: './personal-term-loan.component.html',
  styleUrls: ['./personal-term-loan.component.scss']
})
export class PersonalTermLoanComponent implements OnInit {
  @Input() offerLetterType;
  @Input() cadOfferLetterApprovedDoc;
  personalTermLoan: FormGroup;
  currencyFormatPipe: CurrencyFormatterPipe;
  engToNepNumberPipe: EngToNepaliNumberPipe;
  existingOfferLetter: boolean;
  spinner: boolean;
  offerLetterConst = IcfcOfferLetterConst;


  constructor(private dialogRef: NbDialogRef<PersonalTermLoanComponent>,
              private formBuilder: FormBuilder,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private toastService: ToastService,
              private administrationService: CreditAdministrationService,
              private routerUtilService: RouterUtilsService) { }

  ngOnInit() {
  }

  calcYearlyRate(formArrayName, i) {
    const baseRate = this.nepToEngNumberPipe.transform(this.personalTermLoan.get([formArrayName, i, 'baseRate']).value);
    const premiumRate = this.nepToEngNumberPipe.transform(this.personalTermLoan.get([formArrayName, i, 'premiumRate']).value);
    const addRate = parseFloat(baseRate) + parseFloat(premiumRate);
    const asd = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(addRate));
    this.personalTermLoan.get([formArrayName, i, 'yearlyRate']).patchValue(asd);
  }

  onSubmit() {
    this.spinner = true;
    this.cadOfferLetterApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;

    if (this.existingOfferLetter) {
      this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
        if (offerLetterPath.docName.toString() ===
            this.offerLetterConst.value(this.offerLetterConst.PERSONAL_TERM_LOAN).toString()) {
          offerLetterPath.initialInformation = JSON.stringify(this.personalTermLoan.value);
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.PERSONAL_TERM_LOAN);
      offerDocument.initialInformation = JSON.stringify(this.personalTermLoan.value);
      this.cadOfferLetterApprovedDoc.offerDocumentList.push(offerDocument);
      console.log('This is cad offer letter : ', this.cadOfferLetterApprovedDoc);
    }
    this.administrationService.saveCadDocumentBulk(this.cadOfferLetterApprovedDoc).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved offer letter !'));
      this.spinner = false;
      this.dialogRef.close();
      this.routerUtilService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
    }, error => {
      console.log(error);
      this.toastService.show(new Alert(AlertType.DANGER, 'Failed to save offer letter !'));
      this.spinner = false;
      this.dialogRef.close();
      this.routerUtilService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
    });
  }
}
