const express = require("express");
const router = express.Router();
const multer = require("multer");
const mongoose = require("mongoose");

//load student Schema
require("../Model/Student");
const Student = mongoose.model("student");

//load storage module
const uploadLocal = require("../config/multer");
var upload = multer({ storage: uploadLocal.storage });

//======================all get routes starts here ===========================
router.get("/add-student", (req, res) => {
  res.render("./students/add-student");
});

//students data from database
router.get("/students", (req, res) => {
  Student.find({})
    .sort({ date: "desc" })
    .lean()
    .then((student) => {
      res.render("./students/students", {
        student,
      });
    })
    .catch((err) => console.log(err));
});

//students data from database

// create details Routes
router.get("/student_details/:id", (req, res) => {
  Student.findOne({ _id: req.params.id })
    .lean()
    .then((std_detail) => {
      res.render("./students/student-details", { std_detail: std_detail });
    })
    .catch((err) => console.log(err));
});

//======================all get routes ends here ===========================

//===========================all post routes here ==================================
router.post("/add-student", upload.single("student_photo"), (req, res) => {
  let {
    student_id,
    student_name,
    student_dob,
    student_location,
    student_education,
    student_email,
    student_skills,
    student_phone,
    student_gender,
    student_percentage,
  } = req.body;

  let newStudent = {
    student_photo: req.file,
    student_id,
    student_name,
    student_dob,
    student_location,
    student_education,
    student_email,
    student_phone,
    student_skills,
    student_gender,
    student_percentage,
  };
  // save students info in database
  new Student(newStudent)
    .save()
    .then((student) => {
      res.redirect("/student/students", 304, {
        student: student,
      });
    })
    .catch((err) => console.log(err));
});

module.exports = router;
