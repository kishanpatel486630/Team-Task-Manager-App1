interface AvatarProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const colors = ['#FF5630', '#0052CC', '#36B37E', '#FF8B00', '#6554C0', '#00B8D9', '#DE350B'];

const getColorFromName = (name: string) => {
  const hash = name.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
  return colors[hash % colors.length];
};

const sizeMap = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
};

export function Avatar({ name, size = 'md' }: AvatarProps) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const bgColor = getColorFromName(name);

  return (
    <div
      className={`${sizeMap[size]} rounded-full flex items-center justify-center font-semibold text-white`}
      style={{ backgroundColor: bgColor }}
    >
      {initials}
    </div>
  );
}
