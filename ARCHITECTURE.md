# EMS Backend Architecture Explanation

## 📊 Data Flow Architecture

```
┌─────────────┐
│   Client    │  (Frontend - React)
│  (Browser)  │
└──────┬──────┘
       │ HTTP Request (POST /api/treatment-services)
       │ Body: { type: "Flu", patientId: "123", ... }
       ▼
┌─────────────────────────────────────────────────────┐
│                    app.ts                           │
│  ┌───────────────────────────────────────────────┐ │
│  │  Middleware Layer                             │ │
│  │  • CORS                                       │ │
│  │  • JSON Parser                                │ │
│  │  • URL Encoded                                │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │  Route Registration                           │ │
│  │  app.use('/api/treatment-services', routes)   │ │
│  └───────────────────────────────────────────────┘ │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│         treatment.routes.ts (Routes Layer)          │
│  ┌───────────────────────────────────────────────┐ │
│  │  router.post('/', createTreatmentService)     │ │
│  │  router.get('/', getAllTreatmentServices)     │ │
│  │  router.get('/:id', getTreatmentServiceById)  │ │
│  │  router.put('/:id', updateTreatmentService)   │ │
│  │  router.delete('/:id', deleteTreatmentService)│ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  • Maps HTTP methods to controller functions       │
│  • Contains Swagger documentation                  │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│    treatment.controller.ts (Controller Layer)       │
│  ┌───────────────────────────────────────────────┐ │
│  │  export const createTreatmentService = async  │ │
│  │    (req, res) => {                            │ │
│  │      const data = req.body;  // Extract data  │ │
│  │      const service = await Model.create(data);│ │
│  │      res.json({ success: true, data });       │ │
│  │    }                                          │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  • Handles request/response                        │
│  • Validates input                                 │
│  • Calls model methods                             │
│  • Formats response                                │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│     treatment.model.ts (Model/Data Layer)           │
│  ┌───────────────────────────────────────────────┐ │
│  │  class TreatmentServiceModel {                │ │
│  │    async create(data) {                       │ │
│  │      const service = new Schema(data);        │ │
│  │      return await service.save();             │ │
│  │    }                                          │ │
│  │                                               │ │
│  │    async findAll() { ... }                    │ │
│  │    async findById(id) { ... }                 │ │
│  │    async update(id, data) { ... }             │ │
│  │    async delete(id) { ... }                   │ │
│  │  }                                            │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  • Interacts with MongoDB                          │
│  • CRUD operations                                 │
│  • Uses Mongoose Schema                            │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│    treatment.schema.ts (Mongoose Schema)            │
│  ┌───────────────────────────────────────────────┐ │
│  │  const Schema = new mongoose.Schema({         │ │
│  │    type: { type: String, required: true },    │ │
│  │    patientId: { type: String, required: true },│ │
│  │    symptoms: [String],                        │ │
│  │    severity: { enum: ['mild', 'moderate'] },  │ │
│  │    status: { default: 'pending' }             │ │
│  │  }, { timestamps: true });                    │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  • Defines data structure                          │
│  • Validation rules                                │
│  • Indexes for performance                         │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│              MongoDB Atlas Database                 │
│  ┌───────────────────────────────────────────────┐ │
│  │  Collection: treatmentservices                │ │
│  │  ┌─────────────────────────────────────────┐ │ │
│  │  │ {                                       │ │ │
│  │  │   _id: "507f1f77bcf86cd799439011",      │ │ │
│  │  │   type: "Flu",                          │ │ │
│  │  │   patientId: "patient-123",             │ │ │
│  │  │   symptoms: ["fever", "cough"],         │ │ │
│  │  │   severity: "moderate",                 │ │ │
│  │  │   status: "pending",                    │ │ │
│  │  │   createdAt: "2024-01-15T10:30:00Z",    │ │ │
│  │  │   updatedAt: "2024-01-15T10:30:00Z"     │ │ │
│  │  │ }                                       │ │ │
│  │  └─────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

---

## 🔄 Complete Request Flow Example

### Example: Creating a Treatment Service

**1. Client sends request:**
```javascript
fetch('http://localhost:5000/api/treatment-services', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: "Flu",
    patientId: "patient-123",
    symptoms: ["fever", "cough", "headache"],
    description: "Patient has high fever",
    severity: "moderate"
  })
})
```

**2. app.ts receives request:**
- Passes through CORS middleware
- Parses JSON body
- Routes to `/api/treatment-services`

**3. treatment.routes.ts matches route:**
```typescript
router.post('/', createTreatmentService)
// Calls the createTreatmentService controller
```

**4. treatment.controller.ts processes:**
```typescript
export const createTreatmentService = async (req, res) => {
  const data = req.body;  // Gets the JSON data
  const service = await TreatmentServiceModel.create(data);  // Calls model
  res.status(201).json({ success: true, data: service });  // Sends response
}
```

**5. treatment.model.ts saves to database:**
```typescript
async create(data) {
  const service = new TreatmentServiceSchema({
    ...data,
    status: 'pending'  // Sets default status
  });
  return await service.save();  // Saves to MongoDB
}
```

**6. treatment.schema.ts validates:**
- Checks all required fields exist
- Validates enum values (severity, status, type)
- Adds timestamps automatically
- Creates indexes for fast queries

**7. MongoDB stores document:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "type": "Flu",
  "patientId": "patient-123",
  "symptoms": ["fever", "cough", "headache"],
  "description": "Patient has high fever",
  "severity": "moderate",
  "status": "pending",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**8. Response flows back:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "type": "Flu",
    "patientId": "patient-123",
    ...
  }
}
```

---

## 📁 File Structure

```
ems-backend/
├── src/
│   ├── app.ts                      # Main application entry
│   ├── config/
│   │   ├── database.ts             # MongoDB connection
│   │   └── swagger.ts              # API documentation setup
│   ├── types/
│   │   └── treatment.types.ts      # TypeScript interfaces
│   ├── models/
│   │   ├── treatment.schema.ts     # Mongoose schema definition
│   │   └── treatment.model.ts      # Data access methods
│   ├── controllers/
│   │   └── treatment.controller.ts # Request handlers
│   └── routes/
│       └── treatment.routes.ts     # API endpoints
├── .env                            # Environment variables
└── package.json
```

---

## 🔑 Key Concepts

### 1. **Separation of Concerns**
Each layer has ONE job:
- **Routes**: Define endpoints
- **Controllers**: Handle requests/responses
- **Models**: Database operations
- **Schema**: Data structure

### 2. **MongoDB Connection String**
```
mongodb+srv://username:password@cluster.mongodb.net/database?options
```
- `username`: nsanzimanarichard1
- `password`: Replace `<db_password>` with actual password
- `cluster`: nodejs.bl4biax.mongodb.net
- `database`: ems-treatment (added automatically)

### 3. **Mongoose Benefits**
- **Schema validation**: Ensures data integrity
- **Type safety**: Works with TypeScript
- **Middleware**: Auto-timestamps, hooks
- **Queries**: Easy database operations
- **Indexes**: Fast searches

---

## 🚀 Setup Instructions

1. **Create .env file:**
```bash
PORT=5000
MONGODB_URI=mongodb+srv://nsanzimanarichard1:YOUR_PASSWORD@nodejs.bl4biax.mongodb.net/ems-treatment?retryWrites=true&w=majority
```

2. **Install dependencies:**
```bash
npm install
```

3. **Build project:**
```bash
npm run build
```

4. **Run development server:**
```bash
npm run dev
```

5. **Access API:**
- API: http://localhost:5000
- Swagger Docs: http://localhost:5000/api-docs

---

## 📝 Summary

**Before (In-Memory):**
- Data stored in array
- Lost on restart
- No persistence

**After (MongoDB):**
- Data stored in cloud database
- Persistent storage
- Scalable and production-ready
- All methods now `async/await`
- Mongoose handles validation
