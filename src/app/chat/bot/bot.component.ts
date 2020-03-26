import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {User} from '../../feature/admin/modal/user';
import {Chat} from '../model/chat';
import {LocalStorageUtil} from '../../@core/utils/local-storage-util';
import {PushNotificationsService} from '../../@core/service/push-notification.service';
import {ChatService} from '../chat.service';
import {ChatSocketService} from '../chat-socket.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-bot',
    templateUrl: './bot.component.html',
    styleUrls: ['./bot.component.scss']
})
export class BotComponent implements OnInit, OnChanges {


    @Input() associateUser: User;
    messages = new Array<Chat>();

    chat: Chat = new Chat();
    chatForm: FormGroup;
    showHideChat = true;
    private currentUserId = LocalStorageUtil.getStorage().userId;

    constructor(
        private chatService: ChatService,
        private formBuilder: FormBuilder,
        private chatSocketService: ChatSocketService,
        private _pushNotificationService: PushNotificationsService) {
    }

    ngOnInit() {
        this.messages = this.chatSocketService.messages;

        this.chatForm = new FormGroup({
            message: new FormControl(null, [Validators.required])
        });
    }

    sendMessage(event: any) {
        event = this.chatForm.get('message').value;
        if (this.chatForm.invalid) {
            return;
        }
        this.chat = new Chat();
        this.chat.text = event;
        this.chat.sendDate = new Date();
        this.chat.reply = true;
        this.chat.seenFlag = false;
        this.chat.senderUser = {
            id: LocalStorageUtil.getStorage().userId,
            name: LocalStorageUtil.getStorage().username,
            avatar: '../assets/img/avatar.png',
        };
        this.chat.fromUserId = LocalStorageUtil.getStorage().userId;
        this.chat.toUserId = this.associateUser.id.toString();
        this.chat.senderUser = JSON.stringify(this.chat.senderUser);
        this.chatService.save(this.chat).subscribe((response: any) => {
            this.chatForm.reset();
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.chatSocketService.messages = [];
        this.chatService.getPaginationWithSearchObject(this.associateUser.id.toString(), 1, 100).subscribe((response: any) => {
            this.messages = response.detail.content;
            this.messages.forEach(msg => {
                msg.senderUser = JSON.parse(msg.senderUser);
                // if (msg.fromUserId !== this.currentUserId) {
                //     msg.reply = false;
                // } else {
                //     msg.senderUser.name = 'you';
                // }
            });
            this.chatSocketService.messages = this.messages;
        });
    }

    close() {
        this.showHideChat = false;
    }


}
