import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

export default function ReactPortal({ children }) {
  let container = document.getElementById('fullscreen-root');
  if (!container) {
    container = document.createElement('div');
    container.setAttribute('id', 'fullscreen-root');
    document.body.appendChild(container);
  }

  return ReactDOM.createPortal(children, container);
}

ReactPortal.propTypes = {
  children: PropTypes.node.isRequired,
};
