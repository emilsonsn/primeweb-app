import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicianContactComponent } from './technician-contact.component';

describe('TechnicianContactComponent', () => {
  let component: TechnicianContactComponent;
  let fixture: ComponentFixture<TechnicianContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TechnicianContactComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TechnicianContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
