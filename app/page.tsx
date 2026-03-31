/* eslint-disable @next/next/no-img-element */
'use client'

import { CustomHoverEffect } from '@/components/custom/card-hover-effect'
import { CustomFooter } from '@/components/custom/footer'
import { SocialNetworkSection } from '@/components/custom/socialNetworkSection'
import { BackgroundBeamsWithCollision } from '@/components/ui/background-beams-with-collision'
import { Button } from '@/components/ui/button'
import {
  DraggableCardBody,
  DraggableCardContainer
} from '@/components/ui/draggable-card'
import { useScrollAnimation } from '@/lib/hooks/useScrollAnimation'
import { cn } from '@/lib/utils'
import { getSponsors } from '@/lib/utils/sponsors'
import { MapPin, User, Users } from 'lucide-react'
import { motion } from 'motion/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

export default function Home() {
  const [sponsors, setSponsors] = useState<
    {
      title: string
      image: string
      className: string
      style: React.CSSProperties
    }[]
  >([])
  useEffect(() => {
    if (!sponsorsRef.current) return
    const rect = sponsorsRef.current.getBoundingClientRect()
    const topFromDocument = rect.top + window.scrollY
    setSponsors(getSponsors({ topFromDocument }))
  }, [])
  const sponsorsRef = useRef<HTMLDivElement | null>(null)

  return (
    <div className="dark bg-neutral-900 w-full text-white overflow-hidden">
      <title>OCM Tennis - Site officiel</title>
      <meta
        name="description"
        content="Bienvenue à l'OCM Tennis. Découvrez nos cours et nos installations pour tous les niveaux."
      ></meta>
      {/* Home screen */}
      <div className="relative">
        <DraggableCardContainer className="absolute inset-0 z-55 pointer-events-none bg-transparent">
          {sponsors.map((item, index) => (
            <DraggableCardBody
              key={index}
              style={item.style}
              className={cn(
                item.className,
                'pointer-events-auto text-center flex-col justify-center items-center flex w-50 p-3 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl shadow-md'
              )}
            >
              <img
                src={'/sponsors' + item.image}
                alt={item.title}
                className="pointer-events-none w-auto object-contain rounded max-h-30"
              />
              <span className="mt-2 flex text-center text-xs font-semibold  leading-tight">
                {item.title}
              </span>
            </DraggableCardBody>
          ))}
        </DraggableCardContainer>

        <div className="mx-auto">
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
  )
}

const HomeScreen = () => {
  const router = useRouter()
  return (
    <div className="pt-30 sm:pt-10 z-10 text-center flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden md:block items-center justify-center"
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
        className="z-10 text-6xl pb-1 md:text-8xl font-bold mb-5 bg-linear-to-r from-white via-indigo-200 to-green-300 bg-clip-text text-transparent"
      >
        Jouez, Partagez, Gagnez
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="z-10 text-xl md:text-2xl text-indigo-200 mb-8 max-w-3xl mx-auto leading-relaxed"
      >
        Section tennis de l’
        <motion.a
          href="https://ocm-35.fr/"
          target="_blank"
          whileHover={{ backgroundSize: '100% 100%' }}
          className="hover:px-2 px-1 hover:py-1 hover:text-indigo-200 text-indigo-400 rounded-md bg-linear-to-r from-indigo-600/50 to-indigo-600/50"
          data-slot="highlight-text"
          initial={{
            backgroundSize: '0% 100%'
          }}
          style={{
            backgroundRepeat: 'no-repeat',
            display: 'inline'
          }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          Olympic Club Montalbanais (OCM)
        </motion.a>
        , acteur historique du sport à Montauban-de-Bretagne. L’OCM Tennis vous
        transmet sa passion commune qui rassemble les joueurs·euses de tout âge,
        du loisir à la compétition.
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
            className="z-10 hover:cursor-pointer bg-linear-to-r from-indigo-500 to-green-600 hover:from-indigo-600 hover:to-green-700 text-white font-semibold px-8 py-4 text-lg"
          >
            Voir nos équipes
            <Users className="w-5 h-5 ml-2" />
          </Button>
        </Link>
        <Button
          size="lg"
          onClick={() => router.push('/contact')}
          className="z-10 bg-neutral-800 border border-white/20 hover:bg-white/10 text-white font-semibold px-8 py-4 text-lg hover:cursor-pointer"
        >
          Passer nous voir
          <MapPin className="w-5 h-5 ml-2" />
        </Button>
      </motion.div>
    </div>
  )
}

const InfrastructureSection = () => {
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.2 })
  const infrastructureItems = [
    {
      image: ['/infrastructure/terrain1.jpeg', '/infrastructure/terrain2.jpeg'],
      title: 'Terrains de Tennis',
      description:
        'Nous disposons de 2 terrains principaux en résine et de 2 terrains durs complémentaires.'
    },
    {
      image: [
        '/infrastructure/coinRepos.jpg',
        '/infrastructure/coinSpectateur.jpg'
      ],
      title: 'Club House',
      description:
        'Que vous soyez joueur·euse, accompagnant·e ou spectateur·rice, profitez de ce lieu de convivialité mêlant esprit sportif et moments de partage.'
    }
  ]
  return (
    <div className="bg-linear-to-br from-green-600/20 via-emerald-500/15 to-lime-500/20 pt-20 md:py-20 w-full">
      <motion.div
        ref={elementRef}
        initial={{ opacity: 0, y: 40 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
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
            className="text-5xl md:text-6xl font-bold mb-6 bg-linear-to-r from-emerald-300 via-green-300 to-lime-300 bg-clip-text text-transparent"
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
  )
}

const OrganigrammeSection = () => {
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.15 })
  const {
    elementRef: educationalTeamRef,
    isVisible: educationalTeamIsVisible
  } = useScrollAnimation({
    threshold: 0.15
  })
  const { elementRef: engagedClubRef, isVisible: engagedClubIsVisible } =
    useScrollAnimation({ threshold: 0.15 })
  const teamMembers = {
    dirigeante: [
      { name: 'Philippe BOSC', role: 'Co-Président' },
      { name: 'Yohan MILON', role: 'Co-Président' },
      { name: 'Julien MARMOL', role: 'Vice-Président' },
      { name: 'Edouard COULOMBEL', role: 'Vice-Président' },
      { name: 'Isabelle DUVERGER', role: 'Trésorier Général' },
      { name: 'Emmanuelle LAURENS', role: 'Secrétaire Général' },
      { name: 'Emilie GAILLARD', role: 'Secrétaire Général Adjoint' },
      { name: 'Cyrille PATTIER', role: 'Membre' },
      { name: 'ERIC GAILLARD', role: 'Membre' },
      { name: 'François MATIS', role: 'Membre' },
      { name: 'Anthony HUET', role: 'Membre' },
      { name: 'Mathilde IBBA', role: 'Membre' }
    ],
    pedagogique: [
      {
        name: 'Guillaume BRANDILY',
        role: 'Entraîneur - Directeur sportif',
        imagePath: '/organigramme/guillaume.jpg'
      },
      {
        name: 'Alexandre THOMAS',
        role: 'Entraîneur',
        imagePath: '/organigramme/alexandre.jpg'
      }
    ]
  }
  const presidentCount = teamMembers.dirigeante.filter((member) =>
    member.role.includes('Président')
  ).length
  const otherCount = teamMembers.dirigeante.filter(
    (member) =>
      !member.role.includes('Président') && !member.role.includes('Membre')
  ).length
  return (
    <div className="pb-10 pt-20 bg-linear-to-br from-indigo-100 via-indigo-500/50 to-blue-900/30">
      <motion.div ref={elementRef} className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-linear-to-r from-blue-300 via-indigo-300 to-blue-400 bg-clip-text text-[#1a172d]"
          >
            L&apos;équipe du club
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
                .filter((member) => member.role.includes('Président'))
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
                    !member.role.includes('Président') &&
                    !member.role.includes('Membre')
                )
                .map((member, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 200 }}
                    animate={
                      isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                    }
                    transition={{
                      duration: 0.6,
                      delay: index * 0.1 + 0.3 + presidentCount * 0.1
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
                .filter((member) => member.role.includes('Membre'))
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
                        otherCount * 0.1
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
  )
}

const SponsorsSection = ({
  ref
}: {
  ref: React.RefObject<HTMLDivElement | null>
}) => {
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.2 })

  return (
    <div className="pt-20 bg-linear-to-br from-pink-200 via-pink-50 to-pink-300">
      <motion.div
        ref={elementRef}
        initial={{ opacity: 0, y: 40 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="container mx-auto px-4"
      >
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-linear-to-r from-slate-700 via-gray-800 to-slate-700 bg-clip-text text-transparent"
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
  )
}
