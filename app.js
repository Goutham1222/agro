require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcrypt');

const indexRouter = require('./routes/index');
const productRouter = require('./routes/products');
const shopRouter = require('./routes/shops');
const authRouter = require('./routes/auth');
const reviewsRouter = require('./routes/reviews');
const User = require('./models/user');

const app = express();

/* ==============================
   🔗 MongoDB Connection
============================== */
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/farmer_verification', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ DB Error:', err));

/* ==============================
   🧠 View Engine Setup
============================== */
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));

/* ==============================
   ⚙️ Middleware
============================== */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));

/* ==============================
   🔐 Session Configuration
============================== */
app.use(session({
  secret: process.env.SESSION_SECRET || 'supersecret_agro',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/farmer_verification'
  }),
}));

/* ==============================
   👤 Make user available to all views
============================== */
app.use((req, res, next) => {
  if (req.session.user) {
    res.locals.user = {
      ...req.session.user,
      isAdmin: req.session.user.role === 'admin'
    };
  } else {
    res.locals.user = null;
  }
  next();
});

/* ==============================
   🧱 Routes
============================== */
app.use('/', authRouter);
app.use('/reviews', reviewsRouter);
app.use('/', indexRouter);
app.use('/products', productRouter);
app.use('/shops', shopRouter);

/* ==============================
   👑 Ensure Default Admin Exists
============================== */
(async () => {
  try {
    const admin = await User.findOne({ username: 'admin' });
    if (!admin) {
      const hash = await bcrypt.hash('admin123', 10);
      await User.create({ username: 'admin', password: hash, role: 'admin' });
      console.log('✅ Default admin created: admin / admin123');
    }
  } catch (e) {
    console.error('⚠️ Admin seeding error:', e);
  }
})();

/* ==============================
   🚀 Start Server
============================== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
