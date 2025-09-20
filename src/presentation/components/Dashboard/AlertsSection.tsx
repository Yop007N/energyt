import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Box
} from '@mui/material';
import {
  Warning,
  Error,
  Info,
  CheckCircle,
  Schedule
} from '@mui/icons-material';
import {
  DashboardAlert,
  AlertType,
  AlertSeverity
} from '../../../application/usecases/GetDashboardStatsUseCase';

interface AlertsSectionProps {
  alerts: DashboardAlert[];
}

function getAlertIcon(type: AlertType): JSX.Element {
  const iconProps = { fontSize: 'small' as const };

  switch (type) {
    case AlertType.HIGH_CONSUMPTION:
      return <Warning {...iconProps} />;
    case AlertType.DEVICE_OFFLINE:
      return <Error {...iconProps} />;
    case AlertType.PAYMENT_OVERDUE:
      return <Schedule {...iconProps} />;
    case AlertType.MAINTENANCE_DUE:
      return <Info {...iconProps} />;
    default:
      return <Info {...iconProps} />;
  }
}

function getAlertColor(severity: AlertSeverity): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' {
  switch (severity) {
    case AlertSeverity.LOW:
      return 'info';
    case AlertSeverity.MEDIUM:
      return 'warning';
    case AlertSeverity.HIGH:
      return 'error';
    case AlertSeverity.CRITICAL:
      return 'error';
    default:
      return 'default';
  }
}

function formatAlertTime(timestamp: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - timestamp.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) {
    return 'Hace un momento';
  } else if (diffMinutes < 60) {
    return `Hace ${diffMinutes} minuto${diffMinutes !== 1 ? 's' : ''}`;
  } else if (diffHours < 24) {
    return `Hace ${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
  } else {
    return `Hace ${diffDays} día${diffDays !== 1 ? 's' : ''}`;
  }
}

export function AlertsSection({ alerts }: AlertsSectionProps): JSX.Element {
  if (alerts.length === 0) {
    return (
      <Card elevation={2}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CheckCircle color="success" sx={{ mr: 1 }} />
            <Typography variant="h6">
              Sistema Saludable
            </Typography>
          </Box>
          <Typography color="text.secondary">
            No hay alertas activas en este momento
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Alertas del Sistema ({alerts.length})
        </Typography>

        <List>
          {alerts.map((alert) => (
            <ListItem
              key={alert.id}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                mb: 1,
                '&:last-child': { mb: 0 }
              }}
            >
              <ListItemIcon>
                {getAlertIcon(alert.type)}
              </ListItemIcon>

              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant="body1">
                      {alert.message}
                    </Typography>
                    <Chip
                      label={alert.severity}
                      size="small"
                      color={getAlertColor(alert.severity)}
                      variant="outlined"
                    />
                  </Box>
                }
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    {formatAlertTime(alert.timestamp)}
                    {alert.clientId && ` • Cliente: ${alert.clientId}`}
                    {alert.deviceId && ` • Dispositivo: ${alert.deviceId}`}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}