import {Component, Input, OnInit} from '@angular/core';
import {Document} from '../../../modal/document';
import {DocumentService} from '../document.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalResponse, ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {Action} from '../../../../../@core/Action';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {EnumUtils} from '../../../../../@core/utils/enums.utils';
import {DocumentCheckType} from '../../../../../@core/model/enum/document-check-type.enum';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-document-form',
  templateUrl: './document-form.component.html',
  styleUrls: ['./document-form.component.scss']
})
export class DocumentFormComponent implements OnInit {

  @Input() model: Document;
  @Input() action: Action = Action.ADD;

  modelForm: FormGroup;
  DocumentCheckTypeEnum = EnumUtils.keys(DocumentCheckType);

  constructor(
      private service: DocumentService,
      private activeModal: NgbActiveModal,
      private toastService: ToastService,
      private formBuilder: FormBuilder
  ) {
  }

  get name() {
    return this.modelForm.get('name');
  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm(): void {
    this.modelForm = this.formBuilder.group(
        {
          id: [this.model.id === undefined ? '' : this.model.id],
          name: [this.model.displayName === undefined ? '' : this.model.displayName,
            [Validators.required, Validators.pattern('[a-zA-Z0-9 ]*')]],
          checkType: [ObjectUtil.setUndefinedIfNull(this.model.checkType)],
          containsTemplate: [ObjectUtil.isEmpty(this.model.containsTemplate) ? false : this.model.containsTemplate],
        }
    );
  }

  onSubmit() {
    this.model.displayName = this.modelForm.get('name').value;
    this.model.checkType = this.modelForm.get('checkType').value;
    this.model.containsTemplate = this.modelForm.get('containsTemplate').value;
    this.service.save(this.model).subscribe((response) => {
        if (this.model.id == null) {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Document!'));
            this.model = new Document();
            this.activeModal.close(ModalResponse.SUCCESS);
        } else {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Edited Document!'));
            this.model = new Document();
            this.activeModal.close(ModalResponse.SUCCESS);
        }
        }, error => {
          console.log(error);
          this.activeModal.dismiss(error);
        }
    );
  }

  dismiss(): void {
    this.activeModal.dismiss(ModalResponse.CANCEL);
  }

}
