import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {ToastService} from '../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CadFile} from '../../../model/CadFile';
import {Document} from '../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';

@Component({
  selector: 'app-letter-of-set-off-proprietorship',
  templateUrl: './letter-of-set-off-proprietorship.component.html',
  styleUrls: ['./letter-of-set-off-proprietorship.component.scss']
})
export class LetterOfSetOffProprietorshipComponent implements OnInit {


  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  letterOfSetOffProprietorship: FormGroup;
  nepData;

  constructor(private formBuilder: FormBuilder,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
              private routerUtilsService: RouterUtilsService
  ) {
  }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          this.letterOfSetOffProprietorship.patchValue(JSON.parse(singleCadFile.initialInformation));
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
    }
  }

  buildForm() {
    this.letterOfSetOffProprietorship = this.formBuilder.group({
      address: [undefined],
      borrowerName: [undefined],
      municipality: [undefined],
      wardNum: [undefined],
      date1: [undefined],
      tole: [undefined],
      curProvince1: [undefined],
      curDistrict1: [undefined],
      curMunicipality1: [undefined],
      curWard1: [undefined],
      creditInfo1: [undefined],
      creditInfo2: [undefined],
      guarantorName: [undefined],
      guarantorFatherName: [undefined],
      guarantorFatherInLawName: [undefined],
      guarantorHusbandName: [undefined],
      guarantorCitizenshipNum: [undefined],
      CitizenshipIssuedDate: [undefined],
      CitizenshipIssuingOffice: [undefined],
      metropolitian: [undefined],
      approver: [undefined],
      creditInformation1: [undefined],
      creditInformation2: [undefined],
      GuarantorApproverDistrict: [undefined],
      GuarantorMunicipality: [undefined],
      GuarantorWard: [undefined],
      guarantorTole: [undefined],
      guarantorCurProvince: [undefined],
      guarantorCurDistrict: [undefined],
      guarantorCurMunicipality: [undefined],
      guarantorCurWard: [undefined],
      department: [undefined],
      mantralaya: [undefined],
      officeName: [undefined],
      regNo: [undefined],
      approverDistrict: [undefined],
      approverMunicipality: [undefined],
      approverWard: [undefined],
      approverAddress: [undefined],
      approverCurProvince: [undefined],
      approverCurDistrict: [undefined],
      approverCurMunicipality: [undefined],
      approverCurWard: [undefined],
      ward: [undefined],
      regDate: [undefined],
      metropolitan1: [undefined],
      wardNo: [undefined],
      partnershipForm: [undefined],
      representativeName: [undefined],
      representativeGrandaughterName: [undefined],
      sonOrDaughter: [undefined],
      wife: [undefined],
      district: [undefined],
      permanentAdd: [undefined],
      curProvince: [undefined],
      curDistrict: [undefined],
      curMunicipality: [undefined],
      curWard: [undefined],
      metropolitan2: [undefined],
      age: [undefined],
      mrOrMrs: [undefined],
      ownerBankNum: [undefined],
      documentWritenDate: [undefined],
      rupees: [undefined],
      rupessInWord: [undefined],
      sambatYear: [undefined],
      sambatMonth: [undefined],
      sambatDay: [undefined],
      sambatDocumentWrittenInWord: [undefined],
      witnessSignature: [undefined],
      witnessDistrict: [undefined],
      witnessMunicipality: [undefined],
      witnessVdc: [undefined],
      witnessAge: [undefined],
      companyName: [undefined],
      amount: [undefined],
      monthOfYear: [undefined],
      dayOfMonth: [undefined],
      fullYear: [undefined],
      promoterName: [undefined],
      billNum: [undefined],
      billInput: [undefined],
      amountInWords: [undefined],
      companyBorrowerName: [undefined],
      witnessEvidence: [undefined],
      governmentOffice: [undefined],
      registration: [undefined],
      registrationNum: [undefined],
      companyDistrict: [undefined],
      companyMunicipality: [undefined],
      companyWard: [undefined],
      timeOfDay: [undefined],
      dateOfRegister: [undefined],
      companyAct: [undefined],
      companyRegistrationOffice: [undefined],
      registrationIssuedDate: [undefined],
      registrationNumber: [undefined],
      InstitutionRegisteredDistrict: [undefined],
      InstitutionRegisteredMunicipality: [undefined],
      InstitutionRegisteredWard: [undefined],
      borrowerPersonName: [undefined],
      authorizedPersonGrandfather: [undefined],
      authorizedPerson: [undefined],
      authorizedPersonFather: [undefined],
      authorizedPersonDistrict: [undefined],
      authorizedPersonMunicipality: [undefined],
      authorizedPersonWard: [undefined],
      authorizedPersonAge: [undefined],
      authorizedPerson1: [undefined],
      authorizedPersonGrandfatherNext: [undefined],
      authorizedPersonNext: [undefined],
      authorizedPersonFatherNext: [undefined],
      authorizedPersonDistrictNext: [undefined],
      authorizedPersonMunicipalityNext: [undefined],
      authorizedPersonWardNext: [undefined],
      authorizedPersonAgeNext: [undefined],
      authorizedPersonPrevious: [undefined],
      agreementDate: [undefined],
      amountToPay: [undefined],
      amountToPayInWords: [undefined],
      accNum: [undefined],
      accNumAnother: [undefined],
      TreasuryBillNum: [undefined],
      authorizedPersonOne: [undefined],
      nameOfBorrower: [undefined],
      authorizedPersonTwo: [undefined],
      agreementYear: [undefined],
      agreementMonth: [undefined],
      agreementDate1: [undefined],
      agreementTime: [undefined],
    });
  }

  submit() {
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.letterOfSetOffProprietorship.value);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.letterOfSetOffProprietorship.value);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.letterOfSetOffProprietorship.value);
      document.id = this.documentId;
      cadFile.cadDocument = document;
      cadFile.customerLoanId = this.customerLoanId;
      this.cadData.cadFileList.push(cadFile);
    }

    this.administrationService.saveCadDocumentBulk(this.cadData).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
      this.dialogRef.close();
      this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
      this.dialogRef.close();
    });
  }

}
