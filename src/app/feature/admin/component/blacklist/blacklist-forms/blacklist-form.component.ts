import {Component, Input, OnInit} from '@angular/core';
import {Action} from '../../../../../@core/Action';
import {BlackList} from '../../../modal/BlackList';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ModalResponse, ToastService} from '../../../../../@core/utils';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {BlacklistService} from '../blacklist.service';

@Component({
  selector: 'app-blacklist-forms',
  templateUrl: './blacklist-form.component.html',
  styleUrls: ['./blacklist-form.component.scss']
})
export class BlacklistFormsComponent implements OnInit {

  @Input() action: Action = Action.ADD;
  @Input() model: BlackList;
  types = [
    {id: 'c', name: 'Citizenship. No'},
    {id: 'p', name: 'PAN.No'}];
  spinner = false;
  private submitted: boolean;
  formdata: FormData = new FormData();
  form: FormGroup;
  blacklistForm: FormGroup;
  isCitizen = true;
  constructor(
      private activeModal: NgbActiveModal,
      private toastService: ToastService,
      private blackListService: BlacklistService,
      private formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
    this.buildForm();
    this.buildModalForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      file: [undefined]
    });
  }

  buildModalForm() {
    this.blacklistForm = this.formBuilder.group({
      name: [undefined],
      ref: [undefined],
      docType: [undefined]
    });
  }

  onClose() {
    this.activeModal.dismiss(ModalResponse.CANCEL);
  }

  onSubmit() {
    this.submitted = true;
    this.blackListService.save(this.blacklistForm.value).subscribe((res) => {
      this.activeModal.close(ModalResponse.SUCCESS);
      this.toastService.show(new Alert(AlertType.SUCCESS, 'sucessfully saved'));
    }, error => {
      this.activeModal.dismiss(error);
      this.toastService.show(new Alert(AlertType.ERROR, error.error.message));
    });
  }

  show(data) {
    console.log(data);
    if (data.id === 'p') {
      this.isCitizen = false;
    }
  }

}
