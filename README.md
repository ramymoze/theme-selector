# 🎨 Next.js Theme Selector

A **Next.js Theme Selector** built to make choosing project themes easier for **students and teammates in an educational context**.

The platform ensures that **each theme can only be selected once** — when a student chooses a theme, it becomes unavailable to others. An **Admin Dashboard** allows supervisors or teachers to monitor selections and student data in real time.

---

## 🚀 Features

### 👩‍🎓 Student Side

* Browse available project themes
* Select **one unique theme** (locked after selection)
* Real-time availability updates
* Prevents duplicate theme selection
* Simple and intuitive UI

### 🛠️ Admin Dashboard

* View all students and their selected themes
* See unselected / available themes
* Monitor assignment progress
* Centralized data management

---

## 🧠 Use Case

This project is designed for:

* University courses
* Group projects
* Hackathons
* Academic assignments

It eliminates conflicts by ensuring **fair theme distribution** among students.

---

## 🏗️ Tech Stack

* **Next.js** 
* **TypeScript** (optional but recommended)
* **Database** (Supabase / PostgreSQL )
* **Tailwind CSS / CSS Modules**

---



## 🔐 Theme Locking Logic

* Each theme has a `status` field (`available | selected`)
* Once a student selects a theme:

  * Theme status becomes `selected`
  * Theme is locked for other users
* Admin can view all selections in real time

---

## 📊 Admin Dashboard Overview

The admin panel allows:

* Viewing all registered students
* Seeing selected themes per student
* Identifying available and locked themes
* Managing or resetting selections (optional)

---

## ⚙️ Environment Variables

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=your_database_url```

---

## ▶️ Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🔮 Future Improvements

* Theme reset by admin
* Deadline-based locking
* Notifications for students
* Role-based permissions

---

## 🤝 Contributors

This project was built for **educational collaboration** to simplify theme assignment and avoid conflicts.

Feel free to improve or adapt it for your institution.

---

## This project is for **educational use**. You may modify and reuse it freely.

---

⭐ If this project helped you, feel free to give it a star!
