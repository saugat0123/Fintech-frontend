import {Component, Input, OnInit} from '@angular/core';
import {BaseInterest} from '../BaseInterest';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ModalResponse, ToastService} from '../../../../../@core/utils';
import {BaseInterestService} from '../../../service/base-interest.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-base-interest-form',
  templateUrl: './base-interest-form.component.html',
  styleUrls: ['./base-interest-form.component.scss']
})
export class BaseInterestFormComponent implements OnInit {

  constructor(private baseInterestService: BaseInterestService,
              private activeModal: NgbActiveModal,
              private toastService: ToastService) { }

  @Input()
  model: BaseInterest = new BaseInterest();
  task: string;
  submitted = false;
  spinner = false;

  ngOnInit() {
  }

  onSubmit() {
    this.submitted = true;
    this.baseInterestService.save(this.model).subscribe(result => {
          this.model = new BaseInterest();
          this.activeModal.close(ModalResponse.SUCCESS);

        }, error => {

          console.log(error);
          this.activeModal.dismiss(error);
          this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Save Base Interest'));
        }
    );
  }
  onClose() {
    this.activeModal.dismiss(ModalResponse.CANCEL);
  }

}
