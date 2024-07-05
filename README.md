# Caliana Interview Test

This project is a backend technical test for the recruitment process at DNA. It is designed to evaluate the technical skills and understanding of backend development concepts of prospective developers. Web application implementing a file upload and download service, text input storage with SQL injection prevention, and a duplicate number finder. 

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Testing](#testing)
- [Deployment](#deployment)
- [API Endpoints](#api-endpoints)

## Features
- **File Upload**: Upload files to a server directory.
- **File Download**: Download files from the server.
- **Text Input**: Store text in a database securely.
- **Duplicate Finder**: Identify duplicate numbers in an array.

## Prerequisites
- Node.js (version 14 or higher)
- NPM (Node Package Manager)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/aliirsyaadn/caliana-interview-test.git
   cd caliana-interview-test
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

## Usage

1. Start the server:

   ```bash
   npm start
   ```

   The server will run at `http://localhost:3000`.

2. Use a tool like Postman or cURL to interact with the API.

    The API documentation for this project is provided in the docs folder. It includes a `Postman collection`.
    You can import the provided Postman collection (`postman_collection.json`) and environment file (`postman_environment.json`). These files include pre-configured requests for all the API endpoints, making it easy to test the API's functionality.

## Testing

Run the unit tests to verify the functionality:

```bash
npm test
```

## Deployment

### Local Deployment

To deploy the application locally:

1. Ensure that all dependencies are installed:

   ```bash
   npm install
   ```

2. Start the server:

   ```bash
   npm start
   ```

## API Endpoints

### 1. Upload File

- **Endpoint**: `POST /upload`
- **Description**: Upload a file.
- **Parameters**: 
  - `file` (form-data): The file to upload.
- **Response**:
  - `200 OK`: `{ status: 'File uploaded' }`
  - `400 Bad Request`: `{ error: 'File is required' }`

### 2. Download File

- **Endpoint**: `GET /download/:filename`
- **Description**: Download a file by name.
- **Parameters**:
  - `filename` (path): The name of the file to download.
- **Response**:
  - `200 OK`: File content.
  - `404 Not Found`: `{ error: 'File not found' }`

### 3. Input Text

- **Endpoint**: `POST /input`
- **Description**: Store text in the database.
- **Parameters**:
  - `text` (JSON): The text to store.
- **Response**:
  - `200 OK`: `{ status: 'Text saved' }`
  - `400 Bad Request`: `{ error: 'Text is required' }`

### 4. Find Duplicates

- **Endpoint**: `POST /findDuplicates`
- **Description**: Find duplicate numbers in an array.
- **Parameters**:
  - `numbers` (JSON): An array of numbers.
- **Response**:
  - `200 OK`: `{ duplicates: [number] }`
  - `400 Bad Request`: `{ error: 'Numbers array is required' }`

