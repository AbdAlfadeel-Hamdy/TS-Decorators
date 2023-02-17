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
