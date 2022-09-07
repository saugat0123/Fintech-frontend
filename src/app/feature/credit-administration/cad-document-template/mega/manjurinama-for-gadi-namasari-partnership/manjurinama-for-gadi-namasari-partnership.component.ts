import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {CustomerInfoData} from '../../../../loan/model/customerInfoData';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
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
  selector: 'app-manjurinama-for-gadi-namasari-partnership',
  templateUrl: './manjurinama-for-gadi-namasari-partnership.component.html',
  styleUrls: ['./manjurinama-for-gadi-namasari-partnership.component.scss']
})
export class ManjurinamaForGadiNamasariPartnershipComponent implements OnInit {
  @Input() customerInfo: CustomerInfoData;
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  manjurinamaForGadiNamasariPartnership: FormGroup;
  nepData;
  initialInfo;
  submitted = false;
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
          const data = JSON.parse(singleCadFile.initialInformation);
          this.manjurinamaForGadiNamasariPartnership.patchValue(data);
          this.setName(data);
          this.initialInfo = JSON.parse(singleCadFile.initialInformation);
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
    }
    if (!ObjectUtil.isEmpty(this.initialInfo)) {
      this.manjurinamaForGadiNamasariPartnership.patchValue(this.initialInfo);
    } else {
      this.fillForm();
    }
  }

  buildForm() {
    this.manjurinamaForGadiNamasariPartnership = this.formBuilder.group({
      date : [undefined],
      chasisNo: [undefined],
      engineNo: [undefined],
      vehicleRegistrationNo: [undefined],
      borrowerName: [undefined],
      authorizedPersonName: [undefined],
      name: this.formBuilder.array([]),
    });
  }
  fillForm() {
    this.manjurinamaForGadiNamasariPartnership.patchValue({
          borrowerName: [!ObjectUtil.isEmpty(this.nepData.nepaliName) ? this.nepData.nepaliName : ''],
          authorizedPersonName: [!ObjectUtil.isEmpty(this.nepData.authorizedPersonDetail) ? this.nepData.authorizedPersonDetail.name : ''],
        });
    if (!ObjectUtil.isEmpty(this.nepData)) {
      if (!ObjectUtil.isEmpty(this.nepData.authorizedPersonDetail.name)) {
        this.addName();
        this.manjurinamaForGadiNamasariPartnership.get(['name', 0, 'name']).patchValue(this.nepData.authorizedPersonDetail.name);
      }
    }
  }
  submit() {
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.manjurinamaForGadiNamasariPartnership.value);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.manjurinamaForGadiNamasariPartnership.value);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.manjurinamaForGadiNamasariPartnership.value);
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
  addName() {
    (this.manjurinamaForGadiNamasariPartnership.get('name') as FormArray).push(this.formBuilder.group({
      name: [undefined]
    }));
  }

  remove(i) {
    (this.manjurinamaForGadiNamasariPartnership.get('name') as FormArray).removeAt(i);
  }

  setName(data) {
    if (data.length < 0) {
      this.addName();
    }
    data.name.forEach(d => {
      (this.manjurinamaForGadiNamasariPartnership.get('name') as FormArray).push(this.formBuilder.group({
        name: [d ? d.name : undefined],
      }));
    });
  }
}
