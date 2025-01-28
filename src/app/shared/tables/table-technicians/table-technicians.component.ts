import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-table-technicians',
  templateUrl: './table-technicians.component.html',
  styleUrls: ['./table-technicians.component.scss']
})
export class TableTechniciansComponent {
  @Input() loading: boolean = false;
  @Input() technicians: any[] = [];
  @Input() showActions: boolean = true;
  @Input() totalItems: number = 0; // Total de itens para paginação

  @Output() onViewTechnician = new EventEmitter<any>();
  @Output() onDeleteTechnician = new EventEmitter<any>();
  @Output() onPageChange = new EventEmitter<PageEvent>(); // Emite evento para mudança de página

  pageControl = {
    take: 10, // Itens por página
    page: 0, // Página atual
  };

  constructor() {}

  // Evento de clique para visualizar um técnico
  public viewTechnician(technician: any) {
    this.onViewTechnician.emit(technician);
  }

  // Evento de clique para deletar um técnico
  public deleteTechnician(technician: any) {
    this.onDeleteTechnician.emit(technician);
  }

  // Evento de paginação
  public pageEvent(event: PageEvent) {
    this.pageControl.page = event.pageIndex;
    this.pageControl.take = event.pageSize;
    this.onPageChange.emit(event); // Emite evento para o componente pai carregar novos dados
  }
}
