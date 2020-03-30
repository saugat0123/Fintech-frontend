import {Component, OnInit} from '@angular/core';
import {ChatService} from './chat.service';
import {ChatSocketService} from './chat-socket.service';
import {Chat} from './model/chat';
import {User} from '../feature/admin/modal/user';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

    messages = [];
    showHideUser = false;
    showHideBot = false;
    user: User = new User();
    userList = [];
    currentUserUnseenMsg = 0;
    chat: Chat = new Chat();
    searchText;

    constructor(
        private chatSocketService: ChatSocketService,
        private chatService: ChatService) {
    }

    ngOnInit() {

        this.chatService.getUserForChat().subscribe((res: any) => {
            this.userList = res.detail.userList;
            this.currentUserUnseenMsg = res.detail.totalUnseenMsg;
        });
        this.chatSocketService.initializeWebSocketConnection();
        this.chatSocketService.newMsgCount.subscribe((res) => {
            this.chat = res;
            // this.currentUserUnseenMsg = this.currentUserUnseenMsg + 1;
        });


    }

    openChatBot(user) {
        this.user = user;
        this.showHideBot = true;
        this.chatService.updateSeenChat(this.user.id.toString()).subscribe((res: any) => {
            this.chatService.getUserForChat().subscribe((res: any) => {
                this.userList = res.detail.userList;
                this.chat = new Chat();
                this.currentUserUnseenMsg = res.detail.totalUnseenMsg;
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
