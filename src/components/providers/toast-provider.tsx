import { ReactNode } from 'react';

interface ToastProviderProps {
  children: ReactNode;
}

const ToastProvider = ({ children }: ToastProviderProps) => {
  return <div className='toast-provider'>{children}</div>;
};
export default ToastProvider;
