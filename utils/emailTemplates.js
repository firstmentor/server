exports.generateStatusUpdateEmail = (name, status, comment, resumeUrl) => {
    return `
      <div style="font-family:'Segoe UI', sans-serif; max-width:600px; margin:auto; border:1px solid #ddd; border-radius:10px;">
        <div style="background:#f8f9fa; padding:15px; text-align:center;">
          <img src="https://srwebconsultancy.in/assets/client-logo-DRoMsrbi.png" alt="SR Web Logo" style="height:60px;" />
        </div>
        <div style="padding:20px;">
          <h2 style="color:#2b9348;">Hello ${name},</h2>
          <p>We have reviewed your job application.</p>
  
          <table style="margin-top:15px;">
            <tr>
              <td style="font-weight:bold; padding:5px 10px;">📌 Status:</td>
              <td style="color:#0077b6; padding:5px 10px;">${status}</td>
            </tr>
            <tr>
              <td style="font-weight:bold; padding:5px 10px;">💬 SR | Web Consultancy Services Comment:</td>
              <td style="padding:5px 10px;">${comment || 'No comment provided'}</td>
            </tr>
          </table>
  
         
  
          <p style="margin-top:30px; font-size:14px; color:#555;">Thank you for applying. We’ll be in touch shortly.</p>
          <hr />
          <p style="text-align:center; font-size:12px; color:#888;">SR Web Consultancy Services • www.srwebconsultancy.in</p>
        </div>
      </div>
    `;
  };
  