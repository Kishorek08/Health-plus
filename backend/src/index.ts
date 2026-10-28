import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import appointmentRoutes from './routes/appointment';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);

app.get('/', (req, res) => {
  res.send('Healthcare Portal API Running');
});

app.listen(PORT, () => {
  console.log(`Healthcare Server running on port ${PORT}`);
});