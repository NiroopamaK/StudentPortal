package com.example.studentPortal.controller;

import org.springframework.web.bind.annotation.RestController;

import com.example.studentPortal.model.Student;
import com.example.studentPortal.service.StudentService;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:4200")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping
    public ResponseEntity<Student> saveStudent(@RequestBody Student student) {
        Student savedStudent = studentService.saveStudent(student);
        return ResponseEntity.ok(savedStudent);
    }

    @PostMapping("/loadFromFile")
    public ResponseEntity<List<Student>> saveStudents(
            @RequestBody List<Student> students) {

        List<Student> savedStudents = studentService.saveStudents(students);
        return ResponseEntity.ok(savedStudents);
    }

    @GetMapping
    public ResponseEntity<List<Student>> getStudents(@RequestParam String moduleCode) {
        return ResponseEntity.ok(studentService.getAllStudents(moduleCode));
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteStudent(@RequestParam String studentId) {
        studentService.deleteStudent(studentId);
        return ResponseEntity.noContent().build();
    }

}
