import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CurrencyFormatterPipe} from '../../../../../../@core/pipe/currency-formatter.pipe';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {CustomerOfferLetterService} from '../../../../../loan/service/customer-offer-letter.service';
import {NbDialogRef} from '@nebular/theme';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {OfferDocument} from '../../../../model/OfferDocument';
import {CadDocStatus} from '../../../../model/CadDocStatus';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {IcfcOfferLetterConst} from '../../icfc-offer-letter-const';

@Component({
  selector: 'app-corporate-guarantee',
  templateUrl: './corporate-guarantee.component.html',
  styleUrls: ['./corporate-guarantee.component.scss']
})
export class CorporateGuaranteeComponent implements OnInit {
  @Input() offerLetterType;
  @Input() cadOfferLetterApprovedDoc;
  corporateGuarantee: FormGroup;
  spinner: boolean;
  offerLetterConst = IcfcOfferLetterConst;
  existingOfferLetter = false;
  offerLetterDocument: OfferDocument;
  initialInfoPrint;
  nepData;

  constructor(private formBuilder: FormBuilder,
              private currencyFormatPipe: CurrencyFormatterPipe,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private routerUtilService: RouterUtilsService,
              private customerOfferLetterService: CustomerOfferLetterService,
              private dialogRef: NbDialogRef<CorporateGuaranteeComponent>) { }

  ngOnInit() {
    this.buildForm();
    this.checkOfferLetter();
  }

  checkOfferLetter() {
    this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
        === this.offerLetterConst.value(this.offerLetterConst.CORPORATE_GUARANTEE).toString())[0];
    if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
      this.offerLetterDocument = new OfferDocument();
      this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.CORPORATE_GUARANTEE);
      this.fillForm();
    } else {
      const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
      this.initialInfoPrint = initialInfo;
      this.existingOfferLetter = true;
      if (!ObjectUtil.isEmpty(initialInfo)) {}
      this.corporateGuarantee.patchValue(this.initialInfoPrint);
    }
  }

  fillForm() {
    this.nepData = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
    this.corporateGuarantee.patchValue({
      date: this.nepData.date ? this.nepData.date : '',
      address: this.nepData.address ? this.nepData.address : '',
    });
  }

  onSubmit() {
    this.spinner = true;
    this.cadOfferLetterApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;

    if (this.existingOfferLetter) {
      this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
        if (offerLetterPath.docName.toString() ===
            this.offerLetterConst.value(this.offerLetterConst.CORPORATE_GUARANTEE).toString()) {
          offerLetterPath.initialInformation = JSON.stringify(this.corporateGuarantee.value);
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.CORPORATE_GUARANTEE);
      offerDocument.initialInformation = JSON.stringify(this.corporateGuarantee.value);
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

  buildForm() {
    this.corporateGuarantee = this.formBuilder.group({
      name: [undefined],
      date: [undefined],
      guarantorName: [undefined],
      amount: [undefined],
      amountInWords: [undefined],
      address: [undefined],
      authorizedPerson: [undefined],
      telNo: [undefined],
    });
  }
}
