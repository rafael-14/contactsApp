import { useEffect, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import useSafeAsyncState from '../../hooks/useSafeAsyncState';
import useSafeAsyncAction from '../../hooks/useSafeAsyncAction';
import ContactsService from '../../services/ContactsService';
import toast from '../../utils/toast';

export default function useEditContact() {
  const [isLoading, setIsLoading] = useSafeAsyncState(true);
  const [contactName, setContactName] = useSafeAsyncState('');
  const contactFormRef = useRef(null);
  const { id } = useParams();
  const history = useHistory();
  const safeAsyncAction = useSafeAsyncAction();

  async function handleSubmit(contact) {
    try {
      const contactData = await ContactsService.updateContact(id, contact);

      setContactName(contactData.name);

      toast('success', 'Contato editado com sucesso!');
    } catch {
      toast('danger', 'Ocorreu um erro ao editar o contato.', 7000);
    }
  }

  useEffect(() => {
    const controller = new AbortController();

    async function loadContact() {
      try {
        const contact = await ContactsService.getContactById(id, controller.signal);

        safeAsyncAction(() => {
          contactFormRef.current.setFieldsValues(contact);
          setIsLoading(false);
          setContactName(contact.name);
        });
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        safeAsyncAction(() => {
          history.push('/');
          toast('danger', 'Contato não encontrado.');
        });
      }
    }
    loadContact();

    return () => controller.abort();
  }, [id]);

  return {
    isLoading,
    contactName,
    contactFormRef,
    handleSubmit,
  };
}
