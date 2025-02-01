import { Component, Input, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-table-annual-grid',
  templateUrl: './table-annual-grid.component.html',
  styleUrls: ['./table-annual-grid.component.scss']
})
export class TableAnnualGridComponent implements OnInit {
  @Input() loading: boolean = false;
  @Input() totalItems: number = 0;

  // Definindo as posições (1º a 10º)
  rankings: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  // Lista de meses com dados simulados
  months = [
    { name: 'Jan', positions: [null, null, null, null, null, null, null, null, null, null], total: 0 },
    { name: 'Fev', positions: [null, null, null, null, null, null, null, null, null, null], total: 0 },
    { name: 'Mar', positions: [null, null, null, null, null, null, null, null, null, null], total: 0 },
    { name: 'Abr', positions: [null, null, null, null, null, null, null, null, null, null], total: 0 },
    { name: 'Mai', positions: [null, null, null, null, null, null, null, null, null, null], total: 0 },
    { name: 'Jun', positions: [null, null, null, null, null, null, null, null, null, null], total: 0 },
    { name: 'Jul', positions: [null, null, null, null, null, null, null, null, null, null], total: 0 },
    { name: 'Ago', positions: [null, null, null, null, null, null, null, null, null, null], total: 0 },
    { name: 'Set', positions: [null, null, null, null, null, null, null, null, null, null], total: 0 },
    { name: 'Out', positions: [null, null, null, null, null, null, null, null, null, null], total: 0 },
    { name: 'Nov', positions: [null, null, null, null, null, null, null, null, null, null], total: 0 },
    { name: 'Dez', positions: [null, null, null, null, null, null, null, null, null, null], total: 0 }
  ];

  info = {
    totalPalavras: 0,
    paginas: [0, 0, 0],
    cadastrado: null,
    contratacao: null,
    finalizado: null,
    tecnico: '',
    consultor: '',
    vendedor: ''
  };

  pageControl = {
    take: 10,
    page: 0,
  };

  ngOnInit() {
    this.updateInfoPanel();
    this.loadAnnualData();
  }

  // Atualiza o painel com informações gerais
  updateInfoPanel(): void {
    const totalPalavras = this.months.reduce((acc, month) => acc + month.total, 0);

    this.info = {
      totalPalavras,
      paginas: [this.months.filter(m => m.positions.includes(1)).length, 0, 0],
      cadastrado: new Date('2020-07-06'),
      contratacao: new Date('2020-07-01'),
      finalizado: new Date('2020-09-21'),
      tecnico: 'Renato Di Giacomo',
      consultor: 'Roberto',
      vendedor: 'Wesley Araujo'
    };
  }

  // Simula o carregamento de dados para o grid anual
  loadAnnualData(): void {
    this.months[0].positions = [1, 2, 3, null, null, null, null, null, null, null];
    this.months[0].total = 3;

    this.months[1].positions = [null, 4, 5, 6, null, null, null, null, null, null];
    this.months[1].total = 3;

    this.months[2].positions = [1, null, null, null, null, null, null, null, null, null];
    this.months[2].total = 1;

    this.updateInfoPanel();
  }

  // Paginação
  pageEvent(event: PageEvent) {
    this.pageControl.page = event.pageIndex;
    this.pageControl.take = event.pageSize;
  }
}
