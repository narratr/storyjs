export interface KeyValue {
  key: string;
  value: any;
}

export class StringBuilder {
  private strings: Array<string> = [];

  public append(...args: any[]): StringBuilder {
    return this.appendInternal(args);
  }

  public appendLine(...args: any[]): StringBuilder {
    this.appendInternal(args);
    this.strings.push('\n');
    return this;
  }

  private appendInternal(args: any[]): StringBuilder {
    args && args.forEach(arg => {
      if (arg === undefined) {
        return;
      }

      var val: any;

      if (arg === null) {
        val = 'null';
      } else {
        var type = typeof(arg);
        if (type === 'string' || type === 'number' || type === 'boolean') {
          val = arg;
        } else {
          val = JSON.stringify(arg);
        }
      }

      this.strings.push(val);
    });

    return this;
  }

  public toString(): string {
    return this.strings.length > 0 ? this.strings.join('') : '';
  }
}

export class Utils {
  public static newGuid() {
    var s4 = Utils.s4;
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

  private static s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
}
