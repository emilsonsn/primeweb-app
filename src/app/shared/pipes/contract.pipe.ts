import { Pipe, PipeTransform } from '@angular/core';
import { ClientStatusEnum } from '@models/client';
import { ContractModelEnum, ContractTypeServiceEnum } from '@models/contract';
import { PhoneCallStatus } from '@models/phone-call';
import { RequestStatus } from '@models/request';
import { RequestOrderStatus } from '@models/requestOrder';
import { Status } from '@models/status';

@Pipe({
  name: 'contract'
})
export class ContractPipe implements PipeTransform {

  transform(value) {
    switch (value) {
      // ContractModelEnum
      case ContractModelEnum.V1:
        return 'Modelo V1';
      case ContractModelEnum.V2:
        return 'Modelo V2';
      case ContractModelEnum.V3:
        return 'Modelo V3';
      case ContractModelEnum.V4:
        return 'Modelo V4';
      case ContractModelEnum.CLIENT_LAYOUT:
        return 'Layout do Cliente';
      case ContractModelEnum.CUSTOMIZED:
        return 'Personalizado';
      case ContractModelEnum.N1:
        return 'Nível 1';
      case ContractModelEnum.N2:
        return 'Nível 2';
      case ContractModelEnum.N3:
        return 'Nível 3';

      // ContractTypeServiceEnum
      case ContractTypeServiceEnum.PLAN_A:
        return 'Plano A';
      case ContractTypeServiceEnum.PLAN_B_SILVER:
        return 'Plano B Prata';
      case ContractTypeServiceEnum.PLAN_B_GOLD:
        return 'Plano B Ouro';

      default:
        return 'Não encontrado';
    }
  }

}
