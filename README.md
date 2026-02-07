# EMS Treatment Services API

Backend API for managing treatment services in the Emergency Medical System.

## Features

- ✅ 7 Treatment Service Types (Sinus/Cough/Allergy, Women's Health, Eye & Ear, Kids' Health, Skin & Rashes, Sexual Health/STI, Flu)
- ✅ Full CRUD operations
- ✅ Filter by patient ID and service type
- ✅ Swagger API documentation
- ✅ TypeScript support

## Installation

```bash
npm install
```

## Running the Application

Development mode:
```bash
npm run dev
```

Production build:
```bash
npm run build
npm start
```

## API Endpoints

### Base URL
`http://localhost:5000`

### Treatment Services

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/treatment-services` | Create new treatment service |
| GET | `/api/treatment-services` | Get all treatment services |
| GET | `/api/treatment-services/:id` | Get treatment service by ID |
| GET | `/api/treatment-services/patient/:patientId` | Get services by patient |
| GET | `/api/treatment-services/type/:type` | Get services by type |
| PUT | `/api/treatment-services/:id` | Update treatment service |
| DELETE | `/api/treatment-services/:id` | Delete treatment service |

### API Documentation
Visit `http://localhost:5000/api-docs` for interactive Swagger documentation.

## Request Examples

### Create Treatment Service
```json
POST /api/treatment-services
{
  "type": "Sinus, Cough & Allergy",
  "patientId": "patient-123",
  "symptoms": ["cough", "runny nose", "sneezing"],
  "description": "Patient experiencing severe allergy symptoms",
  "severity": "moderate"
}
```

### Update Treatment Service
```json
PUT /api/treatment-services/:id
{
  "status": "in-progress",
  "severity": "mild"
}
```

## Service Types

1. **Sinus, Cough & Allergy**
2. **Women's Health**
3. **Eye & Ear**
4. **Kids' Health**
5. **Skin & Rashes**
6. **Sexual Health / STI**
7. **Flu**

## Status Values
- `pending` - Initial state
- `in-progress` - Being treated
- `completed` - Treatment finished
- `cancelled` - Service cancelled

## Severity Levels
- `mild`
- `moderate`
- `severe`

## Tech Stack
- Node.js
- Express.js
- TypeScript
- Swagger (API Documentation)
