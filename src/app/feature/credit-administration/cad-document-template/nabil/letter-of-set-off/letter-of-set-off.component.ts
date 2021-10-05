import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {NabilDocumentChecklist} from '../../../../admin/modal/nabil-document-checklist.enum';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CadFile} from '../../../model/CadFile';
import {Document} from '../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {ToastService} from '../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {CustomerType} from '../../../../customer/model/customerType';
import {CadDocStatus} from '../../../model/CadDocStatus';
import {District} from '../../../../admin/modal/district';

@Component({
  selector: 'app-letter-of-set-off',
  templateUrl: './letter-of-set-off.component.html',
  styleUrls: ['./letter-of-set-off.component.scss']
})
export class LetterOfSetOffComponent implements OnInit {
  letterOfSetOff: FormGroup;
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  @Input() preview;
  @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
  nepData;
  individualData;
  initialInfoPrint;
  offerLetterConst = NabilDocumentChecklist;
  customerType = CustomerType;
  constructor(private formBuilder: FormBuilder,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
              private routerUtilsService: RouterUtilsService) { }


  ngOnInit() {
    this.buildForm();
    console.log('This is cad Approved doc ', this.cadData);
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(individualCadFile => {
        if (individualCadFile.customerLoanId === this.customerLoanId && individualCadFile.cadDocument.id === this.documentId) {
          const initialInfo = JSON.parse(individualCadFile.initialInformation);
          this.initialInfoPrint = initialInfo;
          this.letterOfSetOff.patchValue(initialInfo);
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.individualData = JSON.parse(this.cadData.loanHolder.nepData);
    }
    console.log('INDIVIDUAL DATA =', this.individualData);
    this.fillform();
  }

  buildForm() {
    this.letterOfSetOff = this.formBuilder.group({
      date: [undefined],
      grandFatherName: [undefined],
      fatherName: [undefined],
      district: [undefined],
      vdc: [undefined],
      wardNo: [undefined],
      age: [undefined],
      daughterName: [undefined],
      nameOfCustomer: [undefined],
      citizenshipNo: [undefined],
      dateOfIssue: [undefined],
      identifyIssuedDistrictName: [undefined],
      actDetails: [undefined],
      actYearFigure: [undefined],
      nameOfDepartment: [undefined],
      dateOfRegistration: [undefined],
      registrationNo: [undefined],
      nameOfUnit:  [undefined],
      grandDaughterName: [undefined],
      nameOfWife: [undefined],
      grandSonName: [undefined],
      sonName: [undefined],
      nameOfSon: [undefined],
      nameOfBorrower: [undefined],
      nameOfBranch: [undefined],
      sanctionLetterIssuedDate: [undefined],
      loanAmountFigure: [undefined],
      loanAmountWord: [undefined],
      accountNo: [undefined],
      nameOfTd: [undefined],
      fixedDeposit: [undefined],
      purposeOfLoan: [undefined],
      numberOfPerson: [undefined],
      nameOfWitness: [undefined],
      nameOfWitnessFromBank: [undefined],
    });
  }
  fillform() {
    this.letterOfSetOff.patchValue(
        {
          nameOfBranch: this.individualData.branch.ct ?
              this.individualData.branch.ct : '',
          grandFatherName: this.individualData.grandFatherName.ct ?
              this.individualData.grandFatherName.ct : '',
          fatherName: this.individualData.fatherName.ct ?
              this.individualData.fatherName.ct : '',
          identifyIssuedDistrictName: this.individualData.citizenshipIssueDistrict.ct ?
              this.individualData.citizenshipIssueDistrict.ct : '',
          dateOfIssue: this.individualData.citizenshipIssueDate.np ?
              this.individualData.citizenshipIssueDate.np : '',
          citizenshipNo: this.individualData.citizenshipNo.ct ?
              this.individualData.citizenshipNo.ct : '',
          wardNo: this.individualData.permanentWard.ct ?
              this.individualData.permanentWard.ct : '',
          vdc: this.individualData.permanentMunicipality.ct ?
              this.individualData.permanentMunicipality.ct : '',
          district: this.individualData.permanentDistrict.ct ?
              this.individualData.permanentDistrict.ct : '',
          nameOfCustomer: this.individualData.name.ct ?
              this.individualData.name.ct : '',
        }
    );
    console.log('value', this.individualData.grandFatherName);
  }

  submit() {
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(individualCadFile => {
        if (individualCadFile.customerLoanId === this.customerLoanId && individualCadFile.cadDocument.id === this.documentId) {
          flag = false;
          individualCadFile.initialInformation = JSON.stringify(this.letterOfSetOff.value);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.letterOfSetOff.value);
        this.initialInfoPrint = cadFile.initialInformation;
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.letterOfSetOff.value);
      this.initialInfoPrint = cadFile.initialInformation;
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
    console.log(this.letterOfSetOff.value);
  }

}
