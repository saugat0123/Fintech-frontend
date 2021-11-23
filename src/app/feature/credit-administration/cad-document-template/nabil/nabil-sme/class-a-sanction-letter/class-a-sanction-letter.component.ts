import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NepaliNumberAndWords} from '../../../../model/nepaliNumberAndWords';
import {MegaOfferLetterConst} from '../../../../mega-offer-letter-const';
import {OfferDocument} from '../../../../model/OfferDocument';
import {NepaliEditor} from '../../../../../../@core/utils/constants/nepaliEditor';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {Router} from '@angular/router';
import {ToastService} from '../../../../../../@core/utils';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../@core/pipe/currency-formatter.pipe';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliPercentWordPipe} from '../../../../../../@core/pipe/nepali-percent-word.pipe';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CadDocStatus} from '../../../../model/CadDocStatus';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {NabilOfferLetterConst} from '../../../../nabil-offer-letter-const';
import {EngNepDatePipe} from 'nepali-patro';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-class-a-sanction-letter',
  templateUrl: './class-a-sanction-letter.component.html',
  styleUrls: ['./class-a-sanction-letter.component.scss']
})
export class ClassASanctionLetterComponent implements OnInit {
  form: FormGroup;
  spinner = false;
  existingOfferLetter = false;
  initialInfoPrint;
  nepaliNumber = new NepaliNumberAndWords();
  nepaliAmount = [];
  finalNepaliWord = [];
  offerLetterConst = NabilOfferLetterConst;
  offerLetterDocument: OfferDocument;
  selectedArray = [];
  ckeConfig = NepaliEditor.CK_CONFIG;
  @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
  @Input() preview;
  guarantorData;
  nepData;
  external = [];
  loanHolderInfo;
  tempData;
  offerLetterData;
  afterSave = false;
  selectedSecurity;
  loanLimit;
  renewal;
  offerDocumentDetails;
  guarantorNames: Array<String> = [];
  allguarantorNames;
  guarantorAmount: number = 0;
  finalName;
  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private toastService: ToastService,
              private administrationService: CreditAdministrationService,
              private routerUtilsService: RouterUtilsService,
              protected dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
              public nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private engToNepNumberPipe: EngToNepaliNumberPipe,
              private currencyFormatPipe: CurrencyFormatterPipe,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private nepPercentWordPipe: NepaliPercentWordPipe,
              private ref: NbDialogRef<ClassASanctionLetterComponent>,
              private engToNepaliDate: EngNepDatePipe,
              public datePipe: DatePipe) { }

  ngOnInit() {
  }

  submit(): void {
    this.spinner = true;
    this.cadOfferLetterApprovedDoc.docStatus = 'OFFER_AND_LEGAL_PENDING';

    this.form.get('selectedSecurity').patchValue(this.selectedSecurity);
    this.form.get('loanLimitChecked').patchValue(this.loanLimit);
    this.form.get('renewalChecked').patchValue(this.renewal);

    if (this.existingOfferLetter) {
      this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
        if (offerLetterPath.docName.toString() === this.offerLetterConst.value(this.offerLetterConst.CLASS_A_SANCTION_LETTER)
            .toString()) {
          offerLetterPath.supportedInformation = this.form.get('additionalGuarantorDetails').value;
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.CLASS_A_SANCTION_LETTER);
      offerDocument.initialInformation = JSON.stringify(this.form.value);
      offerDocument.supportedInformation = this.form.get('additionalGuarantorDetails').value;
      this.cadOfferLetterApprovedDoc.offerDocumentList.push(offerDocument);
    }

    this.administrationService.saveCadDocumentBulk(this.cadOfferLetterApprovedDoc).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
      this.spinner = false;
      this.dialogRef.close();
      this.afterSave = true;
      this.routerUtilsService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
      this.spinner = false;
      this.dialogRef.close();
      this.afterSave = false;
      this.routerUtilsService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
    });
  }
  close() {
    this.ref.close();
  }
}
