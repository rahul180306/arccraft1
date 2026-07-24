import { getTasksAccessToken } from './googleTasks';

export interface GoogleDocExportResult {
  documentId: string;
  title: string;
  documentUrl: string;
}

export interface GoogleSheetExportResult {
  spreadsheetId: string;
  title: string;
  spreadsheetUrl: string;
}

export interface GmailMessageItem {
  id: string;
  threadId: string;
  from?: string;
  subject?: string;
  snippet?: string;
  date?: string;
}

/**
 * Create a new Google Document for forensic reports or case notes
 */
export const createGoogleDoc = async (
  title: string,
  content: string,
  token?: string
): Promise<GoogleDocExportResult> => {
  const accessToken = token || getTasksAccessToken();

  if (accessToken) {
    try {
      // 1. Create blank doc
      const createRes = await fetch('https://docs.googleapis.com/v1/documents', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      });

      if (createRes.ok) {
        const doc = await createRes.json();
        const documentId = doc.documentId;

        // 2. Insert text content
        if (content) {
          await fetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              requests: [
                {
                  insertText: {
                    location: { index: 1 },
                    text: content,
                  },
                },
              ],
            }),
          });
        }

        return {
          documentId,
          title: doc.title || title,
          documentUrl: `https://docs.google.com/document/d/${documentId}/edit`,
        };
      }
    } catch (e) {
      console.warn('Google Docs API call fallback:', e);
    }
  }

  // Local fallback mock result
  const mockDocId = `doc-${Date.now()}`;
  return {
    documentId: mockDocId,
    title,
    documentUrl: `https://docs.google.com/document/d/${mockDocId}/edit`,
  };
};

/**
 * Create a new Google Sheet for ANPR vehicle logs, CDR data, or evidence matrices
 */
export const createGoogleSheet = async (
  title: string,
  headers: string[],
  rows: string[][],
  token?: string
): Promise<GoogleSheetExportResult> => {
  const accessToken = token || getTasksAccessToken();

  if (accessToken) {
    try {
      const createRes = await fetch('https://sheets.googleapis.com/v1/spreadsheets', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          properties: { title },
          sheets: [
            {
              properties: { title: 'Forensic Data Matrix' },
              data: [
                {
                  startRow: 0,
                  startColumn: 0,
                  rowData: [
                    { values: headers.map((h) => ({ userEnteredValue: { stringValue: h } })) },
                    ...rows.map((row) => ({
                      values: row.map((cell) => ({ userEnteredValue: { stringValue: cell } })),
                    })),
                  ],
                },
              ],
            },
          ],
        }),
      });

      if (createRes.ok) {
        const sheet = await createRes.json();
        return {
          spreadsheetId: sheet.spreadsheetId,
          title: sheet.properties?.title || title,
          spreadsheetUrl: sheet.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${sheet.spreadsheetId}/edit`,
        };
      }
    } catch (e) {
      console.warn('Google Sheets API call fallback:', e);
    }
  }

  const mockSheetId = `sheet-${Date.now()}`;
  return {
    spreadsheetId: mockSheetId,
    title,
    spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${mockSheetId}/edit`,
  };
};

/**
 * Send an email notification or forensic report via Gmail
 */
export const sendGmailMessage = async (
  toEmail: string,
  subject: string,
  bodyText: string,
  token?: string
): Promise<{ id: string; threadId: string }> => {
  const accessToken = token || getTasksAccessToken();

  if (accessToken) {
    try {
      const rawMessage = [
        `To: ${toEmail}`,
        'Content-Type: text/plain; charset=utf-8',
        'MIME-Version: 1.0',
        `Subject: ${subject}`,
        '',
        bodyText,
      ].join('\r\n');

      const encodedMessage = btoa(unescape(encodeURIComponent(rawMessage)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ raw: encodedMessage }),
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn('Gmail API send fallback:', e);
    }
  }

  return {
    id: `msg-${Date.now()}`,
    threadId: `thread-${Date.now()}`,
  };
};

/**
 * Fetch recent dispatch emails or case communications from Gmail
 */
export const fetchGmailMessages = async (token?: string): Promise<GmailMessageItem[]> => {
  const accessToken = token || getTasksAccessToken();

  if (accessToken) {
    try {
      const listRes = await fetch(
        'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10&q=FIR+OR+KSP+OR+Police+OR-[#FF5A1F]',
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (listRes.ok) {
        const listData = await listRes.json();
        const msgList = listData.messages || [];

        const details = await Promise.all(
          msgList.slice(0, 5).map(async (item: any) => {
            const detailRes = await fetch(
              `https://gmail.googleapis.com/gmail/v1/users/me/messages/${item.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`,
              { headers: { Authorization: `Bearer ${accessToken}` } }
            );

            if (detailRes.ok) {
              const msg = await detailRes.json();
              const headers = msg.payload?.headers || [];
              const subjectHeader = headers.find((h: any) => h.name === 'Subject')?.value;
              const fromHeader = headers.find((h: any) => h.name === 'From')?.value;
              const dateHeader = headers.find((h: any) => h.name === 'Date')?.value;

              return {
                id: msg.id,
                threadId: msg.threadId,
                from: fromHeader || 'KSP Dispatch HQ',
                subject: subjectHeader || 'KSP Case Incident Notification',
                snippet: msg.snippet || '',
                date: dateHeader || new Date().toLocaleString(),
              };
            }
            return {
              id: item.id,
              threadId: item.threadId,
              subject: 'KSP Official Dispatch Alert',
              snippet: 'Case evidence update received from Control Room.',
            };
          })
        );

        return details;
      }
    } catch (e) {
      console.warn('Gmail API list fallback:', e);
    }
  }

  // Fallback items
  return [
    {
      id: 'g-1',
      threadId: 't-1',
      from: 'controlroom.bangalore@ksp.gov.in',
      subject: 'FIR KRP/2026/0456: FSL Forensic Report Ready',
      snippet: 'Forensic Science Laboratory has uploaded digital hash verification for CCTV feed #0456.',
      date: 'Today, 09:15 AM',
    },
    {
      id: 'g-2',
      threadId: 't-2',
      from: 'rto.krpuram@ksp.gov.in',
      subject: 'RTO Vehicle Verification KA03MN4481',
      snippet: 'Vehicle chassis number matched with stolen vehicle registry DB. Owner identified as S. Kumar.',
      date: 'Yesterday, 04:30 PM',
    },
    {
      id: 'g-3',
      threadId: 't-[#FF5A1F]',
      from: 'publicprosecutor.hc@ksp.gov.in',
      subject: 'High Court Hearing Notice - Courtroom #4',
      snippet: 'Please bring authenticated video keyframe timeline to courtroom tomorrow 10:30 AM.',
      date: '22 Jul 2026, 02:10 PM',
    },
  ];
};

/**
 * Post message to Google Chat Space
 */
export const sendGoogleChatMessage = async (
  spaceName: string,
  text: string,
  token?: string
): Promise<{ name: string; text: string }> => {
  const accessToken = token || getTasksAccessToken();

  if (accessToken && spaceName) {
    try {
      const response = await fetch(`https://chat.googleapis.com/v1/${spaceName}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn('Google Chat API fallback:', e);
    }
  }

  return {
    name: `spaces/MOCK/messages/${Date.now()}`,
    text,
  };
};
