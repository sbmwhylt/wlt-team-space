export const contactUpdateTemplate = (data) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .header img { max-width: 150px; margin-bottom: 10px; }
        .header h1 { color: white; margin: 0; font-size: 24px; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .info-row { background: white; padding: 15px; margin-bottom: 10px; border-radius: 5px; border-left: 4px solid #667eea; }
        .label { font-weight: bold; color: #667eea; font-size: 12px; text-transform: uppercase; }
        .value { color: #333; font-size: 16px; margin-top: 5px; }
        .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://via.placeholder.com/150x50/667eea/ffffff?text=WLT" alt="Logo" />
          <h1>📋 Contact Details Update</h1>
        </div>
        
        <div class="content">
          <div class="info-row">
            <div class="label">🏢 Business Name</div>
            <div class="value">${data.businessName}</div>
          </div>
          
          <div class="info-row">
            <div class="label">👤 Contact Name</div>
            <div class="value">${data.contactName || 'Not provided'}</div>
          </div>
          
          <div class="info-row">
            <div class="label">📧 Email Address</div>
            <div class="value">${data.contactEmail || 'Not provided'}</div>
          </div>
          
          <div class="info-row">
            <div class="label">📱 Phone Number</div>
            <div class="value">${data.contactPhone || 'Not provided'}</div>
          </div>
          
          <div class="info-row">
            <div class="label">📍 Business Address</div>
            <div class="value">${data.businessAddress || 'Not provided'}</div>
          </div>
          
          ${data.otherInfo ? `
          <div class="info-row">
            <div class="label">💬 Additional Information</div>
            <div class="value">${data.otherInfo}</div>
          </div>
          ` : ''}
        </div>
        
        <div class="footer">
          <p>This is an automated message from Why Leave Town</p>
          <p>Received on ${new Date().toLocaleString()}</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Add more templates for other forms
export const partnershipTemplate = (data) => {
  return `...`;
};