import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {NabilDocumentChecklist} from '../../../../admin/modal/nabil-document-checklist.enum';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CadFile} from '../../../model/CadFile';
import {Document} from '../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {NepaliNumberAndWords} from '../../../model/nepaliNumberAndWords';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {ToastService} from '../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {Router} from '@angular/router';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../@core/pipe/currency-formatter.pipe';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {EngNepDatePipe} from 'nepali-patro';
import {NepaliPercentWordPipe} from '../../../../../@core/pipe/nepali-percent-word.pipe';
import {ProposalCalculationUtils} from '../../../../loan/component/loan-summary/ProposalCalculationUtils';
@Component({
  selector: 'app-personal-guarantee-partnership',
  templateUrl: './personal-guarantee-partnership.component.html',
  styleUrls: ['./personal-guarantee-partnership.component.scss']
})
export class PersonalGuaranteePartnershipComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  @Input() nepaliAmount: NepaliNumberAndWords;
  form: FormGroup;
  initialInfoPrint;
  offerLetterConst = NabilDocumentChecklist;
  nepaliNumber = new NepaliNumberAndWords();
  loanHolderNepData: any;
  offerDocumentDetails: any;
  taggedGuarantorsDetailsInLoan = [];
  constructor(
      private formBuilder: FormBuilder,
      private router: Router,
      private toastService: ToastService,
      private routerUtilService: RouterUtilsService,
      private administrationService: CreditAdministrationService,
      private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
      private engToNepNumberPipe: EngToNepaliNumberPipe,
      private currencyFormatPipe: CurrencyFormatterPipe,
      private nepToEngNumberPipe: NepaliToEngNumberPipe,
      private englishNepaliDatePipe: EngNepDatePipe,
      private nepPercentWordPipe: NepaliPercentWordPipe,
      private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
      private routerUtilsService: RouterUtilsService
  ) { }

  ngOnInit() {
    this.loadPersonalGuarantorData();
    this.buildForm();
  }
  buildForm() {
    this.form = this.formBuilder.group({
      guarantorsPartnership: this.formBuilder.array([]),
    });
    this.calulation();
    this.taggedPersonalGuarantorsDetailsForm();
  }
  removeIndividualGuarantors(i) {
    (
        this.form.get('guarantorsPartnership') as FormArray
    ).removeAt(i);
  }
  loadPersonalGuarantorData() {
    console.log('cadData: ', this.cadData);
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.assignedLoan)) {
      this.loanHolderNepData = this.cadData.loanHolder.nepData
          ? JSON.parse(this.cadData.loanHolder.nepData)
          : this.cadData.loanHolder.nepData;
      this.cadData.assignedLoan.map((value) => {
        value.taggedGuarantors.forEach((val) => {
          this.taggedGuarantorsDetailsInLoan.push(val);
        });
      });
      if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList) && this.cadData.offerDocumentList.length !== 0) {
        this.offerDocumentDetails = JSON.parse(this.cadData.offerDocumentList[0].initialInformation);
      }
    }
    this.taggedGuarantorsDetailsInLoan = Array.from(
        new Set(
            this.taggedGuarantorsDetailsInLoan.map((val) => JSON.stringify(val))
        )
    ).map((val) => JSON.parse(val));
    console.log('loanHolderNepData: ', this.loanHolderNepData);
    console.log('taggedGuarantorsDetailsInLoan: ', this.taggedGuarantorsDetailsInLoan);
  }
  calulation() {
    if (ObjectUtil.isEmpty(this.cadData.nepData)) {
      const number = ProposalCalculationUtils.calculateTotalFromProposalListKey(this.cadData.assignedLoan);
      this.nepaliNumber.numberNepali = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(number));
      this.nepaliNumber.nepaliWords = this.nepaliCurrencyWordPipe.transform(number);
      this.nepaliNumber.engNumber = number;
    } else {
      this.nepaliNumber = JSON.parse(this.cadData.nepData);
    }

  }
  submit() {
    let flag = true;
    if (
        !ObjectUtil.isEmpty(this.cadData) &&
        !ObjectUtil.isEmpty(this.cadData.cadFileList)
    ) {
      this.cadData.cadFileList.forEach((singleCadFile) => {
        if (
            singleCadFile.customerLoanId === this.customerLoanId &&
            singleCadFile.cadDocument.id === this.documentId
        ) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(
              this.form.value
          );
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(
            this.form.value
        );
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(
          this.form.value
      );
      document.id = this.documentId;
      cadFile.cadDocument = document;
      cadFile.customerLoanId = this.customerLoanId;
      this.cadData.cadFileList.push(cadFile);
    }

    this.administrationService.saveCadDocumentBulk(this.cadData).subscribe(
        () => {
          this.toastService.show(
              new Alert(AlertType.SUCCESS, 'Successfully saved')
          );
          this.dialogRef.close();
          this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
        },
        (error) => {
          console.error(error);
          this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save'));
          this.dialogRef.close();
        }
    );
  }
  initIndividualGuarantors() {
    return this.formBuilder.group({});
  }
  taggedPersonalGuarantorsDetailsForm() {
    if (!ObjectUtil.isEmpty(this.taggedGuarantorsDetailsInLoan)) {
      this.taggedGuarantorsDetailsInLoan.forEach((val) => {
        const individualGuarantorNepData = val.nepData
            ? JSON.parse(val.nepData)
            : val.nepData;
        if (ObjectUtil.isEmpty(individualGuarantorNepData)) {
          return;
        }
        (this.form.get('guarantorsPartnership') as FormArray).push(
         this.formBuilder.group({
          branchName: [undefined],
          actDetails: [undefined],
          actYearInFigure: [undefined],
          headDepartment: [undefined],
          registrationDate: [undefined],
          registrationNo: [undefined],
          location: [undefined],
          loaneeName: [undefined],
          loanPurpose: [undefined],
          letterIssuedDate: [undefined],
          loanAmount: [undefined],
          loanAmountInWord: [undefined],
          approvedLoanAmountInWord: [undefined],
          approvedLoanAmount: [undefined],
          guarantorName: [undefined],
          guarantorFatherOrHusbandName: [undefined],
          guarantorGrandFatherName: [undefined],
          guarantorPermanentDistrict: [undefined],
          guarantorPermanentMunicipality: [undefined],
          guarantorPermanentWard: [undefined],
          guarantorTemporaryDistrict: [undefined],
          guarantorTemporaryMunicipality: [undefined],
          guarantorTemporaryWard: [undefined],
          guarantorCitizenNumber: [undefined],
          guarantorCitzenIssuedPlace: [undefined],
          guarantorCitzenIssuedDate: [undefined],
          year: [undefined],
          month: [undefined],
          day: [undefined],
          date: [undefined],
          freeText: [undefined]
        })
        );
      });
    }
  }
}
