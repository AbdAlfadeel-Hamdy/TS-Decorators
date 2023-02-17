const Logger = (logString: string) => {
  console.log("Logger Factory");
  return (constructor: Function) => {
    console.log(logString);
    console.log(constructor);
  };
};

const WithTemplate = (template: string, hookId: string) => {
  console.log("Template Factory");

  return <T extends { new (...args: any[]): { name: string } }>(
    originalConstructor: T
  ) => {
    // Must be initiated to execute
    return class extends originalConstructor {
      constructor(..._: any[]) {
        super();
        console.log("Rendering...");
        const hookEl = document.getElementById(hookId);
        if (hookEl) {
          hookEl.innerHTML = template;
          hookEl.querySelector("h1")!.textContent = this.name;
        }
      }
    };
  };
};

@Logger("Person login")
@WithTemplate("<h1>Decorators</h1>", "app") // Decorator executes first down to up ^^^^^
class Person {
  name = "Max";
  constructor() {
    console.log("Person created");
  }
}

const person = new Person();

////////////////////////////

const Log = (target: any, propertyName: string | Symbol) => {
  console.log("Property Decorator");
  console.log(target); // prototype of our object or it will be constructor function if dealing with static accessor / method
  console.log(propertyName);
};

const Log2 = (
  target: any,
  name: string | Symbol,
  descriptor: PropertyDescriptor
) => {
  console.log("Accessor Decorator");
  console.log(target);
  console.log(name);
  console.log(descriptor);
};
const Log3 = (
  target: any,
  name: string | Symbol,
  descriptor: PropertyDescriptor
) => {
  console.log("Method Decorator");
  console.log(target);
  console.log(name);
  console.log(descriptor);
};
const Log4 = (target: any, name: string | Symbol, position: number) => {
  console.log("Parameter Decorator");
  console.log(target);
  console.log(name);
  console.log(position);
};
class Product {
  @Log
  title: string;
  _price: number;
  @Log2
  set price(value: number) {
    if (value > 0) this._price = value;
  }
  constructor(t: string, p: number) {
    this.title = t;
    this._price = p;
  }
  @Log3
  getPriceWithTax(@Log4 tax: number) {
    return this._price * (tax + 1);
  }
}

/////////////////////////////
// Autobind Decorator

const Autobind = (
  target: any,
  methodName: string,
  descriptor: PropertyDescriptor
) => {
  console.log(target, methodName);
  const originalMethod = descriptor.value;
  const adjustedDescriptor: PropertyDescriptor = {
    enumerable: false,
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjustedDescriptor;
};
class Printer {
  message = "This works!";
  @Autobind
  showMessage() {
    console.log(this.message);
  }
}

const p = new Printer();
const btn = document.querySelector("button")!;
// btn.addEventListener("click", p.showMessage.bind(p)); // Another solution
btn.addEventListener("click", p.showMessage);

//// Validation with Decorators

interface ValidatorConfig {
  [property: string]: {
    [validatableProps: string]: string[]; // ['required', 'positive']
  };
}

const registeredValidators: ValidatorConfig = {};

const RequiredItem = (target: any, propName: string) => {
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name],
    [propName]: [
      ...(registeredValidators[target.constructor.name]?.[propName] ?? []),
      "required",
    ],
  };
};
const PositiveNumber = (target: any, propName: string) => {
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name],
    [propName]: [
      ...(registeredValidators[target.constructor.name]?.[propName] ?? []),
      "positive",
    ],
  };
};
const validate = (obj: any) => {
  const objValidConfig = registeredValidators[obj.constructor.name];
  if (!objValidConfig) return true;
  let isValid = true;
  for (const prop in objValidConfig) {
    for (const validator of objValidConfig[prop]) {
      switch (validator) {
        case "required":
          if (!obj[prop]) isValid = false;
          break;

        case "positive":
          if (!(obj[prop] > 0)) isValid = false;
          break;
      }
    }
  }
  return isValid;
};

class Course {
  @RequiredItem
  title: string;
  @PositiveNumber
  price: number;
  constructor(t: string, p: number) {
    this.title = t;
    this.price = p;
  }
}

const form = document.querySelector("form")!;
form.addEventListener("submit", (e: SubmitEvent) => {
  e.preventDefault();
  const titleEl = document.getElementById("title") as HTMLInputElement;
  const priceEl = document.getElementById("price") as HTMLInputElement;
  const title = titleEl.value;
  const price = +priceEl.value;

  const createdCourse = new Course(title, price);
  if (!validate(createdCourse)) {
    alert("Invalid inputs!");
    return;
  }
  console.log(createdCourse);
});
