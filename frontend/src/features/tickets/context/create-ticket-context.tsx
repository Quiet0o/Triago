'use client';

import * as React from 'react';
import type { TicketPriority, TicketStatus, TicketType } from '#/types/tickets';

export interface CreateTicketInitialValues {
  type?: TicketType;
  status?: TicketStatus;
  priority?: TicketPriority;
  sprint?: string | null;
  title?: string;
  description?: string;
}

interface CreateTicketContextValue {
  isOpen: boolean;
  initialValues: CreateTicketInitialValues;
  openCreateModal: (values?: CreateTicketInitialValues) => void;
  closeCreateModal: () => void;
}

const CreateTicketContext = React.createContext<CreateTicketContextValue | null>(null);

export function CreateTicketProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [initialValues, setInitialValues] = React.useState<CreateTicketInitialValues>({});

  const openCreateModal = React.useCallback((values?: CreateTicketInitialValues) => {
    setInitialValues(values ?? {});
    setIsOpen(true);
  }, []);

  const closeCreateModal = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <CreateTicketContext.Provider
      value={{
        isOpen,
        initialValues,
        openCreateModal,
        closeCreateModal,
      }}
    >
      {children}
    </CreateTicketContext.Provider>
  );
}

export function useCreateTicketModal() {
  const context = React.useContext(CreateTicketContext);
  return (
    context ?? {
      isOpen: false,
      initialValues: {},
      openCreateModal: () => {},
      closeCreateModal: () => {},
    }
  );
}
