import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChatComponent} from './chat.component';
import {BotComponent} from './bot/bot.component';
import {NbBadgeModule, NbCardModule} from '@nebular/theme';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FilterPipe} from './filter.pipe';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {ChatSpinnerComponent} from './chat-spinner/chat-spinner.component';


@NgModule({
    declarations: [ChatComponent, BotComponent, FilterPipe, ChatSpinnerComponent],
    imports: [
        CommonModule,
        NbCardModule,
        ReactiveFormsModule,
        FormsModule,
        NbBadgeModule,
        InfiniteScrollModule

    ],
    exports: [
        ChatComponent
    ],
    entryComponents: [ChatComponent, BotComponent]
})
export class ChatModule {
}
