import {Component, OnInit} from '@angular/core';
import {ChatService} from './chat.service';
import {ChatSocketService} from './chat-socket.service';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
    messages = [];
    showHideUser = false;
    showHideBot = false;
    user;
    userList = [];
    currentUserUnseenMsg = 0;

    constructor(
        private chatSocketService: ChatSocketService,
        private chatService: ChatService) {
    }

    ngOnInit() {
        this.chatSocketService.initializeWebSocketConnection();
        this.currentUserUnseenMsg = this.chatSocketService.newMsgCount;
        this.chatService.getUserForChat().subscribe((res: any) => {
            this.userList = res.detail.userList;
            this.currentUserUnseenMsg = res.detail.unseenMsg;
        });
    }

    openChatBot(user) {
        this.user = user;
        this.showHideBot = true;
        this.chatService.updateSeenChat(this.user.id.toString()).subscribe((res: any) => {
            this.chatService.getUserForChat().subscribe((res: any) => {
                this.userList = res.detail.userList;
                this.currentUserUnseenMsg = res.detail.unseenMsg;
            });
        });
    }

    showHideUserList() {
        if (this.showHideUser) {
            this.showHideUser = false;
            this.showHideBot = false;
        } else {
            this.showHideUser = true;
        }
    }

}
