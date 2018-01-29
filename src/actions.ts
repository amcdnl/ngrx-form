import { Action } from '@ngrx/store';

export enum FormActions {
  UpdateStatus = '[Form] Update Status',
  UpdateValue = '[Form] Update Value',
  UpdateDirty = '[Form] Update Dirty',
  SetDirty = '[Form] Set Dirty',
  SetPrestine = '[Form] Set Prestine',
  UpdateErrors = '[Form] Update Errors',
  SetDisabled = '[Form] Disable Form',
  SetEnabled = '[Form] Enable Form'
}

export class UpdateFormStatus implements Action {
  readonly type = FormActions.UpdateStatus;
  constructor(public payload: { status: string; path: string }) {}
}

export class UpdateFormValue implements Action {
  readonly type = FormActions.UpdateValue;
  constructor(public payload: { value: any; path: string }) {}
}

export class UpdateFormDirty implements Action {
  readonly type = FormActions.UpdateDirty;
  constructor(public payload: { dirty: boolean | null; path: string }) {}
}

export class SetFormDirty implements Action {
  readonly type = FormActions.SetDirty;
  constructor(public payload: string) {}
}

export class SetFormPristine implements Action {
  readonly type = FormActions.SetDirty;
  constructor(public payload: string) {}
}

export class UpdateFormErrors implements Action {
  readonly type = FormActions.UpdateErrors;
  constructor(public payload: { errors: { [k: string]: string } | null; path: string }) {}
}

export class SetFormDisabled implements Action {
  readonly type = FormActions.SetDisabled;
  constructor(public payload: string) {}
}

export class SetFormEnabled implements Action {
  readonly type = FormActions.SetEnabled;
  constructor(public payload: string) {}
}
