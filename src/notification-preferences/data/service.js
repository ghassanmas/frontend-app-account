import { getConfig, snakeCaseObject } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import snakeCase from 'lodash.snakecase';

export const getCourseNotificationPreferences = async (courseId) => {
  const url = `${getConfig().LMS_BASE_URL}/api/notifications/configurations/${courseId}`;
  const { data } = await getAuthenticatedHttpClient().get(url);
  return data;
};

export const getCourseList = async () => {
  const url = `${getConfig().LMS_BASE_URL}/api/notifications/enrollments/`;
  const { data } = await getAuthenticatedHttpClient().get(url);
  return data;
};

export const patchAppPreferenceToggle = async (courseId, appId, value) => {
  const patchData = snakeCaseObject({
    notificationApp: appId,
    value,
  });
  const url = `${getConfig().LMS_BASE_URL}/api/notifications/configurations/${courseId}`;
  const { data } = await getAuthenticatedHttpClient().patch(url, patchData);
  return data;
};

export const patchPreferenceToggle = async (
  courseId,
  notificationApp,
  notificationType,
  notificationChannel,
  value,
) => {
  const patchData = snakeCaseObject({
    notificationApp,
    notificationType: snakeCase(notificationType),
    notificationChannel,
    value,
  });
  const url = `${getConfig().LMS_BASE_URL}/api/notifications/configurations/${courseId}`;
  const { data } = await getAuthenticatedHttpClient().patch(url, patchData);
  return data;
};
