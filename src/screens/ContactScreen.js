import React from "react";
import contactImage from "../assets/contactImage.jpeg";

const ContactScreen = () => {
  return (
    <div className="pop-up">
      <div className="contact-screen">
        <div className="contact-column">
          <h1>Yhteystiedot</h1>
          <p>
            Onko kysymyksiä? Voitte olla yhteydessä kuvassa näkyviin
            henkilöihin.
          </p>
          <p>Puhelin: Oma Koti Kullankallis WhatsApp ryhmä</p>
          <p>Osoite: Kaivosrinteentie 6</p>
          <p>:3</p>
        </div>
        <div className="contact-column">
          <img
            style={{ width: "50%", paddingTop: "8%", paddingRight: "8%" }}
            src={contactImage}
            alt="contact"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactScreen;
