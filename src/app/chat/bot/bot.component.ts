import {Component, Input, OnInit} from '@angular/core';
import {User} from '../../feature/admin/modal/user';
import {Chat} from '../model/chat';
import {LocalStorageUtil} from '../../@core/utils/local-storage-util';

@Component({
    selector: 'app-bot',
    templateUrl: './bot.component.html',
    styleUrls: ['./bot.component.scss']
})
export class BotComponent implements OnInit {

    @Input() toUser: User;
    messages = [];
    chat: Chat = new Chat();

    constructor() {
    }

    ngOnInit() {
        console.log(this.toUser);
    }

    sendMessage(event: any) {
        this.chat = new Chat();
        this.chat.text = event.message;
        this.chat.date = new Date();
        this.chat.reply = true;
        this.chat.user = {
            id: LocalStorageUtil.getStorage().userId,
            name: LocalStorageUtil.getStorage().username,
            avatar: null,
        };
        this.chat.fromUserId = LocalStorageUtil.getStorage().userId;
        this.chat.toUserId = this.toUser.id.toString();
        this.messages.push(this.chat);
    }

}
