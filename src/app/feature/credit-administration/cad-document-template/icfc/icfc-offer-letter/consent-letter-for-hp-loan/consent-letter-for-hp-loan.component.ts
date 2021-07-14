import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {LegalDocumentCheckListEnum} from '../../../../../admin/modal/legalDocumentCheckListEnum';
import {CurrencyFormatterPipe} from '../../../../../../@core/pipe/currency-formatter.pipe';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {CustomerOfferLetterService} from '../../../../../loan/service/customer-offer-letter.service';
import {NbDialogRef} from '@nebular/theme';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CadFile} from '../../../../model/CadFile';
import {Document} from '../../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {OfferDocument} from '../../../../model/OfferDocument';
import {NepaliNumberAndWords} from '../../../../model/nepaliNumberAndWords';
import {NepaliEditor} from '../../../../../../@core/utils/constants/nepaliEditor';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {NepaliPercentWordPipe} from '../../../../../../@core/pipe/nepali-percent-word.pipe';

@Component({
  selector: 'app-consent-letter-for-hp-loan',
  templateUrl: './consent-letter-for-hp-loan.component.html',
  styleUrls: ['./consent-letter-for-hp-loan.component.scss']
})
export class ConsentLetterForHpLoanComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  @Input() nepaliAmount: NepaliNumberAndWords;

  form: FormGroup;
  spinner;
  offerLetterConst = LegalDocumentCheckListEnum;
  initialInfoPrint;
  customGender;
  nepData;
  guarantorData;
  editor = NepaliEditor.CK_CONFIG;

  constructor(private formBuilder: FormBuilder,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private dialogRef: NbDialogRef<ConsentLetterForHpLoanComponent>,
              private nepPercentWordPipe: NepaliPercentWordPipe,
              private routerUtilsService: RouterUtilsService) {
  }

  ngOnInit(): void {
    this.buildForm();
    this.checkOfferLetter();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      date: [undefined],
      branch: [undefined],
      branchAddress: [undefined],
      customerName: [undefined],
      customerName1: [undefined],
      customerName2: [undefined],
      customerName3: [undefined],

      vehicleType: [undefined],
      vehicleModel: [undefined],
      vehicleEngineNo: [undefined],
      vehicleChasisNo: [undefined],
      vehicleRegNo: [undefined],
      applicantName: [undefined],
      applicantAddress: [undefined],
    });

  }

  fillForm() {
    this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
    const customerAddress = this.nepData.permanentMunicipality + '-' + this.nepData.permanentWard + ', ' + this.nepData.permanentDistrict + ', ' + this.nepData.permanentProvince;
    this.form.patchValue({
      customerName: this.nepData.name ? this.nepData.name : '',
      applicantAddress: customerAddress,
    });
  }

  checkOfferLetter() {
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      if (this.cadData.cadFileList.length > 0) {
        this.cadData.cadFileList.forEach(singleCadFile => {
          if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
            const initialInfo = JSON.parse(singleCadFile.initialInformation);
            this.initialInfoPrint = initialInfo;
            this.form.patchValue(this.initialInfoPrint);
          } else {
            this.fillForm();
          }
        });
      } else {
        this.fillForm();
      }
    }
  }


  submit() {
    console.log(this.form.value.amountInWords);
    this.spinner = true;
    let flag = true;

    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.form.value);
          console.log('Initial Information ==> ', singleCadFile);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.form.value);
        console.log('Initial Information ==> ', cadFile.initialInformation);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
        console.log('cad data from the loan ===> ', cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.form.value);
      document.id = this.documentId;
      cadFile.cadDocument = document;
      cadFile.customerLoanId = this.customerLoanId;
      console.log('Initial Information ==> ', cadFile.initialInformation);
      this.cadData.cadFileList.push(cadFile);
      console.log('cad data from the loan ===> ', cadFile);
    }

    this.administrationService.saveCadDocumentBulk(this.cadData).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
      this.spinner = false;
      this.dialogRef.close();
      this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
      this.spinner = false;
      this.dialogRef.close();
      this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
    });
  }

}
