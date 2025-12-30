# 🚀 Деплой Strong Admin на Vercel

## 📋 Что нужно знать

**Важно!** Vercel подходит только для фронтенда (React приложения). PocketBase (бэкенд) нужно деплоить отдельно.

### Структура проекта:
- `client/` - React приложение → **Vercel**
- `pocketbase` - Backend сервер → **Railway / Fly.io / Render**

## 🎯 Шаг 1: Деплой PocketBase (Backend)

### Рекомендуемые платформы для PocketBase:

#### Вариант A: Railway (Рекомендуется)
1. Зарегистрируйтесь на [Railway.app](https://railway.app)
2. Создайте новый проект
3. Deploy from GitHub
4. Выберите ваш репозиторий
5. Railway автоматически определит PocketBase
6. Получите URL (например: `https://your-app.railway.app`)

#### Вариант B: Fly.io
1. Установите Fly CLI: `brew install flyctl` (Mac) или скачайте с [fly.io](https://fly.io)
2. Войдите: `flyctl auth login`
3. В корне проекта:
   ```bash
   flyctl launch
   ```
4. Следуйте инструкциям
5. Деплой: `flyctl deploy`

#### Вариант C: Render
1. Зарегистрируйтесь на [Render.com](https://render.com)
2. New → Web Service
3. Connect GitHub
4. Build Command: `chmod +x pocketbase && ./pocketbase serve --http=0.0.0.0:$PORT`
5. Start Command: `./pocketbase serve --http=0.0.0.0:$PORT`

**После деплоя PocketBase получите URL**, например:
```
https://strong-admin-pb.railway.app
```

## 🎨 Шаг 2: Деплой фронтенда на Vercel

### A. Через Vercel Dashboard (Рекомендуется)

1. **Зайдите на [Vercel.com](https://vercel.com)**
2. **Войдите через GitHub**
3. **Import Project**
   - Нажмите "Add New..." → "Project"
   - Выберите репозиторий `strong-admin`

4. **Configure Project**

   **Root Directory:**
   ```
   client
   ```

   **Framework Preset:**
   ```
   Create React App
   ```

   **Build Settings:**
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install --legacy-peer-deps`

5. **Environment Variables**

   Добавьте переменную:
   ```
   REACT_APP_POCKETBASE_URL = https://ваш-pocketbase-url.railway.app
   ```

   Замените `https://ваш-pocketbase-url.railway.app` на реальный URL вашего PocketBase сервера.

6. **Deploy**
   - Нажмите "Deploy"
   - Дождитесь завершения (~2-3 минуты)
   - Получите URL (например: `https://strong-admin.vercel.app`)

### B. Через Vercel CLI

```bash
# Установите Vercel CLI
npm install -g vercel

# Войдите
vercel login

# В корне проекта
vercel

# Следуйте инструкциям:
# 1. Set up and deploy? Yes
# 2. Which scope? Выберите ваш аккаунт
# 3. Link to existing project? No
# 4. Project name? strong-admin
# 5. In which directory is your code located? ./client
# 6. Want to override settings? Yes
# 7. Build Command: npm run build
# 8. Output Directory: build
# 9. Development Command: npm start

# Добавьте переменную окружения
vercel env add REACT_APP_POCKETBASE_URL

# Введите URL вашего PocketBase
https://ваш-pocketbase-url.railway.app

# Выберите все окружения (production, preview, development)

# Деплой
vercel --prod
```

## ⚙️ Шаг 3: Настройка PocketBase

После деплоя PocketBase нужно настроить CORS:

1. **Откройте PocketBase Admin:** `https://ваш-pocketbase-url.railway.app/_/`
2. **Settings → Application**
3. **Allowed origins:** Добавьте ваш Vercel домен
   ```
   https://strong-admin.vercel.app
   http://localhost:3000
   ```

## 🔧 Troubleshooting

### Ошибка: "Module not found"
```bash
# В client/package.json убедитесь, что все зависимости установлены
cd client
npm install --legacy-peer-deps
```

### Ошибка: "Failed to connect to PocketBase"
1. Проверьте, что PocketBase запущен
2. Проверьте переменную `REACT_APP_POCKETBASE_URL` в Vercel
3. Проверьте CORS в PocketBase Admin

### Build fails на Vercel
1. Проверьте логи сборки в Vercel Dashboard
2. Убедитесь, что Root Directory = `client`
3. Проверьте Build Command: `npm run build`
4. Проверьте Install Command: `npm install --legacy-peer-deps`

## 📊 Мониторинг

### Vercel Dashboard
- Деплои: https://vercel.com/dashboard
- Логи: Project → Deployments → View Logs
- Analytics: Project → Analytics

### PocketBase Admin
- Данные: `https://ваш-pocketbase-url/_/`
- Логи: В зависимости от платформы (Railway/Fly.io/Render)

## 🔄 Автоматический деплой

После настройки, каждый push в GitHub будет автоматически деплоить:
- **main branch** → Production
- **другие ветки** → Preview

## 📝 Полезные команды

```bash
# Посмотреть список деплоев
vercel ls

# Открыть проект в браузере
vercel open

# Посмотреть логи
vercel logs

# Удалить деплой
vercel rm [deployment-url]

# Добавить домен
vercel domains add yourdomain.com
```

## 🌐 Кастомный домен

1. **В Vercel Dashboard:**
   - Project → Settings → Domains
   - Add Domain
   - Введите ваш домен (например: `admin.yourdomain.com`)

2. **У регистратора домена:**
   - Добавьте A запись или CNAME
   - Следуйте инструкциям Vercel

3. **SSL сертификат:**
   - Vercel автоматически настроит Let's Encrypt

## 💾 Backup данных PocketBase

```bash
# Локально сохраните pb_data
scp user@server:/path/to/pb_data ./pb_data_backup

# Или используйте функцию backup платформы (Railway/Fly.io/Render)
```

## 🔐 Безопасность

### Vercel Environment Variables
✅ Используйте для:
- API ключей
- Database URLs
- Секретных токенов

❌ НЕ коммитьте в Git:
- `.env` файлы
- Секреты в коде

### PocketBase
1. Включите HTTPS
2. Настройте сильные пароли
3. Регулярно обновляйте
4. Включите rate limiting

## 📚 Полезные ссылки

- [Vercel Docs](https://vercel.com/docs)
- [PocketBase Docs](https://pocketbase.io/docs/)
- [Railway Docs](https://docs.railway.app/)
- [Fly.io Docs](https://fly.io/docs/)

## ✅ Checklist перед деплоем

- [ ] PocketBase задеплоен и работает
- [ ] Получен URL PocketBase
- [ ] Добавлена переменная `REACT_APP_POCKETBASE_URL` в Vercel
- [ ] Настроен CORS в PocketBase
- [ ] Root Directory = `client` в Vercel
- [ ] Build Command = `npm run build`
- [ ] Install Command = `npm install --legacy-peer-deps`
- [ ] Проект собирается локально без ошибок
- [ ] Созданы тестовые данные в PocketBase

## 🎉 Готово!

После выполнения всех шагов ваше ��риложение будет доступно по адресу:
```
Frontend: https://strong-admin.vercel.app
Backend: https://ваш-pocketbase-url.railway.app
Admin Panel: https://ваш-pocketbase-url.railway.app/_/
```

Удачи с деплоем! 🚀
