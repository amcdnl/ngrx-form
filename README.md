# ngrx-form [![npm version](https://badge.fury.io/js/ngrx-form.svg)](https://badge.fury.io/js/ngrx-form)
Reactive Form bindings for NGRX.

See [changelog](CHANGELOG.md) for latest changes.

## Whats this do?
Often when building Reactive Forms in Angular, you need to bind values from the
store to form and vice versus. The values from the store are observable and
the reactive form accepts raw objects, as a result we end up monkey patching
this back and forth. For more info on this, checkout [Reactive Forms with NGRX](https://medium.com/@amcdnl/reactive-angular-forms-with-ngrx-533a2f28c127) blog post.

Binding the values is not the only thing we commonly do, its not un-typical
to translate form dirty status or form errors. Typically workflows might include
reading the errors from the form to show in various decoupled components or for
use in our effects or using the form dirty status to prevent users from leaving
a page without saving but without binding a variable we have no way to reset
the status of the form after a successful save from an effect.

In addition to these issues we encounter, there are workflows where you want
to fill out a form and leave and then come back and resume your current status.
This is an excellent use case for stores and we can conquer that case with this utility.

In a nutshell, this tool helps bridge the gaps between ngrx-store and reactive forms
with a set of utilities and bindings to keep your forms and state in sync.

## Usage
To get started, install the package:

```
npm i ngrx-form -s
```

### Configuration
In the root module of your application, import `NgrxFormModule`
and include it in the imports. Also in this file, lets import the `form`
meta-reducer and bind it to our store.

```javascript
import { form, NgrxFormModule } from 'ngrx-form';

@NgModule({
    StoreModule.forRoot(reducers, {
        metaReducers: [form]
    }),
    NgrxFormModule
})
export class AppModule {}
```

### Reducer Setup
Define your state interface by extending the `FormState` interface:

```javascript
import { FormState } from 'ngrx-form';

export interface PizzaForm extends FormState<Pizza> {}
```

the `FormState` interface is a interface you will map
your form<=>model to. It looks like:

```javascript
export interface FormState<T> {
  /**
   * The model to bind to the form
   */
  model: T;

  /**
   * Id of the model. Seperate because
   * this is typically not bound in
   * a form
   */
  modelId?: string;

  /**
   * Key value pair of errors
   */
  errors?: { [k: string]: string };

  /**
   * Whether the form is dirty or not.
   */
  dirty?: boolean;

  /**
   * The status of the form
   */
  status?: string;
}
```

then in the reducer populate the `model` object, this will vary based on
your implementation but it should look something like this:

```javascript
const pizzaDefaultState = { model: undefined };
export function pizzaReducer(state = pizzaDefaultState, action) {
    switch(action.type) {
        switch 'LOAD_PIZZA':
            return { ...state, model: action.payload };

        return state;
    }
}
```

### Form Setup
In your component, you would implement the a reactive form and
decorate the form with the `ngrxForm` directive with the path
of your state object.

```javascript
@Component({
    template: `
        <form [formGroup]="pizzaForm" novalidate (ngSubmit)="onSubmit()" ngrxForm="pizza">
            <input type="text" formControlName="toppings" />
            <button type="submit">Order</button>
        </form>
    `
})
export class PizzaComponent {
    pizzaForm = this.formBuilder.group({
        toppings: ['']
    });
}
```

Now anytime your form updates, your state will also reflect the new state.

The directive also has 2 inputs you can utilize as well:

- `ngrxFormDebounce: number` - Debounce the value changes to the form. Default value: `100`.
- `ngrxFormClearOnDestroy: boolean` - Clear the state on destroy of the form.

### Actions
In addition to it automatically keeping track of the form, you can also
manually dispatch actions for things like resetting the form state. For example:

```javascript
this.store.dispatch(
    new UpdateFormDirty({
        dirty: false, path: 'pizza'
    })
);
```

The actions that it comes with out of the box are:
- `UpdateFormStatus({ status, path })` - Update the form status
- `UpdateFormValue({ value, path })` - Update the form value
- `UpdateFormDirty({ dirty, path })` - Update the form dirty status
- `SetFormDisabled(path)` - Set the form to disabled
- `SetFormEnabled(path)` - Set the form to enabled
- `SetFormDirty(path)` - Set the form to dirty (shortcut for `UpdateFormDirty`)
- `SetFormPristine(path)` - Set the form to prestine (shortcut for `UpdateFormDirty`)
