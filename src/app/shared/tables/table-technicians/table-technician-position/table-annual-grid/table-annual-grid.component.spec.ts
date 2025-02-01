import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableAnnualGridComponent } from './table-annual-grid.component';

describe('TableAnnualGridComponent', () => {
  let component: TableAnnualGridComponent;
  let fixture: ComponentFixture<TableAnnualGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableAnnualGridComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TableAnnualGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
