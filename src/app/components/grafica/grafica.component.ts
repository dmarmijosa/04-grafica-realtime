import { ChangeDetectorRef, Component, OnInit, ViewChild, inject } from '@angular/core';
import { Chart, ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import { default as Annotation } from 'chartjs-plugin-annotation';
import { HttpClient } from '@angular/common/http';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-grafica',
  templateUrl: './grafica.component.html',
})
export class GraficaComponent implements OnInit {
  private http = inject(HttpClient);
  public wsService = inject(WebsocketService);
  private cdr = inject(ChangeDetectorRef);
  ngOnInit(): void {
   this.getData();
   this.listenSocket();
  }

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [0, 0, 0, 0],
        label: 'Ventas',
        
      },
    ],
    labels: ['enero', 'febrero', 'marzo', 'abril'],
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.5,
      },
    },

    plugins: {
      legend: { display: true },
      annotation: {
        annotations: [
          {
            type: 'line',
            scaleID: 'x',
            value: 'March',
            borderColor: 'orange',
            borderWidth: 2,
            label: {
              display: true,
              position: 'center',
              color: 'orange',
              content: 'LineAnno',
              font: {
                weight: 'bold',
              },
            },
          },
        ],
      },
    },
  };

  public lineChartType: ChartType = 'line';

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  getData() {
    this.http.get('http://localhost:3000/grafica').subscribe((data:any) => {

      this.lineChartData.datasets= data;
      this.chart?.update();
    });
  }

  listenSocket(){
    this.wsService.listen('cambio-grafica').subscribe((data: any) => {
      console.log('socket', data);
      this.lineChartData.datasets = data;
      this.chart?.update();
      this.cdr.detectChanges(); // Forzar la detección de cambios
    });
  }
}
