-- Rename column publishAt -> publishedAt (keep existing data)
ALTER TABLE `posts` RENAME COLUMN `publishAt` TO `publishedAt`;
