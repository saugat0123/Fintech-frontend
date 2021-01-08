import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CadFile} from '../../../model/CadFile';
import {Document} from '../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {ToastService} from '../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../utils/router-utils.service';

@Component({
  selector: 'app-deed-hypo-of-machinery',
  templateUrl: './deed-hypo-of-machinery.component.html',
  styleUrls: ['./deed-hypo-of-machinery.component.scss']
})
export class DeedHypoOfMachineryComponent implements OnInit {

  deepHypoMachinery: FormGroup;
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
          this.deepHypoMachinery.patchValue(JSON.parse(singleCadFile.initialInformation));
        }
      });
    }
  }
  buildForm(){
    this.deepHypoMachinery = this.formBuilder.group({
      hintNumber: [undefined],
      loanLimitInRupees: [undefined],
      loanLimitInAlphabetical: [undefined],
      interestRateAnnually: [undefined],
      interestRatePercentage: [undefined],
      margin: [undefined],
      debtorName: [undefined],
      debtorAddress: [undefined],
      bankDistrict: [undefined],
      bankMetropolitan: [undefined],
      bankAddress: [undefined],
      bankOffice: [undefined],
      nepalMinistry: [undefined],
      department: [undefined],
      officeRegistrationNo: [undefined],
      date: [undefined],
      registeredDate: [undefined],
      registeredCompany: [undefined],
      moderatorName: [undefined],
      ModeratorGrandsonorGrandDaughter: [undefined],
      mSonorDaghter: [undefined],
      mWife: [undefined],
      mMetropolitan: [undefined],
      mVdc: [undefined],
      mAge: [undefined],
      mrs: [undefined],
      mMetropolitanNo: [undefined],
      mDistrictAdministrationOffice: [undefined],
      loanAmountInFuture: [undefined],
      indebtedMetropolitanName: [undefined],
      indebtedWardNo: [undefined],
      debtorName1: [undefined],
      debtorAddress1: [undefined],
      year: [undefined],
      month: [undefined],
      day: [undefined],
      documentWrittenWeek: [undefined],
      witnessDistrict: [undefined],
      witnessMetropolitan: [undefined],
      witnessVdc: [undefined],
      witnessAge: [undefined],
      witnessEvidence: [undefined]
    });
  }

  submit() {
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.deepHypoMachinery.value);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.deepHypoMachinery.value);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.deepHypoMachinery.value);
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
