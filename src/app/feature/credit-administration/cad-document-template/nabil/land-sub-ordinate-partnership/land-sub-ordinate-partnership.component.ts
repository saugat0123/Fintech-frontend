import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NabilDocumentChecklist} from '../../../../admin/modal/nabil-document-checklist.enum';
import {NabilOfferLetterConst} from '../../../nabil-offer-letter-const';
import {CustomerType} from '../../../../customer/model/customerType';
import {CustomerSubType} from '../../../../customer/model/customerSubType';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {ToastService} from '../../../../../@core/utils';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {EngNepDatePipe} from 'nepali-patro';
import {DatePipe} from '@angular/common';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CadFile} from '../../../model/CadFile';
import {Document} from '../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';

@Component({
  selector: 'app-land-sub-ordinate-partnership',
  templateUrl: './land-sub-ordinate-partnership.component.html',
  styleUrls: ['./land-sub-ordinate-partnership.component.scss']
})
export class LandSubOrdinatePartnershipComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  form: FormGroup;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  individualData;
  offerLetterConst = NabilDocumentChecklist;
  offerDocumentChecklist = NabilOfferLetterConst;
  nepData;
  isInstitutional = false;
  clientType;
  loanHolderNepData: any;
  initialInfoPrint;
  customerType = CustomerType;
  customerSubType = CustomerSubType;

  constructor(private formBuilder: FormBuilder,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
              private routerUtilsService: RouterUtilsService,
              public engToNepaliDate: EngNepDatePipe,
              public datePipe: DatePipe, ) {
  }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      if (this.cadData.loanHolder.customerType === 'INSTITUTION') {
        this.isInstitutional = true;
      }
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          this.form.patchValue(JSON.parse(singleCadFile.initialInformation));
          const initialInfo = JSON.parse(singleCadFile.initialInformation);
          this.initialInfoPrint = initialInfo;
          this.form.patchValue(initialInfo);
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.individualData = JSON.parse(this.cadData.loanHolder.nepData);
      this.clientType = this.cadData.loanHolder['customerSubType'];

      this.loanHolderNepData = this.cadData.loanHolder.nepData ?
          JSON.parse(this.cadData.loanHolder.nepData) :
          this.cadData.loanHolder.nepData;
    }
    this.fillForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      nameOfBranch: [undefined],
      witnessDistrict: [undefined],
      witnessMunicipality: [undefined],
      WitnessWardNumber: [undefined],
      witnessAge: [undefined],
      witnessName: [undefined],
      witnessDistrict2: [undefined],
      witnessMunicipality2: [undefined],
      WitnessWardNumber2: [undefined],
      witnessAge2: [undefined],
      witnessName2: [undefined],
      bankStaff: [undefined],
      borrowerName: [undefined],
      branchAddress: [undefined],
      freeText1: [undefined],
      freeText2: [undefined],
      loanProviderName: [undefined],
      loanProviderAddress: [undefined],
      freeText3: [undefined],
      freeText4: [undefined],
      amount: [undefined],
      amountInWords: [undefined],
      borrowerAuthorizedPerson: [undefined],
      borrowerAuthorizedPersonAddress: [undefined],
      loanProviderAuthorizedPerson: [undefined],
      loanProviderAuthorizedPersonAddress: [undefined],
    });
  }

  fillForm() {
    this.form.patchValue({
      nameOfBranch: this.individualData.branch ? this.individualData.branch.ct : ''
    });
  }

  submit() {
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
      this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save '));
      this.dialogRef.close();
    });
  }
}
