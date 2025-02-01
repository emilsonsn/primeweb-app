import { Component, OnInit } from '@angular/core';
import { InfoPanelService } from '@services/info-panel.service';

@Component({
  selector: 'app-annual-grid',
  templateUrl: './annual-grid.component.html',
  styleUrls: ['./annual-grid.component.scss']
})
export class AnnualGridComponent implements OnInit {
  public info: any;

  constructor(private _infoPanelService: InfoPanelService) {}

  ngOnInit(): void {
    this._infoPanelService.info$.subscribe((data) => {
      this.info = data;
    });
  }
}
