import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-pie-chart',
    templateUrl: './pie-chart.component.html',
    styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {
    single = [
        {
            'name': 'America',
            'value': 8940000
        },
        {
            'name': 'Japan',
            'value': 5000000
        },
        {
            'name': 'China',
            'value': 7200000
        }
    ];
    view: any[] = [700, 400];
    showLegend = true;
    colorScheme = {
        domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    };
    showLabels = true;
    explodeSlices = false;
    doughnut = false;

    constructor() {
    }


    ngOnInit() {

    }

    onSelect(event) {
        console.log(event);
    }
}
