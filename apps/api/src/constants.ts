export const METADATA_KEY = {
  PUBLIC: "auth:public",
  OPTIONAL_AUTH: "auth:optional",
  ROLES: "auth:roles",
} as const;

export const EMAIL_EVENTS = {
  WELCOME: "email:welcome",
  VERIFY_EMAIL: "email:verify_email",
  RESET_PASSWORD: "email:reset_password",
  NEW_POST: "email:new_post",
  ARTICLE_SUBMITTED_AUTHOR: "email:article_submitted_author",
  ARTICLE_SUBMITTED_ADMIN: "email:article_submitted_admin",
  ARTICLE_STATUS_UPDATED: "email:article_status_updated",
} as const;
