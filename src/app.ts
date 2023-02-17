const Logger = (logString: string) => {
  console.log("Logger Factory");
  return (constructor: Function) => {
    console.log(logString);
    console.log(constructor);
  };
};

const WithTemplate = (template: string, hookId: string) => {
  console.log("Template Factory");

  return (constructor: any) => {
    console.log("Rendering...");
    const person = new constructor();
    const hookEl = document.getElementById(hookId);
    if (hookEl) {
      hookEl.innerHTML = template;
      hookEl.querySelector("h1")!.textContent = person.name;
    }
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
