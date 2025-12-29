package com.example.studentPortal.model;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "students")
public class Student {

    private String studentId;
    private String studentName;
    private String moduleCode;
    private String dob;
    private String age;
    private double rawScore;
    private double overallScore;
    private String category;

    Student(String studentId, String studentName, String moduleCode, String dob, String age, double rawScore,
            double overallScore, String category) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.moduleCode = moduleCode;
        this.dob = dob;
        this.age = age;
        this.rawScore = rawScore;
        this.overallScore = overallScore;
        this.category = category;
    }

    // Getter and Setter for studentId
    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    // Getter and Setter for studentName
    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    // Getter and Setter for moduleCode
    public String getModuleCode() {
        return moduleCode;
    }

    public void setModuleCode(String moduleCode) {
        this.moduleCode = moduleCode;
    }

    // Getter and Setter for dob
    public String getDob() {
        return dob;
    }

    public void setDob(String dob) {
        this.dob = dob;
    }

    // Getter and Setter for age
    public String getAge() {
        return age;
    }

    public void setAge(String age) {
        this.age = age;
    }

    // Getter and Setter for rawScore
    public double getRawScore() {
        return rawScore;
    }

    public void setRawScore(double rawScore) {
        this.rawScore = rawScore;
    }

    // Getter and Setter for overallScore
    public double getOverallScore() {
        return overallScore;
    }

    public void setOverallScore(double overallScore) {
        this.overallScore = overallScore;
    }

    // Getter and Setter for category
    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

}
