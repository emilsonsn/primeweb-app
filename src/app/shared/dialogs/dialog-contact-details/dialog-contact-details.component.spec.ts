import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogContactDetailsComponent } from './dialog-contact-details.component';

describe('DialogContactDetailsComponent', () => {
  let component: DialogContactDetailsComponent;
  let fixture: ComponentFixture<DialogContactDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogContactDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogContactDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
