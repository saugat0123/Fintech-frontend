import {FormControl} from '@angular/forms';

export class BeforeTodayValidator {
    static beforeToday(tenure: FormControl) {
        const dateString = tenure.value;
        const newDate = new Date(dateString);
        if (newDate < new Date()) {
            return {invalidTenure: true};
        }
        return null;
    }
}
