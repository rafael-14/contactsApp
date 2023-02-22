import { Link } from 'react-router-dom';
import arrow from '../../assets/images/icons/arrow.svg';
import edit from '../../assets/images/icons/edit.svg';
import trash from '../../assets/images/icons/trash.svg';
// import Loader from '../../components/Loader';
// import Modal from '../../components/Modal';
import {
  Card,
  Container,
  Header,
  InputSearchContainer,
  ListContainer,
} from './styles';

export default function Home() {
  return (
    <Container>
      {/* <Loader />
       <Modal danger /> */}
      <InputSearchContainer>
        <input type="text" placeholder="Pesquisar contato:" />
      </InputSearchContainer>
      <Header>
        <strong>X contatos</strong>
        <Link to="/new">Novo contato</Link>
      </Header>
      <ListContainer>
        <header>
          <button type="button">
            <span>Nome</span>
            <img src={arrow} alt="Arrow" />
          </button>
        </header>
        <Card>
          <div className="info">
            <div className="contact-name">
              <strong>Nome contato</strong>
              <small>category</small>
            </div>
            <span>email@.com</span>
            <span>33227070</span>
          </div>
          <div className="actions">
            <Link to="/edit/123">
              <img src={edit} alt="Edit" />
            </Link>
            <button type="button">
              <img src={trash} alt="Trash" />
            </button>
          </div>
        </Card>
      </ListContainer>
    </Container>
  );
}
