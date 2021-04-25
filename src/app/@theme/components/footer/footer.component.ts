import {Component} from '@angular/core';

@Component({
    selector: 'app-footer',
    styleUrls: ['./footer.component.scss'],
    template: `
        <span class="created-by">
            Powered by <b><a href="https://www.sbsolutionsnepal.com/" target="_blank">SB Solutions Pvt. Ltd.</a></b> 2021
        </span>
        <div class="socials">
            <a href="#" target="_blank" class="ion ion-social-github"></a>
            <a href="#" target="_blank" class="ion ion-social-facebook"></a>
            <a href="#" target="_blank" class="ion ion-social-twitter"></a>
            <a href="#" target="_blank" class="ion ion-social-linkedin"></a>
        </div>
    `,
})
export class FooterComponent {
}
