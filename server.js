require('dotenv').config();
const express = require('express');
const { TagManager } = require('@google-cloud/tag-manager');

const app = express();
const port = process.env.PORT || 8080;

// Middleware للتحقق من صحة التوكن
const authenticate = (req, res, next) => {
  const authToken = req.headers['x-gtm-auth'];
  if (authToken === process.env.GTM_AUTH_TOKEN) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
};

app.use(express.json());

// Route للصحة
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    nodeVersion: process.version,
    memoryUsage: process.memoryUsage()
  });
});

// Route لمعالجة طلبات GTM
app.post('/gtm', authenticate, async (req, res) => {
  try {
    const tagManager = new TagManager();
    const result = await tagManager.processEvent({
      containerId: process.env.GTM_CONTAINER_ID,
      environmentId: process.env.GTM_ENVIRONMENT_ID || '1',
      eventData: req.body
    });

    res.json({
      status: 'success',
      container: process.env.GTM_CONTAINER_ID,
      result: result
    });
  } catch (error) {
    console.error('GTM Processing Error:', error);
    res.status(500).json({
      error: 'Processing failed',
      details: error.message
    });
  }
});

// بدء الخادم
app.listen(port, () => {
  console.log(`
  🚀 GTM Server Started
  --------------------
  Container: ${process.env.GTM_CONTAINER_ID}
  Environment: ${process.env.NODE_ENV || 'development'}
  Listening on: http://localhost:${port}
  `);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});
