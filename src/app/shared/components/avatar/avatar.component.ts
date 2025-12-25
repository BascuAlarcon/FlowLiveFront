import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css']
})
export class AvatarComponent {
  @Input() name: string = '';
  @Input() imgUrl: string | null = null;
  @Input() size: number = 50;
  @Input() useRandomColor: boolean = false;

  defaultColor: string = '#184D9B';

  getInitials(): string {
    return this.name.split(' ').map(part => part[0]).join('').toUpperCase();
  }

  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      const randomIndex = window.crypto.getRandomValues(new Uint8Array(1))[0] % 16;
      color += letters[randomIndex];
    }
    return color;
  }

}
