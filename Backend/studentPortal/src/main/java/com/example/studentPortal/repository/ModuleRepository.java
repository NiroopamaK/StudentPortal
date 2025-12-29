package com.example.studentPortal.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import com.example.studentPortal.model.Module;

@Repository
public interface ModuleRepository extends MongoRepository<Module, String> {

    Module findByModuleCode(String moduleCode);

    void deleteByModuleCode(String moduleCode);
}
