# API Reference - Notes Vault

## Authentication

### Register
`POST /api/auth/register`
Body: `{ name, email, password }`
Response: `ApiResponse<{ id, name, email }>`

### Login
Managed by Auth.js v5 via `signIn("credentials", ...)`

## Notes

### List Notes
`GET /api/notes?search=...&tagId=...`
Response: `ApiResponse<Note[]>`

### Create Note
`POST /api/notes`
Body: `{ title, content, isArchived }`
Response: `ApiResponse<Note>`

### Get Note
`GET /api/notes/[id]`
Response: `ApiResponse<Note>`

### Update Note
`PATCH /api/notes/[id]`
Body: `{ title?, content?, isArchived? }`
Response: `ApiResponse<Note>`

### Delete Note
`DELETE /api/notes/[id]`
Response: `ApiResponse`

### Archive Note
`POST /api/notes/[id]/archive`
Response: `ApiResponse<Note>`

### Restore Note
`POST /api/notes/[id]/restore`
Response: `ApiResponse<Note>`

## Tags

### List Tags
`GET /api/tags`
Response: `ApiResponse<Tag[]>`

### Create Tag
`POST /api/tags`
Body: `{ name }`
Response: `ApiResponse<Tag>`

## Profile

### Get Profile
`GET /api/profile`
Response: `ApiResponse<User>`

### Update Profile
`PATCH /api/profile`
Body: `{ name?, avatarUrl? }`
Response: `ApiResponse<User>`

## Uploads

### Upload File
`POST /api/upload`
Form Data: `file: File`, `noteId: string`
Response: `ApiResponse<Attachment>`
