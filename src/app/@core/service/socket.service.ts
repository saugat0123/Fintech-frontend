import {Injectable} from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {Message} from '../../@theme/components/notification/model/message';
import {environment} from '../../../environments/environment.prod';
import {ToastService} from '../utils';
import {Alert, AlertType} from '../../@theme/model/Alert';
import {NotificationService} from '../../@theme/components/notification/service/notification.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  isCustomSocketOpened = false;
  private serverUrl = environment.url + 'socket';
  private stompClient;

  message: Message = new Message();

  userId = Number(localStorage.getItem('userId'));

  constructor(
      private toastService: ToastService,
      private notificationService: NotificationService
  ) {
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
      this.toastService.show(new Alert(AlertType.SUCCESS, 'New notification received!!!'));
      this.notificationService.fetchNotifications();
    });
  }

  sendMessageUsingSocket() {
    this.stompClient.send('/socket-subscriber/send/message', {}, JSON.stringify(this.message));
    console.log(this.message);
  }

}
