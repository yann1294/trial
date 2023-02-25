import AWS from "aws-sdk";
import { nanoid } from "nanoid";
import Course from '../models/course'
import Completed from '../models/completed'
import slugify from 'slugify'
import {readFileSync} from 'fs'
import User from '../models/user'

// Admin manipulating course. That is uploading image when creating a course, 

const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  apiVersion: process.env.AWS_API_VERSION,
};

const S3 = new AWS.S3(awsConfig);

export const uploadImage = async (req, res) => { // uploading image
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
      res.send(data);
    });
  } catch (err) {
    console.log(err);
  }
};

// deleting image
export const removeImage = async (req, res) => { // getting the request object 
  try {
    const { image } = req.body; // extracting the content from the request object 
    // image params
    const params = {   // specifying the required parameters for a deletion such as the key
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


export const create = async (req,res) => {
  // console.log('CREATE COURSE')
  try{
    const alreadyExist = await Course.findOne({ // firing a select course, as a promise, to see if the entered name inside the request body already exists   
      slug: slugify(req.body.name.toLowerCase()),
    })
    if(alreadyExist) return res.status(400).send('Title is taken') // the message to be made more user friendly
    
    const course = await new Course({ // creating a course async if it isn't alreay found 
      slug: slugify(req.body.name), // get the course title 
      instructor: req.user._id, // specifying the instructor who created the course through his id
      ...req.body, // getting all the remaining details 
    }).save(); // therefore saving the whole thing 
    res.json(course) // sending back the details to the UI in form of json
  }catch(err){
    console.log(err)
    return res.status(400).send('Course create failed. Try again.')
  }
}

export const read = async (req,res) =>{ // this function retrieves a course upon receiving requires params (course name and the the insructor who created it)
  try{
    const course = await Course.findOne({slug: req.params.slug})
                               .populate(
                                 'instructor',
                                 '_id name'
                                 ).exec()
    res.json(course)
  }catch(err){
    console.log(err)
  }
}

export const uploadVideo = async (req,res) => { // uploading a video 
  try{

    if(req.user._id != req.params.instructorId){ // only instructor has the permission to upload a video
      return res.status(400).send('Unauthorized')
    }

    const {video} = req.files // this is the issue bcz it makes all files be uploaded 
    // console.log(video)
    if(!video) return res.status(400).send('No video') // only video should be uploaded 

    // video params
    const params = { // specifying the params of video before uploading it 
      Bucket: "clovimy-bucket",
      Key: `${nanoid()}.${video.type.split('/')[1]}`, // what is this?
      Body:  readFileSync(video.path),
      ACL: 'public-read',  // this is really critical and it should be configured in another way. In fact, this can solve our problem
      ContentType: video.type, // what is this type? SOP on this to see what s the type
    }

    // upload to s3
    S3.upload(params, (err, data)=>{ // this uploads through params; otherwise, it captures the error 
      if(err){
        console.log(err)
        res.sendStatus(400)
      }
      console.log(data)
      res.send(data)
    })
  }catch(err){
    console.log(err)
  }
}

export const removeVideo = async (req, res) => { // this simply removes a video... similar logic 
  try {

    if(req.user._id != req.params.instructorId){
      return res.status(400).send('Unauthorized')
    }

    const { Bucket, Key } = req.body;
    // console.log("VIDEO REMOVE =====> ", req.body);

    // video params
    const params = {
      Bucket,
      Key,
    };

    // upload to s3
    S3.deleteObject(params, (err, data) => {
      if (err) {
        console.log(err);
        res.sendStatus(400);
      }
      console.log(data);
      res.send({ ok: true });
    });
  } catch (err) {
    console.log(err);
  }
};


export const addLesson = async(req,res) =>{ // adding a lesson 
  try{
    const {slug, instructorId} = req.params  // instructorId is required obviously because we need an instructor to create the course
    const {title, content, video} = req.body // course content 

    if(req.user._id != instructorId){  // similar authorization logic 
      return res.status(400).send('Unauthorized')
    }

    const updated = await Course.findOneAndUpdate( // since lesson is part of a course, adding a lesson technically means updating the course
      {slug},
      {
        $push: {lessons: {title, content, video, slug: slugify(title )}}
      },
      {new: true}
    ).populate('instructor', '_id name').exec()

    res.json(updated)

  }catch(err){
    console.log(err)
    return res.status(400).send('Add lesson failed')
  }
}

export const update = async (req, res) => {
  try{
    const {slug} = req.params;
    // console.log(slug); 
    const course = await Course.findOne({slug}).exec();
    // console.log('Course Found => ', course);
    if(req.user._id != course.instructor){
      return res.status(400).send('Unauthorised');
    }

    const updated = await Course.findOneAndUpdate(
      {slug}, 
      req.body, 
      {new:true,}
    ).exec();
    
    res.json(updated);
  } catch (err){
    console.log(err);
    return res.status(400).send(err.message);
  }
};

export const removeLesson = async (req, res) => {
  const { slug, lessonId } = req.params;
  const course = await Course.findOne({ slug }).exec();
  if (req.user._id != course.instructor) {
    return res.status(400).send("Unauthorized");
  }

  const deletedCourse = await Course.findByIdAndUpdate(course._id, {
    $pull: { lessons: { _id: lessonId } },
  }).exec();

  res.json({ ok: true });
};

export const updateLesson = async (req, res) => {
  try{
    // console.log("Lesson Updated", req.body);
    const {slug} = req.params;
    const {_id, title, content, video, free_preview} = req.body;
    const course = await Course.findOne({slug}).select('instructor').exec();
    
    if(course.instructor._id != req.user._id){
      return res.status(400).send('Unauthorised');
    }

    const updated = await Course.updateOne(
      {'lessons._id': _id}, 
      {
        $set: {
          'lessons.$.title': title,
          'lessons.$.content': content,
          'lessons.$.video': video,
          'lessons.$.free_preview': free_preview,
        },
      },
      {new: true}
    ).exec();
    console.log('Updated', updated);
    res.json({ok: true});
  }
  catch(err){
    console.log(err);
    return res.status(400).send('Update lesson failed');
  }
};

export const publishCourse = async (req, res) => {
try{
   const {courseId} = req.params
   const course = await Course.findById(courseId).select('instructor').exec()
   if(course.instructor._id != req.user._id){
    return res.status(400).send('Unauthorised');
  }
    const updated = await Course.findByIdAndUpdate(
      courseId, 
      {published: true},
      {new: true}
      ).exec()
      res.json(updated)
  }catch(err){
    console.log(err)
    return res.status(400).send('Publish course failed')
  }

}


export const unpublishCourse = async (req, res) => {
  try {
    const {courseId} = req.params
   const course = await Course.findById(courseId).select('instructor').exec()
   if(course.instructor._id != req.user._id){
    return res.status(400).send('Unauthorised');
  }
    const updated = await Course.findByIdAndUpdate(
      courseId, 
      {published: false},
      {new: true}
      ).exec()
      res.json(updated)
  } catch (error) {
    console.log(error)
    return res.status(400).send('Unpublish course failed')
  }
} 

export const courses = async (req,res) =>{
  const all = await Course.find({
    published: true
  }).populate('instructor','_id name')
  .exec()
  res.json(all)
}

export const checkEnrollment = async(req, res) => {
  const {courseId} = req.params

  // find courses of the currently logged in user
  const user = await User.findById(req.user._id).exec()
  // check if course id is found in user courses array
  let ids = []
  let length = user.courses && user.courses.length 
  for (let i = 0; i < length; i++){
    ids.push(user.courses[i].toString())
  }
  res.json({
    status: ids.includes(courseId),
    course: await Course.findById(courseId).exec()
  })
}

export const freeEnrollment = async (req, res) =>{
  try{
    const course = await Course.findById(req.params.courseId).exec()
    const result = await User.findByIdAndUpdate(req.user._id,{
      $addToSet: {
        courses: course._id
      }
    },
    {new: true}
    ).exec()
    res.json({
      message: 'Congratulations! You can now begin the course',
      course,
    })
  }catch(err){
    console.log('enrollment err',err)
    return res.status(400).send('Enrollment create failed')
  }
}

export const userCourses = async (req, res) =>{
  const user = await User.findById(req.user._id).exec()
  const courses = await Course.find({_id: {$in: user.courses}}).populate('instructor','_id name').exec()
  res.json(courses);
}

export const markCompleted = async (req,res) => {
  const {courseId, lessonId} = req.body
  // console.log(courseId, lessonId)
  // check if user with that course is already created

  const existing = await Completed.findOne({
    users: req.user._id,
    course: courseId,
  }).exec()

  if(existing){
    // update
      const updated = await Completed.findOneAndUpdate({
        user: req.user._id,
        course: courseId,
      }, {
        $addToSet: {
          lessons: lessonId
        }
      }).exec()
      res.json({ok: true})
  }else{
    // create
    const created = await new Completed({
      user: req.user._id,
      course: courseId,
      lessons: lessonId,
    }).save()
    res.json({ok:true})
  }
}

export const listCompleted = async(req, res) => {
  try {
    const list = await Completed.findOne({
      user: req.user._id,
      course: req.body.courseId
    }).exec()
    list && res.json(list.lessons)
  } catch (error) {
    console.log(error)
  }
}

export const markIncompleted = async(req, res) => {
  try {
    const {courseId, lessonId} = req.body

    const updated = await Completed.findOneAndUpdate({
      user: req.user._id,
      course: courseId,
    },{
      $pull: {
        lessons: lessonId
      }
    }).exec()
    res.json({ok:true})
  } catch (error) {
    console.log(error)
  }
}