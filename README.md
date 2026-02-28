# TodoList

Una aplicación móvil de gestión de tareas construida con Ionic y Angular.

## Características

- ✅ CRUD completo de tareas
- ✅ Categorías con colores personalizados
- ✅ Filtrado de tareas (todas, activas, completadas)
- ✅ Paginación e Infinite Scroll para grandes cantidades
- ✅ Exportación de tareas a CSV
- ✅ Compartir tareas
- ✅ SQLite para almacenamiento local
- ✅ Validación de UX: crear categoría antes de tarea
- ⏳ Modo oscuro (planeado)

## Arquitectura

El proyecto sigue una **arquitectura limpia** con las siguientes capas:

```
src/app/
├── pages/          # Vistas/Pantallas
├── components/     # Componentes UI reutilizables
├── services/       # Lógica de negocio
├── repositories/   # Acceso a datos
├── adapters/       # Abstracción de SQLite
├── models/         # Tipos e interfaces TypeScript
└── utils/          # Funciones helper
```

### ¿Por qué esta arquitectura?

| Decisión | Justificación |
|----------|---------------|
| **Repository Pattern** | Si necesitas cambiar la fuente de datos (ej: de SQLite a Firebase, API REST, o IndexedDB), solo modificas el repository. El resto de la app funciona sin cambios. |
| **Signals (Angular 20)** | Mejor rendimiento que RxJS para estado local, sintaxis más simple y reactiva. |
| **SQLite local** | Datos offline sin necesidad de backend. El adapter abstrae la implementación. |
| **Jest para testing** | Más rápido que Karma, mejor DX con watch mode. |
| **Validación de UX** | En lugar de un guard que redirija a categorías (confundiendo al usuario), se muestra un alerta que permite crear la categoría desde el mismo flujo. |
| **Infinite Scroll** | Ionic proporciona `<ion-infinite-scroll>` para cargar tareas progresivamente, evitando lentitud con grandes volúmenes de datos. |

### Flujo de datos

```
Page → Service → Repository → Adapter (SQLite)
         ↓
    Signals (estado reactivo)
```

## Stack Tecnológico

- **Framework**: Ionic 8 + Angular 20
- **Mobile**: Capacitor 8
- **Database**: SQLite (@capacitor-community/sqlite)
- **Testing**: Jest
- **Cloud**: Firebase Remote Config

## Requisitos

- Node.js 22.12+
- npm 10+

## Instalación

```bash
npm install
npm start
```

## Desarrollo

```bash
# Servidor de desarrollo
npm start

# Tests unitarios
npm test

# Tests en modo watch
npm run test:watch

# Coverage
npm run test:coverage

# Build producción
npm run build

# Lint
npm run lint
```

## Generar APK (Android)

```bash
# Build + sincronizar con Android
npm run build
npx cap sync android

# Generar APK debug
npx cap run android

# APK release (requiere firma)
cd android && ./gradlew assembleRelease
```

## Generar IPA (iOS - macOS)

```bash
# Agregar plataforma si no existe
npx cap add ios

# Build + sincronizar con iOS
npm run build
npx cap sync ios

# Abrir en Xcode
npx cap open ios

# En Xcode: Product → Build → Archive → Distribute
```

## Contributing

1. Fork el repositorio
2. Crear una rama (`git checkout -b feature/amazing`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing`)
5. Abrir un Pull Request

## Licencia

MIT
