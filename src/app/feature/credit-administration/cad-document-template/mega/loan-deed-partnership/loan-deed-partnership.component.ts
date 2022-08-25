import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
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
  selector: 'app-loan-deed-partnership',
  templateUrl: './loan-deed-partnership.component.html',
  styleUrls: ['./loan-deed-partnership.component.scss']
})
export class LoanDeedPartnershipComponent implements OnInit {

  loanDeedPartnership: FormGroup;
  multipleData;
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;

  constructor(private formBuilder: FormBuilder,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
              private routerUtilsService: RouterUtilsService) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          this.loanDeedPartnership.patchValue(JSON.parse(singleCadFile.initialInformation));
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.multipleData = JSON.parse(this.cadData.loanHolder.nepData);
    }
  }


  buildForm() {
    this.loanDeedPartnership = this.formBuilder.group({
      registrationOffice: [undefined],
      registrationIssuedDate: [undefined],
      registrationNo: [undefined],
      registrationOfficeDistrict: [undefined],
      registrationOfficeMunicipalityVDC: [undefined],
      registrationOfficeWardNo: [undefined],
      borrowerName: [undefined],
      authorizedPersonGrandfatherName: [undefined],
      authorizedPersonFatherName: [undefined],
      authorizedPersonHusbandName: [undefined],
      authorizedPersonDistrict: [undefined],
      authorizedPersonMunicipalityVDC: [undefined],
      authorizedPersonWardNo: [undefined],
      authorizedPersonAge: [undefined],
      authorizedPersonName: [undefined],
      authorizedPersonGrandfatherName2: [undefined],
      authorizedPersonFatherName2: [undefined],
      authorizedPersonHusbandName2: [undefined],
      authorizedPersonDistrict2: [undefined],
      authorizedPersonMunicipalityVDC2: [undefined],
      authorizedPersonWardNo2: [undefined],
      authorizedPersonAge2: [undefined],
      authorizedPersonName2: [undefined],
      offerLetterIssuedDate: [undefined],
      amount: [undefined],
      amount2: [undefined],
      totalAmount: [undefined],
      amountInWords: [undefined],
      amountInWords2: [undefined],
      totalAmountInWords: [undefined],
      loanFacilityType: [undefined],
      loanFacilityType2: [undefined],
      FACOwnerName: [undefined],
      FACOwnerDistrict: [undefined],
      FACOwnerMunicipalityVDC: [undefined],
      FACOwnerWardNo: [undefined],
      nakshaSeatNo: [undefined],
      plotNo: [undefined],
      area: [undefined],
      witnessName: [undefined],
      witnessName2: [undefined],
      year: [undefined],
      month: [undefined],
      day: [undefined],
      time: [undefined]
    });
  }


  submit() {
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.loanDeedPartnership.value);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.loanDeedPartnership.value);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.loanDeedPartnership.value);
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
  changeToNepAmount(event: any, target, from) {
    this.loanDeedPartnership.get([target]).patchValue(event.nepVal);
    this.loanDeedPartnership.get([from]).patchValue(event.val);
  }

  patchFunction(target) {
    const patchValue1 = this.loanDeedPartnership.get([target]).value;
    return patchValue1;
  }
}
