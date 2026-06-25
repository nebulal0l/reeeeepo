'use client';

const statusColors: Record<string, string> = {
  online: '#ffffff',
  idle: '#888888',
  dnd: '#555555',
  offline: '#333333',
};

const statusLabels: Record<string, string> = {
  online: 'Online',
  idle: 'Idle',
  dnd: 'Do Not Disturb',
  offline: 'Offline',
};

export function StatusDot({ status }: { status: string }) {
  const color = statusColors[status] ?? statusColors.offline;
  const label = statusLabels[status] ?? 'Offline';

  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-white/40">
      <span className="relative inline-flex h-2 w-2" title={label}>
        {status === 'online' && (
          <span
            className="absolute inline-flex h-full w-full rounded-full opacity-50 animate-ping"
            style={{ backgroundColor: color }}
          />
        )}
        <span
          className="relative inline-flex h-2 w-2 rounded-full"
          style={{ backgroundColor: color }}
        />
      </span>
      {label}
    </span>
  );
}
