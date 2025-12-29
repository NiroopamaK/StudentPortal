export enum DefaultComponents {
  CourseWork1 = 'CourseWork 1',
  CourseWork2 = 'CourseWork 2',
  CourseWork3 = 'CourseWork 3',
  FinalExam = 'Final Exam',
}

export const DefaultComponentWeights: Record<DefaultComponents, number> = {
  [DefaultComponents.CourseWork1]: 10,
  [DefaultComponents.CourseWork2]: 20,
  [DefaultComponents.CourseWork3]: 30,
  [DefaultComponents.FinalExam]: 40,
};
