package com.example.studentPortal.model;

public class Component {

    private String componentName;
    private int componentWeight;

    public Component() {
    }

    public Component(String componentName, int componentWeight) {
        this.componentName = componentName;
        this.componentWeight = componentWeight;
    }

    public String getComponentName() {
        return componentName;
    }

    public int getComponentWeight() {
        return componentWeight;
    }

    public void setComponentName(String componentName) {
        this.componentName = componentName;
    }

    public void setComponentWeight(int componentName) {
        this.componentWeight = componentName;
    }
}
