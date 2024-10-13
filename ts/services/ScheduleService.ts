import {Course} from "../types/Course";
import {Lesson} from "../types/Lesson";
import {Classroom} from "../types/Classroom";
import {Professor} from "../types/Professor";
import {DayOfWeek} from "../types/DayOfWeek";
import {CourseType} from "../types/CourseType";
import {ScheduleConflict} from "../types/Errors/ScheduleConflict";
import {NotFoundError} from "../types/Errors/NotFoundError";

export class ScheduleService {
    private courses: Course[];
    private schedule: Lesson[];
    private classrooms: Classroom[];
    private professors: Professor[];
    constructor() {
        this.courses = [];
        this.schedule = [];
        this.classrooms = [];
        this.professors = [];
    }

    public addProfessor(professor: Professor): void {
        this.professors.push(professor);
    }

    public addLesson(lesson: Lesson): boolean {
        if (this.validateLesson(lesson)) {
            return false;
        }
        this.schedule.push(lesson);
        return true;
    }

    public getLesson(lessonId: number): Lesson {
        const lesson = this.schedule.find((schedule) => schedule.lessonId === lessonId);
        if (!lesson) {
            throw new NotFoundError("Lesson not found");
        }
        return lesson;
    }

    public findAvailableClassroom(timeSlot: string, dayOfWeek: DayOfWeek): string[] {
        const occupiedClassrooms: string[] = this.schedule
            .filter((lesson: Lesson) => lesson.timeSlot === timeSlot && lesson.dayOfWeek === dayOfWeek)
            .map((lesson: Lesson) => lesson.classroomNumber);

        return this.classrooms
            .map((classroom: Classroom) => classroom.number)
            .filter((classroomNumber: string) => !occupiedClassrooms.includes(classroomNumber))
    }

    public getProfessorSchedule(professorId: number): Lesson[] {
        return this.schedule.filter((lesson: Lesson) => lesson.professorId === professorId);
    }

    public validateLesson(lesson: Lesson): ScheduleConflict | null {
        const firstConflict: Lesson | undefined = this.schedule.find((scheduleLesson: Lesson) =>
            scheduleLesson.timeSlot === lesson.timeSlot &&
            (scheduleLesson.professorId === lesson.professorId ||
                scheduleLesson.classroomNumber === lesson.classroomNumber)
        );

        if (firstConflict) {
            const type: "ProfessorConflict" | "ClassroomConflict" =
                firstConflict.professorId === lesson.professorId ? "ProfessorConflict" : "ClassroomConflict";

            return {type, lessonDetails: lesson};
        }
        return null;
    }

    public getClassroomUtilization(classroomNumber: string): number {
        const totalLessons: number = this.schedule.filter((lesson: Lesson) => lesson.classroomNumber === classroomNumber).length;
        const totalTimeSlots: number = 5;
        const totalDaysOfWeek: number = 5;

        return totalLessons / totalTimeSlots * totalDaysOfWeek * 100;
    }

    public getMostPopularCourseType(): CourseType {
        const courseTypeCount: { [key: string]: number } = {};

        for (const course of this.courses) {
            if (courseTypeCount[course.type]) {
                courseTypeCount[course.type]++;
            } else {
                courseTypeCount[course.type] = 1;
            }
        }

        const values = Object.values(courseTypeCount);
        const maxValue = Math.max(...values);

        const mostPopularType = Object.keys(courseTypeCount).find(key => courseTypeCount[key] === maxValue);
        return <"Lecture" | "Seminar" | "Lab" | "Practice">mostPopularType;
    }

    public reassingClassroom(lessonId: number, newClassroomNumber: string): boolean {
        const lesson = this.getLesson(lessonId);
            if (lesson && this.validateLesson({...lesson, professorId: -1, classroomNumber: newClassroomNumber}) === null) {
                lesson.classroomNumber = newClassroomNumber;
                return true;
            }
        return false;
    };

    public cancelLesson = (lessonId: number): void => {
        this.schedule = this.schedule.filter((lesson: Lesson) => lesson.lessonId !== lessonId);
    }
}

