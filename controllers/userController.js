const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userSchema")
const { sendVerificationCode } = require("../Services/Email.js");



module.exports.profile = async (req, res, next) => {
   if (!req.session.user) {
      return res.status(400).json({ message: "session expired please login again", success: false })
   }
   let validUser = jwt.verify(req.cookies.token, process.env.jwtsecret);
   let user = await userModel.findById(validUser.id);
   if (!user) {
      return res.status(404).json({ message: "user not found", success: false });
   }
   user = user.toObject();
   delete user.password;
   return res.status(200).json({ message: "user profile", success: true, data: user });
}

module.exports.signup = async (req, res, next) => {
   const { username, email, password, userRole } = req.body;
   const salt = await bcrypt.genSalt(10);
   const hashpassword = await bcrypt.hash(password, salt);
   const verficationCode = Math.floor(Math.random() * 100000) + 100000;

      let newUSer = new userModel({
         username,
         email,
         userRole,
         password: hashpassword,
         verficationCode,
         lastOtpSend: Date.now()
      })

      let savedUser = await newUSer.save();
      const response = await sendVerificationCode(email, verficationCode);
      req.session.user = savedUser;
      let token = jwt.sign({ id: newUSer._id, email: newUSer.email }, process.env.jwtsecret);
      res.cookie("token", token, {
         secure: false,
         maxAge: 1000 * 60 * 60 * 24,
         httpOnly: false,

      })

      savedUser = savedUser.toObject();
      delete savedUser.password;
      res.status(200).json({ message: response.message || "email sent successfully", success: true });
   
}



module.exports.verifyOtp = async (req, res, next) => {
   const { code } = req.body;
   if (!code) {
      return res.status(400).json({ message: "please enter otp", success: false });
   }
   const verifyToken = jwt.verify(req.cookies.token, process.env.jwtsecret);
   let user = await userModel.findById(verifyToken.id);
   if (!user) {
      return res.status(404).json({ message: "user not found", success: false });
   }
   if (code === user.verficationCode) {
      user.verficationCode = null;
      user.isVerified = true;
      let savedUser = await user.save();
      savedUser = savedUser.toObject();
      delete savedUser.password;
      return res.status(200).json({ message: "verification successful", data: savedUser, success: true });
   } else {
      return res.status(401).json({ message: "opt misMatch ", success: false });
   }
}



module.exports.resendOtp = async (req, res, next) => {
   let validUser = jwt.verify(req.cookies.token, process.env.jwtsecret);
   if (!validUser) {
      return res.status(401).json({ message: "unauthorzed access", success: false });
   }
   const verficationCode = Math.floor(Math.random() * 100000) + 100000;
   let user = await userModel.findById(validUser.id);
   let now = Date.now();
   if (user.lastOtpSend && (now - user.lastOtpSend.getTime()) < 5 * 60 * 1000) {
      return res.status(429).json({ message: "otp will be send after 5 min", success: false })
   }
   const response = await sendVerificationCode(validUser.email, verficationCode);


   if (response) {
      user.verficationCode = verficationCode;
      user.lastOtpSend = new Date();
      await user.save();
      return res.status(200).json({ message: "otp send successfully", success: true });

   } else {
      return res.status(500).json({ message: "failed to send opt", success: false });
   }

}


module.exports.login = async (req, res, next) => {
   const { email, password } = req.body;
   let user = await userModel.findOne({ email: email });
   if (!user) {
      return res.status(404).json({ message: "user not found", success: false });
   }
   const isPasswordMatched = bcrypt.compare(password, user.password);

   if (!isPasswordMatched) {
      return res.status(401).json({ message: "unauthorzed user", success: false })
   }

   let token = jwt.sign({ id: user._id, email: user.email }, process.env.jwtsecret);

   res.cookie("token", token, {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24
   });

   req.session.user = user;
   user = user.toObject();
   delete user.password;

   return res.status(200).json({ message: "user login successfully", data: user, success: true });
}



module.exports.updateProfile = async (req, res, next) => {
   const { username, email, profilePic } = req.body;
   const updateData = {};

   // Add only non-empty fields to updateData
   if (username && username.trim() !== "") updateData.username = username;
   if (email && email.trim() !== "") updateData.email = email;
   if (profilePic && profilePic.trim() !== "") updateData.profilePic = profilePic;

   // Check if at least one field is present to update
   if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "At least one field is required to update", success: false });
   }
   
      let upUser = await userModel.findByIdAndUpdate(req.session.user._id, updateData, { new: true });

      upUser = upUser.toObject();
      delete upUser.password;

      res.status(200).json({ message: "User updated successfully", success: true, data: upUser });
   
};
