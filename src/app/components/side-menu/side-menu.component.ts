import { Component } from '@angular/core';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent {

  public showMenu = false;

  toggleSideBar(): void {
    this.showMenu = !this.showMenu;
  }

}
