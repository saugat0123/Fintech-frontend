import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
    messages = [];
    showHideUser = false;

    constructor() {
    }

    ngOnInit() {
    }

    showHideUserList() {
        if (this.showHideUser) {
            this.showHideUser = false;
        } else {
            this.showHideUser = true;
        }
    }

}
