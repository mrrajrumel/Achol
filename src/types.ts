/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ProjectCategory = 'All' | 'Movies' | 'Web Series' | 'Music Videos' | 'Other Projects';

export interface FilmProject {
  id: string;
  title: string;
  year: number;
  category: ProjectCategory;
  role: string;
  badge: string;
  description: string;
  imageUrl?: string;
  embedId?: string;
}

export interface AwardItem {
  year: string;
  title: string;
  organization: string;
  description: string;
}

export interface BookingSubmission {
  name: string;
  company: string;
  email: string;
  projectType: string;
  message: string;
}
