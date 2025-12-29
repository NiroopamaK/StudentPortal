package com.example.studentPortal.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.studentPortal.model.Student;
import java.util.List;

@Repository
public interface StudentRepository extends MongoRepository<Student, String> {

    List<Student> findByModuleCode(String moduleCode);

    void deleteByStudentId(String studentId);

    Student findByStudentId(String studentId);

}
