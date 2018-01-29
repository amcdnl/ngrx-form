import { Action } from '@ngrx/store';

export enum FormActions {
  UpdateStatus = '[Form] Update Status',
  UpdateValue = '[Form] Update Value',
  UpdateDirty = '[Form] Update Dirty',
  UpdateErrors = '[Form] Update Errors'
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

export class UpdateFormErrors implements Action {
  readonly type = FormActions.UpdateErrors;
  constructor(public payload: { errors: { [k: string]: string } | null; path: string }) {}
}
