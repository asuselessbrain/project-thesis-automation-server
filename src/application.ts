import express, { Application, Response, Request } from 'express';
import { StudentRoutes } from './app/modules/student/student.route';
import { UserRoutes } from './app/modules/user/user.route';
import { adminRouter } from './app/modules/admin/admin.route';
import { teacherRouter } from './app/modules/teacher/teacher.route';
import { ProjectThesisRoutes } from './app/modules/projectThesis/projectThesis.route';
import { AuthRoutes } from './app/modules/auth/auth.route';
import { globalErrorHandler } from './app/errors/globalErrorHandler';
import cors from "cors"
import { CourseRoutes } from './app/modules/course/course.route';
import { CourseTeacherRoutes } from './app/modules/courseTeacher/courseTeacher.route';
import { TaskRoutes } from './app/modules/task/task.route';

const app: Application = express();


app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))

app.use('/api/v1/students', StudentRoutes);
app.use('/api/v1/users', UserRoutes);
app.use('/api/v1/admins', adminRouter);
app.use('/api/v1/teachers', teacherRouter);
app.use('/api/v1/courses', CourseRoutes);
app.use('/api/v1/course-teachers', CourseTeacherRoutes)
app.use('/api/v1/project-thesis', ProjectThesisRoutes);
app.use('/api/v1/tasks', TaskRoutes);
app.use('/api/v1/auth', AuthRoutes);

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "CSIT Inventory Server is Running",
        DevelopBy: "Arfan Ahmed",
        version: "1.0.0",
    });
})

app.use(globalErrorHandler)
app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: 'Page not found',
    })
})

export default app;