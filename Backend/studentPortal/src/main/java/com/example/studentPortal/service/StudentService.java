package com.example.studentPortal.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.example.studentPortal.model.Student;
import com.example.studentPortal.repository.StudentRepository;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final ModuleService moduleService;

    public StudentService(StudentRepository studentRepository, ModuleService moduleService) {
        this.studentRepository = studentRepository;
        this.moduleService = moduleService;
    }

    public Student saveStudent(Student student) {
        Student savedStudent = studentRepository.save(student);
        moduleService.incrementStudentCount(student.getModuleCode(), 1);
        return savedStudent;
    }

    public List<Student> saveStudents(List<Student> students) {
        moduleService.incrementStudentCount(students.get(0).getModuleCode(), students.size());
        return studentRepository.saveAll(students);
    }

    public List<Student> getAllStudents(String moduleCode) {
        return studentRepository.findByModuleCode(moduleCode);
    }

    public void deleteStudent(String studentId) {
        Student student = studentRepository.findByStudentId(studentId);
        moduleService.decrementStudentCount(student.getModuleCode());
        studentRepository.deleteByStudentId(studentId);
    }
}
