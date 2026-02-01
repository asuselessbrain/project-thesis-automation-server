export const taskFailedTemplate = (isTaskExist: any, review?: string) => {
  return `
    <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f9fafb; padding: 24px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb;">
        
        <!-- Header -->
        <div style="background-color: #dc2626; color: #ffffff; padding: 20px;">
          <h2 style="margin: 0; font-size: 20px;">Task Marked as Failed ❌</h2>
        </div>

        <!-- Body -->
        <div style="padding: 24px; color: #374151;">
          <p style="font-size: 14px; margin-bottom: 16px;">
            Dear <strong>${isTaskExist.projectThesis.student.name}</strong>,
          </p>

          <p style="font-size: 14px; margin-bottom: 16px;">
            After reviewing your submission, the following task has been
            <strong>marked as failed</strong> as it does not meet the minimum
            evaluation requirements.
          </p>

          <!-- Task Info -->
          <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 14px; margin: 16px 0;">
            <p style="margin: 0; font-size: 14px;">
              <strong>📌 Task Name:</strong> ${isTaskExist.title}<br />
              <strong>📂 Project:</strong> ${isTaskExist.projectThesis.title}<br />
              <strong>📝 Status:</strong> Failed
            </p>
          </div>

          ${
            review
              ? `
            <!-- Teacher Review -->
            <div style="margin-top: 16px;">
              <p style="font-size: 14px; font-weight: 600; margin-bottom: 8px;">
                🧑‍🏫 Teacher Feedback:
              </p>
              <div style="background-color: #f3f4f6; padding: 12px; border-radius: 6px; font-size: 14px;">
                ${review}
              </div>
            </div>
          `
              : ""
          }

          <p style="font-size: 14px; margin-top: 16px;">
            You are advised to carefully review the feedback and improve your
            understanding of the task requirements. For further clarification,
            please contact your supervisor.
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
