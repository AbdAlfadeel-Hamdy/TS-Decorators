const Logger = (logString: string) => {
  return (constructor: Function) => {
    console.log(logString);
    console.log(constructor);
  };
};

@Logger("Person login")
class Person {
  name = "Max";
  constructor() {
    console.log("Person created");
  }
}

const person = new Person();
