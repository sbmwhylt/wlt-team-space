import nodemailer from "nodemailer";

function buildContactEmailHtml({ name, email, subject, message, formData }) {
  const isStructuredData = formData && typeof formData === "object";

  let contentHtml;

  if (isStructuredData) {
    contentHtml = Object.entries(formData)
      .filter(([_, value]) => value)
      .map(
        ([key, value]) => `
        <tr>
          <td class="field-label">${key}</td>
          <td class="field-value">${value}</td>
        </tr>
      `
      )
      .join("");
  } else {
    const content = message || formData;
    contentHtml = `
      <tr>
        <td colspan="2" class="message-content">${
          content || "No message provided"
        }</td>
      </tr>
    `;
  }

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #ffffff;
            padding: 40px 20px;
            color: #1a1a1a;
            line-height: 1.6;
          }
          .email-container {
            max-width: 650px;
            margin: 0 auto;
            background-color: #ffffff;
          }
          .header {
            text-align: center;
            padding: 30px 0;
            border-bottom: 2px solid #e5e5e5;
            margin-bottom: 40px;
          }
          .logo {
            max-width: 200px;
            height: auto;
            margin-bottom: 20px;
          }
          .header-title {
            color: #1a1a1a;
            font-size: 24px;
            font-weight: 600;
            margin-top: 15px;
          }
          .content {
            padding: 0 20px;
          }
          .section {
            margin-bottom: 35px;
          }
          .section-title {
            color: #1a1a1a;
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 1px solid #e5e5e5;
          }
          .info-table {
            width: 100%;
            border-collapse: collapse;
          }
          .info-table tr {
            border-bottom: 1px solid #f5f5f5;
          }
          .info-table tr:last-child {
            border-bottom: none;
          }
          .info-label {
            padding: 12px 0;
            font-size: 13px;
            font-weight: 600;
            color: #666666;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            width: 35%;
            vertical-align: top;
          }
          .info-value {
            padding: 12px 0;
            font-size: 15px;
            color: #1a1a1a;
            font-weight: 400;
          }
          .details-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          .field-label {
            padding: 14px 16px;
            font-size: 13px;
            font-weight: 600;
            color: #666666;
            background-color: #fafafa;
            border: 1px solid #e5e5e5;
            border-right: none;
            width: 35%;
            vertical-align: top;
          }
          .field-value {
            padding: 14px 16px;
            font-size: 15px;
            color: #1a1a1a;
            background-color: #ffffff;
            border: 1px solid #e5e5e5;
            word-break: break-word;
          }
          .message-content {
            padding: 20px;
            font-size: 15px;
            color: #1a1a1a;
            background-color: #fafafa;
            border: 1px solid #e5e5e5;
            white-space: pre-wrap;
            word-wrap: break-word;
            line-height: 1.7;
          }
          .footer {
            margin-top: 50px;
            padding-top: 30px;
            border-top: 2px solid #e5e5e5;
            text-align: center;
          }
          .footer-text {
            color: #666666;
            font-size: 13px;
            line-height: 1.5;
          }
          @media only screen and (max-width: 600px) {
            body {
              padding: 20px 10px;
            }
            .content {
              padding: 0 10px;
            }
            .logo {
              max-width: 160px;
            }
            .header-title {
              font-size: 20px;
            }
            .info-label,
            .field-label {
              display: block;
              width: 100%;
              border-right: 1px solid #e5e5e5;
              padding-bottom: 8px;
            }
            .info-value,
            .field-value {
              display: block;
              width: 100%;
              padding-top: 8px;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <img src="https://ik.imagekit.io/wlt/wlt-static-imgs/wltlogo.png" alt="Why Leave Town" class="logo">
            <div class="header-title">${
              subject || "Contact Form Submission"
            }</div>
          </div>

          <div class="content">
            <div class="section">
              <div class="section-title">Contact Information</div>
              <table class="info-table">
                <tr>
                  <td class="info-label">Name</td>
                  <td class="info-value">${name || "Not provided"}</td>
                </tr>
                <tr>
                  <td class="info-label">Email</td>
                  <td class="info-value">${email || "Not provided"}</td>
                </tr>
              </table>
            </div>

            <div class="section">
              <div class="section-title">Details</div>
              <table class="details-table">
                ${contentHtml}
              </table>
            </div>
          </div>

          <div class="footer">
            <p class="footer-text">
              This message was sent via the Why Leave Town contact form.<br>
              Please reply directly to the sender's email address above.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}

// -------------------- SEND CONTACT EMAIL
export const sendContactEmail = async (req, res) => {
  try {
    const { name, email, subject, message, formData } = req.body;

    const htmlContent = buildContactEmailHtml({
      name,
      email,
      subject,
      message,
      formData,
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"${name || "Contact Form"}" <${process.env.EMAIL_USER}>`,
      to: "shemrei@whyleavetown.com",
      subject: subject || "New Contact Form Submission",
      html: htmlContent,
      replyTo: email,
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
};
