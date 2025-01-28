import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableTechniciansComponent } from './table-technicians.component';

describe('TableTechiciansComponent', () => {
  let component: TableTechniciansComponent;
  let fixture: ComponentFixture<TableTechniciansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableTechniciansComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TableTechniciansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
