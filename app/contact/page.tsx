"use client";

import { CustomNavbar } from "@/components/custom/customeNavbar";
import { CustomFooter } from "@/components/custom/footer";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { Card } from "@/components/ui/card";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="dark bg-neutral-900 w-full text-white">
      {/* Navbar */}
      <BackgroundBeamsWithCollision className="bg-transparent pb-15 min-h-screen border-b border-neutral-700">
        <CustomNavbar />

        {/* Contact Content */}
        <div className="container mx-auto px-4 pb-12 pt-30">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Nous contacter</h1>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Retrouvez toutes les informations pour nous contacter et nous
                rendre visite
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-stretch">
              {/* Contact Information */}
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-neutral-800 to-neutral-900 border-neutral-600 shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden group h-full flex flex-col">
                  {/* Header */}
                  <div className="p-6 border-b border-neutral-700">
                    <div className="flex items-center space-x-3">
                      <Phone className="w-6 h-6 text-blue-400" />
                      <h2 className="text-2xl font-semibold text-white">
                        Informations de contact
                      </h2>
                    </div>
                    <p className="text-gray-400 mt-2">
                      Toutes les informations pour nous joindre
                    </p>
                  </div>

                  {/* Contact items */}
                  <div className="p-6 space-y-6 flex-1">
                    {/* Address */}
                    <div className="relative group/item">
                      <div className="absolute -inset-2 bg-gradient-to-r from-green-400/10 to-transparent rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-start space-x-4 p-4 rounded-lg bg-neutral-800/50 hover:bg-neutral-700/50 transition-all duration-300">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-green-400/20 flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-green-400" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white mb-1">
                            Adresse
                          </h3>
                          <div className="text-gray-300 leading-relaxed">
                            <div>Salle Louis Darcel</div>
                            <div>2 La Métairie Neuve</div>
                            <div>35360 Montauban-de-Bretagne, France</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="relative group/item">
                      <div className="absolute -inset-2 bg-gradient-to-r from-blue-400/10 to-transparent rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-center space-x-4 p-4 rounded-lg bg-neutral-800/50 hover:bg-neutral-700/50 transition-all duration-300">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-blue-400/20 flex items-center justify-center">
                            <Phone className="w-5 h-5 text-blue-400" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white mb-1">
                            Téléphone
                          </h3>
                          <a
                            href="tel:+33299066845"
                            className="underline text-gray-300 hover:text-blue-400 transition-colors font-medium text-lg inline-flex items-center space-x-2 group/link"
                          >
                            +33 6 03 24 83 21
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="relative group/item">
                      <div className="absolute -inset-2 bg-gradient-to-r from-purple-400/10 to-transparent rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-center space-x-4 p-4 rounded-lg bg-neutral-800/50 hover:bg-neutral-700/50 transition-all duration-300">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-purple-400/20 flex items-center justify-center">
                            <Mail className="w-5 h-5 text-purple-400" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white mb-1">
                            Email
                          </h3>
                          <a
                            href="mailto:tennis.ocm@gmail.com"
                            className="text-gray-300 hover:text-purple-400 transition-colors font-medium text-lg inline-flex items-center space-x-2 group/link"
                          >
                            <span>tennis.ocm@gmail.com</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4 bg-neutral-800/50 border-t border-neutral-700">
                    <div className="text-center text-sm text-gray-400">
                      <span className="inline-flex items-center space-x-2">
                        <span>
                          N'hésitez pas à nous contacter pour plus
                          d'informations
                        </span>
                      </span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Map */}
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-neutral-800 to-neutral-900 border-neutral-600 shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden group h-full flex flex-col">
                  {/* Header */}
                  <div className="p-6 border-b border-neutral-700">
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-6 h-6 text-green-400" />
                      <h2 className="text-2xl font-semibold text-white">
                        Notre localisation
                      </h2>
                    </div>
                    <p className="text-gray-400 mt-2">
                      Retrouvez-nous facilement grâce à cette carte interactive
                    </p>
                  </div>

                  {/* Map container */}
                  <div className="relative flex-1 w-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-blue-400/10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <iframe
                      width="100%"
                      height="100%"
                      src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=2%20La%20M%C3%A9tairie%20Neuve%2035360%20Montauban-de-Bretagne+(OCM%20Tennis)&amp;t=&amp;z=16&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                      className="border-0 filter brightness-90 hover:brightness-100 transition-all duration-300"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>

                  {/* Footer info */}
                  <div className="p-4 bg-neutral-800/50 border-t border-neutral-700">
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>2 La Métairie Neuve, Montauban-de-Bretagne</span>
                      <a
                        href="https://maps.google.com/maps?q=2%20La%20M%C3%A9tairie%20Neuve%2035360%20Montauban-de-Bretagne"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors underline"
                      >
                        Ouvrir dans Google Maps
                      </a>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </BackgroundBeamsWithCollision>

      <CustomFooter className="bg-neutral-900" />
    </div>
  );
}
