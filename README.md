# Energy Dashboard Frontend ⚡

> Dashboard frontend moderno para monitoreo y análisis de consumo energético desarrollado con React, TypeScript y Vite

## 📋 Descripción

Energy Dashboard es una aplicación web moderna que proporciona una interfaz intuitiva para monitorear, analizar y gestionar el consumo energético. Integra visualizaciones interactivas, análisis de datos en tiempo real, y herramientas avanzadas para optimización energética.

## ✨ Características Principales

- **📊 Visualización de Datos**: Gráficos interactivos con Chart.js y React Chart.js 2
- **💡 Monitoreo en Tiempo Real**: Seguimiento continuo de consumo energético
- **📈 Análisis Temporal**: Comparativas por períodos con React DatePicker
- **🎛️ Dashboard Interactivo**: Paneles redimensionables y personalizables
- **📱 Diseño Responsivo**: Interfaz adaptativa con Material-UI
- **⚡ Rendimiento Optimizado**: Desarrollo con Vite para carga ultra-rápida
- **🔍 Consultas Eficientes**: Gestión de estado con React Query

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
git clone https://github.com/Yop007N/energyt.git
cd energyt

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Variables de Entorno

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8002
VITE_ENVIRONMENT=development

# Energy Services Endpoints
VITE_CLIENTE_SERVICE_URL=http://localhost:8002
VITE_CONSUMO_SERVICE_URL=http://localhost:8003
VITE_FACTURACION_SERVICE_URL=http://localhost:8006
VITE_MEDIDOR_SERVICE_URL=http://localhost:8007

# Chart Configuration
VITE_CHART_THEME=light
VITE_REFRESH_INTERVAL=30000
```

## 📖 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Servidor Vite de desarrollo (puerto 5173)

# Construcción
npm run build            # Build optimizado para producción
npm run preview          # Vista previa del build de producción

# Calidad de Código
npm run lint             # ESLint con reglas TypeScript
```

## 🏗️ Estructura del Proyecto

```
src/
├── components/              # Componentes reutilizables
│   ├── charts/             # Componentes de gráficos
│   │   ├── ConsumptionChart.tsx
│   │   ├── TrendChart.tsx
│   │   └── PieChart.tsx
│   ├── dashboard/          # Componentes del dashboard
│   │   ├── DashboardGrid.tsx
│   │   ├── MetricCard.tsx
│   │   └── ControlPanel.tsx
│   ├── forms/              # Formularios
│   │   ├── DateRangePicker.tsx
│   │   └── FilterForm.tsx
│   └── ui/                 # Componentes base de UI
│       ├── Loading.tsx
│       ├── ErrorBoundary.tsx
│       └── Layout.tsx
├── hooks/                  # Custom hooks
│   ├── useEnergyData.ts
│   ├── useChartConfig.ts
│   └── useRealTimeData.ts
├── services/               # Servicios de API
│   ├── energyAPI.ts
│   ├── clientsAPI.ts
│   ├── consumptionAPI.ts
│   └── billingAPI.ts
├── types/                  # Definiciones TypeScript
│   ├── energy.types.ts
│   ├── client.types.ts
│   ├── consumption.types.ts
│   └── chart.types.ts
├── utils/                  # Utilidades
│   ├── formatters.ts
│   ├── chartHelpers.ts
│   ├── dateUtils.ts
│   └── constants.ts
├── styles/                 # Estilos globales
│   └── globals.css
└── App.tsx                 # Componente principal
```

## 📊 Características del Dashboard

### Gráficos Disponibles

#### Consumo Temporal
```typescript
interface ConsumptionChartProps {
  data: EnergyData[];
  dateRange: DateRange;
  granularity: 'hour' | 'day' | 'month';
}
```

#### Análisis de Tendencias
```typescript
interface TrendAnalysis {
  consumption: number;
  trend: 'up' | 'down' | 'stable';
  percentage: number;
  period: string;
}
```

#### Distribución por Cliente
```typescript
interface ClientDistribution {
  clientId: string;
  name: string;
  consumption: number;
  percentage: number;
  type: 'RESIDENCIAL' | 'COMERCIAL' | 'INDUSTRIAL';
}
```

### Widgets Interactivos

- **📈 Gráfico de Líneas**: Consumo temporal
- **📊 Gráfico de Barras**: Comparativas por período
- **🥧 Gráfico Circular**: Distribución por tipo de cliente
- **📋 Métricas en Tiempo Real**: KPIs principales
- **🔔 Alertas**: Notificaciones de consumo anómalo

## 🔌 Integración con Backend

### Configuración de APIs

```typescript
// energyAPI.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const energyAPI = {
  getConsumption: (params: ConsumptionQuery) =>
    apiClient.get('/consumos', { params }),

  getClients: () =>
    apiClient.get('/clientes'),

  getBilling: (clientId: string) =>
    apiClient.get(`/facturas/cliente/${clientId}`),
};
```

### React Query Configuration

```typescript
// App.tsx
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: 30000, // 30 segundos
      staleTime: 5 * 60 * 1000, // 5 minutos
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

**Enrique B. (Yop007N)**
- GitHub: [@Yop007N](https://github.com/Yop007N)
- Especialización: IoT y Eficiencia Energética

## 🔗 Enlaces Relacionados

- [Backend Energy Platform](https://github.com/Yop007N/energy)
- [React Documentation](https://reactjs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Material-UI](https://mui.com/)
- [Chart.js](https://www.chartjs.org/)

---

⚡ Visualizando la eficiencia energética del futuro