export enum COURSE_STATUS {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  IN_REVIEW = 'in_review',
  REJECTED = 'rejected',
}

export const courseStatusMapping: Record<COURSE_STATUS, string> = {
  [COURSE_STATUS.DRAFT]: 'Draft',
  [COURSE_STATUS.PUBLISHED]: 'Published',
  [COURSE_STATUS.IN_REVIEW]: 'In Review',
  [COURSE_STATUS.REJECTED]: 'Rejected',
}
