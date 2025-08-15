# 📚 Cuenta Cuentos - App de Historias Interactivas

## 🎯 Descripción

Cuenta Cuentos es una aplicación móvil que permite a los usuarios disfrutar de historias interactivas donde pueden tomar decisiones que afectan el desarrollo de la narrativa.

## 🏗️ Arquitectura

### **Backend-First Approach**

- ✅ **Solo Backend**: Toda la funcionalidad depende del servidor backend
- ✅ **Sin Fallbacks Locales**: No hay historias almacenadas localmente
- ✅ **Sincronización en Tiempo Real**: Todas las decisiones se envían al servidor
- ✅ **Persistencia Centralizada**: El progreso se guarda exclusivamente en el backend

### **Componentes Principales**

- **Frontend**: React Native con Expo
- **Backend**: API REST con Node.js/Express
- **Base de Datos**: PostgreSQL/MySQL (configurado en el backend)
- **Autenticación**: JWT tokens

## 🚀 Configuración

### **1. Configuración del Backend**

Edita `lib/config.ts` para configurar la URL de tu servidor:

```typescript
export const BACKEND_CONFIG = {
  BASE_URL: "http://tu-ip:puerto", // Cambia esta URL
  API_BASE_URL: "http://tu-ip:puerto/api",
  // ... más configuraciones
};
```

### **2. Variables de Entorno**

Asegúrate de que tu backend tenga configurado:

- Puerto del servidor
- Base de datos
- JWT secret
- CORS settings

## 📱 Funcionalidades

### **Autenticación**

- Login/Registro de usuarios
- JWT tokens para sesiones
- Almacenamiento seguro de credenciales

### **Historias**

- **Tipo 'cuento'**: Historias estáticas (solo lectura)
- **Tipo 'story'**: Historias interactivas con sesiones del backend
- Progreso guardado en tiempo real
- Historial de decisiones tomadas

### **Sistema de Sesiones**

- Cada historia interactiva crea una sesión única
- Las elecciones se envían al backend inmediatamente
- Estado sincronizado entre cliente y servidor

## 🔧 Endpoints del Backend

### **Autenticación**

- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario

### **Historias**

- `GET /api/unified-stories` - Obtener todas las historias
- `GET /api/unified-stories/graph/:storyKey` - Obtener grafo de historia
- `POST /api/stories/start` - Iniciar historia interactiva
- `POST /api/stories/choice` - Enviar elección del usuario
- `GET /api/stories/sessions` - Obtener historial del usuario

## 📁 Estructura del Proyecto

```
cuenta_cuentos/
├── app/                    # Pantallas de la app
│   ├── (auth)/            # Autenticación
│   ├── (tabs)/            # Navegación principal
│   └── story/              # Reproductor de historias
├── components/             # Componentes reutilizables
├── lib/                    # Servicios y configuración
│   ├── config.ts          # Configuración centralizada
│   ├── apiService.ts      # Servicio de API
│   └── playedStories.ts   # Gestión de historias jugadas
├── hooks/                  # Hooks personalizados
└── constants/              # Constantes (solo Colors)
```

## 🚨 Requisitos del Backend

### **Base de Datos**

- Tabla `users` para autenticación
- Tabla `stories` para historias disponibles
- Tabla `sessions` para sesiones activas
- Tabla `choices` para decisiones de usuarios

### **Autenticación**

- JWT tokens con expiración
- Middleware de autenticación
- Validación de tokens en endpoints protegidos

### **CORS**

- Configurar para permitir requests desde la app móvil
- Headers de autorización

## 🔄 Flujo de una Historia

1. **Usuario inicia historia** → Se crea sesión en el backend
2. **Usuario hace elección** → Se envía al servidor inmediatamente
3. **Backend procesa** → Actualiza estado de la sesión
4. **Frontend recibe** → Actualiza la interfaz
5. **Historia termina** → Sesión se marca como completada
6. **Progreso guardado** → Disponible en el historial del usuario

## 🛠️ Desarrollo

### **Instalación**

```bash
npm install
```

### **Ejecutar**

```bash
npm start
```

### **Dependencias Principales**

- React Native
- Expo
- React Navigation
- Day.js para fechas
- React Native Reanimated para animaciones

## 📝 Notas Importantes

- **Sin Conexión**: La app no funcionará sin conexión al backend
- **Tokens**: Los tokens JWT se almacenan en SecureStore
- **Sesiones**: Cada historia interactiva requiere una sesión activa
- **Cache**: Solo se cachean datos del backend, no hay datos locales

## 🐛 Troubleshooting

### **Error de Conexión**

- Verifica que el backend esté ejecutándose
- Confirma la URL en `lib/config.ts`
- Revisa logs del servidor

### **Error de Autenticación**

- Verifica que el token JWT sea válido
- Confirma que el usuario esté autenticado
- Revisa expiración del token

### **Historia No Carga**

- Verifica que el `storyKey` exista en el backend
- Confirma permisos del usuario
- Revisa logs del servidor

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
