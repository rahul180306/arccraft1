import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User, 
  signOut 
} from 'firebase/auth';

const requiredFirebaseEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
] as const;

const missingFirebaseEnvVars = requiredFirebaseEnvVars.filter((key) => !process.env[key]);
if (missingFirebaseEnvVars.length > 0) {
  throw new Error(
    `Missing Firebase environment variables: ${missingFirebaseEnvVars.join(', ')}`
  );
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Provider with Google Tasks scopes
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/tasks');
provider.addScope('https://www.googleapis.com/auth/tasks.readonly');

// In-memory token cache
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export interface GoogleTaskItem {
  id: string;
  title: string;
  notes?: string;
  status: 'needsAction' | 'completed';
  due?: string;
  updated?: string;
  completed?: string;
}

/**
 * Initialize auth state listener.
 */
export const initGoogleAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

/**
 * Sign in with Google to request Google Tasks permission & get access token
 */
export const signInWithGoogleTasks = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to retrieve Google OAuth access token');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error) {
    console.error('Google Tasks sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

/**
 * Returns current cached access token
 */
export const getTasksAccessToken = (): string | null => {
  return cachedAccessToken;
};

/**
 * Logout user
 */
export const logoutGoogleTasks = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

/**
 * Fetch tasks from default Google Tasks list
 */
export const fetchGoogleTasks = async (token?: string): Promise<GoogleTaskItem[]> => {
  const accessToken = token || cachedAccessToken;
  if (!accessToken) {
    throw new Error('No Google access token available. Please sign in.');
  }

  const response = await fetch(
    'https://tasks.googleapis.com/tasks/v1/lists/@default/tasks?showCompleted=true&showHidden=true',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to fetch Google Tasks (${response.status})`);
  }

  const data = await response.json();
  const rawItems = data.items || [];
  
  return rawItems.map((item: any) => ({
    id: item.id,
    title: item.title || '(Untitled Task)',
    notes: item.notes || '',
    status: item.status === 'completed' ? 'completed' : 'needsAction',
    due: item.due,
    updated: item.updated,
    completed: item.completed,
  }));
};

/**
 * Create a new task in Google Tasks
 */
export const createGoogleTask = async (
  title: string,
  notes?: string,
  dueDate?: string,
  token?: string
): Promise<GoogleTaskItem> => {
  const accessToken = token || cachedAccessToken;
  if (!accessToken) {
    throw new Error('No Google access token available. Please sign in.');
  }

  const body: Record<string, any> = { title };
  if (notes) body.notes = notes;
  if (dueDate) {
    // Format as RFC3339 timestamp
    body.due = new Date(dueDate).toISOString();
  }

  const response = await fetch('https://tasks.googleapis.com/tasks/v1/lists/@default/tasks', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to create task (${response.status})`);
  }

  const item = await response.json();
  return {
    id: item.id,
    title: item.title,
    notes: item.notes,
    status: item.status === 'completed' ? 'completed' : 'needsAction',
    due: item.due,
    updated: item.updated,
  };
};

/**
 * Toggle or update task status in Google Tasks
 */
export const updateGoogleTaskStatus = async (
  taskId: string,
  isCompleted: boolean,
  token?: string
): Promise<GoogleTaskItem> => {
  const accessToken = token || cachedAccessToken;
  if (!accessToken) {
    throw new Error('No Google access token available. Please sign in.');
  }

  const status = isCompleted ? 'completed' : 'needsAction';
  const body: Record<string, any> = { status };
  if (isCompleted) {
    body.completed = new Date().toISOString();
  }

  const response = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/@default/tasks/${taskId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to update task (${response.status})`);
  }

  const item = await response.json();
  return {
    id: item.id,
    title: item.title,
    notes: item.notes,
    status: item.status === 'completed' ? 'completed' : 'needsAction',
    due: item.due,
    updated: item.updated,
    completed: item.completed,
  };
};

/**
 * Delete a Google Task with confirmation requirement
 */
export const deleteGoogleTask = async (taskId: string, token?: string): Promise<boolean> => {
  const accessToken = token || cachedAccessToken;
  if (!accessToken) {
    throw new Error('No Google access token available. Please sign in.');
  }

  const response = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/@default/tasks/${taskId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to delete task (${response.status})`);
  }

  return true;
};
