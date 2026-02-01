export const taskCompletionTemplate = (isTaskExist: any) => {
  return `<div style="font-family: Arial, Helvetica, sans-serif; background-color: #f9fafb; padding: 24px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb;">
        
        <!-- Header -->
        <div style="background-color: #16a34a; color: #ffffff; padding: 20px;">
          <h2 style="margin: 0; font-size: 20px;">Task Completed 🎉</h2>
        </div>

        <!-- Body -->
        <div style="padding: 24px; color: #374151;">
          <p style="font-size: 14px; margin-bottom: 16px;">
            Dear <strong>${isTaskExist.projectThesis.student.name}</strong>,
          </p>

          <p style="font-size: 14px; margin-bottom: 16px;">
            We are happy to inform you that the following task has been successfully
            reviewed and marked as <strong>Completed</strong>.
          </p>

          <!-- Task Info -->
          <div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 14px; margin: 16px 0;">
            <p style="margin: 0; font-size: 14px;">
              <strong>📌 Task Name:</strong> ${isTaskExist.title}<br />
              <strong>📂 Project:</strong> ${isTaskExist.projectThesis.title}<br />
              <strong>✔ Status:</strong> Completed
            </p>
          </div>

          <p style="font-size: 14px; margin-bottom: 16px;">
            Your performance has been evaluated and the project progress has been
            updated accordingly. If feedback is available, please check your dashboard
            for details.
          </p>

          <p style="font-size: 14px;">
            Keep up the great work and continue moving forward with your project.
          </p>

          <p style="margin-top: 24px; font-size: 14px;">
            Best regards,<br />
            <strong>Project Supervision Team</strong>
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f3f4f6; padding: 16px; text-align: center; font-size: 12px; color: #6b7280;">
          This is an automated message. Please do not reply to this email.
        </div>
      </div>
    </div>`;
};
