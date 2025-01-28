import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogTechnicianComponent } from './dialog-technician.component';

describe('DialogTechnicianComponent', () => {
  let component: DialogTechnicianComponent;
  let fixture: ComponentFixture<DialogTechnicianComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogTechnicianComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogTechnicianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
