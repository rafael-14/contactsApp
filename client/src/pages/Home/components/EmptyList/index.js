import emptyBox from '../../../../assets/images/empty-box.svg';
import { Container } from './styles';

export default function EmptyList() {
  return (
    <Container>
      <img src={emptyBox} alt="Empty box" />
      <p>
        Você ainda não tem nenhum contato cadastrado! Clique no botão
        <strong> &quot;Novo contato&quot; </strong>
        à cima para cadastrar
        o seus primeiro!
      </p>
    </Container>
  );
}
