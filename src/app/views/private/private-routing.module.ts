import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPrivateComponent } from "@shared/layouts/layout-private/layout-private.component";
import { SessionService } from '../../store/session.service';
import { permissionGuard } from '@app/guards/permission.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutPrivateComponent,
    children: [
      {
        path: 'home',
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
        canActivate: [permissionGuard],
        data: {
          page: 'home'
        }
      },
      {
        path: 'phone-calls',
        loadChildren: () => import('./phone-calls/phone-calls.module').then(m => m.PhoneCallsModule),
        canActivate: [permissionGuard],
        data: {
          page: 'phone-calls'
        }
      },
      {
        path: 'schedule',
        loadChildren: () => import('./schedule/schedule.module').then(m => m.ScheduleModule),
        canActivate: [permissionGuard],
        data: {
          page: 'schedule'
        }
      },
      {
        path: 'segments',
        loadChildren: () => import('./segments/segments.module').then(m => m.SegmentsModule),
        canActivate: [permissionGuard],
        data: {
          page: 'segments'
        }
      },
      {
        path: 'contacts',
        loadChildren: () => import('./contacts/contacts.module').then(m => m.ContactsModule),
        canActivate: [permissionGuard],
        data: {
          page: 'contacts'
        }
      },
      {
        path: 'logs',
        loadChildren: () => import('./logs/logs.module').then(m => m.LogsModule),
        canActivate: [permissionGuard],
        data: {
          page: 'logs'
        }
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
        canActivate: [permissionGuard],
        data: {
          page: 'profile'
        }
      },
      {
        path: 'users',
        loadChildren: () => import('./users/users.module').then(m => m.UsersModule),
        canActivate: [permissionGuard],
        data: {
          page: 'users'
        }
      },


      // Deletar depois v
      {
        path: 'tasks',
        loadChildren: () => import('./tasks/tasks.module').then(m => m.TasksModule),
        canActivate: [permissionGuard],
        data: {
          page: 'tasks'
        }
      },
      {
        path: 'client',
        loadChildren: () => import('./client/client.module').then(m => m.ClientModule),
        canActivate: [permissionGuard],
        data: {
          page: 'client'
        }
      },
      {
        path: 'orders',
        loadChildren: () => import('./orders/orders.module').then(m => m.OrdersModule),
        canActivate: [permissionGuard],
        data: {
          page: 'orders'
        }
      },
      // Deletar depois ^

      {
        path: '**',
        redirectTo: 'home',
        canMatch: []
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivateRoutingModule {

  constructor(
    private readonly _sessionService: SessionService
  ) {}

}




