import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {ToastService} from "../../../../../@core/utils";
import {RouterUtilsService} from "../../../utils/router-utils.service";
import {CreditAdministrationService} from "../../../service/credit-administration.service";
import {NepaliCurrencyWordPipe} from "../../../../../@core/pipe/nepali-currency-word.pipe";
import {EngToNepaliNumberPipe} from "../../../../../@core/pipe/eng-to-nepali-number.pipe";
import {CurrencyFormatterPipe} from "../../../../../@core/pipe/currency-formatter.pipe";
import {NepaliToEngNumberPipe} from "../../../../../@core/pipe/nepali-to-eng-number.pipe";
import {NepaliPercentWordPipe} from "../../../../../@core/pipe/nepali-percent-word.pipe";
import {CustomerApprovedLoanCadDocumentation} from "../../../model/customerApprovedLoanCadDocumentation";
import {NepaliNumberAndWords} from "../../../model/nepaliNumberAndWords";
import {NabilDocumentChecklist} from "../../../../admin/modal/nabil-document-checklist.enum";
import {ObjectUtil} from "../../../../../@core/utils/ObjectUtil";
import {CadFile} from "../../../model/CadFile";
import {Document} from "../../../../admin/modal/document";
import {Alert, AlertType} from "../../../../../@theme/model/Alert";
import {NbDialogRef} from "@nebular/theme";
import {CadOfferLetterModalComponent} from "../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component";

@Component({
  selector: 'app-personal-guarantee-individual',
  templateUrl: './personal-guarantee-individual.component.html',
  styleUrls: ['./personal-guarantee-individual.component.scss']
})
export class PersonalGuaranteeIndividualComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  @Input() nepaliAmount: NepaliNumberAndWords;
  guarantorindividualGroup: FormGroup;
  initialInfoPrint;
  offerLetterConst = NabilDocumentChecklist;
  individualData;
  constructor(
      private formBuilder: FormBuilder,
      private router: Router,
      private toastService: ToastService,
      private routerUtilService: RouterUtilsService,
      private administrationService: CreditAdministrationService,
      private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
      private engToNepNumberPipe: EngToNepaliNumberPipe,
      private currencyFormatPipe: CurrencyFormatterPipe,
      private nepToEngNumberPipe: NepaliToEngNumberPipe,
      private nepPercentWordPipe: NepaliPercentWordPipe,
      private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
      private routerUtilsService: RouterUtilsService
  ) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(individualCadFile => {
        if (individualCadFile.customerLoanId === this.customerLoanId && individualCadFile.cadDocument.id === this.documentId) {
          const initialInfo = JSON.parse(individualCadFile.initialInformation);
          this.initialInfoPrint = initialInfo;
          this.guarantorindividualGroup.patchValue(initialInfo);
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.individualData = JSON.parse(this.cadData.loanHolder.nepData);``
    }
  }

  buildForm() {
    this.guarantorindividualGroup = this.formBuilder.group({
      branchName: [undefined],
      grandFatherName: [undefined],
      father_husbandName: [undefined],
      district: [undefined],
      VDCMunicipality: [undefined],
      ward: [undefined],
      temporarydistrict: [undefined],
      temporaryVDCMunicipality: [undefined],
      temporaryward: [undefined],
      borrowerName: [undefined],
      loanPurpose: [undefined],
      sanctionIssueDate: [undefined],
      loanAmount: [undefined],
      loanAmountWords: [undefined],
      guarantorName: [undefined],
      citizenshipNumber: [undefined],
      citizenshipIssuedDistrict: [undefined],
      citizenshipIssuedDate: [undefined],
      year1: [undefined],
      month1: [undefined],
      date1: [undefined],
      day1: [undefined],
      freeText: [undefined]
    });
  }
  getNumAmountWord(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.guarantorindividualGroup.get(numLabel).value);
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.guarantorindividualGroup.get(wordLabel).patchValue(returnVal);
  }
  submit(){
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.guarantorindividualGroup.value);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.guarantorindividualGroup.value);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.guarantorindividualGroup.value);
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
}
