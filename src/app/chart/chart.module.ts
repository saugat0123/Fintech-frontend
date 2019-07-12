import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { ChartRoutingModule } from './chart-routing.module';
import { BarChartComponent } from './bar-chart/bar-chart.component';

@NgModule({
  declarations: [BarChartComponent],
  imports: [
    CommonModule,
    NgxChartsModule,
    ChartRoutingModule
  ]
})
export class ChartModule { }
