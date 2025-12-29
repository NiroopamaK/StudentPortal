package com.example.studentPortal.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.example.studentPortal.service.ModuleService;
import com.example.studentPortal.model.Module;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/modules")
@CrossOrigin(origins = "http://localhost:4200")
public class ModuleController {

    private final ModuleService moduleService;

    public ModuleController(ModuleService moduleService) {
        this.moduleService = moduleService;
    }

    @PostMapping
    public ResponseEntity<Module> createModule(@RequestBody Module module) {
        Module savedModule = moduleService.saveModule(module);
        return ResponseEntity.ok(savedModule);
    }

    @GetMapping
    public ResponseEntity<List<Module>> getAllModules() {
        return ResponseEntity.ok(moduleService.getAllModules());
    }

    @GetMapping("/getByCode")
    public ResponseEntity<Module> getModuleByCode(@RequestParam String moduleCode) {
        return ResponseEntity.ok(moduleService.getModuleByModuleCode(moduleCode));
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteModule(@RequestParam String moduleCode) {
        moduleService.deleteModuleByModuleCode(moduleCode);
        return ResponseEntity.noContent().build();
    }

}
