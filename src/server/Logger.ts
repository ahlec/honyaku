/* tslint:disable:no-console */

class LoggerClass {
  public log(...args: ReadonlyArray<any>) {
    this.performConsoleOutput(console.log, args);
  }

  public info(...args: ReadonlyArray<any>) {
    this.performConsoleOutput(console.info, args);
  }

  public warn(...args: ReadonlyArray<any>) {
    this.performConsoleOutput(console.warn, args);
  }

  public error(...args: ReadonlyArray<any>) {
    this.performConsoleOutput(console.error, args);
  }

  private performConsoleOutput(
    outputFn: (...x: ReadonlyArray<any>) => void,
    args: ReadonlyArray<any>
  ) {
    outputFn(...args);
  }
}

const Logger = new LoggerClass();
export default Logger;
