import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicianPositionComponent } from './technician-position.component';

describe('TechnicianPositionComponent', () => {
  let component: TechnicianPositionComponent;
  let fixture: ComponentFixture<TechnicianPositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TechnicianPositionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TechnicianPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
