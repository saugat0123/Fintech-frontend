import {Component, Input, OnInit} from '@angular/core';
import {Role} from '../../../../modal/role';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalResponse, ToastService} from '../../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {RoleService} from '../../role.service';

@Component({
  selector: 'app-role-edit',
  templateUrl: './role-edit.component.html',
  styleUrls: ['./role-edit.component.scss']
})
export class RoleEditComponent implements OnInit {
  @Input()
  model: Role;

  constructor(private activeModal: NgbActiveModal,
              private service: RoleService,
              private toastService: ToastService) { }

  ngOnInit() {
  }

  onSubmit() {
    this.service.update(this.model).subscribe(() => {
          this.activeModal.close(ModalResponse.SUCCESS);
          this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Updated Role name!'));
          this.model = new Role();
        },
        (error) => {
          console.log(error);
          this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Update Role name!'));
          this.activeModal.dismiss(ModalResponse.ERROR);
        });
  }
  onClose() {
    this.activeModal.dismiss(ModalResponse.CANCEL);
  }

}
