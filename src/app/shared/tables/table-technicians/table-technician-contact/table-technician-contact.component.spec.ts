import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableTechnicianContactComponent } from './table-technician-contact.component';

describe('TableTechnicianContactComponent', () => {
  let component: TableTechnicianContactComponent;
  let fixture: ComponentFixture<TableTechnicianContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableTechnicianContactComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TableTechnicianContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
