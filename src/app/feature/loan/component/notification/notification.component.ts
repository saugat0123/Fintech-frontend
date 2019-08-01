import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

import {Message} from './model/message';

import {environment} from '../../../../../environments/environment.prod';
import {User} from '../../../admin/modal/user';
import {UserService} from '../../../../@core/service/user.service';
import {WebNotificationService} from '../../service/web-notification.service';
import {ToastService} from '../../../../@core/utils';
import {Status} from '../../../../@core/Status';


@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  user: User = new User();
  isLoaded = false;
  isCustomSocketOpened = false;
  messages: Message[] = [];
  public notifications = 0;
  message: Message = new Message();
  private serverUrl = environment.url + 'socket';
  private stompClient;
  toId: any;
  customerId: number;
  loanConfId: number;
  constructor(private http: HttpClient,
              private dataService: WebNotificationService,
              private userService: UserService,
              private toastService: ToastService,
              private router: Router) {
  }

  ngOnInit() {
    this.userService.getLoggedInUser().subscribe(
        (response: any) => {
          this.user = response.detail;
          this.message.fromId = this.user.id;
          this.message.senderName = this.user.name;
        }
    );
    this.initializeWebSocketConnection();
  }
  build() {
    this.message.toId = this.toId;
    this.message.message = 'has sent you a loan document';
    this.message.customerId = this.customerId;
    this.message.loanConfigId = this.loanConfId;
    this.message.status = Status.ACTIVE;
  }

  sendMessageUsingSocket() {
    this.build();
    this.stompClient.send('/socket-subscriber/send/message', {}, JSON.stringify(this.message));
    console.log(this.message);

  }

  initializeWebSocketConnection() {
    const ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    const that = this;
    this.stompClient.connect({}, function (frame) {
      that.isLoaded = true;
      that.openSocket();
    });
  }

  openSocket() {
    if (this.isLoaded) {
      this.isCustomSocketOpened = true;
      this.stompClient.subscribe('/socket-publisher/' + this.user.id, (message) => {
        console.log(message);
        this.handleResult(message);
      });
    }
  }

  handleResult(message) {
    if (message.body) {
      const messageResult: Message = JSON.parse(message.body);
      this.messages.push(messageResult);
      // this.toastService.show();
      this.notifications ++;
      this.newNotification();
      this.newNotificationMessage();
    }
  }
  newNotification() {
    this.dataService.changeNotification(this.notifications);

  }
  newNotificationMessage() {
    this.dataService.setNotificationMessage(this.messages);
  }

}
