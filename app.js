require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const indexRouter = require('./routes/index');
const productRouter = require('./routes/products');
const shopRouter = require('./routes/shops');

const app = express();

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/farmer_verification', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB Connected')).catch(err => console.error('❌ DB Error:', err));

app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcrypt');
const User = require('./models/user');

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'supersecret_agro',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/farmer_verification' })
}));

// Make user data available to all views
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
app.use((req,res,next)=>{
  res.locals.user = req.session.user || null;
  next();
});

// Mount auth and reviews routes
const authRouter = require('./routes/auth');
const reviewsRouter = require('./routes/reviews');
app.use('/', authRouter);
app.use('/reviews', reviewsRouter);

// Ensure default admin exists
(async ()=>{
  try{
    const admin = await User.findOne({ username: 'admin' });
    if(!admin){
      const hash = await bcrypt.hash('admin123', 10);
      await User.create({ username: 'admin', password: hash, role: 'admin' });
      console.log('Default admin user created: admin / admin123');
    }
  }catch(e){
    console.error('Admin seeding error', e);
  }
})();

app.use(bodyParser.json());
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/products', productRouter);
app.use('/shops', shopRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
