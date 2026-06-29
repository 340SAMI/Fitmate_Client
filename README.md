# 💪 IronPulse — Fitness & Gym Management Platform

A comprehensive fitness platform for gym enthusiasts, trainers, and administrators. Discover classes, book sessions, track your fitness journey, and engage with a thriving community forum.

---

## 🌐 Live URL

> [https://your-live-link.vercel.app](https://your-live-link.vercel.app)

---

## ✨ Key Features

### 👤 User
- Register and log in via credentials or Google (Better Auth)
- Browse and search fitness classes by name and category
- Book classes via Stripe payment
- Save favorite classes to a personal dashboard
- Apply to become a trainer
- Read, comment, like, and dislike community forum posts

### 🏋️ Trainer
- Create and manage fitness classes (pending admin approval)
- View enrolled students per class
- Post and manage articles on the community forum

### 🛡️ Admin
- Manage all users — block/unblock, promote to admin
- Approve or reject trainer applications with feedback
- Demote existing trainers
- Approve, reject, or delete submitted classes
- Moderate all community forum posts
- View full Stripe payment transaction history
- Post on the community forum

### 🔒 Security & Access Control
- Role-based access control (User / Trainer / Admin)
- Blocked users cannot book, apply, or comment
- Private routes protected — no redirect on reload
- Environment variables for all sensitive keys

---

## 📦 NPM Packages Used

| Package | Purpose |
|---|---|
| `next` | React framework |
| `react` / `react-dom` | UI library |
| `better-auth` | Authentication (credentials + Google) |
| `@stripe/stripe-js` | Stripe frontend SDK |
| `stripe` | Stripe backend SDK |
| `mongoose` / `mongodb` | MongoDB database |
| `axios` | HTTP requests |
| `framer-motion` | Homepage animations |
| `react-hot-toast` | Toast notifications |
| `tailwindcss` | Utility-first CSS styling |
| `lucide-react` | Icons |
| `react-hook-form` | Form handling |
| `imgbb-uploader` | Image uploads to ImgBB |
| `date-fns` | Date formatting |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Stripe account
- ImgBB API key

### Installation

```bash
git clone https://github.com/your-username/ironpulse-client.git
cd ironpulse-client
npm install
```

### Environment Variables

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Run Locally

```bash
npm run dev
```

---

## 🗂️ Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── (public)/         # Home, Classes, Forum
│   ├── (private)/        # Class Details, Forum Post, Payment
│   └── dashboard/        # Role-based dashboard pages
├── components/           # Reusable UI components
├── lib/                  # API helpers, auth config
└── styles/               # Global styles
```

---

## 📸 Screenshots

> *(Add screenshots here after deployment)*

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@your-username](https://github.com/your-username)
- Email: your@email.com

---

## 📄 License

This project is for educational purposes only.