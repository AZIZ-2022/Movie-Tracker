# 🎬 Movie Tracker

> **A full-stack movie tracking web app** — search any movie, build your watchlist, and write reviews, powered by the OMDB API, Django REST Framework, and React.

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Django](https://img.shields.io/badge/Django_6-092E20?style=for-the-badge&logo=django&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Repository Structure](#-repository-structure)
- [Data Models](#-data-models)
- [API Reference](#-api-reference)
- [Frontend Architecture](#-frontend-architecture)
- [Environment & Configuration](#-environment--configuration)
- [Getting Started](#-getting-started)
- [Contributing](#-contributing)

---

## 🌟 Overview

Movie Tracker is a full-stack web application that lets users search millions of movies via the **OMDB API**, save favourites to a personal watchlist, and leave star ratings with written reviews. Movies discovered through search are cached locally in MySQL so the app doesn't hit the OMDB API for the same title twice.

The project is a monorepo with two workspaces:

| Workspace | Description |
|---|---|
| `backend/` | Django 6 REST API — JWT auth, OMDB integration, MySQL database |
| `frontend/` | React 19 SPA — search, watchlist, reviews, toast notifications |

---

## ✨ Features

- 🔍 **OMDB-powered search** — search any movie by title and get results from the full OMDB database (millions of titles)
- 💾 **Local movie cache** — movies are saved to MySQL the first time they're viewed, preventing duplicate OMDB API calls
- 📋 **Personal watchlist** — add movies you want to watch; one entry per movie per user (enforced at DB level)
- ⭐ **Reviews & ratings** — rate movies 1–5 stars and write a review; one review per user per movie
- 🔐 **JWT authentication** — access tokens (1-day) + refresh tokens (7-day) with automatic silent refresh and token blacklisting on logout
- 👤 **User profiles** — optional bio and profile picture URL; update profile and change password while logged in
- 🔔 **Toast notifications** — real-time success/error feedback via `react-toastify`
- 🌐 **CORS-ready** — Django configured to accept requests from the React dev server out of the box

---

## 🛠️ Tech Stack

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Python | 3.13 | Runtime |
| Django | 6.0.1 | Web framework |
| Django REST Framework | latest | REST API layer |
| djangorestframework-simplejwt | latest | JWT authentication + token blacklist |
| django-cors-headers | latest | CORS support for React |
| MySQL | latest | Primary relational database |
| OMDB API | — | External movie data source |
| requests | latest | HTTP client for OMDB calls |

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | ^19.2 | UI library |
| Create React App | 5.0.1 | Build toolchain |
| React Router DOM | ^7.13 | Client-side routing |
| Axios | ^1.13 | HTTP client + interceptors |
| react-toastify | ^11.0 | Toast notification system |

---

## 📁 Repository Structure

```
Movie-Tracker/
├── backend/
│   ├── manage.py
│   ├── db.sqlite3                        # Dev fallback (MySQL is primary)
│   │
│   ├── movie_backend/                    # Django project config
│   │   ├── settings.py                   # All settings — DB, JWT, CORS, OMDB key
│   │   ├── urls.py                       # Root URL dispatcher
│   │   ├── wsgi.py
│   │   └── asgi.py
│   │
│   ├── accounts/                         # User auth app
│   │   ├── models.py                     # Custom User (extends AbstractUser)
│   │   ├── serializers.py                # Registration, UserSerializer, ChangePassword
│   │   ├── views.py                      # Register, login, profile, logout, change-password
│   │   └── urls.py                       # /api/auth/* routes
│   │
│   └── movies/                           # Movies app
│       ├── models.py                     # Movie, Watchlist, Review models
│       ├── serializers.py                # MovieSerializer, WatchlistSerializer, ReviewSerializer
│       ├── views.py                      # MovieViewSet, WatchlistViewSet, ReviewViewSet, search
│       ├── utils.py                      # OMDB API helpers (search_omdb, get_movie_details)
│       └── urls.py                       # /api/* routes with DRF router
│
└── frontend/
    ├── package.json
    ├── public/
    │   └── index.html
    └── src/
        ├── App.js                        # Router + layout
        ├── context/
        │   └── AuthContext.js            # Global auth state + login/register/logout
        ├── services/
        │   ├── api.js                    # Axios instance + JWT interceptors
        │   ├── authService.js            # Auth API calls (register, login, logout, profile)
        │   └── movieService.js           # Movie/watchlist/review API calls
        ├── components/
        │   ├── Navbar.js / .css          # Top navigation bar
        │   ├── MovieCard.js / .css       # Movie tile with watchlist + review actions
        │   └── MovieSearch.js / .css     # OMDB search bar + results grid
        └── pages/
            ├── Home.js / .css            # Landing page with feature highlights
            ├── Login.js                  # Login form
            ├── Register.js               # Registration form
            ├── Movies.js / .css          # All movies + search
            ├── Watchlist.js / .css       # User's watchlist
            └── Reviews.js / .css         # User's reviews
```

---

## 🗄️ Data Models

### User *(accounts app)*

Extends Django's `AbstractUser` with extra fields:

| Field | Type | Notes |
|---|---|---|
| `username` | CharField | Inherited from AbstractUser |
| `email` | EmailField | Unique — no two accounts share an email |
| `bio` | TextField | Optional user biography |
| `profile_picture` | URLField | Optional URL to profile image |
| `created_at` | DateTimeField | Auto-set on creation |

---

### Movie *(movies app)*

Cached local copy of OMDB data — fetched once, stored forever:

| Field | Type | Notes |
|---|---|---|
| `imdb_id` | CharField | Unique IMDB ID (e.g. `tt0133093`) |
| `title` | CharField | Movie title, max 300 chars |
| `year` | CharField | Release year |
| `genre` | CharField | Comma-separated genres (e.g. `"Action, Sci-Fi"`) |
| `plot` | TextField | Full plot summary |
| `poster` | URLField | Poster image URL from OMDB |
| `director` | CharField | Director name(s) |
| `actors` | TextField | Comma-separated cast |
| `runtime` | CharField | e.g. `"136 min"` |
| `rating` | CharField | IMDB rating (e.g. `"8.7"`) |
| `created_at` | DateTimeField | When added to local DB |

---

### Watchlist *(movies app)*

| Field | Type | Notes |
|---|---|---|
| `user` | FK → User | Cascade delete |
| `movie` | FK → Movie | Cascade delete |
| `added_at` | DateTimeField | Auto-set |
| — | unique_together | `(user, movie)` — one entry per movie per user |

---

### Review *(movies app)*

| Field | Type | Notes |
|---|---|---|
| `user` | FK → User | Cascade delete |
| `movie` | FK → Movie | Cascade delete |
| `rating` | IntegerField | 1–5 stars (choices enforced) |
| `review_text` | TextField | Optional written review |
| `created_at` | DateTimeField | Auto-set |
| `updated_at` | DateTimeField | Auto-updated on save |
| — | unique_together | `(user, movie)` — one review per movie per user |

---

## 🔌 API Reference

Base URL: `http://127.0.0.1:8000`

Protected routes require: `Authorization: Bearer <access_token>`

### Auth — `/api/auth/`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register/` | Public | Register; returns user object + JWT tokens |
| `POST` | `/api/auth/login/` | Public | Login; returns `access` + `refresh` tokens |
| `POST` | `/api/auth/token/refresh/` | Public | Get new access token using refresh token |
| `POST` | `/api/auth/logout/` | Protected | Blacklist refresh token |
| `GET` | `/api/auth/profile/` | Protected | Get current user's profile |
| `PUT/PATCH` | `/api/auth/profile/update/` | Protected | Update profile fields (partial allowed) |
| `POST` | `/api/auth/change-password/` | Protected | Change password (requires old password) |

**Register request body:**
```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "securepass123",
  "password2": "securepass123"
}
```

**Login response:**
```json
{
  "access": "<access_token>",
  "refresh": "<refresh_token>"
}
```

---

### Movies — `/api/`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/search/?q=matrix` | Public | Search OMDB by title; returns raw OMDB results |
| `GET` | `/api/omdb/<imdb_id>/` | Public | Get full OMDB details for a specific IMDB ID |
| `GET` | `/api/movies/` | Public | List all movies cached in local DB |
| `GET` | `/api/movies/<id>/` | Public | Get single movie from local DB |
| `POST` | `/api/movies/` | Public | Save a movie to local DB by `imdb_id` (no-op if already exists) |
| `GET` | `/api/watchlist/` | Protected | Get current user's watchlist |
| `POST` | `/api/watchlist/` | Protected | Add a movie to watchlist (`movie_id` required) |
| `DELETE` | `/api/watchlist/<id>/` | Protected | Remove item from watchlist |
| `GET` | `/api/reviews/` | Protected | Get current user's reviews (filter by `?movie_id=`) |
| `POST` | `/api/reviews/` | Protected | Create review (`movie_id`, `rating` required) |
| `PATCH` | `/api/reviews/<id>/` | Protected | Update a review |
| `DELETE` | `/api/reviews/<id>/` | Protected | Delete a review |

**Add movie to local DB:**
```json
{ "imdb_id": "tt0133093" }
```

**Add to watchlist:**
```json
{ "movie_id": 1 }
```

**Create review:**
```json
{
  "movie_id": 1,
  "rating": 5,
  "review_text": "A masterpiece of sci-fi cinema."
}
```

---

## 🖥️ Frontend Architecture

### Routing

All routes are defined in `App.js` via React Router v7:

| Path | Component | Description |
|---|---|---|
| `/` | `Home` | Landing page with feature highlights and CTAs |
| `/login` | `Login` | Username + password login form |
| `/register` | `Register` | Registration form |
| `/movies` | `Movies` | Movie search + full movie list |
| `/watchlist` | `Watchlist` | Current user's watchlist |
| `/reviews` | `Reviews` | Current user's reviews |

### Auth Context

`AuthContext.js` wraps the entire app and exposes:

| Value | Type | Description |
|---|---|---|
| `user` | Object / null | Current user's profile data |
| `loading` | Boolean | True while checking stored token on load |
| `isAuthenticated` | Boolean | `!!user` shorthand |
| `login(username, password)` | Function | Calls API, stores tokens, sets user state |
| `register(userData)` | Function | Calls API, stores tokens, sets user state |
| `logout()` | Function | Blacklists refresh token, clears localStorage, clears user state |

### Axios Interceptors (`services/api.js`)

The Axios instance has two interceptors:

**Request interceptor** — automatically attaches `Authorization: Bearer <token>` from `localStorage` to every outgoing request.

**Response interceptor** — on a `401` response, silently tries to refresh the access token using the stored refresh token. If refresh succeeds, the original request is retried transparently. If refresh fails, both tokens are cleared and the user is redirected to `/login`.

### Key Components

| Component | Description |
|---|---|
| `Navbar` | Navigation links; shows Login/Register or username + Logout depending on auth state |
| `MovieSearch` | Search bar that hits `/api/search/`, displays a clickable results grid; clicking a result fetches full OMDB details and saves the movie to the local DB |
| `MovieCard` | Displays a movie tile with poster, title, year, genre, IMDB rating, review count, and buttons to add to watchlist / write a review |

---

## ⚙️ Environment & Configuration

All configuration lives in `backend/movie_backend/settings.py`. The key values to update before running:

### Database (MySQL)

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'movie_tracker_db',   # Create this database first
        'USER': 'root',
        'PASSWORD': 'your_mysql_password',
        'HOST': '127.0.0.1',
        'PORT': '3306',
    }
}
```

### OMDB API Key

```python
OMDB_API_KEY = 'your_omdb_api_key'
```

Get a free key at [omdbapi.com](https://www.omdbapi.com/apikey.aspx).

### Django Secret Key

```python
SECRET_KEY = 'your-secret-key-here'
```

> ⚠️ The default key in `settings.py` is insecure. Generate a new one for any non-local environment:
> ```bash
> python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
> ```

### JWT Settings

| Setting | Default | Description |
|---|---|---|
| `ACCESS_TOKEN_LIFETIME` | 1 day | How long access tokens are valid |
| `REFRESH_TOKEN_LIFETIME` | 7 days | How long refresh tokens are valid |
| `ROTATE_REFRESH_TOKENS` | True | Issues a new refresh token on every refresh |
| `BLACKLIST_AFTER_ROTATION` | True | Old refresh tokens are invalidated immediately |

### CORS

By default, only `http://localhost:3000` and `http://127.0.0.1:3000` are allowed. Add new origins in `settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    # "https://your-production-frontend.com",
]
```

---

## 🚀 Getting Started

### Prerequisites

- Python ≥ 3.10
- Node.js ≥ 16
- MySQL server running locally
- An [OMDB API key](https://www.omdbapi.com/apikey.aspx) (free tier: 1,000 requests/day)

---

### 1 — Clone the repository

```bash
git clone https://github.com/AZIZ-2022/Movie-Tracker.git
cd Movie-Tracker
```

---

### 2 — Create the MySQL database

```sql
CREATE DATABASE movie_tracker_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

### 3 — Backend setup

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # macOS / Linux
venv\Scripts\activate           # Windows

# Install dependencies
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers mysqlclient requests python-dotenv

# Update settings.py with your MySQL password and OMDB API key

# Run migrations
python manage.py makemigrations
python manage.py migrate

# (Optional) Create a Django superuser for the admin panel
python manage.py createsuperuser

# Start the development server  →  http://127.0.0.1:8000
python manage.py runserver
```

---

### 4 — Frontend setup

```bash
cd ../frontend

# Install dependencies
npm install

# Start the React dev server  →  http://localhost:3000
npm start
```

Open [http://localhost:3000](http://localhost:3000), register an account, and start tracking movies!

---

### 5 — Django Admin Panel

Visit [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/) and log in with your superuser credentials to browse and manage all users, movies, watchlist items, and reviews directly.

---

## 🤝 Contributing

Contributions and feature ideas are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes with clear messages
4. Push to your branch: `git push origin feature/your-feature-name`
5. Open a Pull Request against the `main` branch

**Ideas for future improvements:**
- [ ] Add a movie detail page showing full plot, cast, and all reviews from all users
- [ ] Mark watchlist items as "watched" and move them to a watched history
- [ ] Add genre and year filters to the movies page
- [ ] Paginate the movie list
- [ ] Deploy backend to Railway / Render and frontend to Vercel

---

<p align="center">Made with ❤️ by <a href="https://github.com/AZIZ-2022">AZIZ-2022</a></p>
