import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SanaCovenantsComponent } from './sana-covenants.component';

describe('SanaCovenantsComponent', () => {
  let component: SanaCovenantsComponent;
  let fixture: ComponentFixture<SanaCovenantsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SanaCovenantsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SanaCovenantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
