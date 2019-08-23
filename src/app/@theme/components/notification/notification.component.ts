import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';

import {Message} from './model/message';
import {User} from '../../../feature/admin/modal/user';
import {UserService} from '../../../@core/service/user.service';
import {ToastService} from '../../../@core/utils';
import {NotificationService} from './service/notification.service';
import {Status} from '../../../@core/Status';
import {Alert, AlertType} from '../../model/Alert';


@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  user: User = new User();
  customerId: number;
  loanConfigId: number;

  notifications: Array<Message> = new Array<Message>();

  constructor(private http: HttpClient,
              private userService: UserService,
              private toastService: ToastService,
              private router: Router,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.userService.getLoggedInUser().subscribe(
        (response: any) => {
          this.user = response.detail;
        }
    );
    this.notificationService.notificationMessage.subscribe(value => this.notifications = value);
  }

  summaryClick(message: Message) {
    message.status = Status.INACTIVE;
    this.notificationService.save(message).subscribe((updateNotification: any) => {
      this.notificationService.fetchNotifications();
      this.router.navigate(['/home/loan/summary'], {
            queryParams: {
              loanConfigId: message.loanConfigId,
              customerId: message.customerId
            }
          });
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Error updating notification status'));
    });
  }

}
