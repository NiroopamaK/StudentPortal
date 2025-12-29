package com.example.studentPortal.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.example.studentPortal.model.Module;

import com.example.studentPortal.repository.ModuleRepository;

@Service
public class ModuleService {

    private final ModuleRepository moduleRepository;

    public ModuleService(ModuleRepository moduleRepository) {
        this.moduleRepository = moduleRepository;
    }

    public Module saveModule(Module module) {
        return moduleRepository.save(module);
    }

    public List<Module> getAllModules() {
        return moduleRepository.findAll();
    }

    public Module getModuleByModuleCode(String moduleCode) {
        return moduleRepository.findByModuleCode(moduleCode);
    }

    public void deleteModuleByModuleCode(String moduleCode) {
        moduleRepository.deleteByModuleCode(moduleCode);
    }

    // when creating the module, student count is set to zero
    // when adding a new student, the student count has to be incremented
    public void incrementStudentCount(String moduleCode, int increment) {
        Module module = moduleRepository.findByModuleCode(moduleCode);
        module.setStudentCount(module.getStudentCount() + increment);
        moduleRepository.save(module);
    }

    // when deleting a student, student count has to be reduced by one
    public void decrementStudentCount(String moduleCode) {
        Module module = moduleRepository.findByModuleCode(moduleCode);
        module.setStudentCount(module.getStudentCount() - 1);
        moduleRepository.save(module);
    }

}
