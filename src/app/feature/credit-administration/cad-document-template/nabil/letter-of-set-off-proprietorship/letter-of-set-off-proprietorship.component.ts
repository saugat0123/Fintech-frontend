import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NabilDocumentChecklist} from '../../../../admin/modal/nabil-document-checklist.enum';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CadFile} from '../../../model/CadFile';
import {Document} from '../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {NbDialogRef} from '@nebular/theme';
import {ToastService} from '../../../../../@core/utils';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';

@Component({
  selector: 'app-letter-of-set-off-proprietorship',
  templateUrl: './letter-of-set-off-proprietorship.component.html',
  styleUrls: ['./letter-of-set-off-proprietorship.component.scss']
})
export class LetterOfSetOffProprietorshipComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  letterOfSetOffForm: FormGroup;
  documentConstant = NabilDocumentChecklist;
  spinner = false;
  offerDocumentDetails: any;
  loanHolderNepData: any;
  freeText: any;

  constructor(private formBuilder: FormBuilder,
              private administrationService: CreditAdministrationService,
              private routerUtilsService: RouterUtilsService,
              private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
              private toastService: ToastService
) { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.cadData)) {
      if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList)) {
        this.offerDocumentDetails = JSON.parse(this.cadData.offerDocumentList[0].initialInformation);
      }
      if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
        this.loanHolderNepData = JSON.parse(this.cadData.loanHolder.nepData);
      }
      if (!ObjectUtil.isEmpty(this.cadData.cadFileList)) {
        this.cadData.cadFileList.forEach(singleCadFile => {
          if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
            this.freeText = JSON.parse(singleCadFile.supportedInformation);
          }
        });
      }
    }
    this.buildForm();
    this.patchFreeText();
  }
  patchFreeText() {
    if (!ObjectUtil.isEmpty(this.freeText)) {
      this.letterOfSetOffForm.get('purposeOfLoan').patchValue(
          this.freeText.purposeOfLoan ? this.freeText.purposeOfLoan : '');
      this.letterOfSetOffForm.get('proprietorFreeText').patchValue(
          this.freeText.proprietorFreeText ? this.freeText.proprietorFreeText : '');
      this.letterOfSetOffForm.get('witnessDistrict').patchValue(
          this.freeText.witnessDistrict ? this.freeText.witnessDistrict : '');
      this.letterOfSetOffForm.get('witnessMunicipality').patchValue(
          this.freeText.witnessMunicipality ? this.freeText.witnessMunicipality : '');
      this.letterOfSetOffForm.get('WitnessWardNumber').patchValue(
          this.freeText.WitnessWardNumber ? this.freeText.WitnessWardNumber : '');
      this.letterOfSetOffForm.get('witnessAge').patchValue(
          this.freeText.witnessAge ? this.freeText.witnessAge : '');
      this.letterOfSetOffForm.get('witnessName').patchValue(
          this.freeText.witnessName ? this.freeText.witnessName : '');
      this.letterOfSetOffForm.get('witnessDistrict2').patchValue(
          this.freeText.witnessDistrict2 ? this.freeText.witnessDistrict2 : '');
      this.letterOfSetOffForm.get('witnessMunicipality2').patchValue(
          this.freeText.witnessMunicipality2 ? this.freeText.witnessMunicipality2 : '');
      this.letterOfSetOffForm.get('WitnessWardNumber2').patchValue(
          this.freeText.WitnessWardNumber2 ? this.freeText.WitnessWardNumber2 : '');
      this.letterOfSetOffForm.get('witnessAge2').patchValue(
          this.freeText.witnessAge2 ? this.freeText.witnessAge2 : '');
      this.letterOfSetOffForm.get('witnessName2').patchValue(
          this.freeText.witnessName2 ? this.freeText.witnessName2 : '');
      this.letterOfSetOffForm.get('bankStaff').patchValue(
          this.freeText.bankStaff ? this.freeText.bankStaff : '');
      this.letterOfSetOffForm.get('date').patchValue(
          this.freeText.date ? this.freeText.date : '');
    }
  }
  buildForm() {
    this.letterOfSetOffForm = this.formBuilder.group({
      // If Natural Person
      naturalOwnerDetails: this.formBuilder.array([]),
      // If TD Holder is Firm/Company
      authorizedOwnerDetails: this.formBuilder.array([]),
      // Other Details
      actName: [undefined],
      actYear: [undefined],
      authorizedBodyName: [undefined],
      headSectionName: [undefined],
      registrationDate: [undefined],
      registrationNumber: [undefined],
      districtName: [undefined],
      VDCMunicipality: [undefined],
      wardNumber: [undefined],
      borrowerName: [undefined],
      branchName: [undefined],
      sanctionLetterIssuedDate: [undefined],
      loanAmountInFigure: [undefined],
      loanAmountInWords: [undefined],
      accountNumber: [undefined],
      TDIssuingBank: [undefined],
      fixedDepositNumber: [undefined],
      totalNumberOfPeople: [undefined],
      // Free Text
      purposeOfLoan: ['Jofkf/÷ Joj;fo ;+rfng '],
      proprietorFreeText: ['k|f]k|fO{6/÷;fem]bf/x?÷clVtof/ k|fKt÷'],
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
      date: [undefined]
    });
    this.setNaturalOwnerDetails();
    this.setAuthorizedOwnerDetails();
  }
  setNaturalOwnerDetails() {
    return this.formBuilder.group({
      nameofGrandFather: [undefined],
      nameofFather: [undefined],
      ownerDistrict: [undefined],
      ownerVDCMunicipality: [undefined],
      ownerWardNumber: [undefined],
      ownerAge: [undefined],
      nameOfChild: [undefined],
      ownerCitizenNumber: [undefined],
      issueDate: [undefined],
      issuedDistrict: [undefined],
    });
  }
  setAuthorizedOwnerDetails() {
    return this.formBuilder.group({
      authorizedGrandFatherName: [undefined],
      authorizedChildName: [undefined],
      authorizedDistrictName: [undefined],
      authorizedVDCName: [undefined],
      authorizedWardNumber: [undefined],
      authorizedName: [undefined],
      authorizedAge: [undefined],
      authorizedCitizenshipNumber: [undefined],
      authorizedIssuedDate: [undefined],
      authorizedIssuedPlace: [undefined],
    });
  }
  setFreeText() {
    const free = {
      purposeOfLoan: this.letterOfSetOffForm.get('purposeOfLoan').value ? this.letterOfSetOffForm.get('purposeOfLoan').value : '',
      proprietorFreeText: this.letterOfSetOffForm.get('proprietorFreeText').value ?
          this.letterOfSetOffForm.get('proprietorFreeText').value : '',
      witnessDistrict: this.letterOfSetOffForm.get('witnessDistrict').value ? this.letterOfSetOffForm.get('witnessDistrict').value : '',
      witnessMunicipality: this.letterOfSetOffForm.get('witnessMunicipality').value ?
          this.letterOfSetOffForm.get('witnessMunicipality').value : '',
      WitnessWardNumber: this.letterOfSetOffForm.get('WitnessWardNumber').value ? this.letterOfSetOffForm.get('WitnessWardNumber').value : '',
      witnessAge: this.letterOfSetOffForm.get('witnessAge').value ? this.letterOfSetOffForm.get('witnessAge').value : '',
      witnessName: this.letterOfSetOffForm.get('witnessName').value ? this.letterOfSetOffForm.get('witnessName').value : '',
      witnessDistrict2: this.letterOfSetOffForm.get('witnessDistrict2').value ? this.letterOfSetOffForm.get('witnessDistrict2').value : '',
      witnessMunicipality2: this.letterOfSetOffForm.get('witnessMunicipality2').value ?
          this.letterOfSetOffForm.get('witnessMunicipality2').value : '',
      WitnessWardNumber2: this.letterOfSetOffForm.get('WitnessWardNumber2').value ?
          this.letterOfSetOffForm.get('WitnessWardNumber2').value : '',
      witnessAge2: this.letterOfSetOffForm.get('witnessAge2').value ? this.letterOfSetOffForm.get('witnessAge2').value : '',
      witnessName2: this.letterOfSetOffForm.get('witnessName2').value ? this.letterOfSetOffForm.get('witnessName2').value : '',
      bankStaff: this.letterOfSetOffForm.get('bankStaff').value ? this.letterOfSetOffForm.get('bankStaff').value : '',
      date: this.letterOfSetOffForm.get('date').value ? this.letterOfSetOffForm.get('date').value : ''
    };
    return JSON.stringify(free);
  }
  submit() {
    this.spinner = true;
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.supportedInformation = this.setFreeText();
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.supportedInformation = this.setFreeText();
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.letterOfSetOffForm.value);
      cadFile.supportedInformation = this.setFreeText();
      document.id = this.documentId;
      cadFile.cadDocument = document;
      cadFile.customerLoanId = this.customerLoanId;
      this.cadData.cadFileList.push(cadFile);
    }

    this.administrationService.saveCadDocumentBulk(this.cadData).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
      this.dialogRef.close();
      this.spinner = false;
      this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
      this.dialogRef.close();
      this.spinner = false;
    });
  }

}
