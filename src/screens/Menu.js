import React from "react";
import doodle from "../assets/doodle3.jpg";

const Menu = () => {
  return (
    <div className="pop-up">
      <div className="menu-screen">
        <div className="menu-column">
          <h1>Menu on salaisuus ja se selviää varattuna päivänä :3</h1>
          <p>Voitte odottaa kolmen ruokalajin ateriaa! :D</p>
          <p>ja mahtavia makuelämyksiä!</p>
        </div>
        <div className="menu-column">
          <img
            style={{ width: "80%", paddingTop: "8%", paddingRight: "8%" }}
            src={doodle}
            alt="doodle"
          />
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default Menu;
