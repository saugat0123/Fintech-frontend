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
  selector: 'app-letter-of-set-off-company',
  templateUrl: './letter-of-set-off-company.component.html',
  styleUrls: ['./letter-of-set-off-company.component.scss']
})
export class LetterOfSetOffCompanyComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  letterOfSetOffCompany: FormGroup;
  nepData;
  initialInfo;

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
          this.initialInfo = JSON.parse(singleCadFile.initialInformation);
          console.log('this.initialInfo', this.initialInfo);
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
    }
    if (!ObjectUtil.isEmpty(this.initialInfo)) {
      this.letterOfSetOffCompany.patchValue(this.initialInfo);
    } else {
      this.fillForm();
    }
  }

  buildForm() {
    this.letterOfSetOffCompany = this.formBuilder.group({
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
      companyNameNepali: [undefined],
      amount: [undefined],
      monthOfYear: [undefined],
      dayOfMonth: [undefined],
      fullYear: [undefined],
      promoterName: [undefined],
      billNum: [undefined],
      billInput: [undefined],
      amountInWords: [undefined],
      authPersonName: [undefined],
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
      accountNumber: [undefined],
    });
  }

  fillForm() {
    this.letterOfSetOffCompany.patchValue({
      governmentOffice: [ObjectUtil.isEmpty(this.nepData.companyRegOffice) ? '' : (this.nepData.companyRegOffice)],
      registration: [ObjectUtil.isEmpty(this.nepData.regIssueDate) ? '' : (this.nepData.regIssueDate)],
      registrationNum: [ObjectUtil.isEmpty(this.nepData.registrationNo) ? '' : (this.nepData.registrationNo)],
      companyDistrict: [ObjectUtil.isEmpty(this.nepData.institutionRegisteredAddress.district) ? '' : (this.nepData.institutionRegisteredAddress.district)],
      companyMunicipality: [ObjectUtil.isEmpty(this.nepData.institutionRegisteredAddress.municipality) ? '' : (this.nepData.institutionRegisteredAddress.municipality)],
      companyWard: [ObjectUtil.isEmpty(this.nepData.institutionRegisteredAddress.wardNo) ? '' : (this.nepData.institutionRegisteredAddress.wardNo)],
      companyNameNepali: [ObjectUtil.isEmpty(this.nepData.nepaliName) ? '' : (this.nepData.nepaliName)],
      authPersonName: [ObjectUtil.isEmpty(this.nepData.authorizedPersonDetail.name) ? '' : (this.nepData.authorizedPersonDetail.name)],
      dateOfRegister: [ObjectUtil.isEmpty(this.nepData.miscellaneousDetail.offerIssueDate) ? '' : (this.nepData.miscellaneousDetail.offerIssueDate)],
      amount: [ObjectUtil.isEmpty(this.nepData.miscellaneousDetail.loanAmountInFig) ? '' : (this.nepData.miscellaneousDetail.loanAmountInFig)],
      amountInWords: [ObjectUtil.isEmpty(this.nepData.miscellaneousDetail.loanAmountInWord) ? '' : (this.nepData.miscellaneousDetail.loanAmountInWord)]
    });
  }

  submit() {
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.letterOfSetOffCompany.value);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.letterOfSetOffCompany.value);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.letterOfSetOffCompany.value);
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
