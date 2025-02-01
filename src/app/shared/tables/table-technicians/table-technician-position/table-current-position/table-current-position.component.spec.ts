import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableCurrentPositionComponent } from './table-current-position.component';

describe('TableCurrentPositionComponent', () => {
  let component: TableCurrentPositionComponent;
  let fixture: ComponentFixture<TableCurrentPositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableCurrentPositionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TableCurrentPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
