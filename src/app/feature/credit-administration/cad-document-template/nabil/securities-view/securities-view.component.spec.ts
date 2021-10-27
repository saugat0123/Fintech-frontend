import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecuritiesComponent } from './securities-view.component';

describe('SecuritiesComponent', () => {
  let component: SecuritiesComponent;
  let fixture: ComponentFixture<SecuritiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecuritiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecuritiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
