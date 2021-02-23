declare module Express {
  export interface Request {
    user: {
      id: string;
      email: string;
      location: {
        type: string,
        coordinates: number[]
      };
    };
  }
}