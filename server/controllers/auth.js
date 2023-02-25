import User from "../models/user";
import { hashPassword, comparePassword } from "../utils/auth";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import AWS from "aws-sdk";

// this controller is where all the login related things are handled

const awsConfig = { // this is the AWS related config setup for authentication 
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  apiVersion: process.env.AWS_API_VERSION,
};

const SES = new AWS.SES(awsConfig);

// this is the login fonction. It gets the entered email and password sent through req object 
export const login = async (req, res) => {
  try {
    // console.log(req.body);
    const { email, password } = req.body;
    // check if our db has user with that email
    const user = await User.findOne({ email }).exec();
    if (!user) return res.status(400).send("No user found");
    // check password, comparing the entered one against the saved one
    const match = await comparePassword(password, user.password);
    if(!match) return res.status(400).send('Wrong password')
    // create signed jwt
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { // ? why do we need this?
      expiresIn: "7d",
    });
    // return user and token to client, exclude hashed password
    user.password = undefined; // what is this step for? // so, we make the the password null so that we can send the user login without the password

    // send token in cookie
    res.cookie("token", token, { // why are cookies being used? do we really need cookie? all these params to be defined 
      httpOnly: true,
      sameSite: 'none',
      secure: true, // only works on https
    });
    // send user as json response
    res.json(user); 
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error. Try again.");
  }
};

// this is the sign out function 
export const logout = async (req, res) => {
  try { 
    res.clearCookie("token"); // this clears out the cookies // How else to sign out without clearing the cookies?
    return res.json({ message: "Signout success" }); 
  } catch (err) {
    console.log(err);
  }
};

export const currentUser = async (req, res) => { // what is the purpose of this function? If it is a utilitary function, let us put where it can be accessed by whatever wants it
  try {
    const user = await User.findById(req.user._id).select("-password").exec();
    console.log("CURRENT_USER", user);
    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
};
// forgot password function 
// in order to retrieve one's password, the user should enter his email so that he receives an email for updating the password  
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body; // this extracts the email embodied into the body of request as the user enters the email
    // console.log(email);
    const shortCode = nanoid(6).toUpperCase(); // what does this do?
    const user = await User.findOneAndUpdate(  // this gets the user through the entered email and update the password
      { email },
      { passwordResetCode: shortCode }
    );
    if (!user) return res.status(400).send("User not found");

    // prepare for email
    const params = { // how does this work?
      Source: process.env.EMAIL_FROM, // the source address email is internal, meaning we send the email to the user
      Destination: {
        ToAddresses: [email], // this is the email of the user to which the message will be sent to 
      },
      Message: { // this is the message along with the shortcode 
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: `
                <html>
                  <h1>Reset password</h1>
                  <p>Use this code to reset your password</p>
                  <h2 style="color:red;">${shortCode}</h2>
                  <i>clovemy.com</i>
                </html>
              `,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "Reset Password",
        },
      },
    }; // everything is put inside the params 

    const emailSent = SES.sendEmail(params).promise(); // what's this for? // this process the params and sends the email with the recovered password
    emailSent
      .then((data) => {
        console.log(data);
        res.json({ ok: true });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
};

export const resetPassword = async (req, res) => { // what does password reset mean? why do we need it?
  try {
    const { email, code, newPassword } = req.body;
    // console.table({ email, code, newPassword });
    const hashedPassword = await hashPassword(newPassword);

    const user = User.findOneAndUpdate(
      {
        email,
        passwordResetCode: code,
      },
      {
        password: hashedPassword,
        passwordResetCode: "",
      }
    ).exec();
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error! Try again.");
  }
};
