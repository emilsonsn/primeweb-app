import { Pipe, PipeTransform } from '@angular/core';
import { PhoneCallStatus } from '@models/phone-call';
import { RequestStatus } from '@models/request';
import { RequestOrderStatus } from '@models/requestOrder';
import { Status } from '@models/status';

@Pipe({
  name: 'status'
})
export class StatusPipe implements PipeTransform {

  transform(value: string | Status | PhoneCallStatus) {
    switch (value) {
      case Status.Pending:
        return 'Pendente';
      case Status.Resolved:
        return 'Resolvido';
      case Status.RequestFinance:
        return 'Solicitado ao financeiro';
      case Status.RequestManager:
        return 'Solicitado ao gerente'
      case Status.Finished:
        return 'Finalizado';
      case Status.Rejected:
        return 'Rejeitado';
      case Status.Payment:
        return 'Pagamento';
      case Status.LEAD:
        return 'Lead';
      case Status.CONVERTEDTOCONTACT:
        return 'Convertido para Contato';
      case Status.LOST:
        return 'Perdido';

      default:
        return 'Não encontrado';
    }
  }

}
