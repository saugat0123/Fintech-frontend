import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

import {Sender} from './model/message';

import {environment} from '../../../../../environments/environment.prod';
import {User} from '../../../admin/modal/user';
import {UserService} from '../../../../@core/service/user.service';
import {WebNotificationService} from '../../service/web-notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  user: User = new User();
  isLoaded = false;
  isCustomSocketOpened = false;
  messages: Sender[] = [];
  public notifications = 0;
  message: Sender = new Sender();
  // mainForm: FormGroup;
  private serverUrl = environment.url + 'socket';
  private stompClient;
  notificationMessage = 'hello';

  constructor(private http: HttpClient,
              private dataService: WebNotificationService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.userService.getLoggedInUser().subscribe(
        (response: any) => {
          this.user = response.detail;
        }
    );
    // this.buildForm();
    this.initializeWebSocketConnection();
  }



  clearCount() {
    this.notifications = 0;
  }

  sendMessageUsingSocket() {
    this.stompClient.send('/socket-subscriber/send/message', {}, JSON.stringify(this.message));
    console.log(this.message);

  }

  initializeWebSocketConnection() {
    const ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    const that = this;
    this.stompClient.connect({}, function (frame) {
      that.isLoaded = true;
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
      const messageResult: Sender = JSON.parse(message.body);
      this.messages.push(messageResult);
      // this.toastr.success('new message recieved', null, {
      //   'timeOut': 3000
      // });
      this.notifications += 1;
      this.newNotification();
    }
  }
  newNotification() {
    this.dataService.changeNotification(this.notifications);

  }
  // sendNotificationMessage() {
  //     this.dataService.setNotifiationMessage(this.messages)
  // }



}
