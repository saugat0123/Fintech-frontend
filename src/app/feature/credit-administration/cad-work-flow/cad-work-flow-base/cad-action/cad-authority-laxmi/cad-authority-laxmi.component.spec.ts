import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CadAuthorityLaxmiComponent } from './cad-authority-laxmi.component';

describe('CadAuthorityLaxmiComponent', () => {
  let component: CadAuthorityLaxmiComponent;
  let fixture: ComponentFixture<CadAuthorityLaxmiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CadAuthorityLaxmiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CadAuthorityLaxmiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
