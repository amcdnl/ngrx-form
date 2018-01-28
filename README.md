# ngrx-form
Reactive Form bindings for NGRX.

See [changelog](CHANGELOG.md) for latest changes.

## Whats this do?
Often when building Reactive Forms in Angular, you need to bind values from the
store to form and vice versus. In addition to binding the values, you
might want to get form status and errors. This utility does this all for you!

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
- `UpdateFormStatus({ status, path })`
- `UpdateFormValue({ value, path })`
- `UpdateFormDirty({ dirty, path })`
