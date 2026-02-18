"use client";
import { useState } from "react";
import {
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  Navbar,
  NavbarLogo,
  NavBody,
  NavItems,
  SocialNetworkButton,
} from "../ui/resizable-navbar";

export const CustomNavbar = () => {
  const navItems = [
    { name: "Accueil", link: "/" }, // cspell: disable-line
    { name: "Championnats par équipe", link: "/teamChampionship" }, // cspell: disable-line
    { name: "Contact", link: "/contact" },
  ];
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Navbar className="absolute top-3 fixed">
      <NavBody>
        <NavbarLogo />
        <NavItems items={navItems} />
        <SocialNetworkButton logoWidth={4} className="mr-2" />
      </NavBody>

      <MobileNav className="border border-neutral-600">
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
        </MobileNavHeader>
        <MobileNavMenu isOpen={isOpen} onClose={() => setIsOpen(false)}>
          {navItems.map((item, idx) => (
            <a
              key={idx}
              href={item.link}
              onClick={() => setIsOpen(false)}
              className="text-neutral-300 hover:text-indigo-400 transition-colors"
            >
              {item.name}
            </a>
          ))}
          <SocialNetworkButton
            className="justify-between w-full"
            classNameButton="w-full text-center flex justify-center"
            logoWidth={6}
          />
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
};
