# Energy Monitoring Dashboard ⚡

> Dashboard moderno para monitoreo y análisis de consumo energético desarrollado con React, TypeScript y Vite

## 📋 Descripción

Energy Monitoring Dashboard es una aplicación web moderna que proporciona una interfaz completa para monitorear, analizar y gestionar el consumo energético de clientes residenciales, comerciales e industriales. Integra visualizaciones interactivas, análisis de datos en tiempo real, gestión de facturación y herramientas avanzadas para optimización energética.

## ✨ Características Principales

- **📊 Dashboard en Tiempo Real**: Estadísticas completas de consumo energético
- **📈 Gráficos Interactivos**: Visualización de datos con Chart.js integrado
- **👥 Gestión de Clientes**: CRUD completo para clientes residenciales, comerciales e industriales
- **⚡ Monitoreo de Consumo**: Seguimiento en tiempo real de medidores y consumo
- **📋 Facturación Integrada**: Generación y gestión de facturas automáticas
- **📉 Análisis Temporal**: Comparativas y tendencias por períodos
- **🖥️ Dashboard Moderno**: Interfaz Material-UI con tema personalizable
- **📱 Diseño Responsivo**: Adaptativo a cualquier dispositivo
- **⚡ Rendimiento Optimizado**: Desarrollo con Vite y React Query
- **🔄 Auto-refresh**: Actualización automática de datos

## 🛠️ Stack Tecnológico

### Core Frontend
- **React 18.2.0** - Biblioteca de interfaz de usuario
- **TypeScript 5.2.2** - Tipado estático para mayor robustez
- **Vite 5.2.0** - Build tool de nueva generación
- **ESLint** - Linting y calidad de código

### UI Framework
- **Material-UI 5.15.20** - Sistema de diseño completo
- **Emotion React/Styled** - CSS-in-JS para estilos dinámicos
- **React Icons 5.2.1** - Iconografía consistente

### Visualización de Datos
- **Chart.js 4.4.3** - Librería de gráficos potente
- **React Chart.js 2 5.2.0** - Integración React con Chart.js
- **React Resizable 3.0.5** - Componentes redimensionables

### Gestión de Estado y APIs
- **React Query 3.39.3** - Gestión de estado del servidor
- **Axios 1.7.2** - Cliente HTTP para APIs
- **Date-fns 3.6.0** - Manipulación de fechas

### Utilidades
- **React DatePicker 7.1.0** - Selector de fechas avanzado

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ (LTS recomendado)
- npm o yarn
- Backend Energy API (repositorio energy)

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Yop007N/energy-monitoring-dashboard.git
cd energy-monitoring-dashboard

# Instalar dependencias
npm install

# Configurar variables de entorno
# Editar .env con las URLs de tus servicios de energía

# Iniciar servidor de desarrollo
npm run dev
```

### Variables de Entorno

Configura las siguientes variables en el archivo `.env`:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8002
VITE_API_TIMEOUT=10000

# Energy Services Endpoints
VITE_CLIENTE_SERVICE_URL=http://localhost:8002
VITE_CONSUMO_SERVICE_URL=http://localhost:8003
VITE_FACTURACION_SERVICE_URL=http://localhost:8006
VITE_MEDIDOR_SERVICE_URL=http://localhost:8007

# Chart Configuration
VITE_CHART_THEME=light
VITE_REFRESH_INTERVAL=30000
VITE_CHART_ANIMATION_DURATION=1000

# Feature Flags
VITE_ENABLE_REAL_TIME=true
VITE_ENABLE_CHARTS=true
VITE_ENABLE_EXPORT=true
VITE_ENABLE_NOTIFICATIONS=true

# UI Configuration
VITE_THEME=light
VITE_LANGUAGE=es
VITE_TIMEZONE=America/Asuncion

# Performance Configuration
VITE_CACHE_DURATION=300000
VITE_MAX_DATA_POINTS=1000
```

## 📖 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Servidor Vite de desarrollo (puerto 5173)

# Construcción
npm run build            # Build optimizado para producción
npm run build:analyze    # Análisis del bundle de producción
npm run preview          # Vista previa del build de producción

# Calidad de Código
npm run lint             # ESLint con reglas TypeScript
npm run lint:fix         # Corrige errores de linting automáticamente
npm run type-check       # Verifica tipos TypeScript

# Servidor de archivos estáticos
npm run serve            # Sirve el build de producción localmente
```

## 🏗️ Estructura del Proyecto

```
src/
├── components/              # Componentes principales
│   ├── Dashboard/          # Dashboard principal
│   │   └── EnergyDashboard.tsx
│   ├── ErrorBoundary/      # Manejo de errores
│   │   ├── ErrorBoundary.tsx
│   │   └── index.ts
│   ├── FilterForm/         # Formularios de filtros
│   │   └── FilterForm.tsx
│   ├── HistoricalChart/    # Gráficos históricos
│   │   └── HistoricalChart.tsx
│   └── MensajesUplinkList/ # Lista de mensajes
│       └── MensajeUplinkList.tsx
├── services/               # Servicios de API
│   ├── apiService.ts       # Servicio API original
│   └── energyAPI.ts        # API centralizada de energía
├── types/                  # Definiciones TypeScript
│   └── index.ts            # Tipos principales
├── App.tsx                 # Componente principal
├── main.tsx               # Punto de entrada
└── vite-env.d.ts           # Tipos de Vite
```

## 📊 Funcionalidades del Dashboard

### Métricas Principales
- **Total Clientes**: Número de clientes activos en el sistema
- **Consumo Total**: Consumo energético acumulado en kWh
- **Facturación Total**: Monto total facturado en el período
- **Medidores Activos**: Cantidad de medidores operativos
- **Promedio de Consumo**: Consumo promedio por cliente
- **Alertas Activas**: Número de alertas pendientes

### Gráficos Interactivos
- **📈 Gráfico de Líneas**: Consumo temporal (12 meses)
- **📊 Gráfico de Barras**: Top 5 consumidores
- **🥧 Gráfico Circular**: Distribución por tipo de cliente
- **📉 Estado del Sistema**: Monitoreo de servicios

### Tipos de Cliente
```typescript
interface Cliente {
  id: string;
  nombre: string;
  tipo: 'RESIDENCIAL' | 'COMERCIAL' | 'INDUSTRIAL';
  direccion: string;
  activo: boolean;
}
```

### Consumo Energético
```typescript
interface EnergyConsumption {
  id: string;
  clienteId: string;
  timestamp: Date;
  consumo: number;
  unidad: 'kWh' | 'MWh';
  costo: number;
}
```

## 🔌 Integración con Microservicios

### Arquitectura de Servicios
El dashboard se integra con 4 microservicios especializados:

- **Cliente Service** (puerto 8002): Gestión de clientes
- **Consumo Service** (puerto 8003): Datos de consumo energético
- **Facturación Service** (puerto 8006): Generación y gestión de facturas
- **Medidor Service** (puerto 8007): Monitoreo de medidores

### API Centralizada

```typescript
// energyAPI.ts
class EnergyAPIService {
  // Métodos de clientes
  async getClientes(): Promise<Cliente[]>
  async createCliente(cliente: Omit<Cliente, 'id'>): Promise<Cliente>

  // Métodos de consumo
  async getConsumos(params?: FilterParams): Promise<EnergyConsumption[]>
  async getConsumosByCliente(clienteId: string): Promise<EnergyConsumption[]>

  // Métodos de facturación
  async getFacturas(params?: FilterParams): Promise<Factura[]>
  async createFactura(factura: Omit<Factura, 'id'>): Promise<Factura>

  // Métodos de medidores
  async getMedidores(): Promise<Medidor[]>
  async getMedidoresByCliente(clienteId: string): Promise<Medidor[]>

  // Dashboard y estadísticas
  async getDashboardStats(): Promise<DashboardStats>
  async getConsumosPorPeriodo(periodo: string): Promise<any[]>
}
```

### React Query y Caché

```typescript
// App.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: 30000, // Auto-refresh cada 30 segundos
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});
```

## 🎨 Configuración de Material-UI

### Tema Personalizado

```typescript
// theme.ts
import { createTheme } from '@mui/material/styles';

export const energyTheme = createTheme({
  palette: {
    primary: {
      main: '#2563eb',
      light: '#3b82f6',
      dark: '#1d4ed8',
    },
    secondary: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
});
```

### Componentes Personalizados

```typescript
// MetricCard.tsx
import { Card, CardContent, Typography, Box } from '@mui/material';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit: string;
  trend?: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
}

export function MetricCard({ title, value, unit, trend, icon }: MetricCardProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="h6">
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value} {unit}
            </Typography>
          </Box>
          <Box color="primary.main">
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
```

## 📈 Configuración de Gráficos

### Chart.js Setup

```typescript
// chartConfig.ts
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};
```

## 🌐 Despliegue

### Build de Producción

```bash
# Crear build optimizado
npm run build

# El build se genera en ./dist/
```

### Servicios de Hosting

#### Vercel (Recomendado)
```bash
# Deploy automático desde GitHub
# Variables de entorno configurables en dashboard
```

#### Netlify
```bash
# Build command: npm run build
# Publish directory: dist
# Configurar variables de entorno en Netlify
```

#### GitHub Pages
```bash
# Configurar GitHub Actions para deploy automático
# Base path para subpaths si es necesario
```

## 🧪 Testing y Calidad

### ESLint Configuration

```javascript
// .eslintrc.cjs
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
};
```

## 🔧 Optimizaciones de Rendimiento

### Lazy Loading

```typescript
import { lazy, Suspense } from 'react';
import { CircularProgress } from '@mui/material';

const Dashboard = lazy(() => import('./components/Dashboard'));
const Analytics = lazy(() => import('./components/Analytics'));

function App() {
  return (
    <Suspense fallback={<CircularProgress />}>
      <Dashboard />
    </Suspense>
  );
}
```

### Memoización

```typescript
import { memo, useMemo } from 'react';

export const ConsumptionChart = memo(({ data, options }) => {
  const chartData = useMemo(() => {
    return processChartData(data);
  }, [data]);

  return <Line data={chartData} options={options} />;
});
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea tu branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Add: nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es privado. Todos los derechos reservados.

## 👨‍💻 Autor

**Enrique Bobadilla (Yop007N)**
- GitHub: [@Yop007N](https://github.com/Yop007N)
- Especialización: Energía, IoT y Desarrollo Frontend
- Proyecto: Dashboard completo para monitoreo energético

## 🔗 Enlaces Relacionados

- [Backend Energy Platform](https://github.com/Yop007N/energy)
- [React Documentation](https://reactjs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Material-UI](https://mui.com/)
- [Chart.js](https://www.chartjs.org/)

---

⚡ Transformando la gestión energética con tecnología moderna

## 🚨 Problemas Resueltos

✅ **Nombre del proyecto estandarizado** - `energyt` → `energy-monitoring-dashboard`
✅ **URLs hardcodeadas eliminadas** - Configuración centralizada en variables de entorno
✅ **API service centralizado** - Servicio completo para microservicios de energía
✅ **Dashboard completamente funcional** - Integración con Material-UI y Chart.js
✅ **Funcionalidad IoT reemplazada** - Enfoque 100% en monitoreo energético
✅ **Props corregidas** - Componentes alineados con nueva funcionalidad
✅ **Configuración optimizada** - Variables de entorno para todos los servicios
✅ **Documentación actualizada** - README completo con instrucciones detalladas