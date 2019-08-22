import {Component, Input, OnInit} from '@angular/core';
import {Document} from '../../../modal/document';
import {DocumentService} from '../document.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalResponse, ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {Action} from '../../../../../@core/Action';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-document-form',
  templateUrl: './document-form.component.html',
  styleUrls: ['./document-form.component.scss']
})
export class DocumentFormComponent implements OnInit {

  @Input()
  model: Document;

  @Input()
  action: Action = Action.ADD;

  modelForm: FormGroup;

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
            [Validators.required, Validators.pattern('[a-zA-Z0-9 ]*')]]
        }
    );
  }

  onSubmit() {
    this.model.displayName = this.modelForm.value.name;
    this.service.save(this.model).subscribe((response) => {
          this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Document!'));
          this.model = new Document();
          this.activeModal.close(ModalResponse.SUCCESS);
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
