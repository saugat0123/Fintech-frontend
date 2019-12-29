import {Injectable} from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {Message} from '../../@theme/components/notification/model/message';
import {ApiConfig} from '../utils/api/ApiConfig';
import {ToastService} from '../utils';
import {Alert, AlertType} from '../../@theme/model/Alert';
import {NotificationService} from '../../@theme/components/notification/service/notification.service';
import {LocalStorageUtil} from '../utils/local-storage-util';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  isCustomSocketOpened = false;
  private serverUrl = `${ApiConfig.URL}/socket`;
  private stompClient;

  message: Message = new Message();

  userId = Number(LocalStorageUtil.getStorage().userId);
  userRoleId = Number(LocalStorageUtil.getStorage().roleId);

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
    this.stompClient.debug = null;
  }

  openSocket() {
    this.isCustomSocketOpened = true;
    this.stompClient.subscribe(`/socket-publisher/${this.userId}/${this.userRoleId}`, (message) => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'New notification received!!!'));
      this.notificationService.fetchNotifications();
    });
  }

  closeSocket() {
    this.stompClient.unsubscribe(`/socket-publisher/${this.userId}/${this.userRoleId}`);
    this.stompClient.disconnect();
  }

  sendMessageUsingSocket() {
    this.stompClient.send('/socket-subscriber/send/message', {}, JSON.stringify(this.message));
  }

}
