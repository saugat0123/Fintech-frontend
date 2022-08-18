import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KaloSuchiBorrowerPgCompanyComponent } from './kalo-suchi-borrower-pg-company.component';

describe('KaloSuchiBorrowerPgCompanyComponent', () => {
  let component: KaloSuchiBorrowerPgCompanyComponent;
  let fixture: ComponentFixture<KaloSuchiBorrowerPgCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KaloSuchiBorrowerPgCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KaloSuchiBorrowerPgCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
