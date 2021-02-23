declare module Express {
  export interface Request {
    user: {
      id: string;
      name: string;
      phone: string;
      email: string;
      location: {
        type: string,
        coordinates: number[]
      };
    };
  }
}