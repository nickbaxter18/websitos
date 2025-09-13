// ✅ Entry point
const { createApp } = require("./backend");

const app = createApp();
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
  console.log(`✅ Editor:  http://localhost:${PORT}/editor`);
  console.log(`✅ Health:  http://localhost:${PORT}/health`);
});
