# 🏥 Clinic Management System
 
A full-stack web application for running a clinic end to end: patient registration, appointment booking, token queues, doctor consultations, digital prescriptions, and pharmacy billing and inventory, all with role-based access for every member of the clinic team.



## ✨ Features
The system supports four roles, each with its own dashboard and permissions.
 
### 🛡️ Admin
- Register a clinic with its logo, GSTIN, and clinic and pharmacy licence details
- Add, view, and terminate staff (doctors, receptionists, pharmacists)
- Dashboard with clinic-wide overview and charts
- View staff details and patient information
### 🧾 Receptionist
- Register new patients and search existing ones
- Book appointments and check availability
- Issue and view queue tokens
- Browse patient history
- Daily reception dashboard
### 🩺 Doctor
- See today's patients and the token queue
- Consult patients and write prescriptions from the medicine list
- View appointments, consultation details, and patient history
- Personal dashboard
### 💊 Pharmacist
- Add and manage medicine inventory
- Generate and approve bills from prescriptions
- View billing history
- Daily and weekly sales dashboards
### 🔐 Security
- JWT authentication stored in HTTP-only cookies
- Role-based authorization middleware on every protected route
- Request validation with Zod
- Passwords hashed with bcrypt

<br>

## Technology Stack

### Frontend
- React 
- TypeScript
- Tailwind CSS 
- Vite
- Axios
- React Router
- Recharts
- Lucide React

### Backend
- Node.js
- Express.js 
- TypeScript
- Drizzle ORM
- Zod
- JWT
- Multer

### Database & Storage
- Neon PostgreSQL
- Cloudinary

### DevOps & Deployment
- Docker
- AWS

<br>

## 📁 Project Structure
 
```
clinic-management/
├── frontend/                 
│   └── src/
│       ├── api/             
│       ├── component/        
│       ├── context/          
│       ├── pages/
│       │   ├── admin/
│       │   ├── doctor/
│       │   ├── pharmacist/
│       │   └── reception/
│       └── types/
├── server/                   
│   ├── server.ts             
│   ├── drizzle/              
│   └── src/
│       ├── routers/          
│       ├── controllers/     
│       ├── services/         
│       ├── middlewares/     
│       ├── validator/        
│       ├── configs/          
│       └── db/schema/        
├── docker-compose.yml        
└── docker-compose.prod.yml   
```


<br>
 
## 🚀 Getting Started
 
### Prerequisites
- [Node.js](https://nodejs.org/) 22 or later
- A PostgreSQL database ([Neon](https://neon.tech/) instance)
- A [Cloudinary](https://cloudinary.com/) account (for logo uploads)
- [Docker](https://www.docker.com/) (optional)

### 1. Clone the repository
 
```
git clone https://github.com/sahalpk888/clinic-management.git
cd clinic-management
```


### 2. Configure environment variables
 
**`server/.env`**

```env
PORT=8000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@host:5432/dbname
JWT_SECRET=your_long_random_secret
 
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```


 
**`frontend/.env`**
 
```env
VITE_BACKEND_URL=http://localhost:8000
```


 
### 3. Run with Docker (recommended)
 
```
docker compose up --build
```
 
- Frontend: http://localhost:5173
- Backend: http://localhost:8000

### 4. Or run manually
 
**Backend**
 
```bash
cd server
npm install
npm run dev
```

 
**Frontend** 
 
```bash
cd frontend
npm install
npm run dev
```


<br>

## 📸 Screenshots

### Landing Page
<img width="800" alt="Landing Page" src="https://github.com/user-attachments/assets/38e91d57-fe04-4ca3-bf75-aff2a7813053" />


### Admin Dashboard
<img width="800"  alt="Dashboard" src="https://github.com/user-attachments/assets/93b855cc-563b-4fdf-bcb1-bbbe5b771e01" />


### Doctor Page
<img width="800" alt="Doctor Page" src="https://github.com/user-attachments/assets/139cdde2-42d5-48e7-af9f-9dd773ae3e66" />



### Prescription Pad
<img width="800" alt="Prescription Pad" src="https://github.com/user-attachments/assets/ccfa9d45-1963-4fc9-8d2e-1d8c8f00bcd0" />


### Patient History
<img width="800" alt="Patient History" src="https://github.com/user-attachments/assets/389a68a2-369e-460a-9bcf-9e313ba67f39" />


### Pharmacy: Add Medicine
<img width="800" alt="Add Medicine" src="https://github.com/user-attachments/assets/b457a966-7fc6-45d3-9438-1d17868f4aae" />


### Pharmacy: Billing
<img width="800" alt="Billing" src="https://github.com/user-attachments/assets/27590755-0159-4bf2-9e48-79689fc8a425" />


<br>

## Future Improvement

- [ ] **Staff portal:** personal page for staff to mark attendance and request leave
- [ ] **ML visit time prediction:** estimate when a token will be called (e.g. Token 32 on Monday ≈ 12 PM) using each clinic's own history
- [ ] **AI receptionist:** chat assistant for booking appointments and answering patient questions
- [ ] Email / SMS appointment reminders
- [ ] Printable prescriptions and invoices

<br>


## 👤 Author
 
**Sahal PK** — [@sahalpk888](https://github.com/sahalpk888)

