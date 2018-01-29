import { Directive, Input, OnInit, OnDestroy } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { UpdateFormStatus, UpdateFormValue, UpdateFormDirty, UpdateFormErrors } from './actions';

const getValue = (obj, prop) => prop.split('.').reduce((acc, part) => acc && acc[part], obj);

@Directive({ selector: '[ngrxForm]' })
export class FormDirective implements OnInit, OnDestroy {
  @Input('ngrxForm') path: string;

  private _destroy$ = new Subject<null>();
  private _updating = false;

  constructor(private _store: Store<any>, private _formGroupDirective: FormGroupDirective) {}

  ngOnInit() {
    this._store
      .select(state => getValue(state, `${this.path}.model`))
      .pipe(takeUntil(this._destroy$))
      .subscribe(model => {
        if (!this._updating) {
          this._updating = false;
          if (model) {
            this._formGroupDirective.form.patchValue(model);
          }
        }
      });

    this._store
      .select(state => getValue(state, `${this.path}.dirty`))
      .pipe(takeUntil(this._destroy$))
      .subscribe(dirty => {
        if (this._formGroupDirective.form.dirty !== dirty) {
          if (dirty) {
            this._formGroupDirective.form.markAsDirty();
          } else {
            this._formGroupDirective.form.markAsPristine();
          }
        }
      });

    this._store
      .select(state => getValue(state, `${this.path}.disabled`))
      .pipe(takeUntil(this._destroy$))
      .subscribe(disabled => {
        if (this._formGroupDirective.form.disabled !== disabled) {
          if (disabled) {
            this._formGroupDirective.form.disable();
          } else {
            this._formGroupDirective.form.enable();
          }
        }
      });

    this._formGroupDirective.valueChanges.pipe(takeUntil(this._destroy$)).subscribe(value => {
      this._updating = true;
      this._store.dispatch(
        new UpdateFormValue({
          path: this.path,
          value
        })
      );

      this._store.dispatch(
        new UpdateFormDirty({
          path: this.path,
          dirty: this._formGroupDirective.dirty
        })
      );

      this._store.dispatch(
        new UpdateFormErrors({
          path: this.path,
          errors: this._formGroupDirective.errors
        })
      );
    });

    this._formGroupDirective.statusChanges.pipe(takeUntil(this._destroy$)).subscribe(status => {
      this._store.dispatch(
        new UpdateFormStatus({
          path: this.path,
          status
        })
      );
    });
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
