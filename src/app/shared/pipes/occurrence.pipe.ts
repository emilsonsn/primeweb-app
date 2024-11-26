import { Pipe, PipeTransform } from '@angular/core';
import { OccurrenceStatusEnum } from '@models/occurrence';
import { PhoneCallStatus } from '@models/phone-call';
import { RequestStatus } from '@models/request';
import { RequestOrderStatus } from '@models/requestOrder';
import { Status } from '@models/status';

@Pipe({
  name: 'occurrence'
})
export class OccurrencePipe implements PipeTransform {

  transform(value) {
    switch (value) {
      case OccurrenceStatusEnum.Lead:
        return 'Lead';
      case OccurrenceStatusEnum.PresentationVisit:
        return 'Apresentação';
      case OccurrenceStatusEnum.ConvertedContact:
        return 'Contato Convertido';
      case OccurrenceStatusEnum.SchedulingVisit:
        return 'Agendamento de Visita';
      case OccurrenceStatusEnum.ReschedulingVisit:
        return 'Reagendamento de Visita';
      case OccurrenceStatusEnum.DelegationContact:
        return 'Delegação de Contato';
      case OccurrenceStatusEnum.InNegotiation:
        return 'Em Negociação';
      case OccurrenceStatusEnum.MeetingScheduling:
        return 'Agendamento de vídeochamada';
      case OccurrenceStatusEnum.Meetingrescheduling:
        return 'Reagendamento de vídeochamada';
      case OccurrenceStatusEnum.Closed:
        return 'Fechado';
      case OccurrenceStatusEnum.Lost:
        return 'Perdido';

      default:
        return '-';
    }
  }

}
