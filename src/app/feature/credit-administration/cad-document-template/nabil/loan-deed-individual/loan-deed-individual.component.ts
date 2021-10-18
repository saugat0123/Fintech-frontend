import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { CustomerApprovedLoanCadDocumentation } from '../../../model/customerApprovedLoanCadDocumentation';
import { CreditAdministrationService } from '../../../service/credit-administration.service';
import { ToastService } from '../../../../../@core/utils';
import { NbDialogRef } from '@nebular/theme';
import { CadOfferLetterModalComponent } from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import { RouterUtilsService } from '../../../utils/router-utils.service';
import { ObjectUtil } from '../../../../../@core/utils/ObjectUtil';
import { CadFile } from '../../../model/CadFile';
import { Document } from '../../../../admin/modal/document';
import { Alert, AlertType } from '../../../../../@theme/model/Alert';
import { NabilDocumentChecklist } from '../../../../admin/modal/nabil-document-checklist.enum';
import { AgeCalculation } from '../../../../../@core/age-calculation';
import { EngToNepaliNumberPipe } from '../../../../../@core/pipe/eng-to-nepali-number.pipe';
import { EngNepDatePipe } from 'nepali-patro';
import { NepaliCurrencyWordPipe } from '../../../../../@core/pipe/nepali-currency-word.pipe';
import { ProposalCalculationUtils } from '../../../../loan/component/loan-summary/ProposalCalculationUtils';
import { CurrencyFormatterPipe } from '../../../../../@core/pipe/currency-formatter.pipe';
import { NepaliNumberAndWords } from '../../../model/nepaliNumberAndWords';

@Component({
  selector: 'app-loan-deed-individual',
  templateUrl: './loan-deed-individual.component.html',
  styleUrls: ['./loan-deed-individual.component.scss'],
})
export class LoanDeedIndividualComponent implements OnInit {
  loanDeedIndividual: FormGroup;
  loanHolderNepData;
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  initialInfoPrint;
  offerLetterConst = NabilDocumentChecklist;
  offerDocumentDetails: any;
  nepaliNumber = new NepaliNumberAndWords();
  educationInterestRate: any;
  vdcOption = [{value: 'Municipality', label: 'Municipality'}, {value: 'VDC', label: 'VDC'}, {value: 'Rural', label: 'Rural'}];
  constructor(
    private formBuilder: FormBuilder,
    private administrationService: CreditAdministrationService,
    private toastService: ToastService,
    private engToNepNumberPipe: EngToNepaliNumberPipe,
    private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
    private routerUtilsService: RouterUtilsService,
    private englishNepaliDatePipe: EngNepDatePipe,
    private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
    private currencyFormatPipe: CurrencyFormatterPipe,
  ) {}

  ngOnInit() {
    console.log('This is cad Approved doc ', this.cadData);
    if (
      !ObjectUtil.isEmpty(this.cadData) &&
      !ObjectUtil.isEmpty(this.cadData.cadFileList)
    ) {
      this.cadData.cadFileList.forEach((individualCadFile) => {
        if (
          individualCadFile.customerLoanId === this.customerLoanId &&
          individualCadFile.cadDocument.id === this.documentId
        ) {
          const initialInfo = JSON.parse(individualCadFile.initialInformation);
          this.initialInfoPrint = initialInfo;
          this.loanDeedIndividual.patchValue(initialInfo);
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.loanHolderNepData = JSON.parse(this.cadData.loanHolder.nepData);
    }
    console.log('individual data: ', this.loanHolderNepData);
    if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList)) {
        this.offerDocumentDetails = this.cadData.offerDocumentList[0] ? JSON.parse(this.cadData.offerDocumentList[0].initialInformation) : '';
    }
    console.log('offer document details: ', this.offerDocumentDetails);
    this.calulation();
    this.buildForm();
  }

  calulation() {
    if (ObjectUtil.isEmpty(this.cadData.nepData)) {
        const number = ProposalCalculationUtils.calculateTotalFromProposalListKey(this.cadData.assignedLoan);
        this.nepaliNumber.numberNepali = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(number));
        this.nepaliNumber.nepaliWords = this.nepaliCurrencyWordPipe.transform(number);
        this.nepaliNumber.engNumber = number;
    }
  }

  buildForm() {
    this.loanDeedIndividual = this.formBuilder.group({
      loanDeedIndividuals: this.formBuilder.array([]),
    });
    this.addIndividualLoandeedForm();
  }

  initIndividualLoandeed() {
    let todayDate: any = this.englishNepaliDatePipe.transform(new Date(), true);
    todayDate = todayDate.replace(',', '').split(' ');
    const daysInNumber = new Date().getDay();
    let age: any;
    let ageNepaliNumber: string;
    if (!ObjectUtil.isEmpty(this.loanHolderNepData) && !ObjectUtil.isEmpty(this.loanHolderNepData.dob)) {
        age = AgeCalculation.calculateAge(this.loanHolderNepData.dob.en.eDate);
        ageNepaliNumber = this.engToNepNumberPipe.transform(String(age));
    }
    let approvedDate: any;
    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && !ObjectUtil.isEmpty(this.offerDocumentDetails.dateOfApproval)) {
      // tslint:disable-next-line:max-line-length
        approvedDate = this.offerDocumentDetails.dateOfApproval && this.offerDocumentDetails.dateOfApproval.en.eDate ? this.offerDocumentDetails.dateOfApproval.en.eDate : this.offerDocumentDetails.dateOfApproval && this.offerDocumentDetails.dateOfApproval.en ? this.offerDocumentDetails.dateOfApproval.en : '';
    }

    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Educational Loan') {
        this.educationInterestRate = this.offerDocumentDetails.interestRate ? this.offerDocumentDetails.interestRate.en : '';
    }
    return this.formBuilder.group({
      branchName: [
        this.loanHolderNepData.branch ? this.loanHolderNepData.branch.ct : '',
      ],
      grandFatherName: [
        // tslint:disable-next-line:max-line-length
        this.loanHolderNepData.grandFatherName ? this.loanHolderNepData.grandFatherName.ct : this.loanHolderNepData.fatherInLawName ? this.loanHolderNepData.fatherInLawName.ct : ''
      ],
      father_husbandName: [
        // tslint:disable-next-line:max-line-length
          this.loanHolderNepData.fatherName ? this.loanHolderNepData.fatherName.ct : this.loanHolderNepData.husbandName ? this.loanHolderNepData.husbandName.ct : ''
      ],
      district: [
        this.loanHolderNepData.permanentDistrict
          ? this.loanHolderNepData.permanentDistrict.ct
          : '',
      ],
      municipality: [
          this.loanHolderNepData.permanentMunicipality ? this.loanHolderNepData.permanentMunicipality.ct : '',
        ],
      wardNo: [this.loanHolderNepData.permanentWard ? this.loanHolderNepData.permanentWard.ct : ''],
      borrowerName: [this.loanHolderNepData.name ? this.loanHolderNepData.name.ct : ''],
      name: [undefined],
      permanentdistrict: [undefined],
      permanentMunicipality: [undefined],
      placeName: [undefined],
      fatherInLawName: [undefined],
      husbandName: [undefined],
      age: [ageNepaliNumber],
      issueDate: [this.englishNepaliDatePipe.transform(approvedDate || '', true)  || ''],
      facilityName: [undefined],
      loanAmount: [undefined],
      Interest: [undefined],
      expiryDate: [undefined],
      totalLoanAmount: [this.nepaliNumber.numberNepali],
      totalLoanAmountWord: ['रु. ' + this.nepaliNumber.nepaliWords],
      propertyOwnerName: [undefined],
      plotNo: [undefined],
      area: [undefined],
      year: [todayDate[2]],
      month: [todayDate[1]],
      day: [todayDate[0]],
      time: [this.engToNepNumberPipe.transform(String(daysInNumber + 1))],
      propertyOwnerName1: [undefined],
      district1: [undefined],
      municipality1: [undefined],
      wardNo1: [undefined],
      plotNo1: [undefined],
      area1: [undefined],
      propertyOwnerName2: [undefined],
      district2: [undefined],
      municipality2: [undefined],
      wardNo2: [undefined],
      plotNo2: [undefined],
      area2: [undefined],
      freeText: [undefined],
    });
  }

  addIndividualLoandeedForm() {
    (this.loanDeedIndividual.get('loanDeedIndividuals') as FormArray).push(
      this.initIndividualLoandeed()
    );
  }

  convertNepaliNumberAmount(value) {
    return this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(value));
  }

  convertNepaliNumber(value) {
    return this.engToNepNumberPipe.transform(String(value));
  }

  submit() {
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
            this.loanDeedIndividual.value
          );
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(
          this.loanDeedIndividual.value
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
        this.loanDeedIndividual.value
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
