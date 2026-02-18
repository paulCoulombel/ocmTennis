"use client";

import { CustomHoverEffect } from "@/components/custom/card-hover-effect";
import { CustomFooter } from "@/components/custom/footer";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { Button } from "@/components/ui/button";
import {
  DraggableCardBody,
  DraggableCardContainer,
} from "@/components/ui/draggable-card";
import { useScrollAnimation } from "@/lib/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { getSponsors } from "@/lib/utils/sponsors";
import { MapPin, User, Users } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [sponsors, setSponsors] = useState<
    {
      title: string;
      image: string;
      className: string;
      style: React.CSSProperties;
    }[]
  >([]);
  useEffect(() => {
    if (!sponsorsRef.current) return;
    const rect = sponsorsRef.current.getBoundingClientRect();
    const topFromDocument = rect.top + window.scrollY;
    setSponsors(getSponsors({ topFromDocument }));
  }, []);
  const sponsorsRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="dark bg-neutral-900 w-full text-white overflow-hidden">
      <title>OCM Tennis - Site officiel</title>
      <meta
        name="description"
        content="Bienvenue à l'OCM Tennis. Découvrez nos cours et nos installations pour tous les niveaux."
      ></meta>
      {/* Home screen + Navbar */}
      <div className="relative">
        <DraggableCardContainer className="absolute inset-0 z-55 pointer-events-none bg-transparent">
          {sponsors.map((item, index) => (
            <DraggableCardBody
              key={index}
              style={item.style}
              className={cn(
                item.className,
                "pointer-events-auto text-center flex-col justify-center items-center flex w-50 p-3 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl shadow-md",
              )}
            >
              <img
                src={"/sponsors" + item.image}
                alt={item.title}
                className="pointer-events-none w-auto object-contain rounded max-h-30"
              />
              <span className="mt-2 flex text-center text-xs font-semibold  leading-tight">
                {item.title}
              </span>
            </DraggableCardBody>
          ))}
        </DraggableCardContainer>

        <div className="mx-auto px-4">
          <BackgroundBeamsWithCollision className="pointer-events-auto bg-transparent pb-15 min-h-screen">
            <HomeScreen />
          </BackgroundBeamsWithCollision>
        </div>
        <InfrastructureSection />
        <OrganigrammeSection />
        <SponsorsSection ref={sponsorsRef} />
        <SocialNetworkSection />
        <CustomFooter />
      </div>
    </div>
  );
}

const HomeScreen = () => {
  const router = useRouter();
  return (
    <div className="pt-10 z-10 text-center flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden md:block flex items-center justify-center"
      >
        <img
          src="/tennisDraw.png"
          alt="Terrain de tennis"
          className="z-10 mt-15 mb-5"
          width={550}
          height={550}
        />
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="z-10 text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-indigo-200 to-green-300 bg-clip-text text-transparent"
      >
        Jouez, Partagez, Gagnez
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="z-10 text-xl md:text-2xl text-indigo-200 mb-8 max-w-3xl mx-auto leading-relaxed"
      >
        Une passion commune qui rassemble tous les joueurs, quel que soit leur
        niveau.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="z-10 flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Link href="/teamChampionship">
          <Button
            size="lg"
            className="z-10 hover:cursor-pointer bg-gradient-to-r from-indigo-500 to-green-600 hover:from-indigo-600 hover:to-green-700 text-white font-semibold px-8 py-4 text-lg"
          >
            Voir nos équipes
            <Users className="w-5 h-5 ml-2" />
          </Button>
        </Link>
        <Button
          size="lg"
          onClick={() => router.push("/contact")}
          className="z-10 bg-neutral-800 border border-white/20 hover:bg-white/10 text-white font-semibold px-8 py-4 text-lg hover:cursor-pointer"
        >
          Passer nous voir
          <MapPin className="w-5 h-5 ml-2" />
        </Button>
      </motion.div>
    </div>
  );
};

const InfrastructureSection = () => {
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.2 });
  const infrastructureItems = [
    {
      image: ["/infrastructure/terrain1.jpeg", "/infrastructure/terrain2.jpeg"],
      title: "Terrains de Tennis",
      description: "Nous disposons de 2 terrains en résine et 2 terrains durs.",
    },
    {
      image: [
        "/infrastructure/coinRepos.jpg",
        "/infrastructure/coinSpectateur.jpg",
      ],
      title: "Club House",
      description:
        "Profitez de notre salon confortable et chaleureux, où joueurs et spectateurs peuvent se retrouver avant et après les matchs. Lieu de convivialité mêlant esprit sportif et moments de partage.",
    },
  ];
  return (
    <div className="bg-gradient-to-br from-green-600/20 via-emerald-500/15 to-lime-500/20 pt-20 md:py-20 w-full">
      <motion.div
        ref={elementRef}
        initial={{ opacity: 0, y: 40 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="justify-center flex flex-col px-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center md:mb-16"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-300 via-green-300 to-lime-300 bg-clip-text text-transparent"
          >
            Nos Infrastructures
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-xl text-green-200 max-w-3xl mx-auto leading-relaxed"
          >
            Découvrez nos installations dans un cadre chaleureux et convivial.
          </motion.p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <CustomHoverEffect items={infrastructureItems} />
        </motion.div>
      </motion.div>
    </div>
  );
};

const OrganigrammeSection = () => {
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.15 });
  const {
    elementRef: educationalTeamRef,
    isVisible: educationalTeamIsVisible,
  } = useScrollAnimation({
    threshold: 0.15,
  });
  const { elementRef: engagedClubRef, isVisible: engagedClubIsVisible } =
    useScrollAnimation({ threshold: 0.15 });
  const teamMembers = {
    dirigeante: [
      { name: "Philippe BOSC", role: "Co-Président" },
      { name: "Yohan MILON", role: "Co-Président" },
      { name: "Julien MARMOL", role: "Vice-Président" },
      { name: "Edouard COULOMBEL", role: "Vice-Président" },
      { name: "Isabelle DUVERGER", role: "Trésorier Général" },
      { name: "Emmanuelle LAURENS", role: "Secrétaire Général" },
      { name: "Emilie GAILLARD", role: "Secrétaire Général Adjoint" },
      { name: "Cyrille PATTIER", role: "Membre" },
      { name: "ERIC GAILLARD", role: "Membre" },
      { name: "François MATIS", role: "Membre" },
      { name: "Anthony HUET", role: "Membre" },
      { name: "Mathilde IBBA", role: "Membre" },
    ],
    pedagogique: [
      {
        name: "Guillaume BRANDILY",
        role: "Entraîneur - Directeur sportif",
        imagePath: "/organigramme/guillaume.jpg",
      },
      {
        name: "Alexandre THOMAS",
        role: "Entraîneur",
        imagePath: "/organigramme/alexandre.jpg",
      },
    ],
  };
  const presidentCount = teamMembers.dirigeante.filter((member) =>
    member.role.includes("Président"),
  ).length;
  const otherCount = teamMembers.dirigeante.filter(
    (member) =>
      !member.role.includes("Président") && !member.role.includes("Membre"),
  ).length;
  return (
    <div className="pb-10 pt-20 bg-gradient-to-br from-indigo-100 via-indigo-500/50 to-blue-900/30">
      <motion.div ref={elementRef} className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-300 via-indigo-300 to-blue-400 bg-clip-text text-[#1a172d]"
          >
            L'équipe du club
          </motion.h2>
        </div>

        {/* Director team */}
        <div className="mb-16">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl font-bold text-center mb-12 text-blue-200"
          >
            Équipe dirigeante
          </motion.h3>
          <div className="flex flex-col ">
            <div className="flex justify-center flex-wrap gap-8 mb-8">
              {/* Présidents */}
              {teamMembers.dirigeante
                .filter((member) => member.role.includes("Président"))
                .map((member, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 200 }}
                    animate={
                      isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                    }
                    transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                    key={index}
                    className="text-center w-30"
                  >
                    <div className="w-20 h-20 mx-auto mb-4 bg-[#c6c77b] rounded-full flex items-center justify-center border-4 border-[#1a172d]">
                      <User className="w-8 h-8 text-[#1a172d]" />
                    </div>
                    <h4 className="font-bold text-indigo-200 mb-1">
                      {member.name}
                    </h4>
                    <p className="text-sm text-gray-300 italic">
                      {member.role}
                    </p>
                  </motion.div>
                ))}
            </div>
            <div className="flex justify-center flex-wrap gap-8 mb-8">
              {/* Autres */}
              {teamMembers.dirigeante
                .filter(
                  (member) =>
                    !member.role.includes("Président") &&
                    !member.role.includes("Membre"),
                )
                .map((member, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 200 }}
                    animate={
                      isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                    }
                    transition={{
                      duration: 0.6,
                      delay: index * 0.1 + 0.3 + presidentCount * 0.1,
                    }}
                    key={index}
                    className="text-center w-30"
                  >
                    <div className="w-20 h-20 mx-auto mb-4 bg-[#c6c77b] rounded-full flex items-center justify-center border-4 border-[#1a172d]">
                      <User className="w-8 h-8 text-[#1a172d]" />
                    </div>
                    <h4 className="font-bold text-indigo-200 mb-1">
                      {member.name}
                    </h4>
                    <p className="text-sm text-gray-300 italic">
                      {member.role}
                    </p>
                  </motion.div>
                ))}
            </div>
            {/* Membres */}
            <div className="flex justify-center flex-wrap gap-8 mb-8">
              {teamMembers.dirigeante
                .filter((member) => member.role.includes("Membre"))
                .map((member, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 200 }}
                    animate={
                      isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                    }
                    transition={{
                      duration: 0.6,
                      delay:
                        index * 0.1 +
                        0.3 +
                        presidentCount * 0.1 +
                        otherCount * 0.1,
                    }}
                    key={index}
                    className="text-center w-30"
                  >
                    <div className="w-20 h-20 mx-auto mb-4 bg-[#c6c77b] rounded-full flex items-center justify-center border-4 border-[#1a172d]">
                      <User className="w-8 h-8 text-[#1a172d]" />
                    </div>
                    <h4 className="font-bold text-indigo-200 mb-1">
                      {member.name}
                    </h4>
                    <p className="text-sm text-gray-300 italic">
                      {member.role}
                    </p>
                  </motion.div>
                ))}
            </div>
          </div>
        </div>

        {/* Educational team */}
        <motion.div ref={educationalTeamRef}>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={
              educationalTeamIsVisible
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.6, delay: 0 }}
            className="text-3xl font-bold text-center mb-12 text-blue-200"
          >
            Équipe pédagogique
          </motion.h3>
          <div className="flex justify-center gap-8">
            {teamMembers.pedagogique.map((member, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={
                  educationalTeamIsVisible
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 200 }
                }
                transition={{ duration: 0.6, delay: index * 0.1 }}
                key={index}
                className="text-center"
              >
                <img
                  src={member.imagePath}
                  alt={member.name}
                  className="w-20 h-20 mx-auto mb-4 bg-[#c6c77b] rounded-full flex items-center justify-center border-4 border-[#1a172d]"
                />
                <h4 className="font-bold text-indigo-200 mb-1">
                  {member.name}
                </h4>
                <p className="text-sm text-gray-300 italic">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
      <motion.div
        ref={engagedClubRef}
        initial={{ opacity: 0, y: 20 }}
        animate={
          engagedClubIsVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
        }
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center mt-15 flex flex-col items-center justify-center"
      >
        <img
          src="/organigramme/clubEngage.png"
          alt="Tennis Engagé"
          className="h-20 object-contain mb-8"
        />
      </motion.div>
    </div>
  );
};

const SponsorsSection = ({
  ref,
}: {
  ref: React.RefObject<HTMLDivElement | null>;
}) => {
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <div className="pt-20 bg-gradient-to-br from-pink-200 via-pink-50 to-pink-300">
      <motion.div
        ref={elementRef}
        initial={{ opacity: 0, y: 40 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="container mx-auto px-4"
      >
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-700 via-gray-800 to-slate-700 bg-clip-text text-transparent"
          >
            Nos Partenaires
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
          >
            Ils nous font confiance et nous accompagnent dans notre passion du
            tennis.
          </motion.p>
        </div>
        <div ref={ref} className="h-80"></div>
      </motion.div>
    </div>
  );
};

export const SocialNetworkSection = ({
  className,
  textClassName,
}: {
  className?: string;
  textClassName?: string;
}) => {
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.3 });

  return (
    <motion.div
      ref={elementRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "pointer-events-none pt-24 pb-15 bg-slate-950 border-b border-slate-800 w-full",
        className,
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col max-w-3xl mx-auto text-center">
          <motion.h4
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={cn(
              "text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-indigo-200 to-green-300 bg-clip-text text-transparent",
              textClassName,
            )}
          >
            Restez connectés
          </motion.h4>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={cn(
              "text-xl text-indigo-200 mb-8 leading-relaxed",
              textClassName,
            )}
          >
            Retrouvez toutes nos actualités, horaires, événements et infos
            pratiques sur nos réseaux sociaux
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center gap-6"
          >
            <a
              href={"https://m.facebook.com/OCMTennis"}
              target={"_blank"}
              rel="noopener noreferrer"
              className={cn(
                "h-9 has-[>svg]:px-3 pointer-events-auto group flex h-12 items-center gap-3 py-3 rounded-full bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 hover:border-blue-400 transition-all duration-300 hover:cursor-pointer",
                textClassName,
              )}
            >
              <svg
                className="w-6 h-6 text-blue-400 group-hover:text-blue-300"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span className="text-blue-400 group-hover:text-blue-300 font-medium text-lg">
                Facebook
              </span>
            </a>

            <a
              href={"instagram://user?username=ocmtennis"}
              target={"_blank"}
              rel="noopener noreferrer"
              className={cn(
                "h-9 has-[>svg]:px-3 pointer-events-auto group flex h-12 items-center gap-3 px-6 py-3 rounded-full bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/30 hover:border-pink-400 transition-all duration-300 hover:cursor-pointer",
                textClassName,
              )}
            >
              <svg
                className="w-6 h-6 text-pink-400 group-hover:text-pink-300"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077" />
              </svg>
              <span className="text-pink-400 group-hover:text-pink-300 font-medium text-lg">
                Instagram
              </span>
            </a>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
