import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { Chart, ArcElement, Tooltip, Legend, DoughnutController } from 'chart.js';

// Register Chart.js components
Chart.register(ArcElement, Tooltip, Legend, DoughnutController);

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="chart-container">
      <canvas 
        baseChart
        [data]="data"
        [type]="chartType"
        [options]="options"
      ></canvas>
    </div>
  `,
  styles: [`
    .chart-container {
      @apply relative h-full w-full;
    }
  `]
})
export class BarChartComponent {
  @Input() data: ChartConfiguration['data'] = { labels: [], datasets: [] };
  @Input() options: ChartConfiguration['options'] = {};
  
  chartType: ChartType = 'bar';
}