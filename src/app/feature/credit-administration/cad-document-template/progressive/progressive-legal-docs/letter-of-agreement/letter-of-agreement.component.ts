import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CustomerOfferLetter} from '../../../../../loan/model/customer-offer-letter';
import {OfferDocument} from '../../../../model/OfferDocument';
import {NbDialogRef} from '@nebular/theme';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {ProgressiveLegalDocConst} from '../progressive-legal-doc-const';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {CadFile} from '../../../../model/CadFile';
import {Document} from '../../../../../admin/modal/document';
import {NepDataPersonal} from '../../../../model/nepDataPersonal';

@Component({
  selector: 'app-letter-of-agreement',
  templateUrl: './letter-of-agreement.component.html',
  styleUrls: ['./letter-of-agreement.component.scss']
})
export class LetterOfAgreementComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  @Input() offerLetterType;
  @Input() cadOfferLetterApprovedDoc;
  spinner;
  form: FormGroup;
  offerLetterConst = ProgressiveLegalDocConst;
  customerOfferLetter: CustomerOfferLetter;
  initialInfoPrint;
  existingOfferLetter = false;
  offerLetterDocument: OfferDocument;
  nepaliData;
  nepDataPersonal = new NepDataPersonal();

  constructor(private dialogRef: NbDialogRef<LetterOfAgreementComponent>,
              private formBuilder: FormBuilder,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private routerUtilsService: RouterUtilsService) {
  }

  ngOnInit() {
    this.buildForm();
    this.fillForm();
  }

  fillForm() {
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          const initialInfo = JSON.parse(singleCadFile.initialInformation);
          this.initialInfoPrint = initialInfo;
          this.form.patchValue(this.initialInfoPrint);
        }
      });
    }

    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepaliData = JSON.parse(this.cadData.loanHolder.nepData);
      this.nepDataPersonal = JSON.parse(this.cadData.nepDataPersonal);
      const loanAmount = JSON.parse(this.cadData.nepData);
      this.form.patchValue({
        perDistrict: this.nepaliData.collateralOwnerDetails[0].collateralOwnerPermanentDistrict.nepaliName ? this.nepaliData.collateralOwnerDetails[0].collateralOwnerPermanentDistrict.nepaliName : '',
        perMunicipality: this.nepaliData.collateralOwnerDetails[0].collateralOwnerPermanentMunicipalities.nepaliName ? this.nepaliData.collateralOwnerDetails[0].collateralOwnerPermanentMunicipalities.nepaliName : '',
        perWardNo: this.nepaliData.collateralOwnerDetails[0].collateralOwnerPermanentWard ? this.nepaliData.collateralOwnerDetails[0].collateralOwnerPermanentWard : '',
        grandFatherName: this.nepaliData.collateralOwnerDetails[0].collateralOwnerGrandFatherName ? this.nepaliData.collateralOwnerDetails[0].collateralOwnerGrandFatherName : '',
        fatherName: this.nepaliData.collateralOwnerDetails[0].collateralOwnerFatherName ? this.nepaliData.collateralOwnerDetails[0].collateralOwnerFatherName : '',
        loanHolderName: this.nepaliData.collateralOwnerDetails[0].collateralOwnerName ? this.nepaliData.collateralOwnerDetails[0].collateralOwnerName : '',
        financeDistrict: this.nepaliData.branchDistrict ? this.nepaliData.branchDistrict : '',
        financeMunicipality: this.nepaliData.branchMunVdc ? this.nepaliData.branchMunVdc : '',
        financeWardNo: this.nepaliData.branchWardNo ? this.nepaliData.branchWardNo : '',
        financeBranchName: this.nepaliData.branchName ? this.nepaliData.branchName : '',
        officeRegNo: this.nepaliData.collateralDetails[0].regNo ? this.nepaliData.collateralDetails[0].regNo : '',
        districtName: this.nepaliData.companyDistrict ? this.nepaliData.companyDistrict : '',
        municipalityName: this.nepaliData.companyVdcMun ? this.nepaliData.companyVdcMun : '',
        wardNo: this.nepaliData.companyWardNo ? this.nepaliData.companyWardNo : '',
        companyName: this.nepaliData.companyName ? this.nepaliData.companyName : '',
        loanAmount: loanAmount.numberNepali ? loanAmount.numberNepali : '',
        loanAmountWords: loanAmount.nepaliWords ? loanAmount.nepaliWords : '',
        gender: this.nepaliData.collateralOwnerDetails[0].collateralOwnerGender ?  this.nepaliData.collateralOwnerDetails[0].collateralOwnerGender : '',
      });
    }
  }

  onSubmit(): void {
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.form.value);
          this.initialInfoPrint = singleCadFile.initialInformation;
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

  buildForm() {
    this.form = this.formBuilder.group({
      malpot: [undefined],
      perDistrict: [undefined],
      perMunicipality: [undefined],
      perWardNo: [undefined],
      temporaryDistrict: [undefined],
      temporaryMunicipalityVDC: [undefined],
      temporaryWardNo: [undefined],
      temporaryAddress: [undefined],
      grandFatherName: [undefined],
      fatherName: [undefined],
      loanHolderAge: [undefined],
      loanHolderName: [undefined],
      financeDistrict: [undefined],
      financeMunicipality: [undefined],
      financeWardNo: [undefined],
      financeBranchName: [undefined],
      officeRegNo: [undefined],
      financeRegistrationDate: [undefined],
      districtName: [undefined],
      municipalityName: [undefined],
      wardNo: [undefined],
      companyName: [undefined],
      loanAmount: [undefined],
      loanAmountWords: [undefined],
      itiYear: [undefined],
      itiMonth: [undefined],
      itiDate: [undefined],
      itiSambat: [undefined],
      gender: [undefined],
    });
  }

  getNumAmountWord(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.form.get(wordLabel).patchValue(returnVal);
  }

}
