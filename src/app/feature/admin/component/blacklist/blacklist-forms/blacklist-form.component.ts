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
export class BlacklistFormComponents implements OnInit {

  @Input() action: Action = Action.ADD;
  @Input() model: BlackList;

  spinner = false;
  private submitted: boolean;
  formdata: FormData = new FormData();
  form: FormGroup;

  constructor(
      private activeModal: NgbActiveModal,
      private toastService: ToastService,
      private blackListService: BlacklistService,
      private formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      file: [undefined]
    });
  }

  onClose() {
    this.activeModal.dismiss(ModalResponse.CANCEL);
  }

  onSubmit(event) {
    this.submitted = true;
    this.addinformation(event);
  }

  addinformation(event) {
    const excelFile = <File>event.files[0];
    this.formdata.append('excelFile', excelFile);
    this.formdata.append('type', 'blackListFile');
    this.blackListService.uploadBlackListFile(this.formdata).subscribe(() => {
      this.activeModal.close(ModalResponse.SUCCESS);
      this.toastService.show(new Alert(AlertType.SUCCESS, 'sucessfully saved'));
    }, error => {
      this.activeModal.dismiss(error);
      this.toastService.show(new Alert(AlertType.ERROR, error.error.message));
    });
  }

}
