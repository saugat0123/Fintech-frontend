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
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Pageable} from '../../../@core/service/baseservice/common-pageable';
import {PaginationUtils} from '../../../@core/utils/PaginationUtils';


@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  user: User = new User();
  customerId: number;
  loanConfigId: number;
  userId: any;
  notifications: Array<Message> = new Array<Message>();
  activeModal: any;
  notificationData = [];
  p: number = 1
  pageable: Pageable = new Pageable();
  page = 1;

  constructor(private http: HttpClient,
              private userService: UserService,
              private toastService: ToastService,
              private router: Router,
              private modalService: NgbModal,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.userService.getLoggedInUser().subscribe(
        (response: any) => {
          this.user = response.detail;
          this.userId = this.user.id;
        }
    );
    this.getAllNotification();
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
    this.modalService.dismissAll();
  }
  deleteNotification(id: number) {
    this.notificationService.deleteMessageById(id).subscribe(response=> {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Cleared Message'))
      this.notificationService.fetchNotifications();
    })
  }
  deleteAllMessage() {
    this.notificationService.deleteAllMessage(this.userId).subscribe(response=> {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Cleared All Messages'))
      this.notificationService.fetchNotifications();
    });
  }
  open(templete) {
    this.modalService.open(templete,{size:'xl', backdrop: true});
  }
  getAllNotification() {
    this.notificationData = [];
    this.userService.getLoggedInUser().subscribe(response => {
      this.userId = response.detail.id;
    this.notificationService.getAllNotification(this.userId, this.page, 10).subscribe(response => {
      this.pageable = PaginationUtils.getPageable(response.detail);
      this.notificationData = response.detail.content;
    });
    })
  }
  closeModal() {
    this.modalService.dismissAll();
  }
  changePage(page: number) {
    this.page = page;
    this.getAllNotification();
  }
}
