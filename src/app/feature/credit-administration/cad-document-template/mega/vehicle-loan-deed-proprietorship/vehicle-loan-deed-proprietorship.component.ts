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
  selector: 'app-vehicle-loan-deed-proprietorship',
  templateUrl: './vehicle-loan-deed-proprietorship.component.html',
  styleUrls: ['./vehicle-loan-deed-proprietorship.component.scss']
})
export class VehicleLoanDeedProprietorshipComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  vehicleLoanDeedProprietorship: FormGroup;
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
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
    }
    if (!ObjectUtil.isEmpty(this.initialInfo)) {
      this.vehicleLoanDeedProprietorship.patchValue(this.initialInfo);
    } else {
      this.fillForm();
    }
  }

  buildForm() {
    this.vehicleLoanDeedProprietorship = this.formBuilder.group({
      branchOfficeAddress: [undefined],
      companyRegistrationOffice: [undefined],
      act: [undefined],
      department: [undefined],
      mantralaya: [undefined],
      officeName: [undefined],
      regNo: [undefined],
      regDate: [undefined],
      metropolitan1: [undefined],
      metropolitan: [undefined],
      wardNo: [undefined],
      partnershipForm: [undefined],
      borrowerName: [undefined],
      authorizedPersonGrandFather: [undefined],
      authorizedPersonFather: [undefined],
      authorizedPersonHusband: [undefined],
      authorizedPersonDistrict: [undefined],
      authorizedPersonMetropolitan: [undefined],
      authorizedPersonWardNo: [undefined],
      authorizedPersonAge: [undefined],
      authorizedPerson: [undefined],
      loanAmount: [undefined],
      loanAmountInWords: [undefined],
      offerLetterIssuedDate: [undefined],
      witness1: [undefined],
      witness2: [undefined],
      representativeName: [undefined],
      representativeGrandaughterName: [undefined],
      sonOrDaughter: [undefined],
      wife: [undefined],
      district: [undefined],
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
      sambatDate: [undefined],
      shubham: [undefined],
      sambatDocumentWrittenInWord: [undefined],
      witnessSignature: [undefined],
      witnessDistrict: [undefined],
      witnessMunicipality: [undefined],
      witnessVdc: [undefined],
      witnessAge: [undefined],
      witnessEvidence: [undefined],
      engineNo: [undefined],
      vehicleCompany: [undefined],
      vehicleModel: [undefined],
      vehicleRegNo: [undefined],
      witness3: [undefined],
      chassisNo: [undefined],
    });
  }
    fillForm() {
      this.vehicleLoanDeedProprietorship.patchValue({
            branchOfficeAddress: [!ObjectUtil.isEmpty(this.nepData.branchDetail) ? this.nepData.branchDetail.branchNameInNepali : ''],
            companyRegistrationOffice: [!ObjectUtil.isEmpty(this.nepData.companyRegOffice) ? this.nepData.companyRegOffice : ''],
            regDate: [!ObjectUtil.isEmpty(this.nepData.regIssueDate) ? this.nepData.regIssueDate : ''],
            regNo: [!ObjectUtil.isEmpty(this.nepData.registrationNo) ? this.nepData.registrationNo : ''],
            district: [!ObjectUtil.isEmpty
            (this.nepData.institutionRegisteredAddress) ? this.nepData.institutionRegisteredAddress.district : ''],
            metropolitan: [!ObjectUtil.isEmpty
            (this.nepData.institutionRegisteredAddress) ? this.nepData.institutionRegisteredAddress.district : ''],
            wardNo: [!ObjectUtil.isEmpty
            (this.nepData.institutionRegisteredAddress) ? this.nepData.institutionRegisteredAddress.municipality : ''],
            borrowerName: [!ObjectUtil.isEmpty
            (this.nepData.nepaliName) ? this.nepData.nepaliName : ''],
            authorizedPerson: [!ObjectUtil.isEmpty
            (this.nepData.authorizedPersonDetail) ? this.nepData.authorizedPersonDetail.name : ''],
            offerLetterIssuedDate: [!ObjectUtil.isEmpty
            (this.nepData.miscellaneousDetail) ? this.nepData.miscellaneousDetail.offerIssueDate : ''],
            loanAmount: [!ObjectUtil.isEmpty(this.nepData.miscellaneousDetail) ? this.nepData.miscellaneousDetail.loanAmountInFig : ''],
            loanAmountInWords: [!ObjectUtil.isEmpty(this.nepData.miscellaneousDetail) ?
                this.nepData.miscellaneousDetail.loanAmountInWord : ''],
            authorizedPersonGrandFather: [!ObjectUtil.isEmpty
            (this.nepData.authorizedPersonDetail) ? this.nepData.authorizedPersonDetail.grandFatherName : ''],
            authorizedPersonFather: [!ObjectUtil.isEmpty
            (this.nepData.authorizedPersonDetail) ? this.nepData.authorizedPersonDetail.fatherName : ''],
            authorizedPersonHusband: [!ObjectUtil.isEmpty
             (this.nepData.authorizedPersonDetail) ? this.nepData.authorizedPersonDetail.husbandName : ''],
        authorizedPersonDistrict: [!ObjectUtil.isEmpty
        (this.nepData.authorizedPersonAddress) ? this.nepData.authorizedPersonAddress.district : ''],
        authorizedPersonMetropolitan: [!ObjectUtil.isEmpty
        (this.nepData.authorizedPersonAddress) ? this.nepData.authorizedPersonAddress.municipality : ''],
        authorizedPersonWardNo: [!ObjectUtil.isEmpty
        (this.nepData.authorizedPersonAddress) ? this.nepData.authorizedPersonAddress.wardNo : ''],
          }
      );
    }

  submit() {
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.vehicleLoanDeedProprietorship.value);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.vehicleLoanDeedProprietorship.value);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.vehicleLoanDeedProprietorship.value);
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

  changeToNepAmount(event: any, target, from) {
    this.vehicleLoanDeedProprietorship.get([target]).patchValue(event.nepVal);
    this.vehicleLoanDeedProprietorship.get([from]).patchValue(event.val);
  }
  patchFunction(target) {
    const patchValue1 = this.vehicleLoanDeedProprietorship.get([target]).value;
    return patchValue1;
  }
}

