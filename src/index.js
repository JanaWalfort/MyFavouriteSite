/* eslint-disable no-plusplus */
/* eslint-disable no-console */
import './app.scss';
// import { SelectButton } from 'chayns-components';

chayns.ui.initAll();
chayns.ready.then(() => {
   const data = getData();
   createList(data);
   console.log('Chayns is ready, environment loaded', chayns.env);
 }).catch(() => {
   console.warn('No chayns environment found');
 }).then(() => {
   console.log('Will always be executed');
 });

const init = async () => {
   try {
       await chayns.ready;
       document.querySelector('#more').addEventListener('click', getData);
       document.querySelector('#send-button').addEventListener('click', send);
       document.querySelector('#search').addEventListener('input', time);
   } catch (err) {
       console.error('No chayns environment found', err);
   }
};
init();

let counter = 0;
let searchString = 'love';
let timeout;

function getData() {
   fetch(`https://chayns1.tobit.com/TappApi/Site/SlitteApp?SearchString=${searchString}&Skip=${counter}&Take=14`)
   .then(resp => resp.json())
   .then((json) => {
      createList(json.Data);
   });
}

function createList(data) {
   // eslint-disable-next-line no-plusplus
   if (data === null) {
      document.querySelector('#more').classList.add('hidden');

      const fav = document.createElement('div');
       fav.classList.add('site');
       const $sites = document.querySelector('.sites');
       $sites.appendChild(fav);
      const error = document.createElement('P');
      error.innerText = 'Keine Seite gefunden!';
      fav.appendChild(error);
   } else if (data.length < 14) {
      document.querySelector('#more').classList.add('hidden');
   } else {
      document.querySelector('#more').classList.remove('hidden');
   }
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

       const list = document.querySelector('#toSite').children;
       for (let j = 0; j < list.length; j++) {
         list[j].addEventListener('click', toSite);
      }

       console.log('loaded favorite sites');
     }
     counter += 14;
}
function time() {
   clearTimeout(timeout);
   timeout = setTimeout(search, 1000);
}

async function search() {
   const { value } = document.querySelector('#search');

   if (value === '' || value === ' ') {
      searchString = 'love';
   } else {
      searchString = value;
   }
   const list = document.querySelector('.sites');
   while (list.firstElementChild) {
      list.firstElementChild.remove();
   }
   counter = 0;
   getData(value);
}

function toSite() {
   const list = fetch(`https://chayns1.tobit.com/TappApi/Site/SlitteApp?SearchString=${searchString}&Skip=${counter}&Take=14`)
   .then(resp => resp.json())
   // eslint-disable-next-line arrow-parens
   .then((json) => json.Data);

   const { siteId } = list;
   chayns.openUrlInBrowser(`https://chayns.net/${siteId}`);
}

function send() {
   const { firstName } = chayns.env.user;
   if (chayns.env.user.isAuthenticated) {
    const name = document.querySelector('#nameInput').value;
    const email = document.querySelector('#emailInput').value;
    const adress = document.querySelector('#adressInput').value;
    const comment = document.querySelector('#commentInput').value;

    const message = `Name: ${name}, e-Mail: ${email}, Adresse: ${adress}, url: '', Kommentar: ${comment}`;

    chayns.intercom.sendMessageToPage({
      text: message
     })
     .then(() => {
     if (name && email) {
      chayns.dialog.alert(`${firstName}, das Formular wurde abgeschickt.`);
     } else {
      chayns.dialog.alert('Fülle bitte die Felder Name und e-Mail aus.');
     }
    });
   } else {
     chayns.dialog.alert('Login missing', 'To send a message, you have to login.');
   }
  }

