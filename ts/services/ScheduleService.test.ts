import { ScheduleService } from './ScheduleService';
import { Professor } from '../types/Professor';
import { Lesson } from '../types/Lesson';
import {NotFoundError} from "../types/Errors/NotFoundError";

describe('ScheduleService', () => {
    let service: ScheduleService;

    beforeEach(() => {
        service = new ScheduleService();
    });

    test('should add a professor', () => {
        const professor: Professor = { id: 1, name: 'John Doe', department: 'Mathematics' };
        service.addProfessor(professor);

        expect(service['professors']).toContain(professor);
    });

    test('should add a lesson if valid', () => {
        const lesson: Lesson = {
            lessonId: 1,
            courseId: 1,
            professorId: 1,
            classroomNumber: '101',
            dayOfWeek: 'Monday',
            timeSlot: '8:30-10:00'
        };
        const result = service.addLesson(lesson);

        expect(result).toBe(true);
        expect(service['schedule']).toContain(lesson);
    });

    test('should not add a lesson if it conflicts with existing lesson', () => {
        const lesson1: Lesson = {
            lessonId: 1,
            courseId: 1,
            professorId: 1,
            classroomNumber: '101',
            dayOfWeek: 'Monday',
            timeSlot: '8:30-10:00'
        };

        const lesson2: Lesson = {
            lessonId: 2,
            courseId: 2,
            professorId: 1,
            classroomNumber: '101',
            dayOfWeek: 'Monday',
            timeSlot: '8:30-10:00'
        };

        service.addLesson(lesson1);
        const result = service.addLesson(lesson2);

        expect(result).toBe(false);
        expect(service['schedule']).toHaveLength(1);
    });

    test('should find available classrooms', () => {
        const lesson: Lesson = {
            lessonId: 1,
            courseId: 1,
            professorId: 1,
            classroomNumber: '101',
            dayOfWeek: 'Monday',
            timeSlot: '8:30-10:00'
        };

        service['classrooms'] = [
            { number: '101', capacity: 30, hasProjector: true },
            { number: '102', capacity: 30, hasProjector: true }
        ];

        service.addLesson(lesson);

        const availableClassrooms = service.findAvailableClassroom('8:30-10:00', 'Monday');

        expect(availableClassrooms).toEqual(['102']);
    });

    test('should return professor schedule', () => {
        const lesson: Lesson = {
            lessonId: 1,
            courseId: 1,
            professorId: 1,
            classroomNumber: '101',
            dayOfWeek: 'Monday',
            timeSlot: '8:30-10:00'
        };

        service.addLesson(lesson);
        const schedule = service.getProfessorSchedule(1);

        expect(schedule).toContain(lesson);
    });

    test('should validate lesson without conflict', () => {
        const lesson: Lesson = {
            lessonId: 1,
            courseId: 1,
            professorId: 1,
            classroomNumber: '101',
            dayOfWeek: 'Monday',
            timeSlot: '8:30-10:00'
        };

        const conflict = service.validateLesson(lesson);

        expect(conflict).toBeNull();
    });

    test('should validate lesson with professor conflict', () => {
        const lesson1: Lesson = {
            lessonId: 1,
            courseId: 1,
            professorId: 1,
            classroomNumber: '101',
            dayOfWeek: 'Monday',
            timeSlot: '8:30-10:00'
        };

        const lesson2: Lesson = {
            lessonId: 2,
            courseId: 2,
            professorId: 1,
            classroomNumber: '102',
            dayOfWeek: 'Monday',
            timeSlot: '8:30-10:00'
        };

        service.addLesson(lesson1);
        const conflict = service.validateLesson(lesson2);

        expect(conflict).not.toBeNull();
        expect(conflict?.type).toBe('ProfessorConflict');
    });

    test('should calculate classroom utilization', () => {
        const lesson: Lesson = {
            lessonId: 1,
            courseId: 1,
            professorId: 1,
            classroomNumber: '101',
            dayOfWeek: 'Monday',
            timeSlot: '8:30-10:00'
        };

        service.addLesson(lesson);
        const utilization = service.getClassroomUtilization('101');

        expect(utilization).toBeGreaterThan(0);
    });

    test('should return the most popular course type', () => {
        service['courses'] = [
            { id: 1, name: 'Math 101', type: 'Lecture' },
            { id: 2, name: 'Physics 101', type: 'Lecture' },
            { id: 3, name: 'Chemistry 101', type: 'Lab' }
        ];

        const mostPopular = service.getMostPopularCourseType();

        expect(mostPopular).toBe('Lecture');
    });

    test('should reassign classroom successfully', () => {
        const lesson: Lesson = {
            lessonId: 1,
            courseId: 1,
            professorId: 1,
            classroomNumber: '101',
            dayOfWeek: 'Monday',
            timeSlot: '8:30-10:00'
        };

        service.addLesson(lesson);
        const result = service.reassingClassroom(1, '102');

        expect(result).toBe(true);
        expect(service['schedule'][0].classroomNumber).toBe('102');
    });

    test('should cancel a lesson', () => {
        const lesson: Lesson = {
            lessonId: 1,
            courseId: 1,
            professorId: 1,
            classroomNumber: '101',
            dayOfWeek: 'Monday',
            timeSlot: '8:30-10:00'
        };

        service.addLesson(lesson);
        service.cancelLesson(1);

        expect(service['schedule']).not.toContain(lesson);
    });

    test('should throw NotFoundError when lesson is not found', () => {
        expect(() => {
            service.getLesson(999);
        }).toThrow(new NotFoundError("Lesson not found"));
    });

    test('should return false when reassigning classroom for a occupied classroom', () => {
        const lesson1: Lesson = {
            lessonId: 1,
            courseId: 1,
            professorId: 1,
            classroomNumber: '101',
            dayOfWeek: 'Monday',
            timeSlot: '8:30-10:00'
        };
        const lesson2: Lesson = {
            lessonId: 2,
            courseId: 2,
            professorId: 2,
            classroomNumber: '102',
            dayOfWeek: 'Monday',
            timeSlot: '8:30-10:00'
        };

        service.addLesson(lesson1);
        service.addLesson(lesson2);
        const result = service.reassingClassroom(1, '102');
        expect(result).toBe(false);
    });
});
