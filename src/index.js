/* eslint-disable no-console */
import './app.scss';

chayns.ui.initAll();
chayns.ready.then(() => {
   console.log('Chayns is ready, environment loaded', chayns.env);
 }).catch(() => {
   console.warn('No chayns environment found');
 }).then(() => {
   console.log('Will always be executed');
 });

const init = async () => {
   try {
       await chayns.ready;
       getData();
       document.querySelector('#more').addEventListener('click', getData);
       console.log('more button ready!');

       document.querySelector('#send-button').addEventListener('click', send);
   } catch (err) {
       console.error('No chayns environment found', err);
   }
};

init();

let counter = 0;

function getData() {
   fetch(`https://chayns1.tobit.com/TappApi/Site/SlitteApp?SearchString=love&Skip=${counter}&Take=14`)
   .then(resp => resp.json())
   .then((json) => {
      createList(json.Data);
   });
}

function createList(data) {
   console.log(data);

   // eslint-disable-next-line no-plusplus
   for (let i = 0; i < data.length; i++) {
       const fav = document.createElement('div');
       fav.classList.add('site');
       const $sites = document.querySelector('.sites');
       $sites.appendChild(fav);

       const defaultBackground = document.createElement('div');
       defaultBackground.style = 'background-image: url(https://sub60.tobit.com/l/152342); width: 57px; height: 57px';
       fav.appendChild(defaultBackground);

       const pic = document.createElement('div');
       const { locationId } = data[i];
       pic.style = `background-image: url(https://sub60.tobit.com/l/${locationId}); width: 57px; height: 57px`;
       defaultBackground.appendChild(pic);

       const name = data[i].appstoreName.substring(0, 10);
       const p = document.createElement('P');
       p.innerText = name;
       fav.appendChild(p);

       console.log('loaded favorite sites');
     }
     counter += 14;
}

function send() {
   const firstName = chayns.env.user.firstName;
   if (chayns.env.user.isAuthenticated) {
    const message = document.querySelector('#nameInput').value;
    const email = document.querySelector('#emailInput').value;
    const adress = document.querySelector('#adressInput').value;
    const comment = document.querySelector('#commentInput').value;

    const res = message.concat(email);
    res.concat(adress);
    res.concat(comment);
    console.log(res);
    // #adressInput, #emailInput, #commentInput

    chayns.intercom.sendMessageToPage({
      text: res
     })
     .then((result) => {
     if (result.ok) {
      chayns.dialog.alert(`${firstName}, das Formular wurde abgeschickt.`);
     } else {
      chayns.dialog.alert('Es ist ein Fehler aufgetreten.');
     }
    })
    .catch(() => {
      chayns.dialog.alert('Fülle bitte die Felder Name, e-Mail und Adresse aus.');
    });
   } else {
     chayns.dialog.alert('Login missing', 'To send a message, you have to login.');
   }
  }
