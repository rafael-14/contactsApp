import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from 'react';
import useSafeAsyncState from '../../hooks/useSafeAsyncState';
import ContactsService from '../../services/ContactsService';
import toast from '../../utils/toast';

export default function useHome() {
  const [contacts, setContacts] = useSafeAsyncState([]);
  const [orderBy, setOrderBy] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useSafeAsyncState(true);
  const [hasError, setHasError] = useSafeAsyncState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [contactBeingDeleted, setContactBeingDeleted] = useState(null);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  const deferredSearchTerm = useDeferredValue(searchTerm);

  const filteredContacts = useMemo(() => contacts.filter((contact) => (
    contact.name.toUpperCase().includes(deferredSearchTerm.toUpperCase())
  )), [contacts, deferredSearchTerm]);

  const loadContacts = useCallback(async (signal) => {
    try {
      setIsLoading(true);
      const contactsList = await ContactsService.listContacts(orderBy, signal);
      setContacts(contactsList);
      setHasError(false);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setHasError(true);
      setContacts([]);
    } finally {
      setIsLoading(false);
    }
  }, [orderBy]);

  const handleToggleOrderBy = useCallback(() => {
    setOrderBy((prevState) => (prevState === 'asc' ? 'desc' : 'asc'));
  }, []);

  function handleChangeSearchTerm(e) {
    setSearchTerm(e.target.value);
  }

  function handleTryAgain() {
    loadContacts();
  }

  const handleDeleteContact = useCallback((contact) => {
    setContactBeingDeleted(contact);
    setIsDeleteModalVisible(true);
  }, []);

  function handleCloseDeleteModal() {
    setIsDeleteModalVisible(false);
  }

  async function handleConfirmDeleteContact() {
    try {
      setIsLoadingDelete(true);
      await ContactsService.deleteContact(contactBeingDeleted.id);
      setContacts((prevState) => prevState.filter((contact) => (
        contact.id !== contactBeingDeleted.id
      )));

      handleCloseDeleteModal();

      toast('success', 'Contato deletado com sucesso!');
    } catch {
      toast('danger', 'Ocorreu um erro ao deletar o contato.');
    } finally {
      setIsLoadingDelete(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();

    loadContacts(controller.signal);

    return () => controller.abort();
  }, [loadContacts]);

  return {
    isLoading,
    isLoadingDelete,
    contactBeingDeleted,
    isDeleteModalVisible,
    handleCloseDeleteModal,
    handleConfirmDeleteContact,
    contacts,
    searchTerm,
    handleChangeSearchTerm,
    hasError,
    filteredContacts,
    handleTryAgain,
    orderBy,
    handleToggleOrderBy,
    handleDeleteContact,
  };
}
