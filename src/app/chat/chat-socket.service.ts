import {Injectable} from '@angular/core';
import {LocalStorageUtil} from '../@core/utils/local-storage-util';
import {Chat} from './model/chat';
import {ApiConfig} from '../@core/utils/api/ApiConfig';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

// @ts-ignore


@Injectable({
    providedIn: 'root'
})
export class ChatSocketService {
    messages = new Array<Chat>();
    newMsgCount = 0;
    currentUserAssociated = [];
    chat: Chat = new Chat();
    private serverUrl = ApiConfig.URL + '/socket';
    private stompClient;
    private currentUserId = LocalStorageUtil.getStorage().userId;

    constructor() {
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
        });
    }

    handleResult(message) {
        if (message.body) {
            const messageResult: Chat = JSON.parse(message.body);
            console.log(messageResult);
            messageResult.senderUser = JSON.parse(messageResult.senderUser);
            // if (messageResult.fromUserId !== this.currentUserId) {
            //     messageResult.reply = false;
            // } else {
            //     messageResult.senderUser.name = 'you';
            // }
            messageResult.newMsg = 100;
            this.messages.push(messageResult);
            this.messages.forEach(msg => {
                if ((messageResult.toUserId === msg.toUserId) || (messageResult.toUserId === msg.fromUserId)) {

                    this.currentUserAssociated.push(msg);

                }
            });
        }
    }

    newMessageCount(message) {

    }
}
