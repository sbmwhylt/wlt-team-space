Node Based Web App System Template

-----------------------------------------------------

Frontend/client: React + TailwindCSS + Vite

- React → UI library
- TailwindCSS → utility-first styling
- Vite → fast development build tool

Installation: 
- npm create vite@latest client || frontend -- --template react
- npm install tailwindcss @tailwindcss/vite
- npm install react-router-dom@latest
- npm install react-hot-toast@latest
- npm install lucide-react@latest
- npm install axios@latest

optional:
- npx shadcn@latest init (if using tailwind component library) refer to https://ui.shadcn.com/docs/installation/vite

-----------------------------------------------------


Backend/server: Node + Express JS + sequelize pg + bcyrpt + jsonwebtoken + dotenv + CORS + nodemon 
Database: PostgresQL


- express → web framework
- sequilize → 
- bcrypt → password hashing
- jsonwebtoken → JWT for auth
- dotenv → env vars
- cors → handle cross-origin requests
- nodemon → auto-restart during dev

Installation: 
- npm install express sequelize  bcrypt jsonwebtoken dotenv cors pg pg-hstore
- npm install --save-dev nodemon