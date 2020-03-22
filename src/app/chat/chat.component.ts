import {Component, OnInit} from '@angular/core';
import {ChatService} from './chat.service';

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

    constructor(private chatService: ChatService) {
    }

    ngOnInit() {
        this.chatService.getUserForChat().subscribe((res: any) => {
            this.userList = res.detail;
        });
    }

    openChatBot(user) {
        console.log('r', user);
        this.user = user;
        this.showHideBot = true;
    }

    showHideUserList() {
        if (this.showHideUser) {
            this.showHideUser = false;
        } else {
            this.showHideUser = true;
        }
    }

}
