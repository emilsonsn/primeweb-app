import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '@models/user';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-table-technician-contact',
  templateUrl: './table-technician-contact.component.html',
  styleUrls: ['./table-technician-contact.component.scss']
})
export class TableTechnicianContactComponent {
  @Input() loading: boolean = false;
  @Input() contacts: User[] = [];  // Lista de contatos recebida do componente pai
  @Input() showActions: boolean = true;
  @Input() totalItems: number = 0;  // Total de itens para paginação

  @Output() onViewContact = new EventEmitter<User>();
  @Output() onDeleteContact = new EventEmitter<User>();
  @Output() onPageChange = new EventEmitter<PageEvent>();

  pageControl = {
    take: 10,  // Itens por página
    page: 0,   // Página atual
  };

  // Emitir evento para visualizar contato
  public viewContact(contact: User) {
    this.onViewContact.emit(contact);
  }

  // Emitir evento para deletar contato
  public deleteContact(contact: User) {
    this.onDeleteContact.emit(contact);
  }

  // Emitir evento para controle de paginação
  public pageEvent(event: PageEvent) {
    this.pageControl.page = event.pageIndex;
    this.pageControl.take = event.pageSize;
    this.onPageChange.emit(event);
  }
}
