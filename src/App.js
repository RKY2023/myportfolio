// import logo from './logo.svg';

import MainFooter from "./component/footer/mainFooter";
import NavBarPortfolio from "./component/navBarPortfolio";
import Porfolio from "./component/porfolio";

function App() {
  return (
    <div className="m-10">
      <NavBarPortfolio />
      <Porfolio />
      {/* <MainFooter /> */}
    </div>
  );
}

export default App;
