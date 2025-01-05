import express, { Request, Response } from 'express';

const app = express();
const port = 3000;

// Basic route
app.get('/', (req: Request, res: Response): void => {
  res.send('Hello, Express with TypeScript!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
