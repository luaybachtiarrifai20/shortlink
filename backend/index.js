const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const admin = require('firebase-admin');
const { nanoid } = require('nanoid');

dotenv.config();

const app = express();
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:5173'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// Firebase Admin Initialization
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
    console.log('Firebase Admin initialized');
  } catch (error) {
    console.error('Firebase Admin init error:', error.message);
  }
}

const db = admin.firestore();

// API Routes

// Create shortlink
app.post('/api/shorten', async (req, res) => {
  try {
    const { originalUrl, userId, email } = req.body;
    
    if (!originalUrl) {
      return res.status(400).json({ error: 'Original URL is required' });
    }

    const shortCode = nanoid(6);
    const shortLinkData = {
      originalUrl,
      userId: userId || 'anonymous',
      email: email || 'anonymous',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      clicks: 0,
      shortCode,
    };

    await db.collection('links').doc(shortCode).set(shortLinkData);

    const baseUrl = process.env.BASE_FRONTEND_URL || `${req.protocol}://${req.get('host')}`;
    res.status(201).json({
      ...shortLinkData,
      shortUrl: `${baseUrl}/alto/${shortCode}`
    });
  } catch (error) {
    console.error('Error shortening URL:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Resolve shortlink (for frontend)
app.get('/api/resolve/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;
    const linkDoc = await db.collection('links').doc(shortCode).get();

    if (!linkDoc.exists) {
      return res.status(404).json({ error: 'Short link not found' });
    }

    const data = linkDoc.data();
    
    // Increment clicks asynchronously
    db.collection('links').doc(shortCode).update({
      clicks: admin.firestore.FieldValue.increment(1)
    });

    res.json({ originalUrl: data.originalUrl });
  } catch (error) {
    console.error('Error resolving:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Redirect shortlink (fallback for direct backend access)
app.get('/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;
    const linkDoc = await db.collection('links').doc(shortCode).get();

    if (!linkDoc.exists) {
      return res.status(404).send('Short link not found');
    }

    const data = linkDoc.data();
    
    // Increment clicks asynchronously
    db.collection('links').doc(shortCode).update({
      clicks: admin.firestore.FieldValue.increment(1)
    });

    res.redirect(data.originalUrl);
  } catch (error) {
    console.error('Error redirecting:', error);
    res.status(500).send('Internal server error');
  }
});

// Get user links
app.get('/api/links/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const snapshot = await db.collection('links')
      .where('userId', '==', userId)
      .get();

    const links = [];
    snapshot.forEach(doc => {
      links.push({ id: doc.id, ...doc.data() });
    });

    res.json(links);
  } catch (error) {
    console.error('Error fetching links:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete shortlink
app.delete('/api/links/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;
    await db.collection('links').doc(shortCode).delete();
    res.json({ message: 'Link deleted successfully' });
  } catch (error) {
    console.error('Error deleting link:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Save user on login
app.post('/api/users', async (req, res) => {
  try {
    const { userId, email, name, photoURL } = req.body;

    if (!userId || !email) {
      return res.status(400).json({ error: 'User ID and Email are required' });
    }

    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      await userRef.set({
        email,
        name: name || '',
        photoURL: photoURL || '',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        lastLogin: admin.firestore.FieldValue.serverTimestamp(),
      });
      return res.status(201).json({ message: 'User created' });
    } else {
      await userRef.update({
        lastLogin: admin.firestore.FieldValue.serverTimestamp(),
        name: name || userDoc.data().name,
        photoURL: photoURL || userDoc.data().photoURL,
      });
      return res.status(200).json({ message: 'User updated' });
    }
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
