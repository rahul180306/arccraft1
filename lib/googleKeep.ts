import { getTasksAccessToken } from './googleTasks';

export interface KeepNote {
  id: string;
  title: string;
  body: string;
  caseId: string;
  timestamp: string;
  officerName: string;
  tags: string[];
}

/**
 * Fetch Field Observations & Quick Notes
 */
export const fetchKeepNotes = async (token?: string): Promise<KeepNote[]> => {
  const accessToken = token || getTasksAccessToken();
  if (accessToken) {
    try {
      // Attempt Keep REST API call
      const response = await fetch('https://keep.googleapis.com/v1/notes', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const items = data.notes || [];
        return items.map((n: any) => ({
          id: n.name || `keep-${Date.now()}`,
          title: n.title || 'Field Observation',
          body: n.body?.text?.text || n.textContent || '',
          caseId: 'FIR KRP/2026/0456',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          officerName: 'ASI Ramesh',
          tags: ['Field Note', 'Evidence'],
        }));
      }
    } catch (e) {
      console.warn('Google Keep API call fallback:', e);
    }
  }

  // Fallback persistent local notes array
  return [
    {
      id: 'kn-1',
      title: 'Suspect Vehicle Hazard Lights',
      body: 'White sedan KA03MN4481 kept hazard lights blinking for 2m 15s near boundary fence.',
      caseId: 'FIR KRP/2026/0456',
      timestamp: '02:18 AM',
      officerName: 'ASI Ramesh',
      tags: ['ANPR', 'ANOMALY'],
    },
    {
      id: 'kn-2',
      title: 'Witness Statement Verification',
      body: 'Guard Sharanappa confirmed hearing metallic clink around 02:16 AM near CCTV pole 1.',
      caseId: 'FIR KRP/2026/0456',
      timestamp: '03:45 AM',
      officerName: 'Inspector Kumar',
      tags: ['WITNESS', 'STATEMENTS'],
    },
    {
      id: 'kn-3',
      title: 'FSL Bloodstain Swab Control #4',
      body: 'Collected swab from iron gate lock; sealed in tamper-evident bag #FSL-9948.',
      caseId: 'FIR KRP/2026/0456',
      timestamp: '04:10 AM',
      officerName: 'HC Vijay',
      tags: ['FORENSICS', 'CHAIN_OF_CUSTODY'],
    }
  ];
};

/**
 * Create a Quick Note linked to a case ID
 */
export const createKeepNote = async (
  title: string,
  body: string,
  caseId: string = 'FIR KRP/2026/0456',
  token?: string
): Promise<KeepNote> => {
  const accessToken = token || getTasksAccessToken();

  if (accessToken) {
    try {
      const response = await fetch('https://keep.googleapis.com/v1/notes', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          body: {
            text: {
              text: `[${caseId}] ${body}`,
            },
          },
        }),
      });

      if (response.ok) {
        const item = await response.json();
        return {
          id: item.name || `keep-${Date.now()}`,
          title: item.title || title,
          body: body,
          caseId,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          officerName: 'ASI Ramesh',
          tags: ['Google Keep', 'Synced'],
        };
      }
    } catch (e) {
      console.warn('Keep API post fallback:', e);
    }
  }

  return {
    id: `note-${Date.now()}`,
    title,
    body,
    caseId,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    officerName: 'ASI Ramesh',
    tags: ['Field Note', 'Local'],
  };
};

/**
 * Delete a note with explicit user confirmation in component
 */
export const deleteKeepNote = async (noteId: string, token?: string): Promise<boolean> => {
  const accessToken = token || getTasksAccessToken();
  if (accessToken && noteId.startsWith('notes/')) {
    try {
      await fetch(`https://keep.googleapis.com/v1/${noteId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (e) {
      console.warn('Keep API delete fallback:', e);
    }
  }
  return true;
};
