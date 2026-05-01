interface BadgeProps {
  variant: 'status' | 'priority' | 'role';
  value: string;
  children?: React.ReactNode;
}

const statusStyles: Record<string, string> = {
  todo: 'bg-[#DFE1E6] text-[#42526E]',
  'in-progress': 'bg-[#DEEBFF] text-[#0747A6]',
  'in-review': 'bg-[#FFF0B3] text-[#974F0C]',
  done: 'bg-[#E3FCEF] text-[#006644]',
};

const priorityColors: Record<string, string> = {
  low: '#36B37E',
  medium: '#FF8B00',
  high: '#FF5630',
  critical: '#DE350B',
};

const roleStyles: Record<string, string> = {
  admin: 'bg-[#EAE6FF] text-[#403294]',
  member: 'bg-[#DEEBFF] text-[#0747A6]',
};

export function Badge({ variant, value, children }: BadgeProps) {
  if (variant === 'status') {
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${statusStyles[value] || statusStyles.todo}`}>
        {children || value.replace('-', ' ').toUpperCase()}
      </span>
    );
  }

  if (variant === 'priority') {
    return (
      <div className="flex items-center gap-1">
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: priorityColors[value] || priorityColors.medium }}
        />
        <span className="text-xs capitalize">{children || value}</span>
      </div>
    );
  }

  if (variant === 'role') {
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${roleStyles[value] || roleStyles.member}`}>
        {children || value.toUpperCase()}
      </span>
    );
  }

  return null;
}
