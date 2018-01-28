import { FormActions } from './actions';

export interface FormState<T> {
    model: T;
    errors?: { [k: string]: string };
    dirty?: boolean;
    status?: string;
}

const setValue = (obj, prop, val) => {
    obj = { ...obj };
    const split = prop.split('.');
    const last = split[split.length - 1];
    split.reduce((acc, part) => {
        if (part === last) {
            acc[part] = val;
        } else {
            acc[part] = { ...acc[part] };
        }
        return acc && acc[part];
    }, obj);
    return obj;
};

export const form = (reducer: Function) => (state: any, action: any) => {
    const nextState = reducer(state, action);

    if (action.type === FormActions.UpdateValue) {
        return setValue(
            nextState,
            `${action.payload.path}.model`,
            { ...action.payload.value });
    } else if (action.type === FormActions.UpdateStatus) {
        return setValue(
            nextState,
            `${action.payload.path}.status`,
            action.payload.status);
    } else if (action.type === FormActions.UpdateDirty) {
        return setValue(
            nextState,
            `${action.payload.path}.dirty`,
            action.payload.dirty);
    }  else if (action.type === FormActions.UpdateErrors) {
        return setValue(
            nextState,
            `${action.payload.path}.errors`,
            { ...action.payload.errors });
    }

    return nextState;
};
