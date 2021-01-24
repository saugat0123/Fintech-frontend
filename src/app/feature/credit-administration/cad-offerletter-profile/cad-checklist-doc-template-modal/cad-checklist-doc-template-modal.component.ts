import {Component, Input, OnInit} from '@angular/core';
import {NbDialogRef} from '@nebular/theme';
import {CadCheckListTemplateEnum} from '../../../admin/modal/cadCheckListTemplateEnum';
import {CustomerApprovedLoanCadDocumentation} from '../../model/customerApprovedLoanCadDocumentation';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {environment} from '../../../../../environments/environment';
import {Clients} from '../../../../../environments/Clients';

@Component({
  selector: 'app-cad-checklist-doc-template-modal',
  templateUrl: './cad-checklist-doc-template-modal.component.html',
  styleUrls: ['./cad-checklist-doc-template-modal.component.scss']
})
export class CadChecklistDocTemplateModalComponent implements OnInit {
  @Input() documentId;
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() customerLoanId: number;
  client = environment.client;
  clientList = Clients;

  cadTemplate = CadCheckListTemplateEnum;

  constructor(protected dialogRef: NbDialogRef<CadChecklistDocTemplateModalComponent>) {
  }

  ngOnInit() {

  }

  onClose() {
    this.dialogRef.close();
  }
}
