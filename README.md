# Blogify - A Modern Blogging Platform 🌐📝

Blogify is a modern full-stack blog platform where users can register, log in, create blog posts, comment, and manage their content seamlessly. Built with Node.js, Express, MongoDB, and EJS, Blogify delivers a clean and interactive experience for bloggers and readers alike.

---

## 🖼 Screenshots
### 🔹 Register Page
![Register](https://github.com/user-attachments/assets/80334afc-6f92-4780-a7d3-011e5d5a760c)


### 🔹 Login Page
![Login](https://github.com/user-attachments/assets/d0880d92-0052-453a-91ef-06067c15d594)


### 🔹 Home Page
![Profile](https://github.com/user-attachments/assets/b1dfbac1-245e-4a9a-a012-e43955905a5d)


### 🔹 Blog Page
![Upload](https://github.com/user-attachments/assets/ba21e780-234b-48b9-8222-6a15cb41419b)


## Features ✨

### User Authentication 🔐
- Register and log in using secure authentication
- Session-based login system with encrypted passwords

### Blog Management 📝
- Create, edit, delete blog posts
- Each post includes title, content, thumbnail image, and author info

### Comment System 💬
- Authenticated users can add and view comments under posts
- Shows commenter name and comment time

### Clean UI/UX 🎨
- Built with Tailwind CSS for a modern responsive layout
- Dynamic navigation based on login state

---

## Tech Stack 🛠️
- **Backend**: Node.js, Express.js
- **Frontend**: EJS, Tailwind CSS
- **Database**: MongoDB (for storing posts, users, and comments)
- **Authentication**: bcrypt, JWT (for secure login and registration)
- **Deployment**: AWS Elastic Beanstalk

---

## Getting Started (Local Setup) 🚀

### Clone the Repository
```bash
git clone https://github.com/yourusername/blogify.git
cd blogify
```

### Install Dependencies
```bash
npm install
```

### Set Up Environment Variables
Create a `.env` file in the root with:
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_secret_key
```

### Run the Server
```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deployment (AWS Elastic Beanstalk) ☁️
The project is deployed using **AWS Elastic Beanstalk**, which automatically manages the infrastructure for deploying the application. This allows for automatic scaling, monitoring, and easy management of the app in the cloud.

### Set Environment Variables
Go to:
```
AWS Elastic Beanstalk Console → Your Environment → Configuration → Software → Edit Environment Properties
```
Set `MONGO_URL`, `PORT`, and `SECRET`.

### Visit the App 🌍
Open the provided Elastic Beanstalk domain in your browser.

---

## Future Enhancements 🔮
- Rich text editor for posts
- Likes/bookmarks for blogs
- Social login (Google/GitHub)
- Tags and search functionality
- REST API for mobile clients

---

## Contributing 🤝
Pull requests are welcome. For major changes, please open an issue first.

---

## License 📄
MIT

