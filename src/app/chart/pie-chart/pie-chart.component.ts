import { Component, OnInit, Input } from '@angular/core';
import { PieChart } from '../../feature/admin/modal/pie-chart';
import { StatisticsService } from '../shared/service/statistics.service';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {
  @Input()
  data: Array<PieChart> = new Array<PieChart>();
  @Input()
  dataLength: number;
  @Input()
  legendTitle: string;
  view = [950, 350];
  scheme = {
    domain: []
  };
  animations = true;
  labels = false;
  legend = true;
  legendPosition = 'right';
  trimLabels = false;

  constructor() { }

  ngOnInit() {
    for (let i = 0; i < this.dataLength; i++) {
      this.scheme.domain.push(this.getRandomColor());
    }
  }

  private getRandomColor(): string {
    const colorCharacters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += colorCharacters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
