import {Component, Input, OnInit} from '@angular/core';
import {OfferDocument} from '../../../../model/OfferDocument';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {NabilOfferLetterConst} from '../../../../nabil-offer-letter-const';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {CurrencyFormatterPipe} from '../../../../../../@core/pipe/currency-formatter.pipe';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {EngToNepaliNumberPipe} from '../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CadFile} from '../../../../model/CadFile';
import {Document} from '../../../../../admin/modal/document';
import {ToastService} from '../../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {EngNepDatePipe} from 'nepali-patro';

@Component({
  selector: 'app-kisan-karja-subsidy',
  templateUrl: './kisan-karja-subsidy.component.html',
  styleUrls: ['./kisan-karja-subsidy.component.scss']
})
export class KisanKarjaSubsidyComponent implements OnInit {
  existingOfferLetter = false;
  offerLetterDocument: OfferDocument;
  selectedArray = [];
  kisanKarjaSubsidy: FormGroup;
  spinner = false;
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  initialInfoPrint;
  loanHolderInfo;
  tempData;
  offerDocumentDetails;
  offerLetterData;
  guarantorData;
  offerLetterConst = NabilOfferLetterConst;
  constructor(private formBuilder: FormBuilder,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
              private routerUtilsService: RouterUtilsService,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              public nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private engToNepNumberPipe: EngToNepaliNumberPipe,
              private currencyFormatPipe: CurrencyFormatterPipe,
              private engToNepaliDate: EngNepDatePipe,
  ) { }

  ngOnInit() {
    this.buildPersonal();
    /*if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
      this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
      this.tempData = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);
    }
    this.guarantorData = this.cadOfferLetterApprovedDoc.assignedLoan[0].taggedGuarantors;
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.offerDocumentList)) {
      // tslint:disable-next-line:max-line-length
      this.offerDocumentDetails = this.cadOfferLetterApprovedDoc.offerDocumentList[0] ? JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation) : '';
    }*/
  }
  buildPersonal() {
    this.kisanKarjaSubsidy = this.formBuilder.group({
      referenceNumber: [undefined],
      // securities: this.formBuilder.array([]),
      dateOfApproval: [undefined],
      customerName: [undefined],
      customerAddress: [undefined],
      dateofApplication: [undefined],
      prevSanctionLetterDate: [undefined],
      reqLetterDate: [undefined],
      typeOfLoan: [undefined],
      loanAmountinFigure : [undefined],
      loanAmountInWords : [undefined],
      purposeOfLoan: [undefined],
      drawingPower: [undefined],
      baseRate: [undefined],
      premiumRate: [undefined],
      yearlyInterestRate: [undefined],
      swekritiLoan: [undefined],
      totalTenureOfLoan: [undefined],
      nextReviewDate: [undefined],
      landOwnerName: [undefined],
      district: [undefined],
      vdcMunci: [undefined],
      wardNo: [undefined],
      plotNo: [undefined],
      area: [undefined],
      nameOfPersonalGuarantor: [undefined],
      rateNrbCircular: [undefined],
      extraFinancialClause: [undefined],
      additionalOthersClause: [undefined],
      extraSecurityDocumentParts: [undefined],
      relationshipOfficerName: [undefined],
      branchName: [undefined],
      branchManager: [undefined],
      applicantName: [undefined],
      commitmentFee : [undefined],
      executionDate : [undefined],
      freeText1 : [undefined],
      freeText2 : [undefined],
      freeText3 : [undefined],
      freeText4 : [undefined],
      freeText5 : [undefined]
    });
  }
  // setSwikriti(data) {
  //   const formArray = this.kisanKarjaSubsidy.get('swikritiBibaran') as FormArray;
  //   (this.kisanKarjaSubsidy.get('swikritiBibaran') as FormArray).clear();
  //   if (data.length === 0) {
  //     this.addSwikriti();
  //     return;
  //   }
  //   data.forEach((value) => {
  //     formArray.push(this.formBuilder.group({
  //       approvedSubidhakisim: [value.approvedSubidhakisim],
  //       approvedAmount: [value.approvedAmount],
  //       approvedCommision: [value.approvedCommision],
  //       approvedLoanTime: [value.approvedLoanTime],
  //     }));
  //   });
  // }
  calcYearlyRate() {
    const baseRate = this.nepToEngNumberPipe.transform(this.kisanKarjaSubsidy.get('baseRate').value);
    const premiumRate = this.nepToEngNumberPipe.transform(this.kisanKarjaSubsidy.get('premiumRate').value);
    const addRate = parseFloat(baseRate) + parseFloat(premiumRate);
    const asd = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(addRate));
    this.kisanKarjaSubsidy.get('yearlyInterestRate').patchValue(asd);
  }
  getNumAmountWord(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.kisanKarjaSubsidy.get(numLabel).value);
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.kisanKarjaSubsidy.get(wordLabel).patchValue(returnVal);
  }

  /*  public addDefaultSecurity(): void {
      (this.kisanKarjaSubsidy.get('securities') as FormArray).push(
          this.initSecuritiesForm()
      );
    }

    public removeIndividualSecurities(i): void {
      (this.kisanKarjaSubsidy.get('securities') as FormArray).removeAt(i);
    }
    initSecuritiesForm(): FormGroup {
    return this.formBuilder.group({
      freeText: [undefined],
    });
  }*/

  checkOfferLetterData() {
    if (this.cadOfferLetterApprovedDoc.offerDocumentList.length > 0) {
      this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
          === this.offerLetterConst.value(this.offerLetterConst.PERSONAL_OVERDRAFT).toString())[0];
      if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
        this.offerLetterDocument = new OfferDocument();
        this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.PERSONAL_OVERDRAFT);
      } else {
        const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
        console.log('Selected Security Details:', initialInfo);
        if (!ObjectUtil.isEmpty(this.offerLetterDocument.supportedInformation)) {
          this.offerLetterData = this.offerLetterDocument;
          this.kisanKarjaSubsidy.get('additionalGuarantorDetails').patchValue(this.offerLetterData.supportedInformation);
        }
        this.initialInfoPrint = initialInfo;
        this.existingOfferLetter = true;
        this.selectedArray = initialInfo.loanTypeSelectedArray;
        /*this.fillForm();*/
        this.initialInfoPrint = initialInfo;
        if (this.initialInfoPrint.dateOfExpiryType.en === 'AD') {
          // tslint:disable-next-line:max-line-length
          this.kisanKarjaSubsidy.get('dateofExpiry').patchValue(this.engToNepaliDate.transform(this.initialInfoPrint.dateofExpiry.en, true));
        } else {
          this.kisanKarjaSubsidy.get('dateofExpiry').patchValue(this.initialInfoPrint.dateofExpiryNepali.en);
        }
      }
    } /*else {
      this.fillForm();
    }*/
  }
  get Form() {
    return this.kisanKarjaSubsidy.controls;
  }
  submit() {
    /*const securityDetails = [{
      securities: this.kisanKarjaSubsidy.get('securities').value
    }];*/
    let flag = true;
    if (
        !ObjectUtil.isEmpty(this.cadData) &&
        !ObjectUtil.isEmpty(this.cadData.cadFileList)
    ) {
      this.cadData.cadFileList.forEach((individualCadFile) => {
        if (
            individualCadFile.customerLoanId === this.customerLoanId &&
            individualCadFile.cadDocument.id === this.documentId
        ) {
          flag = false;
          individualCadFile.initialInformation = JSON.stringify(
              this.kisanKarjaSubsidy.value
          );
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(
            this.kisanKarjaSubsidy.value
        );
        this.initialInfoPrint = cadFile.initialInformation;
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(
          this.kisanKarjaSubsidy.value
      );
      this.initialInfoPrint = cadFile.initialInformation;
      document.id = this.documentId;
      cadFile.cadDocument = document;
      cadFile.customerLoanId = this.customerLoanId;
      this.cadData.cadFileList.push(cadFile);
    }

    this.administrationService.saveCadDocumentBulk(this.cadData).subscribe(
        () => {
          this.toastService.show(
              new Alert(AlertType.SUCCESS, 'Successfully saved ')
          );
          this.dialogRef.close();
          this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
        },
        (error) => {
          console.error(error);
          this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save '));
          this.dialogRef.close();
        }
    );
  }
}
