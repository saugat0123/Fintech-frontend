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
  selector: 'app-hypo-of-stock',
  templateUrl: './hypo-of-stock.component.html',
  styleUrls: ['./hypo-of-stock.component.scss']
})
export class HypoOfStockComponent implements OnInit {

  hypoOfStock: FormGroup;
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  nepData;
  constructor(private formBuilder: FormBuilder,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
              private routerUtilsService: RouterUtilsService) { }

  ngOnInit() {
    this.hypoOfStock = this.formBuilder.group({
      hintNumber: [undefined],
      loanLimit: [undefined],
      loanLimitInAlphabetical: [undefined],
      interestRateAnnually: [undefined],
      percentage: [undefined],
      margin: [undefined],
      debtorName: [undefined],
      address: [undefined],
      hypothesisAmountInRupees: [undefined],
      loanAmountInWord: [undefined],
      branchOffice: [undefined],
      ministry: [undefined],
      department: [undefined],
      office: [undefined],
      registrationNo: [undefined],
      date: [undefined],
      registeredDate: [undefined],
      proprietaryPartner: [undefined],
      grandDaughter: [undefined],
      sonOrDaughter: [undefined],
      district: [undefined],
      metropolitan: [undefined],
      vdcName: [undefined],
      age: [undefined],
      mrs: [undefined],
      districtAdministrationOffice: [undefined],
      officeName: [undefined],
      indebtedDistrict: [undefined],
      aIndebtedMetropolitan: [undefined],
      aIndebtedWardNo: [undefined],
      aIndebtedAttached: [undefined],
      indebtedName: [undefined],
      indebtedAddress: [undefined],
      companyYear: [undefined],
      companyMonth: [undefined],
      companyDay: [undefined],
      company: [undefined],
      witnessYear: [undefined],
      witnessSignature: [undefined],
      witnessDistrict: [undefined],
      witnessMetropolitan: [undefined],
      witnessVdc: [undefined],
      witnessAge: [undefined],
      witnessEvidence: [undefined]
    });
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          this.hypoOfStock.patchValue(JSON.parse(singleCadFile.initialInformation));
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
    }
  }

  submit() {
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.hypoOfStock.value);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.hypoOfStock.value);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.hypoOfStock.value);
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
    console.log(this.hypoOfStock.value);
  }

}
