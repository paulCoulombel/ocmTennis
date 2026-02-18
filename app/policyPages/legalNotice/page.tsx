"use client";

export default function LegalNoticePage() {
  return (
    <main className="pt-30 m-auto max-w-[min(95%,48rem)] p-6 prose prose-invert max-w-none">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold mb-8">MENTIONS LÉGALES</h1>

        <hr className="border-gray-600 my-6" />

        <p className=" leading-relaxed">
          Les « mentions légales » permettent aux internautes d'être renseignés
          sur l'identité de la personne morale ou physique éditrice du site, et
          de celles et ceux qui le gèrent. Elles sont obligatoires et doivent
          figurer sur tout site web, vitrine ou marchand, édité à titre
          professionnel ou non professionnel.
        </p>

        <section className="space-y-4">
          <h3 className="text-xl font-semibold">Editeur du site</h3>
          <div className=" space-y-2">
            <p>
              <strong>Site de tennis</strong>
            </p>
            <p>
              Affichage des informations du club et résultats des championnats
              de tennis par équipes
            </p>
            <p>
              <strong>Représentant légal :</strong> Monsieur Paul COULOMBEL
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-semibold">
            Pour entrer en contact facilement avec l'éditeur du site
          </h3>
          <div className=" space-y-2">
            <p>
              <strong>Adresse de courrier électronique :</strong>{" "}
              tennis.ocm@gmail.com
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-semibold">Responsable de la rédaction</h3>
          <p className="">
            Le responsable de la rédaction est Monsieur Paul COULOMBEL.
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-semibold">Directeur de publication</h3>
          <p className="">
            Le directeur de publication est Monsieur Paul COULOMBEL.
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-semibold">Hébergeur du site</h3>
          <p className="">
            Ce site est hébergé par la Société Vercel Inc. - 340 S Lemon Ave
            #4133 Walnut, CA 91789, UNITED STATES - Numéro de téléphone : +1
            (559) 288-7060.
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-semibold">Objet du site</h3>
          <p className="">
            Ce site web a pour objet la présentation de l'OCM Tennis et
            l'affichage des résultats de championnats de tennis par équipes.
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-semibold">
            Protection des données personnelles
          </h3>
          <p className="">
            Conformément au Règlement Général sur la Protection des Données
            (RGPD) et à la loi Informatique et Libertés, aucune donnée
            personnelle n'est collectée. Pour plus d'informations sur le
            traitement de vos données, veuillez consulter notre politique de
            confidentialité.
          </p>
        </section>
      </div>
    </main>
  );
}
