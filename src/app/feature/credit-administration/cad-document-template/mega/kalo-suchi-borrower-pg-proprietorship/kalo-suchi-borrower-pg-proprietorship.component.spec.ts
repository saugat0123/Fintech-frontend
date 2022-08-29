import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KaloSuchiBorrowerPgProprietorshipComponent } from './kalo-suchi-borrower-pg-proprietorship.component';

describe('KaloSuchiBorrowerPgProprietorshipComponent', () => {
  let component: KaloSuchiBorrowerPgProprietorshipComponent;
  let fixture: ComponentFixture<KaloSuchiBorrowerPgProprietorshipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KaloSuchiBorrowerPgProprietorshipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KaloSuchiBorrowerPgProprietorshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
