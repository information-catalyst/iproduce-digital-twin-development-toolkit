import logo from "../../assets/iPRODUCE_U12_02.svg";
import "./header.css";

const Header = ({ onBpmnButtonClick, onModelButtonClick }) => {
  return (
    <div className="App-header">
      <img src={logo} alt="Logo" className="logo" />
      <div className="menu">
        <div className="menu-item cursor-pointer" onClick={onBpmnButtonClick}>
          BPMN
        </div>
        <div className="menu-item cursor-pointer" onClick={onModelButtonClick}>
          3D MODEL
        </div>
      </div>
    </div>
  );
};

export default Header;
