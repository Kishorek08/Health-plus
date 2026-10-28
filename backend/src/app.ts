import express from 'express';
import cors from 'cors';
import { ENV } from './config/env';
import authRouter from './routes/auth';
import appointmentRouter from './routes/appointment';
import smsRouter from './routes/smsRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/appointments', appointmentRouter);
app.use('/api/sms', smsRouter);

app.get('/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(ENV.PORT, () => {
  console.log(`Healthcare Server running on port ${ENV.PORT}`);
});

export default app;
