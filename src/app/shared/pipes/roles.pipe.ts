import { Pipe, PipeTransform } from '@angular/core';
import { OccurrenceStatusEnum } from '@models/occurrence';
import { PhoneCallStatus } from '@models/phone-call';
import { RequestStatus } from '@models/request';
import { RequestOrderStatus } from '@models/requestOrder';
import { Status } from '@models/status';
import { UserRoles } from '@models/user';

@Pipe({
  name: 'role'
})
export class RolesPipe implements PipeTransform {

  transform(value) {
    switch (value) {
      case UserRoles.Seller:
        return 'Vendedor';
      case UserRoles.Consultant:
        return 'Consultor';
      case UserRoles.Manager:
        return 'Gerente';
      case UserRoles.Admin:
        return 'Administrador';
      case UserRoles.Technical:
        return 'Técnico';
      case UserRoles.Financial:
        return 'Financeiro';

      default:
        return 'Não encontrado';
    }
  }

}
