interface UserAvatarProps {
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const UserAvatar = ({ name, size = 'md', className = '' }: UserAvatarProps) => {
  // Get user initials from name
  const getUserInitials = (name?: string) => {
    if (!name) return 'U';
    const words = name.trim().split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  return (
    <div 
      className={`${sizeClasses[size]} bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-teal-500/25 ${className}`}
    >
      <span className="text-white font-bold">
        {getUserInitials(name)}
      </span>
    </div>
  );
};
