import { getTasksAccessToken } from './googleTasks';

export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  eventType: 'Court' | 'Deadline' | 'Shift' | 'Hearing' | 'Field';
  htmlLink?: string;
}

/**
 * Fetch Calendar events from primary calendar
 */
export const fetchGoogleCalendarEvents = async (token?: string): Promise<CalendarEvent[]> => {
  const accessToken = token || getTasksAccessToken();
  if (!accessToken) {
    throw new Error('No Google OAuth access token available. Please sign in with Google.');
  }

  const now = new Date().toISOString();
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(
      now
    )}&maxResults=15&orderBy=startTime&singleEvents=true`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Google Calendar API error (${response.status})`);
  }

  const data = await response.json();
  const rawItems = data.items || [];

  return rawItems.map((item: any) => {
    let type: CalendarEvent['eventType'] = 'Field';
    const titleLower = (item.summary || '').toLowerCase();
    if (titleLower.includes('court') || titleLower.includes('hearing') || titleLower.includes('magistrate')) {
      type = 'Court';
    } else if (titleLower.includes('fsl') || titleLower.includes('deadline') || titleLower.includes('submission')) {
      type = 'Deadline';
    } else if (titleLower.includes('shift') || titleLower.includes('patrol') || titleLower.includes('duty')) {
      type = 'Shift';
    } else if (titleLower.includes('hearing')) {
      type = 'Hearing';
    }

    return {
      id: item.id,
      summary: item.summary || '(No Title)',
      description: item.description || '',
      location: item.location || 'KR Puram PS / High Court',
      start: item.start || {},
      end: item.end || {},
      eventType: type,
      htmlLink: item.htmlLink,
    };
  });
};

/**
 * Create a Court Hearing or Shift event in Google Calendar
 */
export const createGoogleCalendarEvent = async (
  summary: string,
  description: string,
  startIso: string,
  endIso: string,
  location?: string,
  token?: string
): Promise<CalendarEvent> => {
  const accessToken = token || getTasksAccessToken();
  if (!accessToken) {
    throw new Error('No Google OAuth access token available. Please sign in with Google.');
  }

  const eventPayload = {
    summary,
    description,
    location: location || 'Bangalore Sessions Court No. 4',
    start: { dateTime: new Date(startIso).toISOString() },
    end: { dateTime: new Date(endIso).toISOString() },
  };

  const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventPayload),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to create Calendar Event (${response.status})`);
  }

  const item = await response.json();
  return {
    id: item.id,
    summary: item.summary,
    description: item.description,
    location: item.location,
    start: item.start,
    end: item.end,
    eventType: 'Court',
    htmlLink: item.htmlLink,
  };
};

/**
 * Delete a Calendar event with explicit confirmation requirement
 */
export const deleteGoogleCalendarEvent = async (eventId: string, token?: string): Promise<boolean> => {
  const accessToken = token || getTasksAccessToken();
  if (!accessToken) {
    throw new Error('No Google OAuth access token available. Please sign in with Google.');
  }

  const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to delete event from Calendar (${response.status})`);
  }

  return true;
};
