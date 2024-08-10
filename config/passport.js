
// src/config/passport.js
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as GitHubStrategy } from "passport-github";
import User from "../models/userModel.js";
import { userToken } from "../utils/generateToken.js";
import dotenv from "dotenv";

dotenv.config()

export default (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
      done(null, user);
    });
  });

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        const user = await User.findOne({ userId: profile.id });

        if (user) {
          const token = userToken(user);
          user.token = token;
          console.log({ user: user, token: token });
          return done(null, user);
        }

        const newUser = await new User({
          userId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          image: profile.photos[0].value,
          hashedPassword: "google_pass",
          loginType: "google",
        }).save();

        const token = userToken(newUser);
        newUser.token = token;

        console.log({ user: newUser });
        done(null, newUser);
      }
    )
  );

  //   passport.use(
  //     new FacebookStrategy(
  //       {
  //         clientID: "your-facebook-client-id",
  //         clientSecret: "your-facebook-client-secret",
  //         callbackURL: "",
  //         profileFields: ["id", "displayName", "emails", "photos"],
  //       },
  //       async (accessToken, refreshToken, profile, done) => {
  //         const user = await User.findOne({ facebookId: profile.id });

  //         if (user) {
  //           const token = userToken(user);
  //           user.token = token;
  //           console.log({ user: user, token: token });
  //           return done(null, user);
  //         }

  //         const newUser = await new User({
  //           facebookId: profile.id,
  //           name: profile.displayName,
  //           email: profile.emails[0].value,
  //           image: profile.photos[0].value,
  //           hashedPassword: "facebook_pass",
  //           loginType: "facebook",
  //         }).save();

  //         const token = userToken(newUser);
  //         newUser.token = token;

  //         console.log({ user: newUser });
  //         done(null, newUser);
  //       }
  //     )
  //   );

  //   passport.use(
  //     new GitHubStrategy(
  //       {
  //         clientID: "Ov23lisOdn5zGhhFSC6d",
  //         clientSecret: "a94f150fd8f76d1e8f9afc34af44aa47541c6c07",
  //         callbackURL: "http://localhost:5555/api/v1/auth/github/callback",
  //         scope: ["user:email"],
  //       },
  //       async (accessToken, refreshToken, profile, done) => {
  //         const user = await User.findOne({ userId: profile.id });

  //         if (user) {
  //           const token = userToken(user);
  //           user.token = token;
  //           console.log({ user: user, token: token });
  //           return done(null, user);
  //         }

  //         const newUser = await new User({
  //           userId: profile.id,
  //           name: profile.displayName || profile.username,
  //           email: profile.emails[0].value,
  //           image: profile.photos[0].value,
  //           hashedPassword: "github_pass",
  //           loginType: "github",
  //         }).save();

  //         const token = userToken(newUser);
  //         newUser.token = token;

  //         console.log({ user: newUser });
  //         done(null, newUser);
  //       }
  //     )
  //   );

  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
        scope: ["user:email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        let email = null;
        if (profile.emails && profile.emails.length > 0) {
          email = profile.emails[0].value;
        } else {
          // GitHub doesn't always provide an email, handle accordingly
          email = `${profile.username}@github.com`; // Or any fallback logic
        }

        const user = await User.findOne({ userId: profile.id });

        if (user) {
            const token = userToken(user);
            user.token = token;
            console.log({ user: user, token: token });
            return done(null, user);
          }

        const newUser = await new User({
          userId: profile.id,
          name: profile.displayName || profile.username,
          email: email,
          image: profile.photos[0]?.value,
          hashedPassword: "github_pass",
          loginType: "github",
        }).save();

        const token = userToken(newUser);
        newUser.token = token;

        console.log({ user: newUser });
        done(null, newUser);
      }
    )
  );
};
