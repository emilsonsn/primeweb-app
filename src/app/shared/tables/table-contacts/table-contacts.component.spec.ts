import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableContactsComponent } from './table-contacts.component';

describe('TableContactsComponent', () => {
  let component: TableContactsComponent;
  let fixture: ComponentFixture<TableContactsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableContactsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TableContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
