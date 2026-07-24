import { getTasksAccessToken } from './googleTasks';

export interface DriveEvidenceFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  createdTime?: string;
  modifiedTime?: string;
  webViewLink?: string;
  thumbnailLink?: string;
  iconLink?: string;
  category: 'Document' | 'Spreadsheet' | 'Presentation' | 'Image' | 'Video' | 'PDF' | 'Folder' | 'Other';
  caseId?: string;
}

export const categorizeMimeType = (mimeType: string): DriveEvidenceFile['category'] => {
  if (mimeType.includes('vnd.google-apps.document') || mimeType.includes('msword') || mimeType.includes('wordprocessingml')) return 'Document';
  if (mimeType.includes('vnd.google-apps.spreadsheet') || mimeType.includes('excel') || mimeType.includes('csv') || mimeType.includes('spreadsheetml')) return 'Spreadsheet';
  if (mimeType.includes('vnd.google-apps.presentation') || mimeType.includes('powerpoint') || mimeType.includes('presentationml')) return 'Presentation';
  if (mimeType.startsWith('image/')) return 'Image';
  if (mimeType.startsWith('video/')) return 'Video';
  if (mimeType.includes('pdf')) return 'PDF';
  if (mimeType.includes('vnd.google-apps.folder')) return 'Folder';
  return 'Other';
};

/**
 * Fetch evidence files from Google Drive
 */
export const fetchDriveEvidenceFiles = async (token?: string): Promise<DriveEvidenceFile[]> => {
  const accessToken = token || getTasksAccessToken();
  if (!accessToken) {
    throw new Error('No Google OAuth access token available. Please sign in with Google.');
  }

  const query = "trashed = false and (name contains 'FIR' or name contains 'CCTV' or name contains 'Evidence' or name contains 'KSP' or mimeType = 'application/vnd.google-apps.folder' or mimeType = 'application/pdf')";
  const fields = 'files(id, name, mimeType, size, createdTime, modifiedTime, webViewLink, thumbnailLink, iconLink)';

  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&pageSize=25&fields=${encodeURIComponent(fields)}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Google Drive API error (${response.status})`);
  }

  const data = await response.json();
  const rawFiles = data.files || [];

  return rawFiles.map((file: any) => ({
    id: file.id,
    name: file.name,
    mimeType: file.mimeType,
    size: file.size ? `${(parseInt(file.size, 10) / (1024 * 1024)).toFixed(1)} MB` : '1.2 MB',
    createdTime: file.createdTime,
    modifiedTime: file.modifiedTime,
    webViewLink: file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`,
    thumbnailLink: file.thumbnailLink,
    iconLink: file.iconLink,
    category: categorizeMimeType(file.mimeType),
    caseId: 'FIR KRP/2026/0456',
  }));
};

/**
 * Upload an evidence file to Google Drive
 */
export const uploadDriveEvidenceFile = async (
  fileName: string,
  fileContent: string,
  mimeType: string = 'text/plain',
  token?: string
): Promise<DriveEvidenceFile> => {
  const accessToken = token || getTasksAccessToken();
  if (!accessToken) {
    throw new Error('No Google OAuth access token available. Please sign in with Google.');
  }

  const metadata = {
    name: fileName,
    mimeType: mimeType,
  };

  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', new Blob([fileContent], { type: mimeType }));

  const response = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,webViewLink,createdTime',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: form,
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to upload file to Google Drive (${response.status})`);
  }

  const file = await response.json();
  return {
    id: file.id,
    name: file.name,
    mimeType: file.mimeType,
    size: '1.0 MB',
    createdTime: file.createdTime,
    webViewLink: file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`,
    category: categorizeMimeType(file.mimeType),
    caseId: 'FIR KRP/2026/0456',
  };
};

/**
 * Delete file from Drive with user confirmation in component
 */
export const deleteDriveEvidenceFile = async (fileId: string, token?: string): Promise<boolean> => {
  const accessToken = token || getTasksAccessToken();
  if (!accessToken) {
    throw new Error('No Google OAuth access token available. Please sign in with Google.');
  }

  const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to delete file from Drive (${response.status})`);
  }

  return true;
};
