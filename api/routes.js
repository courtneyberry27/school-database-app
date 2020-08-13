'use strict'

const express = require('express');
const {check, validationResult} = require('express-validator');
const middleware = require('./middleware') // database Middleware
const bcryptjs = require('bcryptjs');
const { models } = require('./db');

//SET UP ROUTER
const router = express.Router();

//MODELS
const { User, Course } = models;

/*************************
 * ASYNC FUNCTION HANDLER
 *************************/
function asyncHandler(cb) {
    return async (req, res, next) => {
        try {
            await cb(req, res, next)
        } catch (error) {
            next(error)
        }
    }
}

/*************************
 * USERS ROUTES
 *************************/
//GET /USERS
router.get('/users', middleware.authenticateUser, asyncHandler(async(req, res) => {
    const user = req.currentUser

    res.json({
        Id: user.id,
        Name: `${user.firstName} ${user.lastName}`,
        Email: user.emailAddress,
    });
}));

//POST /USERS
router.post('/users', [
    check('firstName')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a "First Name"'),
  check('lastName')
    .exists({ checknull: true, checkFalsy: true })
    .withMessage('Please provide a "Last Name"'),
  check('emailAddress')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "email"')
    .isEmail()
    .withMessage('Please provide a valid email address for "email"'),
  check('password')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "password"')
    .isLength({ min: 8, max: 20 })
    .withMessage('Please provide a value for "password" that is between 8 and 20 characters in length'),
],asyncHandler(async(req, res) => { 
    const errors = validationResult(req);
    const user = req.body;

    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
    
        return res.status(400).json({ errors: errorMessages });
    }

    
    //VALIDATE EMAIL IS UNIQUE
    const uniqueEmail = await middleware.isUniqueEmail(user.emailAddress)
    if(!uniqueEmail) {
        console.log('notunique"');
        res.status(400).json({ message: "Email already in use. Please provide a unique email." });
    }

    //HASH PASSWORD
    if(user.password) {
        user.password = bcryptjs.hashSync(user.password);
    }

    try {
        //ADD USER TO DATABASE
        await User.create(user);
        //LOCATION
        res.location(`/`);
        //STATUS 201 OR 400
        res.status(201).end();
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            res.status(400).location('/').json({error: error.errors[0].message})
        } else {
            throw error
        }
    }
        
}));

/*************************
 * COURSES ROUTES
 *************************/

//GET /COURSES
router.get("/courses", asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
        include: {
            model: User,
            as: "user",
            attributes: ["id", "firstName", "lastName", "emailAddress"]
        },
        attributes: ["id", "title", "description", "estimatedTime", "materialsNeeded"]
    });
    res.json(courses);
}))

//GET /COURSES/:ID
router.get("/courses/:id", asyncHandler(async(req, res) => {
    const courseId = req.params.id;
    const course = await Course.findByPk(courseId, {
        include: {
            model: User,
            as: "user",
            attributes: ["id", "firstName", "lastName", "emailAddress"]
        },
        attributes: ["id", "title", "description", "estimatedTime", "materialsNeeded"]
    })

    if (course) {
        res.json(course)
    } else {
        res.status(404).json({message: "couldn't find course by id provided"})
    }
}))

//POST /COURSES
router.post("/courses", [
    check("title")
        .exists()
        .withMessage("Please provide value from 'title'"),
    check("description")
        .exists()
        .withMessage("Please provide value for 'description'"),
    check("userId")
        .exists()
        .withMessage("Please provide value for 'userId'")
], middleware.authenticateUser, asyncHandler(async(req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);

        return res.status(400).json({ errors: errorMessages });
    };

    const course = req.body;

    //ADD COURSE TO DATABASE
    const newCourse = await Course.create(course);
    const courseId = newCourse.dataValues.id

    //STATUS 201 
    res.status(201).location(`/courses/${courseId}`).end();

}));

//UPDATE COURSES
router.put('/courses/:id', [
    check("title")
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please provide "title"'),
    check("description")
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please provide "description"'),
    ], middleware.authenticateUser, asyncHandler( async(req, res) => {
      const errors = validationResult(req);

      //VALIDATION
      if (!errors.isEmpty()) {
          const errorMessages = errors.array().map(error => error.msg);
        
          return res.status(400).json({ errors: errorMessages });
      };

      const course = await Course.findByPk(req.params.id);
      const user = req.currentUser;
    
      if (course.userId === user.id) {
        await models.Course.update({
          title: req.body.title,
          description: req.body.description,
          estimatedTime: req.body.estimatedTime,
          materialsNeeded: req.body.materialsNeeded,
        },
        { where: { id: req.params.id } }
        );

        res.status(204).end();  
      } else {
      res.status(403).json("User does not have authorization to update the requested course");
      };
    }
  ));

//DELETE /COURSES/:ID
router.delete('/courses/:id', middleware.authenticateUser, asyncHandler( async(req, res) => {
    const course = await models.Course.findOne({where: { id: req.params.id }});
    const user = req.currentUser;

    if (course.userId === user.id) {
      await models.Course.destroy(
        { where: { id: req.params.id } }
      );
      res.status(204).end();  
    } else {
      res.status(403).json("User doesn't have authorization to delete the requested course");
    };
  }));

module.exports = router;