import 'dotenv/config';
import { createApp } from './app';

const PORT = parseInt(process.env.PORT ?? '4000', 10);

const app = createApp();

app.listen(PORT, () => {
  console.log(`✅  ticktock API running on http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log(`   Timesheets: http://localhost:${PORT}/api/timesheets`);
});
