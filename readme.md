
<a name="readme-top"></a>
[![Contributors][contributors-shield]][contributors-url]
[![Issues][issues-shield]][issues-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/filli1/exam">
    <img src="views/img/logo.png" alt="Logo" width="auto" height="80">
  </a>

<h3 align="center">Joe & The juice eksamensprojekt</h3>

  <p align="center">
    Dette er et eksamensprojekt i kurset "Computernetværk og distribuerede systemer" på Copenhagen Business School. Projektet er udarbejdet i forbindelse med en case fra virksomheden Joe & The Juice. Projektet er udarbejdet af en gruppe bestående af 3 studerende: Samira Mahyo, Mille J. Bierrings og Fillip S. Andreasen.
    <br />
    <a href="https://joetogo.dk/" class="rounded-button">Go to hosted website</a>
  </p>
</div>

<!-- ABOUT THE PROJECT -->
## Om projektet

[![Product Name Screen Shot][product-screenshot]](https://joetogo.dk/)

Vores projekt er en hjemmeside for Joe & The Juice, hvor kunder kan bestille varer til afhentning i en af deres butikker. Projektet er udarbejdet i forbindelse med en case fra virksomheden Joe & The Juice. I dette projekt har vi brugt vores kompetencer indenfor asynkron programmering, vores forståelse af netværk og distribuerede systemer, samt vores viden omkring sikkerhed og databaser. 
<br><br>
På siden finder man følgende funktionaliteter:
* Oprette en bruger
* Opdatere sin profil
* Logge ind
* Se en liste over produkter
* Tilføje produkter til en indkøbskurv
* Se indkøbskurven
* Fjerne produkter fra indkøbskurven
* Justere antallet af produkter i indkøbskurven
* Betale for produkterne
* Modtage en kvitering på mail
* Modtage en SMS når ordren er klar til afhentning
* Se en liste over tidligere ordrer
* Logge ud

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Kom i gang

For at få en lokal kopi af projektet op at køre, skal du følge disse enkle eksempel trin.
1. Clone the repo
   ```sh
   git clone filli1/exam
   ```
2. Install NPM packages
   ```sh
    npm install
    ```
3. Opret filen .env i roden af projektet og indsæt følgende kode:
    ```sh
    TWILIO_ACCOUNT_SID=[DIN TWILIO ACCOUNT SID]
    TWILIO_AUTH_TOKEN=[DIN TWILIO AUTH TOKEN]
    TWILIO_MESSAGING_SERVICE_SID=[DIN TWILIO MESSAGING SERVICE SID]
    STRIPE_TEST_TOKEN=[DIN STRIPE TEST TOKEN]
    GMAIL_API_KEY=[DIN GMAIL API KEY]
    ```
    Der skal udskiftes med de nødvendige API keys, som kan findes i den afleverede zip-fil, og i rapportens bilag.
4. Start serveren
    ```sh
    npm start
    ```
* Serveren kører nu på http://localhost:3000/
* For at gennemføre en transaktion, skal du bruge følgende testkort:
    ```sh
    Kortnummer: 4242 4242 4242 4242
    Udløbsdato: Enhver måned og år i fremtiden
    CVC: Et vilkårligt 3-cifret tal
    ```

### Forudsætninger

I dette projekt er det en forudsætning at du har installeret følgende programmer:
* npm
  ```sh
  npm install npm@latest -g
  ```
* node.js
  ```sh
  https://nodejs.org/en/download/
  ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/filli1/exam.svg?style=for-the-badge
[contributors-url]: https://github.com/filli1/exam/graphs/contributors
[issues-shield]: https://img.shields.io/github/issues/filli1/exam.svg?style=for-the-badge
[issues-url]: https://github.com/filli1/exam/issues
[product-screenshot]: views/img/screenshotForside.png
