import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChatComponent} from './chat.component';
import {BotComponent} from './bot/bot.component';
import {NbBadgeModule, NbCardModule} from '@nebular/theme';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FilterPipe} from './filter.pipe';


@NgModule({
    declarations: [ChatComponent, BotComponent, FilterPipe],
    imports: [
        CommonModule,
        NbCardModule,
        ReactiveFormsModule,
        FormsModule,
        NbBadgeModule,

    ],
    exports: [
        ChatComponent
    ],
    entryComponents: [ChatComponent, BotComponent]
})
export class ChatModule {
}
