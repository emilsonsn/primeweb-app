import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnualGridComponent } from './annual-grid.component';

describe('AnnualGridComponent', () => {
  let component: AnnualGridComponent;
  let fixture: ComponentFixture<AnnualGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnnualGridComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnnualGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
