import { Card, CardContent, Typography } from "@mui/material";

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: string;
}

export default function StatCard({ title, value, trend }: StatCardProps) {
  return (
    <Card sx={{ height: "100%", borderRadius: 3 }}>
      <CardContent>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          {value}
        </Typography>
        {trend ? (
          <Typography variant="caption" color="primary.main">
            {trend}
          </Typography>
        ) : null}
      </CardContent>
    </Card>
  );
}
