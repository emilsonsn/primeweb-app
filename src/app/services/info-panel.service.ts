import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InfoPanelService {
  private infoData = new BehaviorSubject<any>({
    totalPalavras: 0,
    paginas: [0, 0, 0],
    cadastrado: null,
    contratacao: null,
    finalizado: null,
    tecnico: '',
    consultor: '',
    vendedor: ''
  });

  // Observable para permitir que os componentes assinem as atualizações
  public info$ = this.infoData.asObservable();

  // Método para atualizar o painel de informações
  updateInfo(data: any) {
    this.infoData.next(data);
  }
}
