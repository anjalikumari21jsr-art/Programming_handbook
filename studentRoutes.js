const express = require("express");
const router = express.Router();

const Student = require("../models/Student");

// ===============================
// CREATE - Add a new student
// ===============================
router.post("/", async (req, res) => {
    try {
        const student = new Student(req.body);

        const savedStudent = await student.save();

        res.status(201).json({
            success: true,
            message: "Student added successfully",
            data: savedStudent
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// ===============================
// READ - Get all students
// ===============================
router.get("/", async (req, res) => {
    try {
        const students = await Student.find().sort({
            createdAt: -1
        });

        res.json({
            success: true,
            data: students
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ===============================
// SEARCH - Search students
// ===============================
router.get("/search/:keyword", async (req, res) => {
    try {
        const keyword = req.params.keyword;

        const students = await Student.find({
            $or: [
                {
                    name: {
                        $regex: keyword,
                        $options: "i"
                    }
                },
                {
                    rollNo: {
                        $regex: keyword,
                        $options: "i"
                    }
                },
                {
                    course: {
                        $regex: keyword,
                        $options: "i"
                    }
                }
            ]
        });

        res.json({
            success: true,
            data: students
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ===============================
// UPDATE - Update a student
// ===============================
router.put("/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.json({
            success: true,
            message: "Student updated successfully",
            data: student
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// ===============================
// DELETE - Delete a student
// ===============================
router.delete("/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(
            req.params.id
        );

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.json({
            success: true,
            message: "Student deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;