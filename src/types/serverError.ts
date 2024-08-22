export default class ServerError extends Error {
    code: string;
    data: any;
  
    constructor(message: string, code: string, data: any) {
      super(message);
      this.code = code;
      this.data = data;
    }
  }