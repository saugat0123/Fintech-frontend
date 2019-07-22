import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {Message} from './Model/message';
import {environment} from '../../../environments/environment.prod';

@Component({
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

    fromId: number;
    isLoaded = false;
    isCustomSocketOpened = false;
    messages: Message[] = [];
    public notifications = 0;
    message: Message = new Message();
    mainForm: FormGroup;
    private serverUrl = environment.url + 'socket';
    private stompClient;

    constructor(private http: HttpClient,
                private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.buildForm();
        this.initializeWebSocketConnection();
    }

    buildForm() {
        this.mainForm = this.formBuilder.group({
            toId: [undefined, Validators.required],
            fromId: [undefined, Validators.required],
            message: [undefined, Validators.required]
        });
    }

    clearCount() {
        this.notifications = 0;
    }

    sendMessageUsingSocket() {
        this.message = this.mainForm.value;
        this.stompClient.send('/socket-subscriber/send/message', {}, JSON.stringify(this.message));

    }

    initializeWebSocketConnection() {
        const ws = new SockJS(this.serverUrl);
        this.stompClient = Stomp.over(ws);
        const that = this;
        this.stompClient.connect({}, function (frame) {
            that.isLoaded = true;
        });
    }

    openSocket() {
        if (this.isLoaded) {
            this.isCustomSocketOpened = true;
            this.fromId = this.mainForm.get('fromId').value;
            this.stompClient.subscribe('/socket-publisher/' + this.fromId, (message) => {
                console.log(message);
                this.handleResult(message);
            });
        }
    }

    handleResult(message) {
        if (message.body) {
            const messageResult: Message = JSON.parse(message.body);
            this.messages.push(messageResult);
            // this.toastr.success('new message recieved', null, {
            //   'timeOut': 3000
            // });
            this.notifications += 1;

        }
    }
}
