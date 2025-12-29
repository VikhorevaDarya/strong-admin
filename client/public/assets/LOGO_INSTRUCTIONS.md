# Инструкция по добавлению логотипа компании

## Куда поместить файлы логотипа

Поместите ваши файлы логотипа в эту папку (`public/assets/`):

### Рекомендуемые файлы:

1. **logo.svg** - Векторный логотип (предпочтительно)
2. **logo.png** - PNG логотип (если нет SVG)
3. **logo-light.svg** - Светлая версия логотипа (для темного фона)
4. **logo-dark.svg** - Темная версия логотипа (для светлого фона)
5. **favicon.ico** - Иконка для браузера

### Рекомендуемые размеры:

- **Логотип для AppBar**: 40x40 px или соотношение сторон 1:1
- **Логотип для Login**: 80x80 px
- **Favicon**: 32x32 px

## Как использовать логотип в коде

### 1. AppBar (верхняя панель)

Откройте файл: `src/layout/AppBar.tsx`

Замените эту часть:
```tsx
<Box
  sx={{
    width: 40,
    height: 40,
    borderRadius: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '1.25rem',
    color: 'white',
  }}
>
  S
</Box>
```

На:
```tsx
<img
  src="/assets/logo-light.svg"
  alt="Company Logo"
  style={{
    width: 40,
    height: 40,
    objectFit: 'contain',
  }}
/>
```

### 2. Login страница

Откройте файл: `src/pages/Login.tsx`

Замените эту часть:
```tsx
<Box
  sx={{
    width: 80,
    height: 80,
    borderRadius: 2,
    backgroundColor: 'primary.main',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '2rem',
    color: 'white',
    mb: 2,
  }}
>
  S
</Box>
```

На:
```tsx
<img
  src="/assets/logo.svg"
  alt="Company Logo"
  style={{
    width: 80,
    height: 80,
    objectFit: 'contain',
  }}
/>
```

### 3. Название компании

Откройте файлы `src/layout/AppBar.tsx` и `src/pages/Login.tsx`

Замените текст "Strong Admin" на название вашей компании.

### 4. Favicon

Замените файл `public/favicon.ico` на ваш favicon.

Обновите `public/index.html`:
```html
<link rel="icon" href="%PUBLIC_URL%/assets/favicon.ico" />
<link rel="apple-touch-icon" href="%PUBLIC_URL%/assets/logo192.png" />
```

## Пример структуры папки assets:

```
public/assets/
├── logo.svg              # Основной логотип
├── logo-light.svg        # Светлая версия (для темного фона)
├── logo-dark.svg         # Темная версия (для светлого фона)
├── favicon.ico           # Иконка браузера
└── LOGO_INSTRUCTIONS.md  # Эта инструкция
```

## Цвета бренда

Откройте файл: `src/theme/theme.ts`

Измените цвета в объекте `brandColors`:

```typescript
const brandColors = {
  primary: {
    main: '#YOUR_PRIMARY_COLOR',    // Ваш основной цвет
    light: '#YOUR_LIGHT_COLOR',     // Светлый оттенок
    dark: '#YOUR_DARK_COLOR',       // Темный оттенок
    contrastText: '#fff',
  },
  secondary: {
    main: '#YOUR_SECONDARY_COLOR',  // Ваш дополнительный цвет
    // ...
  },
};
```

## Готово!

После добавления логотипов и изменения цветов, перезапустите приложение:

```bash
npm start
```
