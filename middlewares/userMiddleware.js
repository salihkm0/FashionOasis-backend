import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

function authenticateUser(req, res, next) {
  const token = req.cookies.token;
  console.log("token : ", token);
  if (!token) {
    console.log("Not Authenticated : Please  login or register");
    return res.status(401).json({
      message: "Not Authenticated : Please  login or register",
      success: false,
    });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    console.log(err);
    if (err) return res.sendStatus(403);
    req.user = user;
    console.log(req.user.role);
    next();
  });
}

export default authenticateUser;
