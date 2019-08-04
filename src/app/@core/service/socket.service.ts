import {Injectable} from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {Message} from '../../@theme/components/notification/model/message';
import {environment} from '../../../environments/environment.prod';
import {Status} from '../Status';
import {ToastService} from '../utils';
import {Alert, AlertType} from '../../@theme/model/Alert';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  isCustomSocketOpened = false;
  private serverUrl = environment.url + 'socket';
  private stompClient;

  notificationCount: number;
  message: Message = new Message();
  messages: Message[] = [];

  userId = Number(localStorage.getItem('userId'));

  constructor(
      private toastService: ToastService
  ) {
    this.initializeWebSocketConnection();
    // set default message parameters
    this.message.message = 'has sent you a loan document';
    this.message.status = Status.ACTIVE;
    this.message.fromId = this.userId;
    this.message.senderName = localStorage.getItem('userFullName');
  }

  // Web socket configurations initialization
  initializeWebSocketConnection() {
    const ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    const that = this;
    this.stompClient.connect({}, function (frame) {
      that.openSocket();
    });
  }

  openSocket() {
    this.isCustomSocketOpened = true;
    this.stompClient.subscribe('/socket-publisher/' + this.userId, (message) => {
      console.log(message);
      this.handleRealTimeResult(message);
    });
  }

  sendMessageUsingSocket() {
    this.stompClient.send('/socket-subscriber/send/message', {}, JSON.stringify(this.message));
    console.log(this.message);
  }

  handleRealTimeResult(message) {
    if (message.body) {
      const messageResult: Message = JSON.parse(message.body);
      this.messages.push(messageResult);
      this.toastService.show(new Alert(AlertType.SUCCESS, 'New notification received!!!'));
      this.notificationCount++;
    }
  }

}
