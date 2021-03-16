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
import {NepaliNumberAndWords} from '../../../model/nepaliNumberAndWords';

@Component({
  selector: 'app-promissory-note-joint',
  templateUrl: './promissory-note-joint.component.html',
  styleUrls: ['./promissory-note-joint.component.scss']
})
export class PromissoryNoteJointComponent implements OnInit {

  promissoryNoteJoint: FormGroup;
  promissoryJoint;
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  @Input() nepaliAmount: NepaliNumberAndWords;

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
          this.promissoryNoteJoint.patchValue(JSON.parse(singleCadFile.initialInformation));
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)){
      this.promissoryJoint = JSON.parse(this.cadData.loanHolder.nepData);
    }
  }

  buildForm() {
    this.promissoryNoteJoint = this.formBuilder.group({
      branch: [undefined],
      temporaryProvince: [undefined],
      temporaryProvince2: [undefined],
      permanentDistrict: [undefined],
      permanentMunicipalityVDC: [undefined],
      permanentWardNo: [undefined],
      permanentDistrict2: [undefined],
      permanentMunicipalityVDC2: [undefined],
      permanentWardNo2: [undefined],
      namesOfTheRightPeopleInTheAffidavit: [undefined],
      namesOfTheRightPeopleInTheAffidavit2: [undefined],
      grandParents: [undefined],
      parents: [undefined],
      grandParents2: [undefined],
      parents2: [undefined],
      temporaryDistrict: [undefined],
      temporaryMunicipalityVDC: [undefined],
      temporaryWardNo: [undefined],
      temporaryDistrict2: [undefined],
      temporaryMunicipalityVDC2: [undefined],
      temporaryWardNo2: [undefined],
      age: [undefined],
      age2: [undefined],
      relation: [undefined],
      citizenshipNo: [undefined],
      issueDate: [undefined],
      issueDistrict: [undefined],
      citizenshipNo2: [undefined],
      issueDate2: [undefined],
      issueDistrict2: [undefined],
      annualRate: [undefined],
      onePerson: [undefined],
      relation2: [undefined],
      amount: [undefined],
      amountInWords: [undefined],
      year: [undefined],
      month: [undefined],
      day: [undefined],
      nameOfWitness: [undefined],
      addressOfWitness: [undefined],
      nameOfWitness2: [undefined],
      addressOfWitness2: [undefined],
    });
  }

  submit() {
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.promissoryNoteJoint.value);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.promissoryNoteJoint.value);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.promissoryNoteJoint.value);
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
