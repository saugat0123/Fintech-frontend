import {Component, Input, OnInit} from '@angular/core';
import {ModalResponse, ToastService} from '../../../../../@core/utils';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {OpeningForm} from '../../../modal/openingForm';
import {OpeningAccountService} from '../service/opening-account.service';
import {environment} from '../../../../../../environments/environment';

@Component({
  selector: 'app-account-no-modal',
  templateUrl: './account-no-modal.component.html',
  styleUrls: ['./account-no-modal.component.scss']
})
export class AccountNumberModalComponent implements OnInit {
  @Input() openingForm: OpeningForm;
  accountNumber;
  isFeatureEnable = environment.enablePreAddingAccountNumber;
  requestValue = {
    accountNumber: undefined
  };

  constructor(private openingAccountService: OpeningAccountService,
              private toastService: ToastService,
              private activeModal: NgbActiveModal) {
  }

  ngOnInit() {
  }

  onClose() {
    this.activeModal.dismiss(ModalResponse.CANCEL);
  }

  saveAccountNo() {
    if (this.isFeatureEnable) {
      this.requestValue.accountNumber  = this.accountNumber;
    }
     this.openingAccountService.updateFormDataOnly(this.openingForm.id , this.requestValue).subscribe(value => {
       this.activeModal.close(ModalResponse.SUCCESS);
     }, res => {
       this.toastService.show(new Alert(AlertType.ERROR, res.error.message));
       console.log(res);
       this.activeModal.dismiss(ModalResponse.ERROR);
     });
  }


}
