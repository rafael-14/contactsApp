import { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useSafeAsyncAction from '../../hooks/useSafeAsyncAction';
import useSafeAsyncState from '../../hooks/useSafeAsyncState';
import ContactsService from '../../services/ContactsService';
import toast from '../../utils/toast';

export default function useEditContact() {
  const [isLoading, setIsLoading] = useSafeAsyncState(true);
  const [contactName, setContactName] = useSafeAsyncState('');
  const contactFormRef = useRef(null);
  const { id } = useParams();
  const navigate = useNavigate();
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
          navigate('/', { replace: true });
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
