import {Component, OnInit} from '@angular/core';
import {ShareValue} from '../../../modal/shareValue';
import {NepseService} from '../nepse.service';
import {NepseMaster} from '../../../modal/NepseMaster';
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
  nepseMaster: NepseMaster = new NepseMaster();
  shareValuesModel: ShareValue = new ShareValue();

  constructor(private nepseService: NepseService,
              private toastService: ToastService,
              private activeModel: NgbActiveModal
  ) {
  }

  ngOnInit() {
  }

  onSubmit(sharevalue: any) {
    console.log(this.nepseMaster.ordinary);
    if (sharevalue.valid) {
    this.nepseService.addShare(this.nepseMaster).subscribe(response => {
      this.activeModel.close(ModalResponse.SUCCESS);
      this.toastService.show(new Alert(AlertType.SUCCESS, 'successfully saved'));
    }, error => {
      this.activeModel.close(ModalResponse.ERROR);
      this.toastService.show(new Alert(AlertType.ERROR, 'error while adding share'));
    });
  } else {
      this.activeModel.close(ModalResponse.ERROR);
      this.toastService.show(new Alert(AlertType.ERROR, 'please Insert all field'));
    }
  }
  closeModel() {
    this.activeModel.dismiss(ModalResponse.CANCEL);
  }
}
