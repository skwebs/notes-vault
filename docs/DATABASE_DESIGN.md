# Database Design - Notes Vault

## Entity Relationship Diagram (Conceptual)
The database is hosted on Neon PostgreSQL and managed via Drizzle ORM.

## Tables

### `users`
- `id`: `uuid` (Primary Key, Default: `gen_random_uuid()`)
- `name`: `varchar(255)`
- `email`: `varchar(255)` (Unique, Not Null)
- `passwordHash`: `text` (Not Null)
- `avatarUrl`: `text`
- `createdAt`: `timestamp` (Default: `now()`)
- `updatedAt`: `timestamp` (Default: `now()`)

### `notes`
- `id`: `uuid` (Primary Key, Default: `gen_random_uuid()`)
- `userId`: `uuid` (Foreign Key -> `users.id`, Not Null)
- `title`: `varchar(255)` (Not Null)
- `content`: `text`
- `isArchived`: `boolean` (Default: `false`)
- `createdAt`: `timestamp` (Default: `now()`)
- `updatedAt`: `timestamp` (Default: `now()`)

### `attachments`
- `id`: `uuid` (Primary Key, Default: `gen_random_uuid()`)
- `noteId`: `uuid` (Foreign Key -> `notes.id`, On Delete: `cascade`)
- `fileUrl`: `text` (Not Null)
- `publicId`: `varchar(255)` (Cloudinary Public ID)
- `fileType`: `varchar(50)` (e.g., 'image/png', 'application/pdf')
- `createdAt`: `timestamp` (Default: `now()`)

### `tags`
- `id`: `uuid` (Primary Key, Default: `gen_random_uuid()`)
- `name`: `varchar(50)` (Unique, Not Null)
- `createdAt`: `timestamp` (Default: `now()`)

### `note_tags`
- `noteId`: `uuid` (Foreign Key -> `notes.id`, On Delete: `cascade`)
- `tagId`: `uuid` (Foreign Key -> `tags.id`, On Delete: `cascade`)
- **Primary Key**: (`noteId`, `tagId`)

## Indexes
- `users.email` (Unique Index)
- `notes.userId`
- `notes.title` (GIN index for search if needed, otherwise B-tree)
- `attachments.noteId`
- `tags.name` (Unique Index)
