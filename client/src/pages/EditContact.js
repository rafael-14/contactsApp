import { useEffect, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import ContactForm from '../components/ContactForm';
import Loader from '../components/Loader';
import PageHeader from '../components/PageHeader';
import useSafeAsyncState from '../hooks/useSafeAsyncState';
import useSafeAsyncAction from '../hooks/useSafeAsyncAction';
import ContactsService from '../services/ContactsService';
import toast from '../utils/toast';

export default function EditContact() {
  const [isLoading, setIsLoading] = useSafeAsyncState(true);
  const [contactName, setContactName] = useSafeAsyncState('');
  const contactFormRef = useRef(null);
  const { id } = useParams();
  const history = useHistory();
  const safeAsyncAction = useSafeAsyncAction();

  async function handleSubmit(formData) {
    try {
      const contact = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        category_id: formData.categoryId,
      };

      const contactData = await ContactsService.updateContact(id, contact);

      setContactName(contactData.name);

      toast('success', 'Contato editado com sucesso!');
    } catch {
      toast('danger', 'Ocorreu um erro ao editar o contato.', 7000);
    }
  }

  useEffect(() => {
    async function loadContact() {
      try {
        const contact = await ContactsService.getContactById(id);

        safeAsyncAction(() => {
          contactFormRef.current.setFieldsValues(contact);
          setIsLoading(false);
          setContactName(contact.name);
        });
      } catch {
        safeAsyncAction(() => {
          history.push('/');
          toast('danger', 'Contato não encontrado.');
        });
      }
    }
    loadContact();
  }, [id]);

  return (
    <>
      <Loader isLoading={isLoading} />

      <PageHeader
        title={isLoading ? 'Carregando...' : `Editar ${contactName}`}
      />
      <ContactForm
        ref={contactFormRef}
        buttonLabel="Salvar alterações"
        onSubmit={handleSubmit}
      />
    </>
  );
}
