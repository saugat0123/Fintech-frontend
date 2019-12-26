import {Component, OnInit} from '@angular/core';
import {ShareValue} from '../../../modal/shareValue';
import {NepseService} from '../nepse.service';
import {ShareForm} from '../../../modal/shareForm';
import {Status} from '../../../../../@core/Status';
import {ModalResponse, ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-share-value-form',
  templateUrl: './share-value-form.component.html',
  styleUrls: ['./share-value-form.component.scss']
})
export class ShareValueFormComponent implements OnInit {
  shareData: ShareForm = new ShareForm();
  shareValuesModel: ShareValue = new ShareValue();

  constructor(private nepseService: NepseService,
              private toastService: ToastService,
              private activeModel: NgbActiveModal
  ) {
  }

  ngOnInit() {
  }

  onSubmit(sharevalue: any) {
    this.shareData.shareData = JSON.stringify(sharevalue.value);
    this.shareData.status = Status.ACTIVE;
    this.nepseService.addShare(this.shareData).subscribe(response => {
      this.activeModel.close(ModalResponse.SUCCESS);
      this.toastService.show(new Alert(AlertType.SUCCESS, 'sucessfully saved'));
    }, error => {
      this.activeModel.close(ModalResponse.ERROR);
      this.toastService.show(new Alert(AlertType.ERROR, 'error while adding share'));
    });
  }

  closeModel() {
    this.activeModel.dismiss(ModalResponse.CANCEL);
  }
}
