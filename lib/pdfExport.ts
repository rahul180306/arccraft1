/**
 * Export conversation history or case report into a downloadable PDF format.
 */
export function exportToPDF(title: string, content: string) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to download the PDF report.");
    return;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            padding: 30px;
            color: #111827;
            line-height: 1.6;
          }
          .header {
            border-bottom: 2px solid #2563eb;
            padding-bottom: 15px;
            margin-bottom: 25px;
          }
          .header h1 {
            color: #1e3a8a;
            margin: 0 0 5px 0;
            font-size: 24px;
          }
          .header p {
            color: #4b5563;
            margin: 0;
            font-size: 13px;
          }
          .content {
            font-size: 14px;
            white-space: pre-wrap;
          }
          .footer {
            margin-top: 40px;
            border-top: 1px solid #e5e7eb;
            padding-top: 15px;
            font-size: 11px;
            color: #6b7280;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🛡️ Karnataka State Police — Crime Intelligence & Investigation Dossier</h1>
          <p>Official Record Export | Generated on ${new Date().toLocaleString('en-IN')}</p>
        </div>
        <div class="content">${content.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
        <div class="footer">
          CONFIDENTIAL — FOR LAW ENFORCEMENT & INVESTIGATIVE USE ONLY — KARNATAKA STATE POLICE
        </div>
        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
