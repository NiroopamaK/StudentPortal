import { component } from '../constants/component.model';

export interface Module {
  moduleCode: string;
  moduleName: string;
  studentCount: number;
  components: component[];
}
