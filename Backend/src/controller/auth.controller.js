const authModel = require("../model/auth.model");
const otpModel = require("../model/otp.model");
const generateOTP = require("../utils/generateOTP");
const otpTemplate = require("../templates/otp.template");
const sendMail = require("../utils/sendMail");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    let { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    // Remove extra spaces
    name = name.trim();
    email = email.trim().toLowerCase();
    password = password.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email.",
      });
    }
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters.",
      });
    }
    const existingUser = await authModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    await otpModel.deleteMany({
      email,
      purpose: "register",
    });

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = generateOTP();

    // Hash OTP
    const hashedOtp = await bcrypt.hash(otp, 10);

    // Expiry (5 Minutes)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Save OTP Data
    await otpModel.create({
      name,
      email,
      password: hashedPassword,
      otp: hashedOtp,
      purpose: "register",
      expiresAt,
      attempts: 0,
    });

    // Send Email
    await sendMail({
      to: email,
      subject: "Verify Your ShopNest Account",
      html: otpTemplate(name, otp),
    });
    return res.status(200).json({
      success: true,
      message: "OTP sent successfully. Please verify your email.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const verifyRegisterOtp = async (req, res) => {
  try {
    let { email, otp } = req.body;

    // Validate Input
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    email = email.trim().toLowerCase();
    otp = otp.trim();
    // Find OTP Record
    const otpData = await otpModel.findOne({
      email,
      purpose: "register",
    }).select("+otp +password");

console.log("OTP DATA =>", otpData);

    if (!otpData) {
      return res.status(404).json({
        success: false,
        message: "OTP not found. Please register again.",
      });
    }

    // Check OTP Expiry
    if (otpData.expiresAt < new Date()) {
      await otpModel.deleteOne({ _id: otpData._id });

      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP.",
      });
    }

    // Compare OTP
    const isOtpValid = await bcrypt.compare(
      otp,
      otpData.otp
    );

      if (!isOtpValid) {

      // Increase Wrong Attempt Count
      otpData.attempts += 1;
      await otpData.save();

      // Block after 5 attempts
      if (otpData.attempts >= 5) {

        await otpModel.deleteOne({
          _id: otpData._id,
        });

        return res.status(400).json({
          success: false,
          message:
            "Maximum OTP attempts exceeded. Please register again.",
        });
      }

      return res.status(400).json({
        success: false,
        message: `Invalid OTP. ${
          5 - otpData.attempts
        } attempt(s) remaining.`,
      });
    }

    // Double Check User Doesn't Exist
    const existingUser = await authModel.findOne({
      email,
    });

    if (existingUser) {
      await otpModel.deleteOne({ _id: otpData._id });

      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Create User
    const user = await authModel.create({
      name: otpData.name,
      email: otpData.email,
      password: otpData.password,
      role: "user",
      isVerified: true,
    });

    // Delete OTP
    await otpModel.deleteOne({
      _id: otpData._id,
    });

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(201).json({
      success: true,
      message: "Email verified successfully.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });

  } catch (error) {
    console.error("Verify OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const loginUser = async (req,res) =>{
  try{
    let {email , password} = req.body;
    if(!email || !password){
      return res.status(400).json({
        success:false,
        message:"All fields are required"
      })
    };
    email = email.trim().toLowerCase();
    password = password.trim();

    const user = await authModel.findOne({email}).select("+password");
    if (!user) {
      return res.status(404).json({
          success:false,
          message:"User not found"
          });
      }
   
    const isPasswordMatch = await bcrypt.compare(password,user.password);

     if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email or Password.",
      });
    }

      const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // ===========================
    // Success
    // ===========================

    return res.status(200).json({
      success: true,
      message: "Login Successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  }catch(error){
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }

}

const sendLoginOtp = async(req,res) =>{
  try{
    let {email} = req.body;
    if(!email){
      return res.status(400).json({
        success:false,
        message:"Email is required"
      })
    }

    email = email.trim().toLowerCase();

    const user = await authModel.findOne({email});
    if(!user){
      return res.status(404).json({
        success:false,
        message:"User not found"
      })
    };

    await otpModel.deleteMany({
      email,
      purpose: "login",
    });

    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp,10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
   
    // Save New OTP
    await otpModel.create({
      email,
      otp: hashedOtp,
      purpose: "login",
      expiresAt,
      attempts: 0,
    });

    await sendMail({
      to: email,
      subject: "Login OTP",
      html: otpTemplate(user.name, otp),
    });
    return res.status(200).json({
      success:true,
      message:"OTP sent successfully"
    });
  }catch(error){
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

const verifyLoginOtp = async (req, res) => {
  try {
    let { email, otp } = req.body;

    // ===========================
    // Validation
    // ===========================

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required.",
      });
    }

    email = email.trim().toLowerCase();
    otp = otp.trim();

    // ===========================
    // Find User
    // ===========================

    const user = await authModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // ===========================
    // Find Login OTP
    // ===========================

    const otpData = await otpModel.findOne({
      email,
      purpose: "login",
    }).select("+otp");

    if (!otpData) {
      return res.status(404).json({
        success: false,
        message: "OTP not found.",
      });
    }

    // ===========================
    // Expiry
    // ===========================

    if (Date.now() > otpData.expiresAt.getTime()) {

      await otpModel.deleteOne({
        _id: otpData._id,
      });

      return res.status(400).json({
        success: false,
        message: "OTP has expired.",
      });
    }

    // ===========================
    // Compare OTP
    // ===========================

    const isOtpMatch = await bcrypt.compare(
      otp,
      otpData.otp
    );

    if (!isOtpMatch) {

      otpData.attempts += 1;

      await otpData.save();

      if (otpData.attempts >= 5) {

        await otpModel.deleteOne({
          _id: otpData._id,
        });

        return res.status(400).json({
          success: false,
          message:
            "Maximum OTP attempts exceeded. Please request a new OTP.",
        });
      }

      return res.status(400).json({
        success: false,
        message: `Invalid OTP. ${
          5 - otpData.attempts
        } attempt(s) remaining.`,
      });
    }

    // ===========================
    // Delete OTP
    // ===========================

    await otpModel.deleteOne({
      _id: otpData._id,
    });

    // ===========================
    // Generate Token
    // ===========================

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // ===========================
    // Success
    // ===========================

    return res.status(200).json({
      success: true,
      message: "Login Successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });

  } catch (error) {

    console.error("Verify Login OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

const getUsers = async(req,res) =>{
try{
  const users = await authModel.find({}).select('-password');
  if(!users){
    return res.status(404).json({
      success:false,
      message:"No users found"
    });
  }
  return res.status(200).json({
    success:true,
    users
  })
  }catch(error){
    console.log(error);
    return res.status(500).json({
      success:false,
      message:"Internal Server Error"
    })
  }
}

const sendForgotPasswordOtp = async(req,res) =>{
  try{
    let{email} = req.body;
    if(!email){
      return res.status(400).json({
        success: false,
        message : "Email is required",
      });
    }
    email = email.trim().toLowerCase();
    const user = await authModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    
    await otpModel.deleteMany({
      email,
      purpose: "forgotPassword",
    });

    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await otpModel.create({
      email,
      otp: hashedOtp,
      purpose: "forgotPassword",
      expiresAt,
      attempts: 0,
    });

    await sendMail({
      to: email,
      subject: "Reset Your ShopNest Password",
      html: otpTemplate(user.name,otp),
    });
    
    return res.status(200).json({
      success: true,
      message: "OTP sent successfully. Please verify your email.",
    });
  }catch(error){
    console.error("Forgot Password OTP Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

const verifyForgotPasswordOtp = async(req,res) =>{
  try{
    let {email,otp} = req.body;
    if(!email || !otp){
      return res.status(400).json({
        success:false,
        message:"Email and OTP are required"
      })
    }
    email = email.trim().toLowerCase();
    otp = otp.trim();

    const user = await authModel.findOne({email});
    if(!user){
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    const otpData = await otpModel.findOne({
      email,
      purpose: "forgotPassword",
    }).select("+otp");
    if(!otpData){
      return res.status(404).json({
        success:false,
        message:"OTP not found"
      })
    }

     if (Date.now() > otpData.expiresAt.getTime()) {

      await otpModel.deleteOne({
        _id: otpData._id,
      });

      return res.status(400).json({
        success: false,
        message: "OTP has expired.",
      });
    }
      const isOtpValid = await bcrypt.compare(
      otp,
      otpData.otp
    );

    if (!isOtpValid) {

      otpData.attempts += 1;

      await otpData.save();

      if (otpData.attempts >= 5) {

        await otpModel.deleteOne({
          _id: otpData._id,
        });

        return res.status(400).json({
          success: false,
          message:
            "Maximum OTP attempts exceeded. Please request a new OTP.",
        });
      }

      return res.status(400).json({
        success: false,
        message: `Invalid OTP. ${
          5 - otpData.attempts
        } attempt(s) remaining.`,
      });
    }

    // ===========================
    // Delete OTP
    // ===========================

    await otpModel.deleteOne({
      _id: otpData._id,
    });

    // ===========================
    // Generate Reset Token
    // ===========================

    const resetToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        purpose: "reset-password",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "10m",
      }
    );

    // ===========================
    // Success
    // ===========================

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully.",
      resetToken,
    });

  } catch (error) {

    console.error("Verify Forgot Password OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

const resetPassword = async(req,res) =>{
  try{
    const authHeader = req.headers.authorization;
       if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Reset token is missing.",
      });
    }
    const resetToken = authHeader.split(" ")[1];
    let decoded;
    try{
      decoded = jwt.verify(resetToken,process.env.JWT_SECRET);
    }catch(error){
      return res.status(401).json({
        success:false,
        message:"Invalid reset token"
      })
    }
    if (decoded.purpose !== "reset-password") {
      return res.status(401).json({
        success: false,
        message: "Invalid reset token.",
      });
    }
     let {newPassword, confirmPassword,} = req.body;
     if (!newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    newPassword = newPassword.trim();
    confirmPassword = confirmPassword.trim();

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters.",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    const user = await authModel.findById(decoded.id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

     const isSamePassword = await bcrypt.compare(
      newPassword,
      user.password
    );

    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message:
          "New password cannot be the same as your old password.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();
    return res.status(200).json({
      success: true,
      message: "Password reset successfully.",
    });

  }catch(error){
    
    console.error("Reset Password Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}


const logoutUser = async(req,res) =>{
  try{
    res.clearCookie("token");
    return res.status(200).json({
      success:true,
      message:"Logout Successful"
    })
    }catch(error){
    console.error(error);
    return res.status(500).json({
      success:false,
      message:"Internal Server Error"
    })
  }
};

module.exports = {
  registerUser,
  verifyRegisterOtp,
  loginUser,
  sendLoginOtp,
  verifyLoginOtp,
  sendForgotPasswordOtp,
  verifyForgotPasswordOtp,
  logoutUser,
  resetPassword,
  getUsers,
};