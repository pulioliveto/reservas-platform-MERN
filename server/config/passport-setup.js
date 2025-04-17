import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as InstagramStrategy } from 'passport-instagram';
import User from '../models/User.js';

// Configurar Google Strategy
passport.use(new GoogleStrategy({
    clientID: 'TU_CLIENT_ID_GOOGLE',
    clientSecret: 'TU_CLIENT_SECRET_GOOGLE',
    callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Verifica si el usuario ya existe
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
            done(null, user);
        } else {
            // Si no existe, crea un nuevo usuario
            user = await new User({
                username: profile.displayName,
                googleId: profile.id
            }).save();
            done(null, user);
        }
    } catch (error) {
        console.error(error);
        done(error, null);
    }
}));

// Configurar Instagram Strategy
passport.use(new InstagramStrategy({
    clientID: 'TU_CLIENT_ID_INSTAGRAM',
    clientSecret: 'TU_CLIENT_SECRET_INSTAGRAM',
    callbackURL: '/auth/instagram/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ instagramId: profile.id });
        if (user) {
            done(null, user);
        } else {
            user = await new User({
                username: profile.displayName,
                instagramId: profile.id
            }).save();
            done(null, user);
        }
    } catch (error) {
        console.error(error);
        done(error, null);
    }
}));

// Serializar y deserializar usuarios
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

export default passport;