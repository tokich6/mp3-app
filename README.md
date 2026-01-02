# MP3 Frame Counter App

API endpoint that counts the number of frames in an MP3 file.

## Features

- Counts frames in MPEG-1 Layer 3 (MP3) files
- Manual binary parsing (no external MP3 parsing libraries)
- Handles ID3v2 and ID3v1 tags
- File size validation (200MB limit)
- Worker threads for CPU-intensive parsing (non-blocking)
- Comprehensive error handling with proper HTTP status codes
- Automatic file cleanup
- TypeScript with strict type checking

## Requirements

- Node.js 20+
- npm or yarn

## Installation

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build
```

## Usage

### Start the server

```bash
npm start
```

Server will run on `http://localhost:3000`

### Development mode

```bash
npm run dev
```

## Quick Test
1. `git clone https://github.com/tokich6/mp3-app.git`
2. `cd mp3-app`
3. `npm install && npm run build && npm start`
4. Server should show: "Server running on http://localhost:3000"
5. Choose between cURL or Postman approach below
6. Expected: `{"frameCount": 1234}`

### Using cURL

```bash
curl -X POST http://localhost:3000/file-upload \
  -F "file=@/path/to/file.mp3"
```

### Using Postman

1. Create new POST request to `http://localhost:3000/file-upload`
2. Go to Body tab → select "form-data"
3. Add key "file" with type "File"
4. Select your MP3 file
5. Click Send

### Expected Response

```json
{
  "frameCount": 8685
}
```

### Error Responses

**No file uploaded:**
```json
{
  "error": "No file uploaded"
}
```

**Invalid file type:**
```json
{
  "error": "Invalid file type. Please upload an MP3 file"
}
```

**File too large:**
```json
{
  "error": "File too large. Maximum size is 200MB"
}
```

**Invalid MP3:**
```json
{
  "message": "No valid MP3 frames found in file",
  "status": 400
}
```

## Project Structure

```
├── src/
│   ├── constants/
│   │   ├── index.ts
│   │   ├── parse.ts
│   │   └── upload.ts
│   ├── interfaces/
│   │   ├── FileUpload.ts
│   │   ├── Workers.ts
│   │   └── index.ts
│   ├── middleware/
│   │   ├── errorHandler.ts
│   │   ├── upload.ts
│   │   └── index.ts
│   ├── routes/
│   │   └── upload.ts
│   ├── services/
│   │   ├── mp3Parser.ts
│   │   ├── mp3Worker.ts
│   │   ├── workerPool.ts
│   │   └── index.ts
│   ├── app.ts
│   └── server.ts
├── temp-uploads/          # Temporary file storage (auto-created)
├── dist/                  # Compiled JavaScript (generated)
├── .eslintrc.json
├── .prettierrc
├── package.json
├── package-lock.json
├── README.md
└── tsconfig.json
```

## Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run compiled server
- `npm run dev` - Run in development mode with ts-node
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm test` - Run tests (if configured)