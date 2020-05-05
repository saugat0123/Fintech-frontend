import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { GaugeChartComponent } from './gauge-chart/gauge-chart.component';

@NgModule({
  declarations: [BarChartComponent, PieChartComponent, GaugeChartComponent],
  imports: [
    CommonModule,
    NgxChartsModule
  ],
  exports: [
    BarChartComponent,
    PieChartComponent,
    GaugeChartComponent
  ]
})
export class ChartModule { }
