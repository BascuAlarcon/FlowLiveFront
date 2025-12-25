import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';  
import { UserContextService } from '../../../core/context/user.context';
import { AvatarComponent } from '../avatar/avatar.component';
import { NotificationModalComponent } from './notification-modal/notification-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, AvatarComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  user: any | null = null;

  constructor(
    private readonly _userContext: UserContextService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.user = this._userContext.currentUser?.trabajadorData || null;
  }

  toggleModal() {
    this.dialog.open(NotificationModalComponent, {
      width: '600px',
      height: '600px',
      panelClass: 'dialog-generico'
    });
  }
}
