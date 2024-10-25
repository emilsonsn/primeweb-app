import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestOrderTypePipe } from './request-order-type.pipe';
import { PaymentFormPipe } from './payment-form.pipe';
import { StatusPipe } from './status.pipe';
import { OrderResponsiblePipe } from './order-responsible.pipe';
import { PhoneMaskPipe } from './phone-mask.pipe';
import { CpfCnpjMaskPipe } from './cpf-cnpj-mask.pipe';
import { SolicitationStatusPipe } from './solicitation-status.pipe';
import { CompanyPositionPipe } from './company-position.pipe';
import { OccurrencePipe } from './occurrence.pipe';
import { RolesPipe } from './roles.pipe';
import { OriginPipe } from './origin.pipe';
import { ContractPipe } from './contract.pipe';

const pipes = [
  RequestOrderTypePipe,
  PaymentFormPipe,
  StatusPipe,
  OrderResponsiblePipe,
  PhoneMaskPipe,
  CpfCnpjMaskPipe,
  SolicitationStatusPipe,
  CompanyPositionPipe,
  OccurrencePipe,
  RolesPipe,
  OriginPipe,
  ContractPipe
];

@NgModule({
  declarations: [
    pipes,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    pipes
  ]
})
export class PipesModule { }
