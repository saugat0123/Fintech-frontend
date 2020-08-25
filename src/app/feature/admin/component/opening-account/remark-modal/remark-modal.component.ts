import {Component, Input, OnInit} from '@angular/core';
import {OpeningForm} from '../../../modal/openingForm';
import {OpeningAccountService} from '../service/opening-account.service';
import {ModalResponse, ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-remark-modal',
  templateUrl: './remark-modal.component.html',
  styles: ['']
})
export class RemarkModalComponent implements OnInit {
  @Input() openingForm: OpeningForm;

  constructor(private openingAccountService: OpeningAccountService,
              private toastService: ToastService,
              private activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  saveRemark(remark) {
    this.openingForm.remark = remark;
    this.openingAccountService.updateFormDataOnly(this.openingForm).subscribe(value => {
      this.toastService.show(new Alert(AlertType.SUCCESS , 'SuccessFully Saved Remark'));
      this.activeModal.close(ModalResponse.SUCCESS);
    } , error => {
      this.toastService.show(new Alert(AlertType.ERROR , 'Error While Saving Remark'));
      console.log(error);
      this.activeModal.dismiss(ModalResponse.ERROR);
    });
  }

  onClose() {
    this.activeModal.dismiss(ModalResponse.CANCEL);
  }

}
