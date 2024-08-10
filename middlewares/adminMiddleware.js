import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authenticateAdmin = async(req, res, next) => {
  console.log("Cookies:", req.cookies);
  const token = await req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Not Authenticated : Please  login or register' });
  }

   jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    console.log(err);
    if (err) return res.sendStatus(403);

    req.user = user;

    console.log(req.user.role);

    if (req.user.role !== "admin") {
      return res.send("Not Authenticated : You are not admin");
    }
    next();
  });
}

export default authenticateAdmin;
