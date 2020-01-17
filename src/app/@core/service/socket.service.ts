import {Injectable} from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {Message} from '../../@theme/components/notification/model/message';
import {ApiConfig} from '../utils/api/ApiConfig';
import {ToastService} from '../utils';
import {Alert, AlertType} from '../../@theme/model/Alert';
import {NotificationService} from '../../@theme/components/notification/service/notification.service';
import {LocalStorageUtil} from '../utils/local-storage-util';
import {PushNotificationsService} from './push-notification.service';
import {LoanFormService} from '../../feature/loan/component/loan-form/service/loan-form.service';

@Injectable({
    providedIn: 'root'
})
export class SocketService {

    isCustomSocketOpened = false;
    message: Message = new Message();
    userId = Number(LocalStorageUtil.getStorage().userId);
    userRoleId = Number(LocalStorageUtil.getStorage().roleId);
    private serverUrl = `${ApiConfig.URL}/socket`;
    private stompClient;

    constructor(
        private toastService: ToastService,
        private notificationService: NotificationService,
        private _pushNotificationService: PushNotificationsService,
        private customerLoanService: LoanFormService
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
        const data: Array<any> = [];

        this.stompClient.subscribe(`/socket-publisher/${this.userId}/${this.userRoleId}`, (message) => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'New notification received!!!'));
            const customerLoan = JSON.parse(message.body);
            this.customerLoanService.detail(customerLoan.customerId).subscribe((res: any) => {
                data.push({
                    'title': 'Alert!!!',
                    'alertContent': 'Document has been ' + res.detail.currentStage.docAction + ' (Priority : ' + res.detail.priority + ') -- By ' + res.detail.currentStage.fromUser.username
                });
                this._pushNotificationService.generateNotification(data);
            });
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
