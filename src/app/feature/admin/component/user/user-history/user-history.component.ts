import {Component, Input, OnInit} from '@angular/core';
import {UserRevisionService} from '../user-revision.service';
import {ModalResponse, ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {BaseRevisionEntity} from '../../../../../@core/model/base-revision-entity';
import {User} from '../../../modal/user';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ApiConfig} from '../../../../../@core/utils/api/ApiConfig';

@Component({
  selector: 'app-user-history',
  templateUrl: './user-history.component.html',
  styleUrls: ['./user-history.component.scss']
})
export class UserHistoryComponent implements OnInit {
  @Input() userId: number;
  spinner = false;
  userHistory: Array<BaseRevisionEntity<User>>;
  rootUrl = ApiConfig.URL;

  constructor(
      private userRevisionService: UserRevisionService,
      private toastService: ToastService,
      private activeModal: NgbActiveModal) {
  }

  ngOnInit() {
    this.userRevisionService.getList(this.userId).subscribe((response: any) => {
      this.userHistory = response;
      console.log(this.userHistory);
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Error loading user history'));
    });
  }

  onClose() {
    this.activeModal.dismiss(ModalResponse.CANCEL);
  }

}
