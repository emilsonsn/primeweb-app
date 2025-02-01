import { Component, OnInit } from '@angular/core';
import { InfoPanelService } from '@services/info-panel.service';

@Component({
  selector: 'app-current-position',
  templateUrl: './current-position.component.html',
  styleUrls: ['./current-position.component.scss']
})
export class CurrentPositionComponent implements OnInit {
  public loading: boolean = false;
  public positions: any[] = [];
  public totalItems: number = 0;
  public info: any; // Variável para armazenar os dados do painel de informações

  constructor(private _infoPanelService: InfoPanelService) {}

  ngOnInit(): void {
    this.loadPositions();

    // Assinando o serviço para atualizar o painel de informações dinamicamente
    this._infoPanelService.info$.subscribe((data) => {
      this.info = data;
    });
  }

  loadPositions(): void {
    this.loading = true;

    // Simulação de carregamento de dados
    setTimeout(() => {
      this.positions = this.getMockPositions();
      this.totalItems = this.positions.length;
      this.loading = false;
    }, 1000);
  }

  getMockPositions(): any[] {
    return [
    ];
  }

  viewPosition(position: any): void {
    console.log("Visualizando posição:", position);
  }

  deletePosition(position: any): void {
    console.log("Deletando posição:", position);
  }

  onPageChange(event: any): void {
    console.log("Mudança de página:", event);
  }
}
