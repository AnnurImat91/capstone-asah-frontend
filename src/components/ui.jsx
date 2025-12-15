import React from 'react';
import { Check, XCircle } from 'lucide-react';

export const Button = ({ children, className = '', variant = 'default', ...props }) => {
  const baseStyle = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-10 px-4 py-2';
  let variantStyle = '';

  switch (variant) {
    case 'destructive':
      variantStyle = 'bg-red-600 text-white hover:bg-red-700';
      break;
    case 'outline':
      variantStyle = 'border border-gray-300 bg-white hover:bg-gray-100';
      break;
    case 'ghost':
      variantStyle = 'hover:bg-gray-100';
      break;
    case 'link':
      variantStyle = 'text-blue-600 underline-offset-4 hover:underline';
      break;
    default: // default
      variantStyle = 'bg-blue-600 text-white hover:bg-blue-700 shadow-md';
      break;
  }

  return (
    <button className={`${baseStyle} ${variantStyle} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const Input = React.forwardRef(({ className = '', type = 'text', ...props }, ref) => (
  <input
    type={type}
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    ref={ref}
    {...props}
  />
));

export const Card = ({ children, className = '', title, description, icon: Icon }) => (
  <div className={`rounded-xl border bg-white p-6 shadow-lg transition-all hover:shadow-xl ${className}`}>
    <div className="flex items-start justify-between">
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
      </div>
      {Icon && <Icon className="h-6 w-6 text-blue-500 opacity-70" />}
    </div>
    <div className="mt-4">{children}</div>
  </div>
);

export const Alert = ({ message, type = 'error', className = '' }) => {
  if (!message) return null;
  const isError = type === 'error';
  const Icon = isError ? XCircle : Check;
  const bgColor = isError ? 'bg-red-100 border-red-400' : 'bg-green-100 border-green-400';
  const textColor = isError ? 'text-red-700' : 'text-green-700';

  return (
    <div className={`${bgColor} border ${textColor} px-4 py-3 rounded-md relative flex items-center ${className}`}>
      <Icon className="h-5 w-5 mr-2" />
      <span className="block sm:inline">{message}</span>
    </div>
  );
};

export const StatCard = ({ icon: Icon, title, value, unit = '', colorClass = 'text-blue-600' }) => (
    <Card className="flex flex-col justify-between h-full" title={title} icon={Icon}>
      <div className="flex items-end">
        <span className={`text-4xl font-bold ${colorClass}`}>{value}</span>
        {unit && <span className="ml-2 text-lg text-gray-500 font-semibold">{unit}</span>}
      </div>
    </Card>
);