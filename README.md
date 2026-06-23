# Task Management System API
## تم الانشاء بمجهود شخصى دون استخدام الai الا فى انشاء ملفا readme file 
## 📋 نظرة عامة على المشروع

نظام إدارة المهام (Task Management System) هو تطبيق backend مكتوب بـ **TypeScript** و **Express.js**، يوفر:

- ✅ **Authentication & Authorization** - تسجيل دخول وإدارة المستخدمين
- ✅ **Project Management** - إنشاء وإدارة المشاريع
- ✅ **Task Management** - إنشاء وتتبع المهام مع الأولويات والحالات
- ✅ **Role-Based Access Control** - نظام الأدوار (Admin/Member)
- ✅ **Type Safety** - TypeScript Strict Mode
- ✅ **Security First** - JWT Authentication & Validation

---

## 🏗️ Architecture (العمارة)

### نمط المشروع: **Layered Architecture**

```
┌─────────────────────────────────────────┐
│           HTTP Requests                 │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│         Routes Layer                     │
│  (Express Router - Endpoints)           │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│      Middleware Layer                   │
│  • Authentication (JWT)                 │
│  • Authorization (RBAC)                 │
│  • Error Handling                       │
│  • Validation (Zod)                     │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│     Controllers Layer                   │
│  (Business Logic & Request Handling)   │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│      Services Layer                     │
│  (Core Business Logic)                  │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│      Models Layer                       │
│  (MongoDB Schema & Validation)          │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│      Database Layer                     │
│  (MongoDB)                              │
└─────────────────────────────────────────┘
```

### مثال على تدفق Request:

```
POST /api/v1/projects

1. Route Handler (project.route.ts)
2. Auth Middleware - التحقق من JWT
3. RBAC Middleware (اختياري) - التحقق من الصلاحيات
4. Controller (project.controller.ts) - استقبال البيانات
5. Validation (Zod) - التحقق من صيغة البيانات
6. Service (project.service.ts) - معالجة البيانات
7. Model (ProjectModel) - حفظ في MongoDB
8. Response - إرجاع النتيجة
```

---

## 🔒 نظام الأمان (Security System)

### 1. **Authentication - JWT (JSON Web Token)**

```typescript
// التسجيل
POST /api/v1/auth/register
{
  "name": "Ahmed",
  "email": "ahmed@example.com",
  "password": "SecurePass123!"
}

// النتيجة
{
  "message": "User registered successfully",
  "user": { "id": "...", "email": "...", "role": "member" }
}

// تسجيل الدخول
POST /api/v1/auth/login
{
  "email": "ahmed@example.com",
  "password": "SecurePass123!"
}

// النتيجة
{
  "message": "User logged in successfully",
  "user": { ... },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "expiresAt": 1234567890
}

// الاستخدام
Headers: {
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIs..."
}
```

### 2. **Authorization - RBAC (Role-Based Access Control)**

```typescript
// الأدوار المتاحة
enum RoleEnum {
  ADMIN = "admin",      // صلاحيات كاملة
  MEMBER = "member"     // صلاحيات محدودة
}

// الحماية
app.delete("/api/V1/users/:id", authorize([RoleEnum.ADMIN]), deleteUserController);
```

### 3. **Data Validation - Zod Schemas**

```typescript
// مثال على validation
const createProjectSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
});

// في Controller
const body = createProjectSchema.parse(req.body);
// إذا البيانات غير صحيحة → يرمي validation error
```

### 4. **Password Security - Bcrypt**

```typescript
// عند الحفظ
userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await hashValue(this.password);
  }
});

// عند التحقق
const isValid = await user.comparePassword(inputPassword);
```

### 5. **Protected Routes**

```typescript
// جميع routes المشاريع والمهام محمية
projectRoutes.use(authMiddleware);  // ✓ JWT required
taskRoutes.use(authMiddleware);     // ✓ JWT required

// غير محمية (فقط)
POST /api/v1/auth/register
POST /api/v1/auth/login
```

### 6. **User Ownership Validation**

```typescript
// مثال: لا يمكن لأحد أن يرى projects غيره
const getProjectByIdService = async (projectId: string, userId: string) => {
  const project = await ProjectModel.findOne({ 
    _id: projectId,
    userId: userId  // ✓ التحقق من الملكية
  });
  if (!project) throw new NotFoundError("Project not found");
  return project;
};
```

### 7. **CORS Security**

```typescript
app.use(cors({
  origin: [
    process.env.FRONTEND_ORIGIN,
    "http://localhost:5174",
    "http://localhost:5173"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
```

---

## 📁 Project Structure

```
task_management_system/
├── src/
│   ├── index.ts                           # نقطة البداية
│   ├── @types/
│   │   ├── index.dt.ts                   # Express types customization
│   ├── config/
│   │   ├── database.config.ts            # MongoDB connection
│   │   ├── env.config.ts                 # Environment variables
│   │   ├── http.config.ts                # HTTP status codes
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts            # Auth endpoints
│   │   ├── user.controller.ts            # User endpoints
│   │   ├── project.controller.ts         # Project endpoints
│   │   └── task.controller.ts            # Task endpoints
│   │
│   ├── services/
│   │   ├── auth.service.ts               # Auth logic
│   │   ├── user.service.ts               # User logic
│   │   ├── project.service.ts            # Project logic
│   │   └── task.service.ts               # Task logic
│   │
│   ├── routes/
│   │   ├── auth.route.ts                 # Auth routes
│   │   ├── user.route.ts                 # User routes
│   │   ├── project.route.ts              # Project routes
│   │   └── task.route.ts                 # Task routes
│   │
│   ├── models/
│   │   ├── user.model.ts                 # User schema
│   │   ├── project.model.ts              # Project schema
│   │   └── task.model.ts                 # Task schema
│   │
│   ├── middlewares/
│   │   ├── asyncHandler.middleware.ts    # Async error wrapper
│   │   ├── errorHandler.middleware.ts    # Global error handler
│   │   ├── auth.middleware.ts            # JWT verification
│   │   └── rbac.middleware.ts            # Role-based access
│   │
│   ├── validations/
│   │   ├── auth.validator.ts             # Auth schemas
│   │   ├── project.validator.ts          # Project schemas
│   │   └── task.validator.ts             # Task schemas
│   │
│   ├── enums/
│   │   ├── error-code.enum.ts            # Error codes
│   │   ├── role.enum.ts                  # User roles
│   │   ├── project-status.enum.ts        # Project statuses
│   │   ├── task-status.enum.ts           # Task statuses
│   │   └── task-priority.enum.ts         # Task priorities
│   │
│   ├── utiles/
│   │   ├── app-error.ts                  # Custom error class
│   │   ├── bcrypt.ts                     # Password hashing
│   │   ├── jwt.ts                        # Token generation
│   │   ├── get-Env.ts                    # Environment reader
│   
│ 
│
├── dist/                                  # Compiled JavaScript
├── .env                                   # Environment variables
├── .gitignore                             # Git ignore rules
├── tsconfig.json                          # TypeScript config
├── package.json                           # Dependencies
└── README.md                              # This file
```

---

## 🚀 Installation & Setup

### المتطلبات
- Node.js = 20
- MongoDB >= 5.0
- npm or yarn

### الخطوات

#### 1. استنساخ المشروع
```bash
git clone <repository-url>
cd task_management_system
```

#### 2. تثبيت الـ Dependencies
```bash
npm install
```

#### 4. بدء MongoDB
```bash
# اختر واحد منهم:

# Option 1: إذا كان mongod مثبت محليًا
mongod

# Option 2: باستخدام Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

#### 5. تشغيل المشروع (Development)
```bash
npm run dev
# Server running on http://localhost:3000
```

#### 6. البناء (Production)
```bash
npm run build
npm start
```

---

## 📡 API Endpoints

### 🔐 Authentication (لا تحتاج JWT)

| الطريقة | المسار | الوصف |
|--------|--------|-------|
| POST | `/api/V1/auth/register` | تسجيل مستخدم جديد |
| POST | `/api/V1/auth/login` | تسجيل دخول المستخدم |

### 👤 User (تحتاج JWT)

| الطريقة | المسار | الوصف |
|--------|--------|-------|
| GET | `/api/V1/user/current-user` | الحصول على بيانات المستخدم الحالي |

### 📊 Projects (تحتاج JWT)

| الطريقة | المسار | الوصف |
|--------|--------|-------|
| GET | `/api/V1/projects` | الحصول على جميع المشاريع |
| POST | `/api/V1/projects` | إنشاء مشروع جديد |
| GET | `/api/V1/projects/:projectId` | الحصول على مشروع واحد |
| PUT | `/api/V1/projects/:projectId` | تحديث المشروع |
| DELETE | `/api/V1/projects/:projectId` | حذف المشروع |

### ✅ Tasks (تحتاج JWT)

| الطريقة | المسار | الوصف |
|--------|--------|-------|
| GET | `/api/V1/projects/:projectId/tasks` | الحصول على المهام (مع filters) |
| POST | `/api/V1/projects/:projectId/tasks` | إنشاء مهمة جديدة |
| GET | `/api/V1/projects/:projectId/tasks/:taskId` | الحصول على مهمة واحدة |
| PUT | `/api/V1/projects/:projectId/tasks/:taskId` | تحديث المهمة |
| DELETE | `/api/V1/projects/:projectId/tasks/:taskId` | حذف المهمة |

---

## 📌 أمثلة على الاستخدام

### تسجيل مستخدم جديد
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ahmed",
    "email": "ahmed@example.com",
    "password": "SecurePass123!"
  }'
```

### تسجيل الدخول
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ahmed@example.com",
    "password": "SecurePass123!"
  }'

# النتيجة تحتوي على: accessToken
```

### إنشاء مشروع (مع JWT)
```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_TOKEN_HERE>" \
  -d '{
    "title": "My Awesome Project",
    "description": "This is my first project",
    "status": "active"
  }'
```

### الحصول على المهام مع التصفية
```bash
# الحصول على المهام المهمة (high priority)
curl -X GET "http://localhost:3000/api/v1/projects/PROJECT_ID/tasks?priority=high" \
  -H "Authorization: Bearer <YOUR_TOKEN_HERE>"

# الحصول على المهام قيد التقدم
curl -X GET "http://localhost:3000/api/v1/projects/PROJECT_ID/tasks?status=in_progress" \
  -H "Authorization: Bearer <YOUR_TOKEN_HERE>"
```

---

## 🔐 Security Features

| الميزة | الوصف | الحالة |
|--------|-------|--------|
| **JWT Authentication** | توثيق آمن باستخدام JWT | ✅ مفعّل |
| **Password Hashing** | تشفير كلمات المرور بـ Bcrypt | ✅ مفعّل |
| **CORS Protection** | السماح فقط بـ origins محددة | ✅ مفعّل |
| **RBAC** | نظام الأدوار والصلاحيات | ✅ مفعّل |
| **Input Validation** | التحقق من البيانات بـ Zod | ✅ مفعّل |
| **User Ownership** | لا يمكن الوصول لبيانات غيرك | ✅ مفعّل |
| **Error Handling** | معالجة آمنة للأخطاء | ✅ مفعّل |
| **TypeScript** | Type Safety 100% | ✅ مفعّل |

## 📊 Error Handling

### Response Format

#### Success
```json
{
  "message": "Operation completed successfully",
  "data": { ... }
}
```

#### Error
```json
{
  "message": "Error description",
  "errorCode": "ERROR_CODE",
  "errors": [ ... ]  // للـ validation errors
}
```

### Error Codes

| الكود | المعنى |
|------|--------|
| `ACCESS_UNAUTHORIZED` | عدم وجود صلاحيات |
| `AUTH_INVALID_TOKEN` | Token غير صحيح |
| `VALIDATION_ERROR` | البيانات المدخلة غير صحيحة |
| `RESOURCE_NOT_FOUND` | المورد غير موجود |
| `INTERNAL_SERVER_ERROR` | خطأ في الخادم |

---

## 🧪 Testing

### Test Authentication
```bash
# سجل مستخدم جديد
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"Test1234!"}'

# احفظ الـ token من الاستجابة

# جرب endpoint محمي
curl -X GET http://localhost:3000/api/v1/user/current-user \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### Invalid Token Error
```
Error: Invalid token
```
**الحل**: تأكد من:
1. JWT_SECRET صحيح في `.env`
2. Token لم ينتهِ (expiry)
3. Format صحيح: `Bearer TOKEN`

### CORS Error
```
Access to XMLHttpRequest... blocked by CORS policy
```
**الحل**: أضف frontend URL في `.env`
```
FRONTEND_ORIGIN=http://your-frontend:port
```

---

## 📚 مراجع إضافية

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [JWT Introduction](https://jwt.io/introduction)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zod Validation](https://zod.dev/)

---

## 👨‍💻 Author

**Task Management System**
- تطوير يدوي بنسبة 100%

**آخر تحديث**: 2026-06-23

---

**Happy Coding! 🚀**
