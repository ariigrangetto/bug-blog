# 🐛 BugBlog

A modern, developer-focused web application designed to log, track, manage, and document software bugs and code solutions. **BugBlog** combines a sleek hacker aesthetic with robust bug-tracking capabilities, featuring custom code editors, real-time filtering, syntax classification, and secure multi-user authentication.

---

## 🚀 Features

- 🔐 **Secure User Authentication**: Complete authentication workflow (Sign Up, Log In, Password Reset, and Password Update) powered by Supabase Auth.
- 🔒 **Row Level Security (RLS)**: Strict database-level policies ensuring user data isolation so developers only access their own logged bugs.
- 📝 **Interactive Bug & Solution Logging**: Create and edit detailed bug reports with title, category, severity, programming language, code snippets, and solution explanations.
- 🎨 **Code Editor & Formatting**: Custom code editing component with line numbering, dynamic text handling, and multi-language support.
- ⚡ **Filter & Search**: Quick filtering by severity (*Critical*, *High*, *Medium*, *Low*) or status (*Open*, *Solved*), along with instant search.
- 💻 **Cyberpunk / Hacker Aesthetic**: Integrated canvas effects (Matrix Rain background), dynamic status badges, and styled components built with Tailwind CSS v4.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Routing**: [React Router](https://reactrouter.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Optimization**: React Compiler (`babel-plugin-react-compiler`)

### **Backend & Database**
- **BaaS**: [Supabase](https://supabase.com/) (PostgreSQL, Supabase Auth, Row Level Security)
- **Client**: `@supabase/supabase-js`

---

## 📁 Project Structure

```text
bugblog/
├── public/                 # Static assets
├── src/
│   ├── assets/             # Images and graphic assets
│   ├── components/         # Shared UI components
│   ├── features/           # Feature-specific modules
│   │   ├── AuthShell.tsx   # Wrapper for authentication views
│   │   ├── BugBlogLogo.tsx # App branding & logo component
│   │   ├── CodeEditor.tsx  # Code editor with line numbers
│   │   ├── DetailView.tsx  # Detailed bug drawer / modal
│   │   ├── Form.tsx        # Bug creation and edition form
│   │   ├── MatrixRain.tsx  # Canvas Matrix digital rain animation
│   │   ├── SeverityBadge.tsx # Severity indicators
│   │   └── StatusBadge.tsx # Status indicators (Open / Solved)
│   ├── hooks/              # Custom React hooks (e.g., useBugs)
│   ├── pages/              # Application views & route targets
│   │   ├── Auth/           # Auth pages (Login, Register, ResetPw, Update)
│   │   ├── Dashboard.tsx   # Main dashboard for bug management
│   │   ├── Landing.tsx     # Hero landing page
│   │   └── ErrorPage.tsx   # Error handling view
│   ├── services/           # API and Supabase client abstractions
│   ├── styles/             # Global style sheets
│   ├── utils/              # Helper functions, Supabase instance, & TypeScript types
│   ├── RootLayout.tsx      # Main layoutwrapper with animations & navigation
│   ├── main.tsx            # React application entrypoint
│   └── router.tsx          # React Router route configuration & auth guards
├── .env.example            # Sample environment variables template
├── supabase_rls_security.sql # SQL migration script for Supabase RLS policies
├── package.json            # Project dependencies & scripts
├── vite.config.ts          # Vite configuration
└── README.md               # Project documentation
```

---

## 📋 Prerequisites

Before running this project locally, ensure you have the following installed:

- **Node.js**: `v18.0.0` or higher
- **Package Manager**: `npm` (v9+) or `pnpm` (v8+)
- **Supabase Account**: A active Supabase project (for database & auth)

---

## ⚙️ Getting Started

Follow these steps to set up and run BugBlog on your local environment.

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/bugblog.git
cd bugblog
```

### 2. Install Dependencies

Using `pnpm` (recommended):
```bash
pnpm install
```

Or using `npm`:
```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the project root directory:

```bash
cp .env.example .env
```

Add your Supabase credentials into `.env`:

```env
VITE_SUPABASE_URL=https://your-supabase-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

> 💡 You can find these values in your Supabase Project Dashboard under **Project Settings > API**.

---

## 🗄️ Database Setup (Supabase)

To prepare your Supabase PostgreSQL database for BugBlog:

1. Go to your **Supabase Dashboard** -> **SQL Editor**.
2. Create the `Bugs` table if it does not already exist:

```sql
CREATE TABLE public."Bugs" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    code TEXT NOT NULL,
    solution TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Open', 'Solved')),
    severity TEXT NOT NULL CHECK (severity IN ('Critical', 'High', 'Medium', 'Low')),
    category TEXT NOT NULL CHECK (category IN ('Runtime', 'Logic', 'UI', 'Performance', 'Security', 'Network', 'Other')),
    language TEXT NOT NULL
);
```

3. Run the security script provided in the repository ([supabase_rls_security.sql](file:///c:/Users/Admin/react/bugblog/supabase_rls_security.sql)) to enable Row Level Security (RLS) policies:

```bash
# Execute contents of supabase_rls_security.sql in Supabase SQL Editor
```

This guarantees that users can only **Create**, **Read**, **Update**, and **Delete** their own bug entries.

---

## 🏷️ Bug Categories & Severity Levels

| Severity | Description |
| :--- | :--- |
| **Critical** | Blockers causing application crashes or system outages |
| **High** | Major issues breaking key functionalities |
| **Medium** | Moderate bugs or visual degradation |
| **Low** | Minor tweaks, text typos, or subtle UI glitches |

| Category | Typical Scenarios |
| :--- | :--- |
| **Runtime** | Unhandled exceptions, null pointer crashes |
| **Logic** | Incorrect calculations or algorithmic flaws |
| **UI** | CSS layout shifts, responsiveness issues |
| **Performance** | Memory leaks, slow render loops |
| **Security** | Auth bypasses, missing data encryption |
| **Network** | API timeouts, CORS failures |
| **Other** | Miscellaneous items |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to check the repository issues or submit a pull request.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
