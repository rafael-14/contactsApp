import { useRef } from 'react';
import ContactForm from '../components/ContactForm';
import PageHeader from '../components/PageHeader';
import ContactsService from '../services/ContactsService';
import toast from '../utils/toast';

export default function NewContact() {
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

  return (
    <>
      <PageHeader title="Novo Contato" />
      <ContactForm
        ref={contactFormRef}
        buttonLabel="Cadastrar"
        onSubmit={handleSubmit}
      />
    </>
  );
}
