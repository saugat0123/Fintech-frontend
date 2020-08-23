import {Component, Input, OnInit} from '@angular/core';
import {OpeningForm} from '../../../modal/openingForm';
import {OpeningAccountService} from '../service/opening-account.service';
import {ModalResponse, ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {DatePipe} from '@angular/common';
import {LocalStorageUtil} from '../../../../../@core/utils/local-storage-util';
import {User} from '../../../modal/user';
import {UserService} from '../../user/user.service';

@Component({
  selector: 'app-remark-modal',
  templateUrl: './remark-modal.component.html',
  styles: ['']
})
export class RemarkModalComponent implements OnInit {
  @Input() openingForm: OpeningForm;
  @Input() action: string;

  requestValue = {
    remark: undefined,
    lastFollowUp: undefined,
    lastFollowUpBy: undefined
  };
  user: User = new User();


  constructor(private openingAccountService: OpeningAccountService,
              private toastService: ToastService,
              private activeModal: NgbActiveModal,
              private userService: UserService) {
  }

  ngOnInit() {
    this.userService.detail(Number(LocalStorageUtil.getStorage().userId)).subscribe
    (value => {
      this.user = value.detail; });
  }

  saveRemark(remark) {
    const pipe = new DatePipe('en-US');
    this.requestValue.remark = remark;
    this.requestValue.lastFollowUpBy = this.user;
    this.requestValue.lastFollowUp = pipe.transform(new Date(), 'MM/dd/yyyy');
    this.openingAccountService.updateFormDataOnly(this.openingForm.id, this.requestValue).subscribe(value => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'SuccessFully Saved Remark'));
      this.activeModal.close(ModalResponse.SUCCESS);
    }, error => {
      this.toastService.show(new Alert(AlertType.ERROR, 'Error While Saving Remark'));
      console.log(error);
      this.activeModal.dismiss(ModalResponse.ERROR);
    });
  }

  onClose() {
    this.activeModal.dismiss(ModalResponse.CANCEL);
  }

}
