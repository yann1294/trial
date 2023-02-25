import User from "../models/user";
import { hashPassword } from "../utils/auth";


// this class is used as controller class and business logic (service) class for Admin type of user
// this has two main functions: register function and login function 
 

// this asynchronously receives register request and sends a response either successfully registered or not
export const register = async (req, res) => { 
    try {
      // console.log(req.body);
      const { name, email, password } = req.body; // extracting these three params from the request object 
      
      // validation: it should be put in the validation layer
      if (!name) return res.status(400).send("Name is required");
      if (!password || password.length < 6) {
        return res
          .status(400)
          .send("Password is required and should be min 6 characters long");
      } // validation 

      // this hits the db so it will be kept in the controller
      let userExist = await User.findOne({ email }).exec();
      if (userExist) return res.status(400).send("Email is taken");
  
      // hash password: only the hash of the password will be saved in the db for pwd secure storage purpose
      const hashedPassword = await hashPassword(password); // while hashing is executing, the control continues
  
      // register
      const user = new User({ // creating a model object so as to receive the newly registered 
        name,
        email,
        password: hashedPassword,
        role: 'Admin'
      });
      await user.save(); // saving the newly created user in the db
      // console.log("saved user", user);
      return res.json({ ok: true });
    } catch (err) {
      console.log(err);
      return res.status(400).send("Error. Try again.");
    }
}

// this is the admin loggin function 
export const currentAdmin = async(req,res) =>{ // the request object contains the entered credentials 
    try{
        // fetching the user with the help of his id and password
        let user = await User.findById(req.user._id).select('-password').exec()
        if(!user.role.includes('Admin')){ // checking if the role of the entered user is <admin
            return res.sendStatus(403);
        }else{
            res.json({ok:true})
        }
    }catch(err){
        console.log(err)
    }
}