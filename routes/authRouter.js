import { Router } from "express";
import passport from "passport";

const authRouter = Router();

authRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:5173/signin" }),
  (req, res) => {
    const token = req.user.token;
    res.cookie("token", token, { httpOnly: true, secure: true });
    res.redirect("http://localhost:5173/user/profile");
  }
);




// // Facebook authentication routes
// authRouter.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

// authRouter.get(
//   '/facebook/callback',
//   passport.authenticate('facebook', { failureRedirect: '/login' }),
//   (req, res) => {
//     res.redirect('/');
//   }
// );

// GitHub authentication routes
authRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

authRouter.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: 'http://localhost:5173/signin' }),
  (req, res) => {
    const token = req.user.token;
    res.cookie("token", token, { httpOnly: true, secure: true });
    res.redirect("http://localhost:5173/user/profile");
  }
);

// googleRouter.get("/logout", (req, res) => {
//   req.logout();
//   res.redirect("http://localhost:5173/");
// });

// googleRouter.get("/current_user", (req, res) => {
//   res.send(req.user);
// });

export default authRouter;
