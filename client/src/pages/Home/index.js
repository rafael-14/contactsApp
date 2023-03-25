import {
  useEffect, useMemo, useState, useCallback,
} from 'react';
import { Link } from 'react-router-dom';
import arrow from '../../assets/images/icons/arrow.svg';
import edit from '../../assets/images/icons/edit.svg';
import trash from '../../assets/images/icons/trash.svg';
import Loader from '../../components/Loader';
import ContactsService from '../../services/ContactsService';
import sad from '../../assets/images/sad.svg';
import magnifierQuestion from '../../assets/images/magnifier-question.svg';
import emptyBox from '../../assets/images/empty-box.svg';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import {
  Card,
  Container,
  EmptyListContainer,
  ErrorContainer,
  Header,
  InputSearchContainer,
  ListHeader,
  SearchNotFoundContainer,
} from './styles';
import toast from '../../utils/toast';

export default function Home() {
  const [contacts, setContacts] = useState([]);
  const [orderBy, setOrderBy] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [contactBeingDeleted, setContactBeingDeleted] = useState(null);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  const filteredContacts = useMemo(() => contacts.filter((contact) => (
    contact.name.toUpperCase().includes(searchTerm.toUpperCase())
  )), [contacts, searchTerm]);

  const loadContacts = useCallback(async () => {
    try {
      setIsLoading(true);
      const contactsList = await ContactsService.listContacts(orderBy);
      setContacts(contactsList);
      setHasError(false);
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [orderBy]);

  function handleToggleOrderBy() {
    setOrderBy((prevState) => (prevState === 'asc' ? 'desc' : 'asc'));
  }

  function handleChangeSearchTerm(e) {
    setSearchTerm(e.target.value);
  }

  function handleTryAgain() {
    loadContacts();
  }

  function handleDeleteContact(contact) {
    setContactBeingDeleted(contact);
    setIsDeleteModalVisible(true);
  }

  function handleCloseDeleteModal() {
    setIsDeleteModalVisible(false);
    setContactBeingDeleted(null);
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
    loadContacts();
  }, [loadContacts]);

  return (
    <Container>
      <Loader isLoading={isLoading} />
      <Modal
        danger
        isLoading={isLoadingDelete}
        title={`Tem certeza que deseja remover o contato "${contactBeingDeleted?.name}"?`}
        confirmLabel="Deletar"
        visible={isDeleteModalVisible}
        onCancel={handleCloseDeleteModal}
        onConfirm={handleConfirmDeleteContact}
      >
        <p>Está ação não poderá ser desfeita!</p>
      </Modal>

      {contacts.length > 0 && (
      <InputSearchContainer>
        <input
          value={searchTerm}
          type="text"
          placeholder="Pesquisar contato:"
          onChange={handleChangeSearchTerm}
        />
      </InputSearchContainer>
      )}

      <Header
      // eslint-disable-next-line no-nested-ternary
        justifyContent={(hasError ? 'flex-end' : (
          contacts.length > 0 ? 'space-between' : 'center'
        ))}
      >
        {(!hasError && contacts.length > 0) && (
        <strong>
          {filteredContacts.length}
          {filteredContacts.length === 1 ? ' contato' : ' contatos'}
        </strong>
        )}
        <Link to="/new">Novo contato</Link>
      </Header>

      {hasError && (
        <ErrorContainer>
          <img src={sad} alt="Sad" />
          <div className="details">
            <strong>Ocorreu um erro ao obter os seus contatos.</strong>
            <Button type="button" onClick={handleTryAgain}>Tentar novamente</Button>
          </div>
        </ErrorContainer>
      ) }

      {!hasError && (
        <>
          {(contacts.length === 0 && !isLoading) && (
            <EmptyListContainer>
              <img src={emptyBox} alt="Empty box" />
              <p>
                Você ainda não tem nenhum contato cadastrado!
                Clique no botão
                <strong> &quot;Novo contato&quot; </strong>
                à cima para cadastrar o seus
                primeiro!
              </p>
            </EmptyListContainer>
          )}

          {(filteredContacts.length === 0 && contacts.length > 0) && (
          <SearchNotFoundContainer>
            <img src={magnifierQuestion} alt="Magnifier question" />
            <span>
              Nenhum resultado foi encontrado para&nbsp;
              <strong>
                &quot;
                {searchTerm}
                &quot;
              </strong>
            </span>
          </SearchNotFoundContainer>
          )}

          {filteredContacts.length > 0 && (
          <ListHeader orderBy={orderBy}>
            <button type="button" onClick={handleToggleOrderBy}>
              <span>Nome</span>
              <img src={arrow} alt="Arrow" />
            </button>
          </ListHeader>
          )}

          {filteredContacts.map((contact) => (
            <Card key={contact.id}>
              <div className="info">
                <div className="contact-name">
                  <strong>{contact.name}</strong>
                  {contact.category_name && <small>{contact.category_name}</small>}
                </div>
                <span>{contact.email}</span>
                <span>{contact.phone}</span>
              </div>
              <div className="actions">
                <Link to={`/edit/${contact.id}`}>
                  <img src={edit} alt="Edit" />
                </Link>
                <button type="button" onClick={() => handleDeleteContact(contact)}>
                  <img src={trash} alt="Trash" />
                </button>
              </div>
            </Card>
          ))}
        </>
      )}
    </Container>
  );
}
