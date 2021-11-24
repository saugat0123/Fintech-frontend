import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CadCheckListTemplateEnum} from '../../../../../admin/modal/cadCheckListTemplateEnum';
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
import {CadFile} from '../../../../model/CadFile';
import {Document} from '../../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';

@Component({
  selector: 'app-offer-letter-laxmi',
  templateUrl: './offer-letter-laxmi.component.html',
  styleUrls: ['./offer-letter-laxmi.component.scss']
})
export class OfferLetterLaxmiComponent implements OnInit {

  @Input() cadData;
  @Input() documentId;
  @Input() customerLoanId;
  offerLetterForm: FormGroup;
  spinner = false;
  initialInfoPrint;
  cadCheckListEnum = CadCheckListTemplateEnum;
  nepaliData;
  proposedAmount;
  customerInfo;

  constructor(private formBuilder: FormBuilder,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
              private routerUtilsService: RouterUtilsService,
              private currencyFormatPipe: CurrencyFormatterPipe,
              private engToNepNumberPipe: EngToNepaliNumberPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private nepaliToEnglishPipe: NepaliToEngNumberPipe,
              private nepaliNumber: NepaliNumberPipe) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.offerLetterForm = this.formBuilder.group({
      signature1: [undefined],
      empoweredName: [undefined],
      signature2: [undefined],
      signature3: [undefined],
      designation2: [undefined],
      designation3: [undefined],
      name2: [undefined],
      name3: [undefined],
      contactNumber: [undefined],
      address: [undefined],
      borrowerName: [undefined],
      branchName: [undefined],
      telephoneNumber: [undefined],
      faxNumber: [undefined],
      //
      // dateOfBirth: [undefined],
      // address: [undefined],
      // gender: [undefined],
      // citizenshipNumber: [undefined],
      // issuedDate: [undefined],
      // issuedPlace: [undefined],
      // landLordSignNumber: [undefined],
      // husbandWifeName: [undefined],
      // fatherName: [undefined],
      // grandFatherName: [undefined],
      // motherName: [undefined],
      // grandMotherName: [undefined],
      // province: [undefined],
      // district: [undefined],
      // guarantorName1: [undefined],
      // guarantorName2: [undefined],
      // guarantorAddress1: [undefined],
      // guarantorAddress2: [undefined],
      // guarantorAge1: [undefined],
      // guarantorAge2: [undefined],
      // guarantorSignature1: [undefined],
      // guarantorSignature2: [undefined],
      // year: [undefined],
      // month: [undefined],
      // date1: [undefined],
      // roseShumbham: [undefined],
      // chalu: [undefined],
      // sepharisPatra: [undefined],
      // name1: [undefined],
      // praDot: [undefined],
      // signature3: [undefined],
      // borrowerSignature1: [undefined],
      // borrowerSignature2: [undefined],
      // borrowerSignature3: [undefined],
      // borrowerName1: [undefined],
      // borrowerName2: [undefined],
      // borrowerName3: [undefined],
      // borrowerDesignation1: [undefined],
      // borrowerDesignation2: [undefined],
      // borrowerDesignation3: [undefined],
      // borrowerDate1: [undefined],
      // borrowerDate2: [undefined],
      // borrowerDate3: [undefined],
      // kittaNumber: [undefined],
      // landAmount: [undefined],
      // registrationNumber1: [undefined],
      // paritMiti1: [undefined],
      // tokenNumber1: [undefined],
      // date2: [undefined],
      // karobarAmount1: [undefined],
      // registrationAmount1: [undefined],
      // pujiGatAmount1: [undefined],
      // taxAmount1: [undefined],
      // billNumber1: [undefined],
      // landRevenue: [undefined],
      // doorMukam: [undefined],
      // signatureDate1: [undefined],
      // signatureDate2: [undefined],
      // acceptanceName1: [undefined],
      // acceptanceName2: [undefined],
      // acceptanceDesignation1: [undefined],
      // acceptanceDesignation2: [undefined],
      // mobileNumber: [undefined],
      // municipality: [undefined],
      // wordNo: [undefined],
      // seatNo: [undefined],
      // kittaNo: [undefined],
      // khande: [undefined],
      // absence: [undefined],
      // area: [undefined],
      // area1: [undefined],
      // mohiName: [undefined],
      // toward: [undefined],
      // purchasedLand: [undefined],
      // purchasedHouse: [undefined],
      // soldLand: [undefined],
      // soldHouse: [undefined],
      // apology: [undefined],
    });
  }

  submit() {
    this.spinner = true;
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.offerLetterForm.value);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.offerLetterForm.value);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.offerLetterForm.value);
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
