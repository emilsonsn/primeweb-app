import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-table-current-position',
  templateUrl: './table-current-position.component.html',
  styleUrls: ['./table-current-position.component.scss']
})
export class TableCurrentPositionComponent {
  @Input() loading: boolean = false;
  @Input() positions: any[] = [];
  @Input() showActions: boolean = true;
  @Input() totalItems: number = 0;

  @Output() onViewPosition = new EventEmitter<any>();
  @Output() onDeletePosition = new EventEmitter<any>();
  @Output() onPageChange = new EventEmitter<PageEvent>();

  pageControl = {
    take: 10,
    page: 0,
  };

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

  ngOnInit() {
    this.updateInfoPanel();
  }

  updateInfoPanel(): void {
    this.info = {
      totalPalavras: this.positions.length * 5,  // Exemplo de cálculo
      paginas: [this.positions.filter(p => p.page === 1).length, 0, 0],
      cadastrado: new Date('2020-07-06'),
      contratacao: new Date('2020-07-01'),
      finalizado: new Date('2020-09-21'),
      tecnico: this.positions.length > 0 ? this.positions[0].createdBy : 'Renato Di Giacomo',
      consultor: 'Roberto',
      vendedor: 'Wesley Araujo'
    };
  }

  viewPosition(position: any): void {
    this.onViewPosition.emit(position);
  }

  deletePosition(position: any): void {
    this.onDeletePosition.emit(position);
  }

  pageEvent(event: PageEvent) {
    this.pageControl.page = event.pageIndex;
    this.pageControl.take = event.pageSize;
    this.onPageChange.emit(event);
  }
}
