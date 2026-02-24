const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          return done(null, false, { message: 'Incorrect email.' });
        }

        if (user.status === 'BLOCKED') {
          return done(null, false, { message: 'User is blocked.' });
        }

        if (!user.passwordHash) {
          return done(null, false, { message: 'Please log in with your social account.' });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);

        if (!isMatch) {
          return done(null, false, { message: 'Incorrect password.' });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  new JwtStrategy(options, async (jwt_payload, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { id: jwt_payload.id } });
      return user ? done(null, user) : done(null, false, { message: 'User not found.' });
    } catch (err) {
      return done(err);
    }
  })
);

const socialHandler = async (profile, done, type) => {
  try {
    const email = profile.emails?.[0].value || `${profile.id}@${type}.com`;
    const user = await prisma.user.upsert({
      where: { email },
      update: { [`${type}Id`]: profile.id },
      create: { email, name: profile.displayName, [`${type}Id`]: profile.id }
    });
    return done(null, user);
  } catch (err) { return done(err); }
};

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID || 'id',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'secret',
  callbackURL: "/api/auth/google/callback"
}, (at, rt, p, d) => socialHandler(p, d, 'google')));

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID || 'id',
  clientSecret: process.env.FACEBOOK_APP_SECRET || 'secret',
  callbackURL: "/api/auth/facebook/callback",
  profileFields: ['id', 'displayName', 'emails']
}, (at, rt, p, d) => socialHandler(p, d, 'facebook')));

module.exports = passport;
