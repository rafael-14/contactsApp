import { useRef } from 'react';
import ContactsService from '../../services/ContactsService';
import toast from '../../utils/toast';

export default function useNewContact() {
  const contactFormRef = useRef(null);

  async function handleSubmit(contact) {
    try {
      await ContactsService.createContact(contact);
      contactFormRef.current.resetFields();
      toast('success', 'Contato cadastrado com sucesso!');
    } catch {
      toast('danger', 'Ocorreu um erro ao cadastrar o contato.', 7000);
    }
  }

  return {
    contactFormRef,
    handleSubmit,
  };
}
