package com.example.studentPortal.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "modules")
public class Module {

    // ID automatically sets an ID
    // Even though the moduleCode is unique, when updating the studentCount after
    // adding a student, this module saves as a new module
    // In order to avoid that ID is needed
    @Id
    private String id;
    private String moduleCode;
    private String moduleName;
    private int studentCount;
    private List<Component> components;

    public Module() {
    }

    public Module(String code, String name, List<Component> components, int studentCount) {
        this.moduleCode = code;
        this.moduleName = name;
        this.components = components;
        this.studentCount = studentCount;
    }

    // getters and setters for the variables
    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getModuleCode() {
        return moduleCode;
    }

    public String getModuleName() {
        return moduleName;
    }

    public List<Component> getComponents() {
        return components;
    }

    public void setModuleCode(String code) {
        this.moduleCode = code;
    }

    public int getStudentCount() {
        return studentCount;
    }

    public void setStudentCount(int studentCount) {
        this.studentCount = studentCount;
    }

    public void setModuleName(String name) {
        this.moduleName = name;
    }

    public void setComponents(List<Component> components) {
        this.components = components;
    }
}
