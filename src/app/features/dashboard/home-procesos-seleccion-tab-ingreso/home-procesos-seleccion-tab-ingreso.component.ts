import { CommonModule } from '@angular/common';
import { Component } from '@angular/core'; 

@Component({
  selector: 'app-home-procesos-seleccion-tab-ingreso',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-procesos-seleccion-tab-ingreso.component.html',
  styleUrls: ['./home-procesos-seleccion-tab-ingreso.component.scss', './../dashboard.component.scss'],
})
export class HomeProcesosSeleccionTabIngresoComponent {
  resumen = [
    { titulo: 'Solicitudes en procesos', valor: 18, subtitulo: '2 Solicitudes nuevas en las últimas 24 hrs.' },
    { titulo: '% Aceptación de Ofertas', valor: 89, subtitulo: '15 Cartas Ofertas aceptadas.' },
    { titulo: 'Ingresos a BUK', valor: 10, subtitulo: '2 Ingresos nuevos en las últimas 24 hrs.' },
    { titulo: 'Duración promedio del proceso', valor: 12, subtitulo: '30.01% Menos que el mes anterior.' },
    { titulo: 'Carta Ofertas rechazadas', valor: 3, subtitulo: '9% Porcentaje de procesos rechazados.' }
  ];
}
