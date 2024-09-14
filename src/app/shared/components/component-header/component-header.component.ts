import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-component-header',
  templateUrl: './component-header.component.html',
  styleUrl: './component-header.component.scss',
  animations: [
    trigger('showFilters', [
      state('collapsed,void', style({overflow: 'hidden' })),
      state('expanded', style({overflow: 'scroll'})),
    ]),
    trigger('filterExpand', [
      state('collapsed,void', style({height: '0', minHeight: '0' })),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('400ms 0ms cubic-bezier(0.2, 0.0, 0.5, 1)')),
    ]),
  ]
})
export class ComponentHeaderComponent {

  public showFilter = signal(false);

  public toggleShowFilter() {
    this.showFilter.set(!this.showFilter());
  }

}
