export const taskResubmissionTemplate = (
  isTaskExist: any,
  review: string
) => {
  return `
    <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f9fafb; padding: 24px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb;">
        
        <!-- Header -->
        <div style="background-color: #f59e0b; color: #ffffff; padding: 20px;">
          <h2 style="margin: 0; font-size: 20px;">Task Resubmission Allowed 🔁</h2>
        </div>

        <!-- Body -->
        <div style="padding: 24px; color: #374151;">
          <p style="font-size: 14px; margin-bottom: 16px;">
            Dear <strong>${isTaskExist.projectThesis.student.name}</strong>,
          </p>

          <p style="font-size: 14px; margin-bottom: 16px;">
            Your submitted task has been reviewed. Based on the evaluation, you are
            allowed to <strong>resubmit</strong> the task after making the required
            improvements.
          </p>

          <!-- Task Info -->
          <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 14px; margin: 16px 0;">
            <p style="margin: 0; font-size: 14px;">
              <strong>📌 Task Name:</strong> ${isTaskExist.title}<br />
              <strong>📂 Project:</strong> ${isTaskExist.projectThesis.title}<br />
              <strong>📝 Status:</strong> Resubmission Required
            </p>
          </div>

          <!-- Teacher Review -->
          <div style="background-color: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 14px; margin: 16px 0;">
            <p style="margin: 0 0 6px 0; font-size: 14px;">
              <strong>👨‍🏫 Teacher Feedback:</strong>
            </p>
            <p style="margin: 0; font-size: 14px; line-height: 1.6;">
              ${review || "No additional feedback was provided."}
            </p>
          </div>

          <p style="font-size: 14px; margin-bottom: 16px;">
            Please carefully review the feedback above and update your submission
            accordingly before resubmitting the task.
          </p>

          <p style="font-size: 14px;">
            You can resubmit the task from your dashboard. Make sure to submit it
            within the given timeline.
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
    </div>
  `;
};
