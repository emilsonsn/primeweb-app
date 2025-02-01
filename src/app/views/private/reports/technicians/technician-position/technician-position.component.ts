import { Component } from '@angular/core';
import { HeaderService } from '@services/header.service';

@Component({
  selector: 'app-technician-position',
  templateUrl: './technician-position.component.html',
  styleUrls: ['./technician-position.component.scss']
})
export class TechnicianPositionComponent {
  public selectedTab: number = 0;

  constructor(private _headerService: HeaderService) {}

  ngOnInit() {
    this.updateTitle(this.selectedTab);
  }

  public updateTitle(index: number): void {
    const titles = ['Grade Anual', 'Posicionamento Atual'];
    this._headerService.setTitle(titles[index] || 'Posições');
  }

  public addPosition() {
    console.log('Adicionar nova posição');
  }
}
