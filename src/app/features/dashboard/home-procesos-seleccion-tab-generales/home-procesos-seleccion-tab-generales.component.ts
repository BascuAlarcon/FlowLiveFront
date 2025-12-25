import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';  

@Component({
  selector: 'app-home-procesos-seleccion-tab-generales',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-procesos-seleccion-tab-generales.component.html',
  styleUrls: ['./home-procesos-seleccion-tab-generales.component.scss', './../dashboard.component.scss'],
})
export class HomeProcesosSeleccionTabGeneralesComponent {
  
  resumen = [
    { titulo: 'Procesos de selección Activos', valor: 18, subtitulo: '2 Procesos nuevos en las últimas 24 hrs.' },
    { titulo: 'Solicitudes de ingreso en proceso', valor: 18, subtitulo: '2 Solicitudes nuevas en las últimas 24 hrs.' },
    { titulo: 'Duración promedio del proceso de selección (en días)', valor: 10, subtitulo: '30.01% Menos que el mes anterior.' },
    { titulo: 'Tiempo de ingreso (en días)', valor: 12, subtitulo: '30.01% Menos que el mes anterior.' },
    { titulo: 'Ingresos a BUK', valor: 10, subtitulo: '2 Ingresos nuevos en las últimas 24 hrs.' }
  ];
}
