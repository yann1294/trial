import User from '../models/user';
import Course from '../models/course'
// import queryString from 'query-string'
import { hashPassword } from "../utils/auth";
import AWS from "aws-sdk";
import { nanoid } from "nanoid";  // how does this work and what's its use?
import slugify from 'slugify' // how does this work and what's its use?
import instructor from '../models/instructor';


// this module is actually under admin account 
// this is how the admin manipulates the instructor 
// As an improvement, for separation of concerns, most fo the logic happening here should be in a service module 

// const stripe = require('stripe')(process.env.STRIPE_SECRET)

const awsConfig = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    apiVersion: process.env.AWS_API_VERSION,
  };


const S3 = new AWS.S3(awsConfig);

// this function helps to upload the image and to save it in S3
export const uploadImage = async (req, res) => {
    // console.log(req.body);
    try {
      const { image } = req.body;
      if (!image) return res.status(400).send("No image");
  
      // prepare the image
      const base64Data = new Buffer.from(
        image.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );
  
      const type = image.split(";")[0].split("/")[1];
  
      // image params
      const params = {
        Bucket: "clovimy-bucket",
        Key: `${nanoid()}.${type}`,
        Body: base64Data,
        ACL: "public-read",
        ContentEncoding: "base64",
        ContentType: `image/${type}`,
      };
  
      // upload to s3
      S3.upload(params, (err, data) => {
        if (err) {
          console.log(err);
          return res.sendStatus(400);
        }
        console.log(data);
        res.send(data); // this persists the image in the AWS S3 bucket
      });
    } catch (err) {
      console.log(err);
    }
  };

  // this helps to delete the image
  export const removeImage = async (req, res) => {
    try {
      const { image } = req.body;
      // image params
      const params = {
        Bucket: image.Bucket,
        Key: image.Key,
      };
  
      // send remove request to s3
      S3.deleteObject(params, (err, data) => {
        if (err) {
          console.log(err);
          res.sendStatus(400);
        }
        res.send({ ok: true });
      });
    } catch (err) {
      console.log(err);
    }
  };

  // this module allows to create an instructor 
export const makeInstructor = async (req, res) => { // 
    try {
      // console.log(req.body);
      const { name, email, password } = req.body;
      // validation
      if (!name) return res.status(400).send("Name is required");
      if (!password || password.length < 6) {
        return res
          .status(400)
          .send("Password is required and should be min 6 characters long");
      }
      // check asynchrously if the user exists already 
      let userExist = await User.findOne({ email, slug: slugify(req.body.name.toLowerCase()) }).exec();
      if (userExist) return res.status(400).send("Email is taken");
  
      // hash password
      const hashedPassword = await hashPassword(password); // this can be a future object since it doesn't impact the starting of the subsequent lines
  
      // register
      const user = new User({ // 
        ...req.body,
        name,
        slug: slugify(req.body.name),
        instructor: req.user._id,
        email,
        password: hashedPassword,
        role: 'Instructor',
      });
      await user.save();
      // console.log("saved user", user);
      return res.json({ ok: true });
    } catch (err) {
      console.log(err);
      return res.status(400).send("Error. Try again.");
    }
  };

// export const getAccountStatus = async (req,res) =>{
//     try{
//         const user = await User.findById(req.user._id).exec()
//         const account = await stripe.accounts.retrieve(user.stripe_account_id)
//         // console.log('ACCOUNT =>',account)
//         if(!account.charges_enabled){
//             return res.status(401).send('Unauthorized');
//         } else {
//             const statusUpdated = await User.findByIdAndUpdate(user._id,{
//                 stripe_seller: account,
//                 $addToSet: {role: 'Instructor'}
//             },
//             {new: true}
//             ).select('-password')
//             .exec()
//             res.json(statusUpdated)
//         }
//     }catch(err){
//         console.log(err)
//     }
// }

// this function can be used in other modules as well. So, it can be made as a utility function
export const currentInstructor = async(req,res) =>{
    try{
        let user = await User.findById(req.user._id).select('-password').exec()
        if(!user.role.includes('Instructor')){
            return res.sendStatus(403);
        }else{
            res.json({ok:true})
        }
    }catch(err){
        console.log(err)
    }
}

// this function which retrieves all the instructor courses can be found in both admin and instructor modules
export const instructorCourses = async (req, res) => {
    try {
      const courses = await Course.find({ instructor: req.user._id })
        .sort({ createdAt: -1 })
        .exec();
      res.json(courses);
    } catch (err) {
      console.log(err);
    }
  };


  // ? this function, which selects all instructors, should be implemented in AdminAccount module
  export const findInstructor = async (req, res) => {
    try {
      const instructors = await User.find({ role: 'Instructor' })
        .sort({ createdAt: -1 })
        .exec();
      res.json(instructors);
    } catch (err) {
      console.log(err);
    }
  };
  
  // ? this function, which selects a particular instructor, should be implemented in AdminAccount module
  export const read = async(req,res) => {
    try {
        const instructor = await User.findOne({ slug: req.params.slug})
                                .populate(
                                    'instructor',
                                    '_id name'
                                ).exec()
        res.json(instructor)
    } catch (error) {
        console.log(error)
    }
  }
   // ? this function, which retrieves and delete instructor, should be implemented in AdminAccount module
  export const deleteInstructor = async(req, res) => {
    try {
        const instructor = await User.findOneAndDelete({slug:req.params.slug}).exec() // we shouldn't physically delete, we will rather perfomr a logical delete 
        res.json(instructor)
    } catch (error) {
        console.log(error)
    }
  }
  // ? this function, which retrieves and updates instructor, should be implemented in AdminAccount module
  export const update = async(req,res) =>{
    try {
        const {slug} = req.params;
        const instructor = await User.findOne({slug}).exec()
        if(req.user._id != instructor.instructor){
            return res.status(400).send('Unauthorised');
        }
        const updated = await User.findOneAndUpdate(
            {slug},
            req.body,
            {new:true}
        ).exec()
        res.json(updated)
    } catch (error) {
        console.log(error)
        return res.status(400).send(err.message);
    }
  }