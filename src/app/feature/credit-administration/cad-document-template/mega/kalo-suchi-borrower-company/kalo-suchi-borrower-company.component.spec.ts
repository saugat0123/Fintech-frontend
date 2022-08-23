import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KaloSuchiBorrowerCompanyComponent } from './kalo-suchi-borrower-company.component';

describe('KaloSuchiBorrowerComponent', () => {
  let component: KaloSuchiBorrowerCompanyComponent;
  let fixture: ComponentFixture<KaloSuchiBorrowerCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KaloSuchiBorrowerCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KaloSuchiBorrowerCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
