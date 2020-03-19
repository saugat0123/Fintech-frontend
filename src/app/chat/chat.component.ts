import {Component, OnInit} from '@angular/core';
import {UserService} from '../feature/admin/component/user/user.service';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
    messages = [];
    showHideUser = false;
    userList = [];

    constructor(private userService: UserService) {
    }

    ngOnInit() {
        this.userService.getUserForChat().subscribe((res: any) => {
            this.userList = res.detail;
        });
    }

    showHideUserList() {
        if (this.showHideUser) {
            this.showHideUser = false;
        } else {
            this.showHideUser = true;
        }
    }

}
