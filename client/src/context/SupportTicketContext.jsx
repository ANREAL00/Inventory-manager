import { createContext, useContext, useState, useCallback } from 'react';
import { SupportTicketModal } from '../components/support/SupportTicketModal';

const SupportTicketContext = createContext(null);

export function SupportTicketProvider({ children }) {
  const [open, setOpen] = useState(false);

  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);

  return (
    <SupportTicketContext.Provider value={{ openSupportModal: openModal, closeSupportModal: closeModal }}>
      {children}
      <SupportTicketModal open={open} onClose={closeModal} />
    </SupportTicketContext.Provider>
  );
}

export function useSupportTicket() {
  const ctx = useContext(SupportTicketContext);
  if (!ctx) {
    throw new Error('useSupportTicket must be used within SupportTicketProvider');
  }
  return ctx;
}
