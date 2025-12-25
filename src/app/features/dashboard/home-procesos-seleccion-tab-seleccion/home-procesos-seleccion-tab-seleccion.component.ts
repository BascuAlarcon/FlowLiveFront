import { CommonModule } from '@angular/common';
import { Component } from '@angular/core'; 

@Component({
  selector: 'app-home-procesos-seleccion-tab-seleccion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-procesos-seleccion-tab-seleccion.component.html',
  styleUrls: ['./home-procesos-seleccion-tab-seleccion.component.scss', './../dashboard.component.scss'],
})
export class HomeProcesosSeleccionTabSeleccionComponent {

  resumen = [
    { titulo: 'Procesos Activos', valor: 18, subtitulo: '2 Procesos nuevos en las últimas 24 hrs.' },
    { titulo: 'Procesos Cerrados', valor: 5, subtitulo: '30.01 Más que el mes anterior.' },
    { titulo: 'Duración promedio del proceso (en días)', valor: 10, subtitulo: '30.01% Menos que el mes anterior.' },
    { titulo: 'Procesos Urgencia Alta', valor: 3, subtitulo: '30.01% Más urgencias que el mes anterior.' },
    { titulo: 'Procesos sin Asignar', valor: 2, subtitulo: '' }
  ];
}
