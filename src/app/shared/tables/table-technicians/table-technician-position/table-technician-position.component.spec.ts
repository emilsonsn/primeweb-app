import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableTechnicianPositionComponent } from './table-technician-position.component';

describe('TableTechnicianPositionComponent', () => {
  let component: TableTechnicianPositionComponent;
  let fixture: ComponentFixture<TableTechnicianPositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableTechnicianPositionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TableTechnicianPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
