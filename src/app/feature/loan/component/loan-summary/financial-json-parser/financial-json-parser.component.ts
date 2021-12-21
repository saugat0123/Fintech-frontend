import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-financial-json-parser',
    templateUrl: './financial-json-parser.component.html',
    styleUrls: ['./financial-json-parser.component.scss']
})
export class FinancialJsonParserComponent implements OnInit {

    financialJson = {
        'schema': [
            'ASSETS',
            'Fixed Assets',
            ' Land \u0026 Building',
            ' Plant \u0026 Machinery',
            ' Others'
        ],
        'column': [
            'FY 2011/12 Audited',
            'FY 2012/13 Audited',
            'FY 2013/14 Audited',
            'FY 2014/15 Audited'
        ],
        'data': [
            [
                12.0,
                0.0,
                14.0,
                0.0
            ],
            [
                89.0,
                0.0,
                90.0,
                0.0
            ],
            [
                45.0,
                0.0,
                0.0,
                12.0
            ], [
                0.0,
                0.0,
                0.0,
                0.0
            ], [
                0.0,
                0.0,
                156.0,
                0.0
            ]
        ]
    };

    ngOnInit() {
    }

}
