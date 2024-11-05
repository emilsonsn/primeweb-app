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
        return 'Vendedor(a)';
      case UserRoles.Consultant:
        return 'Consultor(a)';
      case UserRoles.CommercialManager:
        return 'Gerente comercial';
      case UserRoles.TechnicalManager:
        return 'Gerente técnico';
      case UserRoles.Admin:
        return 'Administrador(a)';
      case UserRoles.Technical:
        return 'Técnico(a)';
      case UserRoles.Financial:
        return 'Financeiro(a)';
      case UserRoles.Copywriter:
        return 'Redator(a)';
        

      default:
        return 'Não encontrado';
    }
  }

}
