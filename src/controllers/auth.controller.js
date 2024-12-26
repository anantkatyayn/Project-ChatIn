import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {

    if(!fullName || !email || !password){
      return res.status(400).json({message:"Fill all the fields please."})
    }

    if (password < 6) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 6 characters" });
    }


    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName, //can also be written as fullname:fullname
      email,  //can also be written as email:email
      password: hashedPassword,
    })

    if(newUser){
      //generating new jwt token using a util in lib folder
      generateToken(newUser._id,res)
      await newUser.save();

      res.status(201).json({
        _id:newUser._id,
        fullName:newUser.fullName,
        email:newUser.email,
        profilePic:newUser.profilePic
      })
    } else{
      res.status(400).json({message:"Invalid User data"})
    }
  } catch (error) {
    console.log("Error in signing up user", error.message);
    res.status(500).json({message:"Internal Server Error"})
  }
};

export const login = (req, res) => {
  res.send("login route");
};

export const logout = (req, res) => {
  res.send("logout route");
};
