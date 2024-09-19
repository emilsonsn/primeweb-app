import { Pipe, PipeTransform } from '@angular/core';
import { ContactOriginEnum } from '@models/contact';
import { OccurrenceStatusEnum } from '@models/occurrence';
import { PhoneCallStatus } from '@models/phone-call';
import { RequestStatus } from '@models/request';
import { RequestOrderStatus } from '@models/requestOrder';
import { Status } from '@models/status';
import { UserRoles } from '@models/user';

@Pipe({
  name: 'origin',
})
export class OriginPipe implements PipeTransform {
  transform(value) {
    switch (value) {
      case ContactOriginEnum.INDICATION:
        return 'Indicação';
      case ContactOriginEnum.EMAIL_MARKETING:
        return 'Email Marketing';
      case ContactOriginEnum.CONSULTANT:
        return 'Consultor';
      case ContactOriginEnum.EXTERNAL_LINK:
        return 'Link Externo';
      case ContactOriginEnum.RETURN:
        return 'Retorno';
      case ContactOriginEnum.GOOGLE:
        return 'Google';
      case ContactOriginEnum.CONTACT_FILTER:
        return 'Filtro de Contato';
      case ContactOriginEnum.OTHER:
        return 'Outro';
      default:
        return 'Fonte Desconhecida';
    }
  }
}
