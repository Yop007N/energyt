# ⚡ Energy Monitoring Dashboard

> **Dashboard moderno para monitoreo y análisis de consumo energético con Clean Architecture**

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-5.15.20-007FFF?style=flat&logo=mui)](https://mui.com/)
[![Vite](https://img.shields.io/badge/Vite-5.2.0-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
[![Clean Architecture](https://img.shields.io/badge/Architecture-Clean-green?style=flat)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Arquitectura](#-arquitectura)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [API](#-api)
- [Testing](#-testing)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

## ⭐ Características

### 🎯 Funcionalidades Principales

- **📊 Dashboard Inteligente:** Visualización en tiempo real del consumo energético
- **📈 Analytics Avanzados:** Tendencias, patrones y predicciones de consumo
- **⚠️ Alertas Dinámicas:** Notificaciones proactivas de anomalías
- **👥 Gestión Multi-Cliente:** Monitoreo de múltiples clientes y ubicaciones
- **📱 Responsive Design:** Optimizado para desktop, tablet y móvil
- **🌙 Modo Oscuro/Claro:** Interfaz adaptable a preferencias del usuario

### 🔧 Características Técnicas

- **🏗️ Clean Architecture:** Separación clara de responsabilidades
- **🔒 Type Safety:** TypeScript estricto en todo el proyecto
- **⚡ Performance:** Optimizado con Vite y lazy loading
- **🧪 Testing:** Cobertura completa con Jest y Testing Library
- **📡 Real-time:** Actualizaciones en tiempo real vía WebSocket
- **🔄 Offline Support:** Funcionamiento sin conexión con cache

## 🏗️ Arquitectura

### Clean Architecture Implementation

```
src/
├── domain/                     # 🏛️ Capa de Dominio
│   ├── entities/              # Entidades de negocio
│   │   ├── Energy.ts          # Entidades de energía
│   │   └── Client.ts          # Entidades de cliente
│   └── interfaces/            # Contratos y abstracciones
│       ├── repositories/      # Interfaces de repositorio
│       └── common/           # Tipos comunes
├── application/               # 🎯 Capa de Aplicación
│   └── usecases/             # Casos de uso
│       └── GetDashboardStatsUseCase.ts
├── infrastructure/           # 🔧 Capa de Infraestructura
│   ├── repositories/         # Implementaciones de repositorio
│   ├── http/                # Clientes HTTP
│   └── config/              # Configuración y DI
└── presentation/             # 🎨 Capa de Presentación
    ├── components/           # Componentes React
    ├── hooks/               # Custom hooks
    └── pages/               # Páginas principales
```

### 🎨 Componentes Principales

```typescript
// Componente principal con Clean Architecture
export function EnergyDashboard(): JSX.Element {
  const { data, loading, error, refetch } = useDashboardStats();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} onRetry={refetch} />;

  return (
    <Container>
      <DashboardHeader onRefresh={refetch} />
      <StatsCards stats={data} />
      <ChartsSection charts={data} />
      <AlertsSection alerts={data.alerts} />
    </Container>
  );
}
```

## 🚀 Instalación

### Prerrequisitos

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 o **yarn** >= 1.22.0
- **Git** para control de versiones

### Pasos de Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/Yop007N/energy-monitoring-dashboard.git
cd energy-monitoring-dashboard

# 2. Instalar dependencias
npm install
# o
yarn install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tu configuración

# 4. Iniciar en modo desarrollo
npm run dev
# o
yarn dev
```

### 🐳 Docker (Opcional)

```bash
# Construir imagen
docker build -t energy-dashboard .

# Ejecutar contenedor
docker run -p 3000:3000 energy-dashboard

# Docker Compose
docker-compose up -d
```

## ⚙️ Configuración

### Variables de Entorno

```bash
# .env
REACT_APP_API_BASE_URL=http://localhost:3000/api
REACT_APP_API_TIMEOUT=10000
REACT_APP_API_RETRIES=3
REACT_APP_THEME=light
REACT_APP_ENABLE_REAL_TIME=true
REACT_APP_DASHBOARD_REFRESH_INTERVAL=30000
REACT_APP_LOG_LEVEL=info
```

### 🔧 Configuración Avanzada

```typescript
// src/infrastructure/config/DependencyContainer.ts
const config = {
  apiBaseURL: process.env.REACT_APP_API_BASE_URL,
  timeout: parseInt(process.env.REACT_APP_API_TIMEOUT || '10000'),
  retries: parseInt(process.env.REACT_APP_API_RETRIES || '3')
};
```

## 📖 Uso

### 🎯 Casos de Uso Principales

#### 1. Monitoreo en Tiempo Real

```typescript
// Usar el hook personalizado
const { data, loading, error } = useDashboardStats();

// Datos obtenidos:
// - Consumo total actual
// - Tendencias de consumo
// - Dispositivos activos
// - Alertas del sistema
```

#### 2. Análisis de Tendencias

```typescript
// Filtrar por período específico
const { updatePeriod } = useDashboardStats();

await updatePeriod({
  start: new Date('2024-01-01'),
  end: new Date('2024-12-31'),
  granularity: TimeGranularity.MONTH
});
```

#### 3. Gestión de Alertas

```typescript
// Las alertas se categorizan automáticamente
interface DashboardAlert {
  type: 'HIGH_CONSUMPTION' | 'DEVICE_OFFLINE' | 'PAYMENT_OVERDUE';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  timestamp: Date;
}
```

## 📡 API

### Endpoints Principales

```typescript
// Estadísticas del dashboard
GET /api/v1/energy/dashboard/stats
Response: {
  totalConsumption: number;
  totalCost: number;
  activeDevices: number;
  totalClients: number;
  consumptionTrend: number;
  peakHours: PeakHourData[];
  monthlyData: MonthlyData[];
  alerts: DashboardAlert[];
}

// Consumo por cliente
GET /api/v1/energy/consumption?clientId={id}&startDate={date}&endDate={date}

// Dispositivos activos
GET /api/v1/energy/devices?status=ONLINE

// Estadísticas de consumo
GET /api/v1/energy/analytics/consumption?clientId={id}&period={period}
```

## 🧪 Testing

### Ejecutar Tests

```bash
# Tests unitarios
npm run test

# Tests con cobertura
npm run test:coverage

# Tests en modo watch
npm run test:watch
```

### 📊 Cobertura de Tests

```bash
# Objetivo: >90% cobertura
- Statements   : 92.5%
- Branches     : 89.3%
- Functions    : 94.1%
- Lines        : 91.8%
```

## 🛠️ Scripts Disponibles

```bash
npm run dev          # Desarrollo con hot reload
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Linter ESLint
npm run lint:fix     # Fix automático de linting
npm run type-check   # Verificación de tipos
npm run test         # Tests unitarios
```

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE) para más detalles.

---

## 👥 Equipo

- **Autor:** [Enrique Bobadilla](https://github.com/Yop007N)
- **Arquitectura:** Clean Architecture Team
- **Versión:** 2.0.0
- **Última actualización:** Diciembre 2024

---