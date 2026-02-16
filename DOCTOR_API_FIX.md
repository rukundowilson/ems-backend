# Doctor API Routes Fix

## Problem
The frontend was getting 404 errors when trying to:
- POST `/api/admin/doctors` (create doctor)
- PATCH `/api/admin/doctors/:id` (update doctor)

## Root Cause
The admin routes file (`src/routes/admin.ts`) was missing the PATCH and DELETE routes for doctors under the `/api/admin/doctors/:id` endpoint.

## Solution Applied

### 1. Updated `src/routes/admin.ts`
Added the missing routes:
- ✅ `GET /api/admin/doctors/:id` - Get doctor by ID
- ✅ `PATCH /api/admin/doctors/:id` - Update doctor
- ✅ `DELETE /api/admin/doctors/:id` - Delete doctor

All routes now use `doctorController` which has full support for:
- name
- email
- phone
- password (for creation)
- role
- specialization (auto-creates service if needed)
- title
- availability
- status

### 2. Fixed TypeScript Type Errors
Updated controllers to properly handle optional fields:
- `src/controllers/authController.ts` - Fixed optional property handling
- `src/controllers/doctorController.ts` - Fixed optional property handling

### 3. Swagger Documentation
All routes now have complete Swagger documentation with:
- Request/response schemas
- Authentication requirements
- Parameter descriptions

## API Endpoints Now Available

### Admin Doctor Management
```
GET    /api/admin/doctors          - Get all doctors
POST   /api/admin/doctors          - Create new doctor
GET    /api/admin/doctors/:id      - Get doctor by ID
PATCH  /api/admin/doctors/:id      - Update doctor
DELETE /api/admin/doctors/:id      - Delete doctor
```

### Public Doctor Endpoints
```
GET    /api/doctors                - Get all doctors (public)
GET    /api/doctors/:id            - Get doctor by ID (public)
POST   /api/doctors                - Create doctor (admin only)
PATCH  /api/doctors/:id            - Update doctor (admin only)
DELETE /api/doctors/:id            - Delete doctor (admin only)
```

## Testing
After deploying to Render, test with:
```bash
# Create doctor
curl -X POST https://ems-backend-2-jl41.onrender.com/api/admin/doctors \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "password": "securepass",
    "specialization": "Cardiology",
    "title": "MD",
    "availability": "Mon-Fri 9AM-5PM",
    "status": "Active"
  }'

# Update doctor
curl -X PATCH https://ems-backend-2-jl41.onrender.com/api/admin/doctors/DOCTOR_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Jane Doe",
    "availability": "Mon-Sat 8AM-6PM"
  }'
```

## Next Steps
1. Commit and push changes to your repository
2. Render will auto-deploy the updated backend
3. Test the doctor creation/update from your frontend
4. Check Swagger docs at: https://ems-backend-2-jl41.onrender.com/api-docs

## Files Modified
- `src/routes/admin.ts` - Added missing doctor routes
- `src/controllers/authController.ts` - Fixed TypeScript types
- `src/controllers/doctorController.ts` - Fixed TypeScript types
