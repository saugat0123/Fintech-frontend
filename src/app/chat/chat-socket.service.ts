import {EventEmitter, Injectable} from '@angular/core';
import {LocalStorageUtil} from '../@core/utils/local-storage-util';
import {Chat} from './model/chat';
import {ApiConfig} from '../@core/utils/api/ApiConfig';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {Alert, AlertType} from '../@theme/model/Alert';
import {ToastService} from '../@core/utils';

// @ts-ignore


@Injectable({
    providedIn: 'root'
})
export class ChatSocketService {
    messages = new Array<Chat>();
    newMsgCount: EventEmitter<Chat> = new EventEmitter<Chat>();


    currentUserAssociated = [];
    chat: Chat = new Chat();
    private serverUrl = ApiConfig.URL + '/socket';
    private stompClient;
    private currentUserId = LocalStorageUtil.getStorage().userId;

    constructor(private toastService: ToastService) {
    }


    initializeWebSocketConnection() {
        const ws = new SockJS(this.serverUrl);
        this.stompClient = Stomp.over(ws);
        const that = this;
        this.stompClient.connect({}, function (frame) {

            that.openSocket();

        });
    }

    openSocket() {
        this.stompClient.subscribe('/socket-publisher/' + LocalStorageUtil.getStorage().userId, (message) => {

            this.handleResult(message);
            this.newMessageCount(message);
        });
    }

    handleResult(message) {
        if (message.body) {
            const messageResult: Chat = JSON.parse(message.body);
            messageResult.senderUser = JSON.parse(messageResult.senderUser);
            this.messages.push(messageResult);
            this.messages.forEach(msg => {
                if ((messageResult.toUserId === msg.toUserId) || (messageResult.toUserId === msg.fromUserId)) {

                    this.currentUserAssociated.push(msg);

                }
            });
        }
    }

    newMessageCount(message) {
        if (message.body) {
            const messageResult: Chat = JSON.parse(message.body);
            messageResult.senderUser = JSON.parse(messageResult.senderUser);
            if (messageResult.unSeenMsg === 1) {
                this.newMsgCount.emit(messageResult);
                const alert = new Alert(AlertType.INFO, 'Message from ' + messageResult.senderUser.name);
                this.toastService.show(alert);
            }
            ;

        }
    }


    getNewMessageCount() {
        return this.chat;
    }


}
