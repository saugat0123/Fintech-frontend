import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

import {Message} from './model/message';

import {CommonDataService} from '../../../../@core/service/baseservice/common-dataService';
import {environment} from '../../../../../environments/environment.prod';
import {User} from '../../../admin/modal/user';
import {UserService} from '../../../../@core/service/user.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  user: User = new User();
  // fromId: string = this.user.name;
  isLoaded = false;
  isCustomSocketOpened = false;
  messages: Message[] = [];
  public notifications = 0;
  message: Message = new Message();
  mainForm: FormGroup;
  private serverUrl = environment.url + 'socket';
  private stompClient;


  constructor(private http: HttpClient,
              private formBuilder: FormBuilder,
              private dataService: CommonDataService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.userService.getLoggedInUser().subscribe(
        (response: any) => {
          this.user = response.detail;
        }
    );
    this.buildForm();
    this.initializeWebSocketConnection();
  }

  buildForm() {
    this.mainForm = this.formBuilder.group({
      toId: [undefined, Validators.required],
      message: [undefined, Validators.required]
    });
  }

  clearCount() {
    this.notifications = 0;
  }

  sendMessageUsingSocket() {
    this.message = this.mainForm.value;
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
      const messageResult: Message = JSON.parse(message.body);
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
