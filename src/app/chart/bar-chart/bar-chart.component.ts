import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { BarChartService } from './bar-chart.service';
import { BarChart } from './bar-chart.model';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit {
  @Input()
  data: Array<BarChart>;
  @Input()
  width: number;
  height = 450;
  view = [950, 450];

  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  legendPosition = 'below';
  legendTitle = 'Status';
  showXAxisLabel = true;
  showDataLabel = true;
  animations = true;
  xAxisLabel = 'Loan Types';
  showYAxisLabel = true;
  yAxisLabel = 'Loan Amount';

  colorScheme = {
    domain: ['#C7B42C', '#5AA454', '#A10A28', '#AAAAAA']
  };

  constructor() { }

  ngOnInit(): void {
    if (this.width > 950) {
      this.view = [this.width - 25, this.height];
    }
  }

}
